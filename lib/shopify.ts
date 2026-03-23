/**
 * Shopify Storefront API 完整封装
 * ─────────────────────────────────────────────────────────────────
 * 包含：产品查询、系列查询、搜索、购物车 CRUD、客户认证、订单查询
 * 所有函数均通过 Storefront API GraphQL 端点调用
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { PRODUCT_BY_HANDLE_QUERY } from './shopify/queries/product';

// ─── Shopify Rich Text → HTML ─────────────────────────────────────────────────

function richTextToHtml(raw: string): string {
  try {
    const doc = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return renderNode(doc);
  } catch {
    return raw ?? '';
  }
}

function renderNode(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return escapeHtml(node);

  if (node.type === 'text') {
    let t = escapeHtml(node.value ?? '').replace(/\n/g, '<br/>');
    if (node.bold) t = `<strong>${t}</strong>`;
    if (node.italic) t = `<em>${t}</em>`;
    return t;
  }

  const children = (node.children ?? []).map(renderNode).join('');

  switch (node.type) {
    case 'root': return children;
    case 'paragraph': return `<p>${children}</p>`;
    case 'heading': return `<h${node.level ?? 3}>${children}</h${node.level ?? 3}>`;
    case 'list': return node.listType === 'ordered' ? `<ol>${children}</ol>` : `<ul>${children}</ul>`;
    case 'list-item': return `<li>${children}</li>`;
    case 'link': return `<a href="${escapeHtml(node.url ?? '')}">${children}</a>`;
    default: return children;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── 客户端初始化 ──────────────────────────────────────────────────────────────

export const shopify = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2026-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
});

// ─── 通用 Fragment ──────────────────────────────────────────────────────────────

const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCard on Product {
    id
    title
    handle
    vendor
    productType
    tags
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    images(first: 1) {
      edges { node { url altText width height } }
    }
  }
`;

const PRODUCT_FULL_FRAGMENT = `
  fragment ProductFull on Product {
    id
    title
    handle
    vendor
    productType
    tags
    descriptionHtml
    seo { title description }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    images(first: 20) {
      edges { node { url altText width height } }
    }
    options {
      id name values
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          priceV2: price { amount currencyCode }
          compareAtPriceV2: compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
        }
      }
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { amount currencyCode }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              priceV2: price { amount currencyCode }
              image { url altText width height }
              product { title handle }
              selectedOptions { name value }
            }
          }
        }
      }
    }
  }
`;

// ─── 产品查询 ──────────────────────────────────────────────────────────────────

/**
 * 按 handle 数组批量获取产品（用于首页 EditorialPanel 精准选品）
 * 使用 GraphQL alias 一次请求取回所有产品，顺序与入参保持一致。
 */
export async function getProductsByHandles(handles: string[]) {
  if (!handles.length) return [];
  // 逐个查询，避免 alias 批量查询在某些 Storefront API 版本下解析失败
  const results = await Promise.all(
    handles.map(async (handle) => {
      const query = `
        ${PRODUCT_CARD_FRAGMENT}
        query GetProduct($handle: String!) {
          product(handle: $handle) { ...ProductCard }
        }
      `;
      const { data } = await shopify.request(query, { variables: { handle } });
      return data?.product ?? null;
    }),
  );
  return results.filter(Boolean);
}

/** 获取首页产品列表（简化版，用于首页展示） */
export async function getProducts(first = 12) {
  const query = `
    ${PRODUCT_CARD_FRAGMENT}
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges { node { ...ProductCard } }
      }
    }
  `;
  const { data } = await shopify.request(query, { variables: { first } });
  return data.products.edges.map((e: any) => e.node);
}

/** 根据 handle 获取单个产品完整信息（PDP 页面用，含 media 用于颜色过滤） */
export async function getProductByHandle(handle: string) {
  const { data } = await shopify.request(PRODUCT_BY_HANDLE_QUERY, {
    variables: { handle },
  });
  return normalizeProductByHandle(data.product);
}

/** 将 ProductByHandle 查询结果规范化为统一结构 */
function normalizeProductByHandle(raw: any) {
  if (!raw) return null;

  const mediaNodes = raw.media?.nodes ?? [];
  const media = mediaNodes
    .filter((n: any) => n?.image?.url)
    .map((n: any) => ({
      url: n.image.url,
      alt: n.alt ?? n.image?.altText ?? null,
      width: n.image.width ?? 0,
      height: n.image.height ?? 0,
    }));

  const variantNodes = raw.variants?.nodes ?? raw.variants?.edges?.map((e: any) => e.node) ?? [];
  const variants = variantNodes.map((v: any) => ({
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    quantityAvailable: v.quantityAvailable,
    selectedOptions: v.selectedOptions ?? [],
    priceV2: v.price ?? v.priceV2,
    compareAtPriceV2: v.compareAtPrice ?? v.compareAtPriceV2,
    image: v.image,
  }));

  const metafields = [raw.care_guide, raw.fabric_details, raw.size_info]
    .filter(Boolean)
    .map((m: any) => ({
      namespace: m.namespace,
      key: m.key,
      value: m.value,
      html: richTextToHtml(m.value),
    }));

  const options = (raw.options ?? []).map((opt: any) => ({
    id: opt.id,
    name: opt.name,
    values: opt.values ?? opt.optionValues?.map((v: any) => v.name) ?? [],
    optionValues: opt.optionValues ?? [],
  }));

  return {
    id: raw.id,
    title: raw.title,
    handle: raw.handle,
    vendor: raw.vendor,
    tags: raw.tags ?? [],
    descriptionHtml: raw.descriptionHtml,
    seo: raw.seo,
    priceRange: raw.priceRange,
    compareAtPriceRange: raw.compareAtPriceRange,
    options,
    variants,
    media,
    images: media,
    metafields,
  };
}

