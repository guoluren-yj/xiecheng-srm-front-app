/**
 * 与 【订单审批】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取订单审批列表
export const getApprovalListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/approving`;
  return http.get(url, { params });
};

// 供应商查询
export const getSupplierApi = (params) => {
  const url = "/spfm/v1/lovs/sql/data";
  return http.get(url, { params });
};

// 采购员查询
export const getPurchaserApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/user-authority-data/purchase-agent`;
  return http.get(url, { params });
};

// 审批通过
export const adoptApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/detail-approve`;
  return http.post(url, params);
};

// 审批拒绝
export const rejectApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/detail-reject`;
  return http.post(url, params);
};

// 批量审批通过
export const someAdoptApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/batch-approve`;
  return http.post(url, params);
};

// 批量审批拒绝
export const someRejectApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/batch-reject`;
  return http.post(url, params);
};

// 订单审批明细头查询
export const getOrderHeaderApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/detail`;
  return http.get(url, { params });
};

// 订单审批明细行查询
export const getOrderLineApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-line/${poHeaderId}/detail`;
  return http.get(url, { params });
};

// 审批操作记录查询
export const getOpRecordApi = (poHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-process-actions/${poHeaderId}`;
  return http.get(url, {
    params: {
      page: 0,
      size: 0,
      tenantId: SrmUtil.getTenantId()
    }
  });
};

/**
 * 查询是否开启双单位配置
 * @async
 * @function queryDoubleUomConfig
 * @returns {object} fetch Promise 0不开启双单位，1上下游和订单都开启，2仅订单开启
 */
 export const queryDoubleUomConfigApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/secondary/getcnf`;
  return http.get(url, { params});
};

/**
 * 双单位计算公式
 * @async
 * @function calculateDoubleUom
 * @returns {object}
 */
export async function calculateDoubleUomApi(params) {
  const url = `/smdm/v1/${storage.getItem("organizationId")}/items/uom/calculate/quantity`;
  return http.post(url, params);
}