/**
 * 价格库自定义配置接口
 */

import { http } from "srm-mobile-ui";
import { encryptMd5 } from "@/utils/utils";

const storage = window.localStorage;

// 获取所有价格库信息
export const getAllPriceLibTmplDimsApi = (params) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-templates/list`;
  return http.get(url, { params: {
    ...params,
    newFlag: 1,
  } });
};

// 获取价格库字段配置
export const getPriceLibTmplDimsHeaderApi = (params) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-tmpl-dims/tableHeaderList`;
  return http.post(url, params);
};

// 获取全量视图数据
export const getPriceLibMainsApi = (params) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-mains`;
  return http.get(url, { params: {
    ...params,
    sign: encryptMd5({ templateCode: params?.templateCode }),
  } });
};

// 保存
export const saveApi = (params) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-mains`;
  return http.post(url, params);
};

// 删除
export const deleteApi = (params) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-mains`;
  return http.delete(url, params);
};

// 发布
export const issueApi = (params) => {
  const customizeUnitCode = "SSRC.PRICE_LIB_NEW.REQ_EDIT";
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-mains?customizeUnitCode=${customizeUnitCode}`;
  return http.put(url, params);
};

// 删除阶梯报价行
export const deleteLadderApi = (params) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-ladders`;
  return http.delete(url, params);
};

// 保存阶梯报价
export const saveLadderApi = (params) => {
  const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-ladders`;
  return http.post(url, params);
};

// // 获取视图数据
// export const getPriceLibViewsApi = (params) => {
//   // params = {
//   //   from: "VIEW_LIST",
//   //   templateCode: "TEST0111",
//   //   viewCode: "ALL_VIEW",
//   //   page: 0,
//   //   size: 10000,
//   // };
//   const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-views`;
//   return http.get(url, { params });
// };

// // 获取价格库视图类型
// export const getPriceLibViewConfsApi = (params) => {
//   // params = {
//   //   templateCode:"templateCode",
//   //   userId:"userId"
//   // };
//   const url = `/spc/v1/${storage.getItem("organizationId")}/price-lib-view-confs/viewSwitch`;
//   return http.get(url, { params });
// };