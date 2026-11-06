import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息查询
export const getHeaderApi = (id, params) => {
  const url = `/srpm/v1/${SrmUtil.getTenantId()}/request-plan-balance/detail/${id}`;
  return http.get(url, { params });
};

// 来源单据查询
export const getSourceDataApi = (id, params) => {
  const url = `/srpm/v1/${SrmUtil.getTenantId()}/request-plan-execute/bl-line-source?blLineId=${id}`;
  return http.get(url, { params });
};