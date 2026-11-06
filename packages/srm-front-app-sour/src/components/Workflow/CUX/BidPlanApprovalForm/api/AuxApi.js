import { http, SrmUtil } from "srm-mobile-ui";

// 获取奥克斯招标计划详情
export const getBidPlanDetail = (planId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux-ssrc-bid-plan-reports/detail`;

  return http.get(url, { params: { planId } });
};

// 获取行业类型
export const getOrgType = (organizationCode) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux-ssrc-bid-plan-reports/pur-org`;

  return http.get(url, { params: { organizationCode } });
};
