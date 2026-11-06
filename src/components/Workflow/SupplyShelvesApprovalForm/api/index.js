import { http, SrmUtil } from "srm-mobile-ui";

// 获取商品上下架头信息
export const getProductShelvesHeadInfoApi = (headerId) => http.get(`/smpc/v1/${SrmUtil.getTenantId()}/sku-shelve-apply-headers/${headerId}`);

// 获取商品详情接口
export function getAllProductApi(id, params) {
  return http.get(`smpc/v1/${SrmUtil.getTenantId()}/skus/spu-detail/${id}`, { params });
}

// 商品属性
export function getProductAttrApi(id, params) {
  return http.get(`smpc/v1/${SrmUtil.getTenantId()}/skus/query-category-attrs/${id}`, { params });
}

// 定制品
export function getCustomSkuApi(id) {
  return http.get(`smpc/v1/${SrmUtil.getTenantId()}/spu-custom-attr-groups/${id}`);
}

