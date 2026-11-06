import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (planSummaryId) => {
  let url = `/scux2/v1/${SrmUtil.getTenantId()}/yx-capital-plan-sum/head-detail/${planSummaryId}`;
  return http.get(url);
};