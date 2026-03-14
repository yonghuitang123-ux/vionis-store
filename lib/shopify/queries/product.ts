/**
 * 产品详情页 Storefront API Query
 * ─────────────────────────────────────────────────────────────────
 * 使用 media 连接获取图片（含 alt），支持按颜色过滤
 */

export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
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
      options {
        id
        name
        values
        optionValues {
          name
          swatch {
            image {
              previewImage { url }
            }
            color
          }
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText width height }
        }
      }
      media(first: 30) {
        nodes {
          ... on MediaImage {
            alt
            image { url width height }
          }
        }
      }
      care_guide: metafield(namespace: "custom", key: "123456") {
        namespace key value
      }
      fabric_details: metafield(namespace: "custom", key: "1234") {
        namespace key value
      }
      size_info: metafield(namespace: "custom", key: "1123") {
        namespace key value
      }
    }
  }
`;
