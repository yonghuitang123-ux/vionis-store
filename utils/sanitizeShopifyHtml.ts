/**
 * 处理 Shopify 政策页面返回的 HTML body。
 * 对没有 href 属性的 <a> 标签补全 href="#"，
 * 避免浏览器控制台警告和无效锚点。
 */
export function sanitizeShopifyHtml(html: string): string {
  return html.replace(
    /<a([^>]*?)>/g,
    (match) => {
      if (match.includes('href')) return match;
      return match.replace('<a', '<a href="#"');
    },
  );
}
