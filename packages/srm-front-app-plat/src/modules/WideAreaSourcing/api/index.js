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
    "bestSellingGoods": "SPFM.BEST_SELLING_GOODS.LIST",
    "capitalTypeList": "SPFM.REGISTERED_CAPITAL",
  };
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/value/batch`;
  return http.get(url, { params });
};

/*
广域寻源联想搜索
*/
export const getSupplierGoodApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/wide-area-sourcing/goods`;
  return http.get(url, { params });
};

/*
广域寻源风控指数
*/
export const getRiskApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/wide-area-sourcing/risk`;
  return http.get(url, { params });
};

/*
广域寻源经营指数
*/
export const getManageApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/wide-area-sourcing/manage`;
  return http.get(url, { params });
};

/*
广域寻源详情
*/
export const getDetailApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/wide-area-sourcing/detail`;
  return http.get(url, { params });
};