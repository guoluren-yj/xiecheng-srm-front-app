import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取收货执行头部数据
export const getReceivingExecuteApprovalHeadDetail = (id, nodeIndex) => {
  let params = {
    customizeUnitCode: "SINV.RECEIPT_EXECUTE_DETAIL.HEADER_" + nodeIndex,
  };

  return http.get(`/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/${id}/detail`, { params });
};

// 获取收货执行数据
export const getReceivingExecuteLineDetail = (id, nodeIndex) => {
  let params = {
    customizeUnitCode: "SINV.RECEIPT_EXECUTE_DETAIL.LINE_" + nodeIndex,
    page: 0,
    size: 1000,
  };

  return http.get(`/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/line/${id}/detail`, { params });
};
