/**
 * 与 【订单审批】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

const storage = window.localStorage;
//const bucketName = "private-bucket";

// 获取订单审批列表
const getApprovalListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/delivery-query`;
  return http.get(url, { params });
};

// 批量审批通过
const someAdoptApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/delivery-date-review/agree`;
  return http.post(url, params);
};

// 批量审批拒绝
const someRejectApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/delivery-date-review/reject`;
  return http.post(url, params);
};

// 订单审批明细头查询
const getOrderHeaderApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/detail`;
  return http.get(url, { params });
};

// 订单审批明细行查询
const getOrderLineApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-line/${poHeaderId}/detail`;
  return http.get(url, { params });
};

// 审批操作记录查询
const getOpRecordApi = (poHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-process-actions/${poHeaderId}`;
  return http.get(url, {
    params: {
      page: 0,
      size: 0,
      tenantId: SrmUtil.getTenantId()
    }
  });
};
// 获取上传附件UUID
const getFileUUIDApi = () => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/uuid`;
  return http.post(url);
};

// 查询是否开启双单位配置
const queryDoubleUomConfigApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/secondary/getcnf`;
  return http.get(url, { params});
};

export {
  queryDoubleUomConfigApi,
  getApprovalListApi,
  someAdoptApi,
  someRejectApi,
  getOrderHeaderApi,
  getOrderLineApi,
  getOpRecordApi,
  getFileUUIDApi
};
