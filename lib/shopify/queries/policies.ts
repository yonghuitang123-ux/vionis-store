export const SHOP_POLICIES_QUERY = `
  query ShopPolicies {
    shop {
      privacyPolicy { title body }
      refundPolicy { title body }
      shippingPolicy { title body }
      termsOfService { title body }
    }
  }
`
