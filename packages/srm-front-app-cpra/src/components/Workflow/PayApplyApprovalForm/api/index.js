
import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// 获取审批事项列表
const getApprovalItemApi = (id) => {
  const url = `/hwfp/v1/${storage.getItem("organizationId")}/activiti/task/${id}`;

  return http.get(url);
};
//获取审批表单数据
const getApprovalFormApi = (settleHeaderId) => {
  const url = `/ssta/v1/${storage.getItem("organizationId")}/settle-headers?settleHeaderId=${settleHeaderId}&customizeUnitCode=SSTA.PURCHASE_SETTLE_DETAIL.PAYMENT_BASIC,SSTA.PURCHASE_SETTLE_DETAIL.BASIC,SSTA.PURCHASE_SETTLE_DETAIL.TRADINGPARTY,SSTA.PURCHASE_SETTLE_DETAIL.INVOICE_SUMMARY_INFORMATION,SSTA.PURCHASE_SETTLE_DETAIL.INVOICE_BILL_INFO,SSTA.PURCHASE_SETTLE_DETAIL.INVOICE_MATCHING,SSTA.PURCHASE_SETTLE_DETAIL.INVOICE_PRE_PAYMENT_REMOVE,SSTA.PURCHASE_SETTLE_DETAIL.INVOICE_PAYMENT_INFORMATION,SSTA.PURCHASE_SETTLE_DETAIL.INVOICE_OTHER_INFO`;

  return http.get(url);
};
//获取交易明细信息列表
const getTransactionInfoListApi = (settleHeaderId) => {
  const url = `/ssta/v1/${storage.getItem("organizationId")}/settle-lines/${settleHeaderId}?settleHeaderId=${settleHeaderId}&customizeUnitCode=SSTA.PURCHASE_SETTLE_DETAIL.TRANSACTIONDETAIL`;

  return http.get(url);
};
//获取多维付款列表
const getMultiPaymentListApi = (settleHeaderId) => {
  const url = `/ssta/v1/${storage.getItem("organizationId")}/settle-lines/mutil-payment/${settleHeaderId}?settleHeaderId=${settleHeaderId}&paymentDimension=INVOICE`;

  return http.get(url);
};
//获取预付款核销信息
const getPrePaymentListApi = (settleHeaderId) => {
  const url = `/ssta/v1/${storage.getItem("organizationId")}/settle-apply-lines/${settleHeaderId}?customizeUnitCode=SSTA.PURCHASE_SETTLE_DETAIL.PAYMENT.PEYPAYMENT.BOX`;

  return http.get(url);
};
//获取交易明细的单条预付款核销信息
const getTransactionDetailListApi = (settleHeaderId, settleLineId) => {
  const url = `/ssta/v1/${storage.getItem("organizationId")}/settle-apply-lines/${settleHeaderId}/${settleLineId}?customizeUnitCode=SSTA.PURCHASE_SETTLE_DETAIL.PAYMENT.PEYPAYMENT.BOX`;

  return http.get(url);
};
//获取预付款核销校验等级
const getPrePaymentCheckLevelApi = () => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data?lovCode=SSTA.PREPAYMENT_CHECK_LEVEL`;

  return http.get(url);
};
//获取预付款核销校验节点
const getPrePaymentCheckPointApi = () => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data?lovCode=SSTA.PREPAYMENT_CHECK_PIONT`;

  return http.get(url);
};

export {
  getApprovalItemApi,
  getApprovalFormApi,
  getTransactionInfoListApi,
  getMultiPaymentListApi,
  getPrePaymentListApi,
  getTransactionDetailListApi,
  getPrePaymentCheckLevelApi,
  getPrePaymentCheckPointApi
};