/** 获取同系列推荐产品（排除当前产品） */
export async function getProductRecommendations(productId: string) {
  const query = `
    ${PRODUCT_CARD_FRAGMENT}
    query GetRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) { ...ProductCard }
    }
  `;
  const { data } = await shopify.request(query, { variables: { productId } });
  return data.productRecommendations ?? [];
}

// ─── 系列查询 ──────────────────────────────────────────────────────────────────

/** 根据 handle 获取 collection 及其产品列表 */
export async function getCollectionByHandle(handle: string, first = 50) {
  const query = `
    ${PRODUCT_CARD_FRAGMENT}
    query GetCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id
        title
        description
        image { url altText width height }
        seo { title description }
        products(first: $first) {
          edges { node { ...ProductCard } }
        }
      }
    }
  `;
  const { data } = await shopify.request(query, { variables: { handle, first } });
  return data.collection;
}

/** 获取所有 collections（导航用） */
export async function getCollections(first = 20) {
  const query = `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            image { url altText }
          }
        }
      }
    }
  `;
  const { data } = await shopify.request(query, { variables: { first } });
  return data.collections.edges.map((e: any) => e.node);
}

// ─── 搜索 ──────────────────────────────────────────────────────────────────────

/** 搜索产品（用于搜索页和搜索弹窗） */
export async function searchProducts(queryStr: string, first = 20) {
  const query = `
    ${PRODUCT_CARD_FRAGMENT}
    query SearchProducts($query: String!, $first: Int!) {
      search(query: $query, first: $first, types: [PRODUCT]) {
        edges {
          node {
            ... on Product { ...ProductCard }
          }
        }
        totalCount
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: { query: queryStr, first },
  });
  return {
    products: data.search.edges.map((e: any) => e.node),
    totalCount: data.search.totalCount,
  };
}

// ─── 购物车 CRUD ───────────────────────────────────────────────────────────────

/** 创建新购物车 */
export async function createCart() {
  const query = `
    ${CART_FRAGMENT}
    mutation CreateCart {
      cartCreate { cart { ...CartFields } userErrors { field message } }
    }
  `;
  const { data } = await shopify.request(query);
  return data.cartCreate.cart;
}

/** 添加商品到购物车 */
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1,
) {
  const query = `
    ${CART_FRAGMENT}
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });
  return data.cartLinesAdd.cart;
}

/** 更新购物车商品数量 */
export async function updateCartItem(
  cartId: string,
  lineId: string,
  quantity: number,
) {
  const query = `
    ${CART_FRAGMENT}
    mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });
  return data.cartLinesUpdate.cart;
}

/** 从购物车删除商品 */
export async function removeCartItem(cartId: string, lineId: string) {
  const query = `
    ${CART_FRAGMENT}
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: { cartId, lineIds: [lineId] },
  });
  return data.cartLinesRemove.cart;
}

/** 获取购物车完整信息 */
export async function getCart(cartId: string) {
  const query = `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
  `;
  const { data } = await shopify.request(query, { variables: { cartId } });
  return data.cart;
}

// ─── 客户认证 ──────────────────────────────────────────────────────────────────

/** 注册新客户 */
export async function createCustomer(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
) {
  const query = `
    mutation CreateCustomer($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id email firstName lastName }
        customerUserErrors { code field message }
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: {
      input: { email, password, firstName, lastName },
    },
  });
  return data.customerCreate;
}

/** 客户登录（获取 Access Token） */
export async function loginCustomer(email: string, password: string) {
  const query = `
    mutation LoginCustomer($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { code field message }
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: { input: { email, password } },
  });
  return data.customerAccessTokenCreate;
}

/** 获取客户信息 */
export async function getCustomer(accessToken: string) {
  const query = `
    query GetCustomer($token: String!) {
      customer(customerAccessToken: $token) {
        id
        email
        firstName
        lastName
        phone
        defaultAddress {
          address1 address2 city province zip country
        }
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: { token: accessToken },
  });
  return data.customer;
}

/** 获取客户订单历史 */
export async function getCustomerOrders(accessToken: string, first = 20) {
  const query = `
    query GetOrders($token: String!, $first: Int!) {
      customer(customerAccessToken: $token) {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice { amount currencyCode }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      image { url altText }
                      priceV2: price { amount currencyCode }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: { token: accessToken, first },
  });
  return data.customer?.orders?.edges?.map((e: any) => e.node) ?? [];
}

// ─── 博客查询 ──────────────────────────────────────────────────────────────────

/** 获取博客文章列表 */
export async function getBlogArticles(blogHandle = 'news', first = 20) {
  const query = `
    query GetArticles($blogHandle: String!, $first: Int!) {
      blog(handle: $blogHandle) {
        articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
          edges {
            node {
              id
              title
              handle
              excerpt
              publishedAt
              image { url altText width height }
              authorV2 { name }
              contentHtml
            }
          }
        }
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: { blogHandle, first },
  });
  return data.blog?.articles?.edges?.map((e: any) => e.node) ?? [];
}

/** 根据 handle 获取单篇博客文章 */
export async function getBlogArticleByHandle(
  blogHandle = 'news',
  articleHandle: string,
) {
  const query = `
    query GetArticle($blogHandle: String!, $articleHandle: String!) {
      blog(handle: $blogHandle) {
        articleByHandle(handle: $articleHandle) {
          id
          title
          handle
          contentHtml
          excerpt
          publishedAt
          image { url altText width height }
          authorV2 { name }
          seo { title description }
        }
      }
    }
  `;
  const { data } = await shopify.request(query, {
    variables: { blogHandle, articleHandle },
  });
  return data.blog?.articleByHandle ?? null;
}
