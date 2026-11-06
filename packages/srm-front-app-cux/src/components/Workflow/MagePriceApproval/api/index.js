import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (id) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/AjMOB6kpq6iaLA7RAWYKmTu33rvMV0DIoETBicQCr6R1s?id=${id}`;
  return http.get(url);
};
