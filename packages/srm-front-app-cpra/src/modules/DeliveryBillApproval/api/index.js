/**
 * 与 【订单审批】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// const bucketName = "private-bucket";

// 获取订单审批列表
const getApprovalListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/approve`;
  return http.get(url, { params });
};

// 审批通过
const adoptApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/approve/pass`;
  return http.post(url, params);
};

// 审批拒绝
const rejectApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/approve/reject`;
  return http.post(url, params);
};

// 送货单审批明细头查询
const getOrderHeaderApi = (asnHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}`;
  return http.get(url, { params });
};

// 送货单审批明细行查询
const getOrderLineApi = (asnHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/page-lines`;
  return http.get(url, { params });
};

// 送货单审批操作记录查询
const getOpRecordApi = (asnHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/action`;
  return http.get(url);
};

// 获取上传附件UUID
const getFileUUIDApi = () => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/uuid`;
  return http.post(url);
};

// 获取门店明细
const getStoreInfoList = (itemId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-detail-list/${itemId}`;
  return http.get(url);
};

export {
  getApprovalListApi,
  adoptApi,
  rejectApi,
  getOrderHeaderApi,
  getOrderLineApi,
  getOpRecordApi,
  getFileUUIDApi,
  getStoreInfoList,
};
