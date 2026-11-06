import { http, SrmUtil } from "srm-mobile-ui";

// 查询物料认证申请单头信息
export const fechAuthReq = (itemAuthReqHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/${itemAuthReqHeaderId}?workflowFlag=1`;
  return http.get(url);
};

// 获取操作记录
export const getActionsRecordApi = (itemAuthReqHeaderId, params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-actions/${itemAuthReqHeaderId}`;
  return http.get(url, { params });
};

// 获取审批记录
export const getApproveRecordApi = (itemAuthReqHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/list-history-approval?itemAuthReqHeaderId=${itemAuthReqHeaderId}`;
  return http.get(url);
};

// 并单组装成物料认证申请单
export const mergeItemAuthReq = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-await-auths/merge-create/item-auth-req`;
  return http.post(url, params);
};

// 创建物料认证申请单
export const createItemAuthReq = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/create`;
  return http.post(url, params);
};

// 确认物料认证申请单
export const confirmItemAuth = (customizeUnitCode, params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/confirm?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

// 查询当前角色下，物料认证申请单头所有阶段操作、查询权限
export const queryRoleAuthority = (itemAuthReqHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/get-role-authority/${itemAuthReqHeaderId}`;
  return http.get(url);
};

// 保存物料认证申请单
export const saveItemAuth = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/save`;
  return http.put(url, params);
};

//删除物料认证申请单
export const deleteItemAuth = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers`;
  return http.delete(url, params);
};

// 提交物料认证申请单
export const submitItemAuth = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/submit`;
  return http.put(url, params);
};

// 取消物料认证申请单
export const cancelItemAuth = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/cancel`;
  return http.put(url, params);
};

// 跳过当前节点物料认证申请单
export const skipItemAuth = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/skip`;
  return http.put(url, params);
};

// 终止物料认证申请单
export const endItemAuth = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/early-termination`;
  return http.put(url, params);
};

// 获取物料认证申请单当前节点所有状态
export const fetchItemReqAllStatus = (itemAuthReqHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/list-req-status?itemAuthReqHeaderId=${itemAuthReqHeaderId}`;
  return http.get(url);
};

// 物料认证申请单打印
export const itemReqPrint = (itemAuthReqHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/header-and-line-detail/print/${itemAuthReqHeaderId}`;
  return http.get(url);
};

// 物料认证申请单预审批
export const preAction = (query, params) => {
  const { result, approvedRemark } = query;
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/single-preapproval?result=${result}&approvedRemark=${approvedRemark}`;
  return http.put(url, params);
};

// 物料认证申请单预审批
export const preActionBatch = (query, params) => {
  const { result, approvedRemark } = query;
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/batch-preapproval?result=${result}&approvedRemark=${approvedRemark}`;
  return http.put(url, params);
};

// 获取页面个性化模版详情
export const getCuszTemplate = (params) => {
  let url = "/smdm/v1/customize/template-cusz";
  return http.post(url, params);
};
