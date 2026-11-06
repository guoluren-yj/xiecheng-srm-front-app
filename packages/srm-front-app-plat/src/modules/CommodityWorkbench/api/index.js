import { http, SrmUtil } from "srm-mobile-ui";

export function approveApi(params) {
  return http.post(`smpc/v1/${SrmUtil.getTenantId()}/skus/approve`, params);
}
export function rejectApi(params) {
  return http.post(`smpc/v1/${SrmUtil.getTenantId()}/skus/reject`, params);
}

export function approveShelfApi(params) {
  return http.post(`smpc/v1/${SrmUtil.getTenantId()}/skus/approve-and-shelf`, params);
}

// 基础信息接口 待审批
export function getAllProductApi(id, params) {
  return http.get(`smpc/v1/${SrmUtil.getTenantId()}/skus/spu-detail-new/${id}`, { params });
}

// 商品属性
export function getProductAttrApi(id, params) {
  return http.get(`smpc/v1/${SrmUtil.getTenantId()}/skus/query-category-attrs/${id}`, { params });
}

// 定制品
export function getCustomSkuApi(id) {
  return http.get(`smpc/v1/${SrmUtil.getTenantId()}/spu-custom-attr-groups/${id}`);
}