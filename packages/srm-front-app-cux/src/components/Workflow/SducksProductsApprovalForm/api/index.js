import { http, SrmUtil } from "srm-mobile-ui";
// 保存
export const fetchFieldsInfo = (params, categoryId) => {
  const url = `/smpc/v1/${SrmUtil.getTenantId()}/skus/query-category-attrs/${categoryId}`;
  return http.get(url, { params });
};
