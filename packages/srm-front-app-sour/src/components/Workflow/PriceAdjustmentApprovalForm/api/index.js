import { http } from "srm-mobile-ui";

const storage = window.localStorage;

//获取适用范围列表
export const getViewScopeList = (params) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-adjustment-scopes`;
  return http.get(url, { params });
};

//获取公司业务实体库存组织
export const getScopeDetailListApi = (params) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-adjustment-scopes/line`;
  return http.get(url, { params });
};