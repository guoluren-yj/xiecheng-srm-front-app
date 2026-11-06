import { http, SrmUtil } from "srm-mobile-ui";

// 获取报价基础信息
export const getHeaderApi = (id) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.HEADER_DETAIL,SSRC.INQUIRY_HALL_DETAIL.HEADER_PREQUAL,SMBL.INQUIRY_HALL.CP.BASICINFO`;
  return http.get(url);
};
// 获取全部报价明细
export const getAllQuotationDetailsApi = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/check?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.ALL_QUOTATION`;
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
