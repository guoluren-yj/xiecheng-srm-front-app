/**
 * 与 【我发出的订单】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

/* 商品详情 */
export const fetchSkuDetail = (params) => {
  const url = `/smpc/v1/${SrmUtil.getTenantId()}/skus/spu-detail/${params.spuId}`;
  return http.get(url, { supFlag: 0, ...params });
};

// 上传图片
export const upload = (files) => {
  const url = `/smpc/v1/${SrmUtil.getTenantId()}/sku-image-imports/batch-upload`;
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file, file.name);
  });
  return http.post(url, formData, {});
};

// 保存维护的图片
export const fetchSaveImages = (params) => {
  const url = `/smpc/v1/${SrmUtil.getTenantId()}/receive-skus/save-receive-image`;
  return http.post(url, params, {});
};

/* 根据二维码结果查询物料编码 */
export const fetchItemCodeWithCodeBar = (barcode) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/Nzia3bFHW0TgjSibQW7DPKbiafp5652TJnq4AySE17rX9o?barcode=${barcode}`;
  return http.get(url, {});
};
