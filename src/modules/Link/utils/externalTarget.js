/**
 * 外部跳转目标判定（platform-9076 安全整改 / poc34）
 *
 * 背景：Link 页面（/Link 路由）会把 url 查询参数解码后作为 iframe src，
 * 并把 localStorage 中的长期 user-token 回填进地址里的 {accessToken} 占位符。
 * 原实现不校验目标 host，攻击者可构造任意域名的链接让用户点击，
 * 令牌随 iframe 请求发往攻击者域名（开放重定向 → 会话接管）。
 *
 * 处置原则：
 *   1. 只有「自有域」才回填令牌；其它域允许打开但【不注入任何凭据】。
 *   2. host 必须用解析后的真实值比对 —— 不能用 startsWith / includes 之类的
 *      字符串判断，否则 http://srm-host@evil.com/x 这类 userinfo 劫持可直接绕过。
 *
 * ★★ 维护红线：本文件【禁止】出现 `URL` 这个全局标识符
 *    （含 new URL(...)、window.URL、globalThis.URL）。原因不是代码风格，是构建会直接失败：
 *
 *      本仓 babel 链 = @vue/cli-plugin-babel 5.x → babel-plugin-polyfill-corejs3 0.8.x
 *      → core-js-compat 3.33.x；在 useBuiltIns=usage 下，只要检测到对全局 `URL` 的引用
 *      （成员表达式 window.URL 同样被判定为引用），就注入
 *          core-js/modules/web.url-search-params.{has,delete,size}.js
 *      这三个「拆分后的」模块；而本仓 package.json 硬锁 `core-js: 3.27.2`，
 *      该版本尚未拆出这三个文件 ⇒ webpack 报 Module not found ⇒ CI node_build 失败。
 *
 *      实测两次：pipeline #1435533（裸 new URL）、#1435551（改成 window.URL 仍失败）。
 *      结论：只要触碰该标识符就必然被打红，唯一出路是完全不用它。
 *
 *   故改用 <a> 元素解析：href 赋值后由浏览器按同一套地址解析规范补全
 *   （含相对路径补全、反斜杠归一、userinfo 保留），结果与 new URL 一致，
 *   且源码里不出现 `URL` 标识符，构建链不会注入 polyfill。
 *
 * 维护说明：新增客户自有域时追加到 CUSTOMER_TOKEN_HOSTS。
 */
import { SrmUtil } from "srm-mobile-ui";

/** 绝对地址判定：scheme: 开头（http: / https: / javascript: / data: …） */
const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

/** 形如 scheme://userinfo@host —— 用于拦截 userinfo 劫持（不依赖浏览器的 username 支持度） */
const USERINFO_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^/?#]*@/;

/**
 * 把待判定地址补成可解析的绝对地址。
 *
 * 补全规则与实际跳转行为保持一致：
 *   - 已带 scheme（http:/https:/javascript: …）→ 原样返回，交给浏览器判协议
 *   - 协议相对（//host/x）→ 原样返回（浏览器按当前协议补，host 即目标 host）
 *   - 其余视为相对路径 → 拼到 API 基地址后（Link.vue 对 "/..." 也是这么处理的，
 *     故相对路径的真实去向就是 API 基地址所在域）
 *
 * @param {string} rawUrl 原始地址
 * @param {string} baseUrl 相对路径基准，缺省取 API 基地址
 * @returns {string} 可解析的地址字符串
 */
function toAbsolute(rawUrl, baseUrl) {
  if (SCHEME_RE.test(rawUrl) || rawUrl.startsWith("//")) {
    return rawUrl;
  }
  const base = baseUrl || SrmUtil.getApiBaseUrl() || "";
  if (!base) {
    return rawUrl;
  }
  return base.replace(/\/+$/, "") + "/" + rawUrl.replace(/^\/+/, "");
}

/**
 * 解析地址，取出判定所需的三个分量。
 *
 * @param {string} rawUrl 原始地址
 * @param {string} baseUrl 相对路径基准
 * @returns {{protocol:string,host:string,hasUserinfo:boolean}|null}
 *          解析器不可用时返回 null，调用方须 fail-closed
 */
function parseTarget(rawUrl, baseUrl) {
  if (typeof document === "undefined") {
    // 无浏览器环境（SSR / 单测）⇒ 无法解析，交由调用方 fail-closed
    return null;
  }
  try {
    const anchor = document.createElement("a");
    anchor.href = toAbsolute(rawUrl, baseUrl);
    return {
      protocol: anchor.protocol,
      host: anchor.host,
      // userinfo 用正则独立判断：部分环境下 anchor.username 不可用，
      // 但 href 归一化会保留 userinfo，故正则判原文更可靠
      hasUserinfo: USERINFO_RE.test(rawUrl),
    };
  } catch (e) {
    return null;
  }
}

/** 从形如 https://a.b.com/xx 的地址中取出 host（不含协议/路径），取不到返回空串 */
function hostOf(url) {
  const parsed = parseTarget(url);
  return parsed && parsed.host ? parsed.host.toLowerCase() : "";
}

/**
 * 允许注入令牌的自有域。
 * SRM 自有域从 SrmUtil.getApiBaseUrl() 推导（各环境自动适配）；
 * 以下两个为客户自有域名，无法从环境推导，需在此维护。
 */
const CUSTOMER_TOKEN_HOSTS = [
  // 29681 松下MRO采购系统：我的待办 / 我的工作流
  "mromall.panasonic.cn",
  // 55483 金风科技：自有电子商城
  "goldwind.going-buy.com",
];

const TOKEN_HOSTS = [hostOf(SrmUtil.getApiBaseUrl()), ...CUSTOMER_TOKEN_HOSTS].filter(Boolean);

/** 目标类型：允许注入令牌 */
export const TARGET_TOKEN = "TOKEN";
/** 目标类型：仅允许打开，不注入任何凭据 */
export const TARGET_PLAIN = "PLAIN";
/** 目标类型：拒绝（非 http/https 或存在 userinfo 劫持） */
export const TARGET_REJECT = "REJECT";

/**
 * 判定目标地址所属类型。
 *
 * @param {string} rawUrl 已经过解码的原始 url（可能是相对路径，也可能是绝对地址）
 * @param {string} baseUrl 相对路径解析时使用的基准域，默认取 API 基地址
 * @returns {string} TARGET_TOKEN / TARGET_PLAIN / TARGET_REJECT
 */
export function classifyTarget(rawUrl, baseUrl) {
  if (!rawUrl) {
    return TARGET_REJECT;
  }
  const parsed = parseTarget(rawUrl, baseUrl);
  if (!parsed || !parsed.host) {
    // 解析器不可用或解析不出 host ⇒ 安全控件失效，fail-closed（宁可不放行）
    return TARGET_REJECT;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    // 挡 javascript: / data: / file: 等
    return TARGET_REJECT;
  }
  if (parsed.hasUserinfo) {
    // 挡 http://srm-host@evil.com/x 这类 userinfo 劫持
    return TARGET_REJECT;
  }
  return TOKEN_HOSTS.includes(parsed.host.toLowerCase()) ? TARGET_TOKEN : TARGET_PLAIN;
}
