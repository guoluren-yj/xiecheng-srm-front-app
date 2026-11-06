import { http, SrmUtil } from "srm-mobile-ui";

// 获取奥克斯招标计划详情
export const getBidPlanDetailBase = (planId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux-ssrc-bid-plan-summarys/${planId}`;

  return http.get(url, { params: { page: 0, size: 10, asyncCountFlag: "DEFAULT" } });
};

// 获取行业类型
export const getBidPlanDetailLine = (planId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux-ssrc-bid-plan-reports/${planId}`;

  return http.get(url, { params: { asyncCountFlag: "DEFAULT" } });
};