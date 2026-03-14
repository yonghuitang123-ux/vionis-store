export const PAGE_BY_HANDLE_QUERY = `
  query PageByHandle($handle: String!) {
    page(handle: $handle) {
      title
      body
      seo { title description }
    }
  }
`
