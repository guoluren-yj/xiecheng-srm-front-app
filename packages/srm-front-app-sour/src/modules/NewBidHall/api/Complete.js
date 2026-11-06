import { http, SrmUtil } from "srm-mobile-ui";

// 获取报价基础信息
export const getHeaderApi = (documentType, id) => {
  const customizeUnitCode = documentType === "BID" ? "SSRC.INQUIRY_BID_DETAIL.CHECK_PRICE_HEADER,SSRC.INQUIRY_BID_DETAIL.COST.REMARK" : "SSRC.INQUIRY_HALL_DETAIL.HEADER_DETAIL,SSRC.INQUIRY_HALL_DETAIL.HEADER_PREQUAL";
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url);
};
// 获取全部报价明细
export const getAllQuotationDetailsApi = (documentType, params) => {
  const customizeUnitCode = documentType === "BID" ? "SSRC.INQUIRY_BID_DETAIL.ALL_QUOTATION" : "SSRC.INQUIRY_HALL_DETAIL.ALL_QUOTATION";
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/check?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url, { params });
};
// 过程附件下载
export const processAttachmentDownloadApi = (id, param) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/process-attachment/download-all`;
  return http.get(url, param);
};
// 获取报价明细信息
export const getPricingQuotaionDetailInfoApi = (id, params) => {
  const url = `ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/quotationTemplate/view`;
  return http.get(url, { params });
};
