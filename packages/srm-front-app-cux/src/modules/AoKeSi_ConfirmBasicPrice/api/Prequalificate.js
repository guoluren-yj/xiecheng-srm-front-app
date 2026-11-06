import { http, SrmUtil } from "srm-mobile-ui";
//资格预审基本信息
export const getPrequalBasicInfoApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/prequal/RFX/${rfxHeaderId}?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.PREQUAL_HEADER`;
  return http.get(url);
};
