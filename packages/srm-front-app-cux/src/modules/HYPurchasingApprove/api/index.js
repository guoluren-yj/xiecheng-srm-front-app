/**
 * 与 【采购方案审批】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

// eslint-disable-next-line valid-jsdoc
/**
 * 获取采购方案明细
 * @param {*采购方案id} id
 * @returns
 */
export const getSchemeApi = (id) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/hygy-scheme-reviews/${id}`;

  return http.get(url);
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

// 获取流程审批历史
export const getTaskApprovalHistory = (businessKey) => http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/historyApproval`, {}, {
  params: {
    businessKey
  }
});

export const getProcessLovApi = () => http.get(`/hpfm/v1/${SrmUtil.getTenantId()}/lovs/value?lovCode=HWFP.PROCESS_APPROVE_STATUS`);
// 评审澄清
export const fetchApprovedInDoubt = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/hygy-review-questions/sendMessage`;

  return http.post(url, params);
};

// 评审澄清查询
export const fetchApprovedSearch = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/hygy-review-questions/detail`;

  return http.get(url, { params });
};
