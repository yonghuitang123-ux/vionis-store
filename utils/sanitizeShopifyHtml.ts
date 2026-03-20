/**
 * 处理 Shopify 返回的 HTML，防止 XSS 攻击。
 * 使用 DOMPurify 消毒 HTML，移除危险标签和属性。
 */
import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's', 'sub', 'sup',
  'a', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'pre', 'code',
  'img',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'title', 'class', 'style',
  'src', 'alt', 'width', 'height', 'loading',
];

export function sanitizeShopifyHtml(html: string): string {
  if (!html) return '';

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });

  // 对没有 href 的 <a> 标签补全 href="#"
  return clean.replace(
    /<a([^>]*?)>/g,
    (match) => {
      if (match.includes('href')) return match;
      return match.replace('<a', '<a href="#"');
    },
  );
}
