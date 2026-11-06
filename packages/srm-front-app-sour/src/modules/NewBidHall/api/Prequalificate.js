import { http, SrmUtil } from "srm-mobile-ui";
//资格预审基本信息
export const getPrequalBasicInfoApi = (documentType, rfxHeaderId) => {
  const customizeUnitCode = documentType === "BID" ? "SSRC.INQUIRY_BID_DETAIL.PREQUAL_HEADER" : "SSRC.INQUIRY_HALL_DETAIL.PREQUAL_HEADER";
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/prequal/RFX/${rfxHeaderId}?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url);
};
