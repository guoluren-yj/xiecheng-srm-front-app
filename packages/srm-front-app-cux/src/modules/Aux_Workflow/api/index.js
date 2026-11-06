import auxHttp from "../request";
import { http, SrmUtil } from "srm-mobile-ui";

const storage = window.localStorage;

// 生产域名 http://dmsapi.auxgroup.com/
// 测试域名 http://dmsapitest.auxgroup.com/

/*
* 获取单据详情
* */
export const getDetailApi = (processId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/aux-group/detail?processId=${processId}`;

  return http.get(url);
};

/*
* 获取审批记录
* */
export const getHistoryRecordApi = (handler, processId) => {
  const url = `/api/workflow/process/audit-list?handler=${handler}&process_id=${processId}`;

  return auxHttp.get(url);
};

/*
* 流程是否可以被审批人审批
* */
export const isCanApproveApi = (handler, processId) => {
  const url = `/api/workflow/process/can-approve?handler=${handler}&process_id=${processId}`;

  return auxHttp.get(url);
};

/*
* 获取流程任务信息
* */
export const getTaskInfoApi = (handler, processId) => {
  const url = `/api/workflow/process/task-info?handler=${handler}&process_id=${processId}`;

  return auxHttp.get(url);
};

/*
* 获取流程退回节点
* */
export const getBckNodeApi = (params) => {
  const url = "/api/workflow/process/operation-parameter";

  return auxHttp.post(url, params);
};

/*
* 获得流程操作数据
* */
export const getOperationsApi = (handler, processId) => {
  const url = `/api/workflow/process/operations?handler=${handler}&process_id=${processId}`;

  return auxHttp.get(url);
};

/*
* 审批并提交流程
* */
export const submitApproveApi = (pamams) => {
  const url = "/api/workflow/process/approve";

  return auxHttp.post(url, pamams);
};

/*
* 通过用户id查询员工id
* */
export const getEmployIdByuserIdApi = (userId) => {
  const url = `/iam/hzero/v1/${storage.getItem("organizationId")}/users/${userId}/user-employee-assigns`;

  return http.get(url);
};

/*
* 通过员工id查询部门名称
* */
export const getUnitNameByEmployeeIdApi = (employeeNum) => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/sql/data?lovCode=SCUX.SSRC.AUX_EMPLOYEE&tenantId=${SrmUtil.getTenantId()}&&employeeNum=${employeeNum}`;

  return http.get(url);
};

/*
* 通过员工名字查询人员列表
* */
export const getEmployeeListByUnitNameApi = (params) => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/sql/data?lovCode=SCUX.SSRC.AUX_EMPLOYEE&tenantId=${SrmUtil.getTenantId()}`;

  return http.get(url, { params });
};

/*
* 获取外部token
* */
export const getToken = () => {
  const url = `/marmot/v1/${storage.getItem("organizationId")}/marmot-api/JRTOl4muXJSCbrQe2wX2nvDD1qf5U6icy3sictCfhESrs`;

  return http.post(url);
};
// 查询用户详情
export const getUserConfig = () => {
  const url = "/iam/hzero/v1/users/self/detail";

  return http.get(url);
};

// 查询用户详情
export const fecthDiscard = (params) => {
  const url = `/marmot/v1/${storage.getItem("organizationId")}/marmot-api/UF6ISy40MWZ4NMxMMaQYwiaHjXXWJtOes2zzTMAWrYnQ`;

  return http.post(url, params);
};


