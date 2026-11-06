import { http, SrmUtil } from "srm-mobile-ui";

// 查询物料反馈申请头信息
export const fechAuthReq = (itemAuthFeeHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-fee-headers/${itemAuthFeeHeaderId}?workflowFlag=1`;
  return http.get(url);
};

// 获取操作记录
export const getActionsRecordApi = (itemAuthFeeHeaderId, params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-fee-actions/${itemAuthFeeHeaderId}`;
  return http.get(url, { params });
};

// 获取审批记录
export const getApproveRecordApi = (itemAuthFeeHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/list-history-approval?itemAuthFeeHeaderId=${itemAuthFeeHeaderId}`;
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
export const queryRoleAuthority = (itemAuthFeeHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-fee-headers/get-role-authority/${itemAuthFeeHeaderId}`;
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
export const fetchItemReqAllStatus = (itemAuthFeeHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/list-req-status?itemAuthFeeHeaderId=${itemAuthFeeHeaderId}`;
  return http.get(url);
};

// 物料认证申请单打印
export const itemReqPrint = (itemAuthFeeHeaderId) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/header-and-line-detail/print/${itemAuthFeeHeaderId}`;
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

/**
 * 保存物料认证申请单
 * @async
 * @function saveItemAuth
 * @returns fetch Promise
 */
// export async function saveItemFeedback(params) {
//   const { query, body } = params;
//   return request(`${SRM_MDM}/v1/${tenantId}/item-auth-fee-headers/save`, {
//     method: 'PUT',
//     body,
//     query,
//   });
// }

// /**
//  * 提交物料认证申请单
//  * @async
//  * @function submitItemAuth
//  * @returns fetch Promise
//  */
// export async function submitItemFeedback(params) {
//   const { query, body } = params;
//   return request(`${SRM_MDM}/v1/${tenantId}/item-auth-fee-headers/submit`, {
//     method: 'PUT',
//     body,
//     query,
//   });
// }

/**
 * 查询当前角色下，物料认证申请反馈单头所有阶段操作、查询权限
 * @async
 * @function queryRoleAuthority
 * @returns fetch Promise
 */
// export async function queryRoleAuthority(itemAuthFeeHeaderId) {
//   return request(
//     `${SRM_MDM}/v1/${tenantId}/item-auth-fee-headers/get-role-authority/${itemAuthFeeHeaderId}`,
//     {
//       method: 'GET',
//     }
//   );
// }

// /**
//  * 查询操作记录
//  * @param {单条数据DTO} Object
//  */
// export async function fetchActionHistory(itemAuthFeeHeaderId) {
//   return request(`${SRM_MDM}/v1/${tenantId}/item-auth-fee-actions/${itemAuthFeeHeaderId}`, {
//     method: 'GET',
//   });
// }

// /**
//  * 查询审批记录
//  * @param {单条数据DTO} Object
//  */
// export async function fetchApproveHistory(itemAuthFeeHeaderId) {
//   return request(`${SRM_MDM}/v1/${tenantId}/item-auth-fee-headers/list-history-approval`, {
//     method: 'GET',
//     query: { itemAuthFeeHeaderId },
//   });
// }

// /**
//  * 获取整单数量
//  * @param {单条数据DTO} Object
//  */
// export async function fetchCount() {
//   return request(`${SRM_MDM}/v1/${tenantId}/item-auth-fee-headers/list-count`, {
//     method: 'GET',
//     query: { onlyCountLimit: 100 },
//   });
// }

// /**
//  * 提交物料认证申请单
//  * @async
//  * @function submitItemAuth
//  * @returns fetch Promise
//  */
// export async function rejectItemFeedback(params) {
//   const { query, body } = params;
//   return request(`${SRM_MDM}/v1/${tenantId}/item-auth-fee-headers/feedback-rejected`, {
//     method: 'PUT',
//     body,
//     query,
//   });
// }
