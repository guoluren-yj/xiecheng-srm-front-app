/**
 * 与 【订单发布审批】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

const storage = window.localStorage;
// const bucketName = "private-bucket";

// eslint-disable-next-line valid-jsdoc
/**
 * 获取订单发布明细
 * @param {*id} id
 * @returns
 */
export const getOrderPublishDetailApi = (poNum) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/hygy-order-release/listTaskPage?poNum=${poNum}`;

  return http.get(url);
};
/*
订单明细行查询
*/
export const getOrderLineApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-line/${poHeaderId}/detail`;
  return http.get(url, { params });
};
/*
操作记录查询
*/
export const getOperationRecordApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-process-actions/${poHeaderId}?tenantId=${storage.getItem("tenantId")}`;
  return http.get(url, { params });
};
// 审批操作接口
export const getOperatorTypeApi = (taskId) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/${taskId}`);

// 审批通过
export const adoptApi = (params) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/runtime/batch-tasks`;

  return http.post(url, params);
};

// 审批拒绝
export const rejectApi = (params) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/runtime/batch-tasks`;

  return http.post(url, params);
};
