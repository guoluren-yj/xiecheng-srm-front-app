/**
 * 与 【APS送货签到】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// const bucketName = "private-bucket";


//获取维护送货单列表
const getMaintainDeliveryListApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/for-supplier/maintain`;

  return http.get(url, { params });
};
//通过送货单号获取物料行信息
const getMaterialLineInfoApi = (asnHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/lines`;

  return http.get(url);
};
//送货单提交
const deliverySubmitApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/submit`;

  return http.post(url,params);
};

export {
  getMaintainDeliveryListApi,
  getMaterialLineInfoApi,
  deliverySubmitApi
};