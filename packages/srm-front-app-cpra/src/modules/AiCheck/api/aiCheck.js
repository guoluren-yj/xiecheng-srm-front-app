import { http, SrmUtil } from "srm-mobile-ui";

// 查询企业详情
export const fetchCheckResult = (params) => {
  const url = `/smbl/v1/${SrmUtil.getTenantId()}/ai-check/task-dashboard?sort=${
    params?.sort || ""
  }&page=${params?.page || -1}&size=${params?.size || 10}`;
  return http.post(url, params?.queryList ?? []);
};
