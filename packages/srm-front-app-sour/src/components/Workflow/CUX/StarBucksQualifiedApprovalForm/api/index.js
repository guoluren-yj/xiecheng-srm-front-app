import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (requisitionId) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/life-cycle/qualified/${requisitionId}`;
  return http.get(url);
};

// 准入调查问卷评估结果信息
export const getAccessReqsInfoApi = (requisitionId) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/starbucks-sup-access-reqs/${requisitionId}`;
  return http.get(url);
};

// 尽职调查报告信息
export const getReportReqsInfoApi = (requisitionId) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/starbucks-resp-report-reqs/${requisitionId}`;
  return http.get(url);
};

