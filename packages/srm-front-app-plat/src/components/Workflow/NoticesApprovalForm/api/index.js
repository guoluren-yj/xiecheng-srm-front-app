import { http, SrmUtil } from "srm-mobile-ui";

export function getNoticeInfoApi(noticeId) {
  return http.get(`spfm/v1/${SrmUtil.getTenantId()}/notices/${noticeId}?customizeUnitCode=SPFM.NOTICES.DETAIL.FORM`);
}