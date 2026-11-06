import { http, SrmUtil } from "srm-mobile-ui";

// 计划分配信息
export const getBaseInfoApi = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/3MHQPwE9BbIOOSKb93UDXuNiaOJbkGhS3AyC9zgD9OG7Yr6sAIsTSWqr6RXiaf8997?type=planDistribution`;
  return http.get(url, { params });
};

// 退回至修改 - 分配
export const fetchSubmitInspection = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/3MHQPwE9BbIOOSKb93UDXtRgc6Z9W9RcCsovB3WoVE9Vuib2FKKY4ccmNgWG2jvSia`;
  return http.post(url, params);
};

// 操作记录
export const hisToryApi = (params) => {
  let url = `/sada/v1/${SrmUtil.getTenantId()}/rel-table-records/scux_srm_xxjt_bidding_plan_action/page`;
  return http.post(url, params);
};
