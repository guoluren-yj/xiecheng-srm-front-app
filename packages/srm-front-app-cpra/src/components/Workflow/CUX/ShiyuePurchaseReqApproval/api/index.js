import { http, SrmUtil } from "srm-mobile-ui";

// 已提交-审批通过
export const submitApprovalApi = (items) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/approve/approval`;
  return http.post(url, items);
};

// 已提交-审批拒绝
export const submitRejectApi = (items) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/approve/reject`;
  return http.post(url, items);
};

// 取消中-审批通过
export const cancelApprovalApi = (items) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/cancel/approve`;
  return http.post(url, items);
};

// 取消中-审批拒绝
export const cancelRejectApi = (items) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/cancel/reject`;
  return http.post(url, items);
};

// 获取详情信息
export const getPrDetailApi = (prHeaderId) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-request/${prHeaderId}`;
  let params = {
    customizeUnitCode:
      "SPRM.PURCHASE_PLAFORM_QUERY.PURCHASEORGINFO,SPRM.PURCHASE_PLAFORM_QUERY.BASE_HEADER,SPRM.PURCHASE_PLAFORM_QUERY.BILLINGINFO,SPRM.PURCHASE_PLAFORM_QUERY.DELIVERYINFO,SPRM.PURCHASE_PLAFORM_QUERY.ATTACHMENT,SPRM.PURCHASE_PLAFORM_QUERY.ATTACH_EX",
    workFlowFlag:1,
  };
  return http.get(url, { params });
};

// 根据编码获取权限集
export const getPermissionsApi = (codes) => {
  let url = "/iam/hzero/v1/menus/check-permissions";
  return http.post(url, codes);
};

// 获取操作记录
export const getActionsRecordApi = (prHeaderId) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/${prHeaderId}/actions/all`;
  return http.get(url);
};

// 获取审批记录
export const getApproveRecordApi = (prHeaderId) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/pr-approval-history/record?prHeaderId=${prHeaderId}`;
  return http.get(url);
};

// 获取业务规则信息-双单位配置
export const getUomControlApi = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/items/secondary/uom/getcnf`;
  return http.get(url, { params });
};
