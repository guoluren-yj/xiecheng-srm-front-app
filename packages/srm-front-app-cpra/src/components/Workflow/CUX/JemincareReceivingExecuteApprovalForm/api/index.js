import { http, SrmUtil } from "srm-mobile-ui";

// 获取头部数据
export const getReceivingExecuteApprovalHeadDetail = (id, nodeIndex) => {
  let params = {
    customizeUnitCode: "SINV.RECEIPT_WORKBENCH_THING.DETAIL." + nodeIndex,
  };

  return http.get(`/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/header/${id}/detail`, { params });
};

// 获取行数据
export const getReceivingExecuteLineDetail = (id, nodeIndex) => {
  let params = {
    customizeUnitCode: "SINV.RECEIPT_WORKBENCH_THING.DETAIL.LINE_" + nodeIndex,
    page: 0,
    size: 1000,
  };

  return http.get(`/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/line/${id}/detail`, { params });
};

// 保存
export const saveApi = (query, params) =>
  http.put(`/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/save?${query}`, params);