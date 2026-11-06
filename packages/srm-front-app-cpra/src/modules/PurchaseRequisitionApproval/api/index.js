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
      "SPRM.PURCHASE_PLAFORM_QUERY.PURCHASEORGINFO,SPRM.PURCHASE_PLAFORM_QUERY.BASE_HEADER,SPRM.PURCHASE_PLAFORM_QUERY.BILLINGINFO%2CSPRM.PURCHASE_PLAFORM_QUERY.DELIVERYINFO,SPRM.PURCHASE_PLAFORM_QUERY.ATTACHMENT",
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

// 表单保存数据
export const getApproveRecordSave = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/iae4h08V9DQmatk3smYtoibrAQyFeTFPhBJOgTD8wetD0ibkO3dGWJRlE095K90xxTs`;
  return http.post(url, params);
};

// 获取AI审核结果
export const fetchAiCheckService = (params) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/ai-check/query-result`;
  return http.get(url, {params});
};

// 查询采购方式
export const getProcurementMethod = () => {
  const url = `/hpfm/v1/lovs/data?lovCode=HLCX_PUR_TYPE_NEW&tenantId=${SrmUtil.getTenantId()}&page=0&size=50`;
  return http.get(url);
};

export const saveSubmitApproval = (params, ) => {
  const url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/update-workflow?customizeUnitCode=${params.customizeUnitCode}`;
  return http.put(url, params);
};
