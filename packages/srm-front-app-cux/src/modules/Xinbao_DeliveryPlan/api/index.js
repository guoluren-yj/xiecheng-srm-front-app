/**
 * 与 【APS送货计划】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// const bucketName = "private-bucket";


//通过库存组织和送货日期获取采购单号列表
const getPurchaseNumListApi = (params) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/xb-asn-plane-headers/queryXbAppAsnPlanInfo`;

  return http.get(url, { params });
};
//通过送货单号获取物料详情列表
const getMaterialDetailListApi = (poLineId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/xb-asn-plane-headers/queryXbAppPoInfo/${poLineId}`;

  return http.get(url);
};
//通过条码号和箱号获取装箱数量
const getPackingQuantityApi = (barCodeNumber,boxNumber) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/order-bar-code-detaileds/getPackingQuantity/${barCodeNumber}/${boxNumber}`;

  return http.get(url);
};
//生成送货单
const createDeliveryApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/create-by-po-new`;

  return http.post(url, params);
};

export {
  getPurchaseNumListApi,
  getMaterialDetailListApi,
  getPackingQuantityApi,
  createDeliveryApi
};