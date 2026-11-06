import { http, SrmUtil } from "srm-mobile-ui";

// 获取报价基础信息
export const getHeaderApi = (documentType, id) => {
  const customizeUnitCode = documentType === "BID" ? "SSRC.INQUIRY_BID_DETAIL.PRETRIAL_INFO_HEADER" : "SSRC.INQUIRY_HALL_DETAIL.HEADER_DETAIL,SSRC.INQUIRY_HALL_DETAIL.HEADER_PREQUAL";
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url);
};
