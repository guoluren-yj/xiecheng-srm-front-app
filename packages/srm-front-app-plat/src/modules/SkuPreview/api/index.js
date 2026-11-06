import { http, SrmUtil } from "srm-mobile-ui";

// 审批详情
export function fetchSkuInfo(skuId, params) {
  return http.get(`smpc/v1/${SrmUtil.getTenantId()}/skus/sku-preview/${skuId}`, { params });
}

// 获取销售规格商品
export function fetchSkus(params) {
  return http.get(`smpc/v1/${SrmUtil.getTenantId()}/skus/get-similar-sku`, { params });
}
