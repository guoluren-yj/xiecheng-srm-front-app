import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息查询
export const getHeaderApi = (id, params) => {
  const url = `/srpm/v1/${SrmUtil.getTenantId()}/request-plan/detail/${id}`;
  return http.get(url, { params });
};
