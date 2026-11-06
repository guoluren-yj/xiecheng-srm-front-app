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
    customizeUnitCode: "SPRM.PURCHASE_PLAFORM_QUERY.PURCHASEORGINFO,SPRM.PURCHASE_PLAFORM_QUERY.BASE_HEADER,SPRM.PURCHASE_PLAFORM_QUERY.BILLINGINFO%2CSPRM.PURCHASE_PLAFORM_QUERY.DELIVERYINFO,SPRM.PURCHASE_PLAFORM_QUERY.ATTACHMENT"
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

// 保存
export const saveApi = (params) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests?customizeUnitCode=SPRM.PURCHASE_PLAFORM_CREATE.BASE_HEADER%2CSPRM.PURCHASE_PLAFORM_CREATE.PURCHASEORGINFO%2CSPRM.PURCHASE_PLAFORM_CREATE.BILLINGINFO%2CSPRM.PURCHASE_PLAFORM_CREATE.DELIVERYINFO%2CSPRM.PURCHASE_PLAFORM_CREATE.PURCHASELINE%2CSPRM.PURCHASE_PLAFORM_CREATE.ATTACHMENT`;
  return http.put(url, params);
};
