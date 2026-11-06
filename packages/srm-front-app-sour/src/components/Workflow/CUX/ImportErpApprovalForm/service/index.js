import { http, SrmUtil } from "srm-mobile-ui";

//获取行记录
export const fetchLineData = (params) => {
  const url = `/spc/v1/${SrmUtil.getTenantId()}/price-lib-tmpl-dims/tableHeaderList`;
  return http.post(url, params);
};