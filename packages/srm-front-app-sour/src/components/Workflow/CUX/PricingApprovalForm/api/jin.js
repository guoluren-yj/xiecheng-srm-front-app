import {
  http
} from "srm-mobile-ui";

const bucketName = "private-bucket";
const storage = window.localStorage;

// 物料查询
export const getPricingItemInfoApi = (changeReqId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${changeReqId}/items`;
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

// 供应商报价查询
export const getPricingSupplierQuotationApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/check`;
  return http.get(url, {
    params
  });
};

// 附件查询
export const getAttachedFileApi = (uuid) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/${uuid}/file?attachmentUUID=${uuid}&bucketName=${bucketName}`;
  return http.get(url);
};

// 获取报价明细
export const getQuotationDetailApi = (rfxHeaderId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${rfxHeaderId}/quotationTemplate/view`;
  return http.get(url, { params });
};
