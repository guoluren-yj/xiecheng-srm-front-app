import { http, SrmUtil } from "srm-mobile-ui";

export const getBasicDataApi = (params) => {
  let url = `/smodr/v1/${localStorage.getItem("organizationId")}/orders/batch-detail`;
  return http.get(url, { params });
};

export const fetchSelectInfo = (code) => {
  let url = `hpfm/v1/${SrmUtil.getTenantId()}/lovs/data`;
  let params = {
    lovCode:code
  };
  return http.get(url, { params });
};