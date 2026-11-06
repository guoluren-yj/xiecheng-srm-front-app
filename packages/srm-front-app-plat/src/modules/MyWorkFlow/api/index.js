
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取我的工作流列表
export const getWorkFlowListApi = (params, name) => {
  const url = `/hwfp/v1/${storage.getItem("organizationId")}/process/instance/query/page?${name}=true&mobFilterHideRecord=true`;
  return http.post(url, params);
};
// 获取流程状态
export const getWorkFlowStatusApi = () =>
  // return http.get(`/hpfm/v1/lovs/value?lovCode=HWFL.PROCESS_STATUS`)
  http.get("/hpfm/v1/lovs/value?lovCode=HWFP.PROCESS_APPROVE_STATUS")
;
// 获取单据类型
export const getmobileFormUrlApi = (processInstanceId) => {
  const url = `/hwfp/v1/${storage.getItem("organizationId")}/instance/mobileFormUrl/${processInstanceId}`;
  return http.get(url);
};
// export const  getmobileFormUrlApi = (params) => {
//   return http.get(`/hwfp/v1/${storage.getItem('organizationId')}/activiti/task/getMobileFormUrl`,{params})
// }

// 获取操作记录
export const getOperationRecordsApi = ({ asnHeaderId, page = 0, size = 10 }) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/action?page=${page}&size=${size}`);

// 审批操作接口
export const getOperatorTypeApi = (taskId, flag, type) => {
  const params = {
    type: type,
  };
  if (flag) {
    return http.get(`/hwfp/v1/${storage.getItem("organizationId")}/instance/${taskId}`, { params });
  }
  return http.get(`/hwfp/v1/${storage.getItem("organizationId")}/instance/carbonCopy/${taskId}`, { params });

};

// 催办
export const getReceiptRemindApi = (procId) => {
  const url = `/hwfp/v1/${storage.getItem("organizationId")}/process/started/remind/${procId}`;
  return http.get(url);
};
// 撤销
export const getReceiptRevokeApi = (procId) => {
  const url = `/hwfp/v1/${storage.getItem("organizationId")}/runtime/prc/revoke/${procId}`;
  return http.get(url);
};
// 撤回
export const getReceiptRecallApi = (procId) => {
  const url = `/hwfp/v1/${storage.getItem("organizationId")}/runtime/prc/back/${procId}`;
  return http.get(url);
};

