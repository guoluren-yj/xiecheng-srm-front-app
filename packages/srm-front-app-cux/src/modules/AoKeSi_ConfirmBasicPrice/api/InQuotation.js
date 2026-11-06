import { http, SrmUtil } from "srm-mobile-ui";
//报价中基本信息
export const getInQuotationBasicInfoApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/simple/${rfxHeaderId}?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.QUOTATION_NODE_BASEINFO`;
  return http.get(url);
};