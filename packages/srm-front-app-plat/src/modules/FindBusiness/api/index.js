/**
 * 与 【我发出的订单】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

/*
广域寻源下拉选项
*/
export const getBatchDataApi = () => {
  const params = {
    "areaCodeList": "SPFM.WIDE_AREA_LIST",
    "capitalTypeList": "SMBL.SUPPLIER_REGISTEREDCAPITAL",
  };
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/value/batch`;
  return http.get(url, { params });
};

/*
广域寻源联想搜索
*/
export const getSupplierGoodApi = (params) => {
  // const url = `/spfm/v1/${storage.getItem("organizationId")}/wide-area-sourcing/goods`;
  const url = `/smbl/v1/${storage.getItem("organizationId")}/source/item-suggest`;
  return http.get(url, { params });
};

/*
广域寻源详情
*/
export const getDetailApi = (params) => {
  const url = `/smbl/v1/${storage.getItem("organizationId")}/source/supplier-info`;
  return http.get(url, { params });
};

/*
广域寻源top10
*/
export const getTopListApi = () => {
  const url = `/smbl/v1/${storage.getItem("organizationId")}/source/top-item`;
  return http.get(url);
};

/*
地图信息
*/
export const getSupplierAreaInfoApi = (params) => {
  const url = `/smbl/v1/${storage.getItem("organizationId")}/source/suppliers`;
  return http.post(url, params);
};

/*
获取钉钉用户信息
*/
export const getUserInfoApi = (authCode, corpId) => {
  const params = { appCode: "WIDE_SOURCE_DINGTALK", authCode, corpId };
  const url = "/smbl/v1/dingtalk/thirdApp/getUserInfo";
  return http.get(url, { params });
};
