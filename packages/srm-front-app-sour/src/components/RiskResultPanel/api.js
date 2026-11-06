import { http, SrmUtil } from "srm-mobile-ui";

// 查询企业详情
export const fetchRiskTroubleshoot = (params) => {
  const url = `/sdat/v1/${SrmUtil.getTenantId()}/risk-report-record/company-relation-mining`;
  return http.get(url, { params });
};
