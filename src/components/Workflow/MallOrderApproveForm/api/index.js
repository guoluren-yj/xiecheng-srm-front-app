import { http, SrmUtil } from "srm-mobile-ui";

export const demo = (id) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-component-reqs/page/${id}`;
  let params = {
    customizeUnitCode: "SMDM_MATERIELAPPLICATION_COMPONENTTABLE.EDITFORM,SMDM_MATERIELAPPLICATION_COMPONENTTABLE.TABLE",
    page: 0,
    size: 1000,
    organizationId: SrmUtil.getTenantId(),
  };
  return http.get(url, { params });
};
