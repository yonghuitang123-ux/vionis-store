/**
 * Shopify Storefront API 完整封装
 * ─────────────────────────────────────────────────────────────────
 * 包含：产品查询、系列查询、搜索、购物车 CRUD、客户认证、订单查询
 * 所有函数均通过 Storefront API GraphQL 端点调用
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client';

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

/** 根据 handle 获取单个产品完整信息（PDP 页面用） */
export async function getProductByHandle(handle: string) {
  const query = `
    ${PRODUCT_FULL_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) { ...ProductFull }
    }
  `;
  const { data } = await shopify.request(query, { variables: { handle } });
  return data.product;
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
