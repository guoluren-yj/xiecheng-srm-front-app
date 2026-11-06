import { http, SrmUtil } from "srm-mobile-ui";

export function getHeadApi(id, params) {
  return http.get(`scux/v1/${SrmUtil.getTenantId()}/item-req/header/${id}`, { params });
}