
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 定标结果
// 获取头部页面信息
export const getCalibrationOrderHeadApi = (taskId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/${taskId}`;
  return http.get(url, { params });
};
// 获取物料信息
export const getCalibrationMaterialInfoApi = (taskId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/items/${taskId}`;
  return http.get(url, { params });
};
// 获取投标信息
export const getCalibrationBidInfoApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/quotation/detail`;
  return http.get(url, { params });
};
// 获取总分信息
export const getCalibrationScroeDetailApi = (evaluateSummaryId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/summary/${evaluateSummaryId}/indic-detail`;
  return http.get(url);
};

// 获取招投标供应商分配信息
export const getSupplierAssignedApi = (bidHeaderId, bidLineItemId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/item-sup-assign?bidHeaderId=${bidHeaderId}&bidLineItemId=${bidLineItemId}`;
  return http.get(url);
};
//协议审批详情接口
export const getAgreementDetailApi = (pcHeaderId) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}?customizeUnitCode=SPCM.PURCHASE_CONTRACT_MAINTAIN.DETAIL`;
  return http.get(url);
};
//协议标的详情接口
export const getAgreementApi = (pcHeaderId) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/pc-subject/page?customizeUnitCode=SPCM.PURCHASE_CONTRACT_MAINTAIN.SUBJECT&page=0&size=1000`;
  return http.get(url);
};
//获取投标信息
export const getCalibrationSuppliersInfoApi = (taskId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/suppliers/${taskId}/detail`;
  return http.get(url, { params });
};
//获取招标小组信息
export const getTenderingGroupApi = (taskId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/members/${taskId}`;
  return http.get(url);
};

// 获取报价明细
export const getQuotationDetailApi = (rfxHeaderId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${rfxHeaderId}/quotationTemplate/view`;
  return http.get(url, { params });
};
