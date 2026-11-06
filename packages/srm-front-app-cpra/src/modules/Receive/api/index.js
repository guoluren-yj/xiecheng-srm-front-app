/**
 * 与 【订单审批】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取送货单列表
export const getAsnListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/rcv-trx-header/permit-receive-asn-line`;
  return http.get(url, { params });
};
// 获取送货单类型
export const getAsnTypeApi = () => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/value?lovCode=SINV.ASN_TYPE`;
  return http.get(url);
};
// 获取送货单详情
export const getListDetailApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/rcv-trx-header/prepare-trx-data?customizeUnitCode=SINV.PURCHASE_RECEPTION_REVIEW.GRID&page=0&size=10&lineIds=${params.lineIds}&receiveOrderType=${params.receiveOrderType}`;
  return http.get(url);
};
// 接收过账
export const receiveApi = (params, receiveOrderType) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/rcv-trx-header/create-rcv-trx-header-line?receiveOrderType=${receiveOrderType}`;
  return http.post(url, params);
};
