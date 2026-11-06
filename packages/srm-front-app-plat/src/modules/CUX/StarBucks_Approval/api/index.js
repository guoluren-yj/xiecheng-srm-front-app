import { http, SrmUtil } from "srm-mobile-ui";

// 判断流程是否已审批
export const checkTaskExistsApi = (taskId) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/check/${taskId}`;

  return http.get(url);
};

// 获取移动端审批地址
export const getMobileFormUrlByInstanceIdApi = (processInstanceId) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/instance/mobileFormUrl/${processInstanceId}`;
  return http.get(url);
};

// 获取移动端审批地址
export const getMobileFormUrlApi = (processDefinitionId, taskDefinitionKey, executionId) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/getMobileFormUrl`;
  return http.get(url, { params: { processDefinitionId, taskDefinitionKey, executionId } });
};
// 获取流程信息
export const getTaskInfoApi = (taskId) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/${taskId}`);

// 流程审批接口
export const taskApproveApi = (taskId, params) => http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/runtime/tasks/${taskId}`, params);

// 流程批量审批接口
export const taskBatchApproveApi = (tasks = []) => http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/runtime/batch-tasks`, tasks);

// 流程批量审批接口
export const getTaskCategory = (type) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/document-list-new`, { params: { type } });

// 获取流程实例信息
export const getProcessInstance = (processInstanceId, type = "involved") => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/instance/${processInstanceId}`, {
  params: {
    type
  }
});

// 获取流程审批历史
export const getTaskApprovalHistory = (businessKey) => http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/historyApproval`, {}, {
  params: {
    businessKey
  }
});

// 获取快捷回复
export const getFastReplay = () => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/fast-reply?type=ALL`);

// 新增快捷回复
export const addFastReplay = (content) => {
  const tenantId = SrmUtil.getTenantId();
  return http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/fast-reply`, {
    tenantId,
    content
  });
};

// 删除快捷回复
export const deleteFastReplay = (commentId) => http.delete(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/fast-reply?commentId=${commentId}`);

// 催办
export const remindProcessApi = (processInstanceId) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/process/started/remind/${processInstanceId}`;
  return http.get(url);
};
// 撤销
export const recallProcessApi = (processInstanceId) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/runtime/prc/revoke/${processInstanceId}`;
  return http.get(url);
};
// 撤回
export const revokeProcessApi = (processInstanceId) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/runtime/prc/back/${processInstanceId}`;
  return http.get(url);
};
// 获取工作流菜单id
export const getTodoMenuId = () => http.get("/iam/hzero/v1/menu", {
  params: {
    tenantId: 0,
    code: "hzero.wp.self.task",
    level: "organization"
  }
});

// 获取工作流菜单id
export const getTodoMenuToken = () => new Promise((resolve, reject) => {
  getTodoMenuId().then((res) => {
    if (res && res.id) {
      window.hMenuId = res.id;
      http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/token`).then((token) => {
        token && (window.sWorkflowToken = token);
        resolve(token);
      }).catch((e) => reject(e));
    } else {
      reject();
    }
  }).catch((e) => reject(e));
});

// 根据编码查id
export const getEmployeeIdApi = (userCode) => {
  let url = `/hpfm/v1/${SrmUtil.getTenantId()}/employees/employee-num`;
  let params = {
    employeeNum: userCode,
  };
  return http.get(url, { params });
};

// 获取员工信息
export const getApplicantUserInfoApi = (userCode) => {
  let url = `/hpfm/v1/${SrmUtil.getTenantId()}/employee-assigns`;
  let params = {
    customizeUnitCode: "SPFM.EMPLOYEE_DETAIL.POSTION_LIST",
    employeeId: userCode,
    tenantId: SrmUtil.getTenantId(),
  };
  return http.get(url, { params });
};

/*
* 获取附件列表
*/
export const getAttachmentFilesApi = (attachmentUUID) => {
  const url = `/hfle/v1/${SrmUtil.getTenantId()}/files/${attachmentUUID}/file`;
  let params = {
    attachmentUUID,
  };

  return http.get(url, { params });
};

/*
* 合同审批通过前,EC&FIN评分校验
*/
export const getApproveStatusApi = (pcHeaderId) => {
  const url = `/spcm/v1/${SrmUtil.getTenantId()}/starbucks-purchase-contract-workflow/get-function-approve-status?pcHeaderId=${pcHeaderId}`;
  return http.get(url);
};

/*
 * 获取全部审批人信息
 */
export const getApproveUserListApi = (srmAccount, instaId) => {
  const params = {
    srmAccount,
    instaId,
  };
  const url = `/smbl/v1/xing-ba-ke/${SrmUtil.getTenantId()}/getChatInfo`;
  return http.get(url, { params });
};

//获取工作流驳回节点信息
export const getJumpList = (taskId) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/getJumpList/${taskId}`);
