import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBasicInfoApi = (id, params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/score/detail`;
  return http.get(url, { params });
};