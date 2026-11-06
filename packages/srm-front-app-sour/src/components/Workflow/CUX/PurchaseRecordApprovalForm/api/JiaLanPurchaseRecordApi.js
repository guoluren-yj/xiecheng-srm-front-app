
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 请求价格记录审批基本信息
export const getPurchaseBaseInfoApi = (priceInfoId) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/cux/jala/price-infos/${priceInfoId}`;

  let params = { priceInfoId, page: 0, size: 10 };

  return http.get(url, { params });
};

// 获取价格记录的物料信息
export const getPriceRecordMaterialInfo = (priceInfoId) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/cux/jala/price-items`;

  let params = {
    page: 0,
    size: 10,
    priceInfoId,
  };

  return http.get(url, { params });
};

// 获取价格记录审批其他信息
export const getPriceRecordOtherInfo = (priceInfoId) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/cux/jala/price-infos/${ priceInfoId }`;

  let params = {
    priceInfoId,
  };

  return http.get(url, { params });
};

// 获取阶梯价
export const getPriceLads = (priceItemId) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/cux/jala/price-lads`;

  let params = {
    priceItemId,
  };

  return http.get(url, { params });
};
