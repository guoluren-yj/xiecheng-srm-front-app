/**
 * 与 【轻松筹采购申请】相关的业务接口
 */
import { http, SrmUtil } from "srm-mobile-ui";

//获取采购申请明细
const getEasyPreparePurchasingDetailApi = (reqHeaderId) => {
  const url = `scux/v1/${SrmUtil.getTenantId()}/qschou-req-headers/mobile/detail/${reqHeaderId}`;

  return http.get(url);
};
//非商城采购申请创建-移动端
const createPurchasingBillApi = (params) => {
  const url = `scux/v1/${SrmUtil.getTenantId()}/qschou-req-headers/req-creation`;

  return http.post(url, params);
};
//非商城采购申请删除单据头行-移动端
const deletePurchasingBillApi = (reqHeaderId) => {
  const url = `scux/v1/${SrmUtil.getTenantId()}/qschou-req-headers/delete/header/${reqHeaderId}`;

  return http.delete(url);
};
//非商城采购申请提交-移动端
const sumbitPurchasingBillApi = (params) => {
  const url = `scux/v1/${SrmUtil.getTenantId()}/qschou-req-headers/submit`;

  return http.post(url, params);
};
//非商城采购申请删除单据行-移动端
const deleteLinePurchasingBillApi = (params) => {
  const url = `scux/v1/${SrmUtil.getTenantId()}/qschou-req-lines/delete/line`;

  return http.delete(url, params);
};
//非商城采购申请核销-移动端
const vertificatePurchasingBillApi = (params) => {
  const url = `scux/v1/${SrmUtil.getTenantId()}/qschou-req-headers/write-off`;

  return http.post(url, params);
};
//非商城采购申请单据取消-移动端
const cancelVertificatePurchasingBillApi = (params) => {
  const url = `scux/v1/${SrmUtil.getTenantId()}/qschou-req-headers/cancel`;

  return http.post(url, params);
};
//获取非商城采购申请单据收货信息-移动端
const getApplyBillReceiveInfoApi = () => {
  const url = `scux/v1/${SrmUtil.getTenantId()}/lovs/sql/data?lovCode=SCUX.QSCHOU.CUSTOMER_ADDRESS&tenantId=${SrmUtil.getTenantId()}&ownedBy=${SrmUtil.getUserInfo().id}`;

  return http.get(url);
};
export {
  getApplyBillReceiveInfoApi,
  getEasyPreparePurchasingDetailApi,
  createPurchasingBillApi,
  deletePurchasingBillApi,
  sumbitPurchasingBillApi,
  deleteLinePurchasingBillApi,
  vertificatePurchasingBillApi,
  cancelVertificatePurchasingBillApi
};
