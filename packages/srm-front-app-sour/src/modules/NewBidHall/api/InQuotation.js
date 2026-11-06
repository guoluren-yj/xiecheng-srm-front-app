import { http, SrmUtil } from "srm-mobile-ui";
//报价中基本信息
export const getInQuotationBasicInfoApi = (documentType, rfxHeaderId) => {
  const customizeUnitCode = documentType === "BID" ? "SSRC.INQUIRY_HALL_DETAIL.QUOTATION_DETAIL" : "SSRC.INQUIRY_HALL_DETAIL.QUOTATION_NODE_BASEINFO";
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/simple/${rfxHeaderId}?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url);
};