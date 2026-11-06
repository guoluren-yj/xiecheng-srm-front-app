import { http, SrmUtil } from "srm-mobile-ui";

// 获取报价基础信息
export const getHeaderApi = (id) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.HEADER_DETAIL,SSRC.INQUIRY_HALL_DETAIL.HEADER_PREQUAL`;
  return http.get(url);
};
