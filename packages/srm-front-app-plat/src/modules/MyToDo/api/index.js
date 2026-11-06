
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取我的待办列表
export const getTodoListApi = (params) => {
  const url = `/hwfp/v1/${storage.getItem("organizationId")}/activiti/task/query/page?mobFilterHideRecord=true`;
  return http.post(url, params);
};
// 获取审批类型
export const getmobileFormUrlApi = (params) => http.get(`/hwfp/v1/${storage.getItem("organizationId")}/activiti/task/getMobileFormUrl`, { params });
// 审批操作接口
export const getOperatorTypeApi = (taskId) => http.get(`/hwfp/v1/${storage.getItem("organizationId")}/activiti/task/${taskId}`);

// 操作接口
export const getOperatorApi = (taskId, params) => http.get(`/hwfp/v1/${storage.getItem("organizationId")}/runtime/tasks/${taskId}`, params);

