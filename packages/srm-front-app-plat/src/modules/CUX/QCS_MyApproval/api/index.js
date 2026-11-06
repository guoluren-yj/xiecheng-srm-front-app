/**
 * 与 【我的审批】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

// 获取我的审批列表
export const getApprovalListApi = (params) => {
  const url = `/sprm/v1/${SrmUtil.getTenantId()}/watsons-pr/activiti/task/query/page`;

  return http.post(url, params);
};

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

// 送货单头查询
export const getOrderHeaderApi = (id) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/${id}`;

  return http.get(url);
};

// 送货单审批明细头查询
export const getOrderHeaderInfoApi = (prHeaderId) => {
  const url = `/sprm/v1/${SrmUtil.getTenantId()}/watsons-lot-pr/${prHeaderId}?page=0&size=10&customizeUnitCode=SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.HEADER`;

  return http.get(url);
};

// 送货单审批明细行查询
export const getOrderLineApi = (prHeaderId) => {
  const url = `/sprm/v1/${SrmUtil.getTenantId()}/watsons-lot-pr/${prHeaderId}/lines?page=0&size=10&customizeUnitCode=SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.SRM_LINE`;

  return http.get(url);
};

// 详情页审批通过
export const detailAdoptApi = (id, params) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/runtime/tasks/${id}`;

  return http.post(url, params);
};

// 获取审批类型
export const getmobileFormUrlApi = (params) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/getMobileFormUrl`, { params });

// 审批操作接口
export const getOperatorTypeApi = (taskId) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/${taskId}`);

// 审批历史接口
export const getOperatorRecordApi = (prHeaderId) => http.get(`/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/prHeader/list-history-approval?prHeaderId=${prHeaderId}`);
