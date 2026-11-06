/**
 * HTML 富文本净化，用于 document.write / innerHTML / v-html 渲染前，
 * 防止存储型 XSS：去掉可执行标签、on* 事件属性、javascript: 等伪协议。
 * 注：DOMParser 解析过程不执行脚本，各端浏览器均支持。
 */
const BLOCKED_TAGS = "script, iframe, object, embed, link, meta, base, form";

// javascript:/vbscript: 伪协议；data: 仅拦截可执行脚本的 text/html，图片类型不限
const BAD_URL = /^\s*(javascript|vbscript)\s*:|^\s*data\s*:\s*text\/html/i;

export function sanitizeHtml(html) {
  if (!html || typeof html !== "string") {
    return "";
  }
  if (typeof DOMParser === "undefined") {
    return html.replace(/<[^>]*>/g, "");
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.body.querySelectorAll(BLOCKED_TAGS).forEach((el) => el.remove());

  doc.body.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach(({ name, value }) => {
      // 先剔除空白/控制字符，防止 java\tscript: 这类拆分绕过
      const normalized = value.replace(/[\u0000-\u0020]/g, "");
      if (/^on/i.test(name) || BAD_URL.test(normalized)) {
        el.removeAttribute(name);
      }
    });
  });

  return doc.body.innerHTML;
}

export default sanitizeHtml;
