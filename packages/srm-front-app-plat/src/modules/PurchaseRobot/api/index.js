import { httpNoCatch, SrmUtil } from "srm-mobile-ui";

const SRM_SMBL = "/smbl";

// 获取远端控制url
export async function getUrlWithCodeApi(code) {
  const params = { code, language: SrmUtil.getLanguage() };
  return httpNoCatch.get(`${SRM_SMBL}/v1/link/${SrmUtil.getTenantId()}/imab-login-page`, { params, responseType: "text" });
}
