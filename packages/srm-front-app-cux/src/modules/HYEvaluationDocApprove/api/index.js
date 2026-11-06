/**
 * 与 【考评档案审批】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

export const getDetailApi = (id) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/hygy-perform-evaluations/${id}`;
  return http.get(url);
};
// 审批操作接口
export const getOperatorTypeApi = (taskId) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/${taskId}`);

// 审批通过
const adoptApi = (params) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/runtime/batch-tasks`;

  return http.post(url, params);
};

// 审批拒绝
const rejectApi = (params) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/runtime/batch-tasks`;

  return http.post(url, params);
};

// 获取流程审批历史
export const getTaskApprovalHistory = (businessKey) => http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/historyApproval`, {}, {
  params: {
    businessKey
  }
});

export {
  adoptApi,
  rejectApi,
};
