import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (id) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/XGVEiaWUVE8VbIvc3ovW3w20KmdNsJeyFR0bGmaxEyJ0?id=${id}`;
  return http.get(url);
};

// 审批同意
export const toApprovalList = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/XGVEiaWUVE8VbIvc3ovW3w9qgQa3J71AfM0odYbPShm0`;
  return http.post(url, params);
};