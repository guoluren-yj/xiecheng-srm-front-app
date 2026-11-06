import { http, SrmUtil } from "srm-mobile-ui";

// 出席/不出席
export const expertReplyApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/o4h0iaJxyEgvc55WDBWoUozoSQqDaDxHPbbKxFrKAAyQ7icPDGRHSgANznKObgIxfX?actionMethod=REPLY`;
  return http.post(url, params);
};