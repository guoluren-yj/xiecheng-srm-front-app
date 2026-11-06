import { http, SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

// 查询头信息
export const fetchHeaderInfo = (payload) => {
  const { evalPlanHeaderId, ...params } = payload || {};
  const url = `/sslm/v1/${organizationId}/eval-plan-headers/${evalPlanHeaderId}`;
  return http.get(url, { params });
};