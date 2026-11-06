import { http, SrmUtil } from "srm-mobile-ui";

const bucketName = "private-bucket";
const storage = window.localStorage;

/**验收单审批接口*/

// 获取审批页面信息
export const getReceiptApprovalApi = (taskId) => http.get(`/hwfp/v1/${storage.getItem("organizationId")}/activiti/task/${taskId}`);
// 获取头信息
export const getReceiptOrderHeadInfoApi = (acceptListHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/ac-header/${acceptListHeaderId}`;
  return http.get(url);
};
// 获取验收单明细行信息
export const getReceiptOrderLineInfoApi = (acceptListHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/ac-line/${acceptListHeaderId}/lines`;
  return http.get(url);
};

/**供应商审批**/

// 头信息查询
export const getOrderHeadInfoApi = (type, changeReqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/${type}/${changeReqId}?customizeUnitCode=SSLM.SUPPLIER_LIFE_MANAGE.REC_ATT_IN%2CSSLM.SUPPLIER_LIFE_MANAGE.RECOMMEND_ITEM_TABLE%2CSSLM.SUPPLIER_LIFE_MANAGE.RECOMMEND_HEADER&organizationId=7860`;
  return http.get(url);
};
// 供应商分类查询
export const getSupplierCategoryInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-category-assign`;
  return http.get(url, {
    params
  });
};

/**核价审批*/

// 详情查询
export const getPricingOrderHeadApi = (changeReqId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${changeReqId}`;
  return http.get(url, {
    params
  });
};
// 物料查询
export const getPricingItemInfoApi = (changeReqId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${changeReqId}/items`;
  return http.get(url, {
    params
  });
};
// BTN物料查询
export const getBTNPricingItemInfoApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/items`;
  return http.get(url, {
    params
  });
};
// 供应商报价查询
export const getPricingSupplierQuotationApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/check`;
  return http.get(url, {
    params
  });
};
// 操作记录查询
export const getPricingOperateApi = (params, changeReqId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${changeReqId}/actions`;
  return http.get(url, {
    params
  });
};
// 阶梯报价查询
export const getLadderQuotationApi = (lineId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${lineId}/ladder-quotation`;
  return http.get(url);
};

/**订单审批 */

// 订单审批明细头查询
export const getOrderHeaderApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/detail`;
  params.customizeUnitCode = "SODR.ORDER_APPROVE_LINE_LIST.HEADER,SODR.ORDER_APPROVE_LINE_LIST.DELIVERY_CATA";
  return http.get(url, {
    params
  });
};
// 附件查询
export const getAttachedFileApi = (uuid) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/${uuid}/file?attachmentUUID=${uuid}&bucketName=${bucketName}`;
  return http.get(url);
};
// 订单审批明细行查询
export const getOrderLineApi = (poHeaderId, params = {}) => {
  params.customizeUnitCode = "SODR.ORDER_APPROVE_LINE_LIST.APPROVE,SODR.ORDER_APPROVE_LINE_LIST.OTHER";
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-line/${poHeaderId}/detail`;
  return http.get(url, {
    params
  });
};

/**
 * 订单审批操作记录
 * @param headerId
 * @returns {any}
 */
export const getPoProcessActions = (headerId) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-process-actions/${headerId}`;
  return http.get(url, {
    params: {
      page: 0,
      size: 1000,
      tenantId: SrmUtil.getTenantId()
    }
  });
};
