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

export const getMobileFormUrlByTaskId = (taskId) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/getMobileFormUrlByTaskId`;
  return http.get(url, { params: { taskId } });
};

// 获取流程信息
export const getTaskInfoApi = (taskId, params) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/${taskId}`, { params });

// 审批流程上锁
export const acquireTaskFormLockApi = (processInstanceId) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/form-lock/acquire/${processInstanceId}`;
  return http.post(url);
};

// 审批流程解锁
export const releaseTaskFormLockApi = (processInstanceId, formLock) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/form-lock/release/${processInstanceId}?formLock=${formLock}`;
  return http.post(url);
};

// 流程审批接口
export const taskApproveApi = (taskId, params) => http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/runtime/tasks/${taskId}`, params);

// 流程批量审批接口
export const taskBatchApproveApi = (tasks = []) => http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/runtime/batch-tasks`, tasks);

// 流程批量审批接口
export const getTaskCategory = (type) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/document-list-new`, { params: { type } });

// 获取流程实例信息
export const getProcessInstance = (processInstanceId, type = "involved", params) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/instance/${processInstanceId}`, {
  params: {
    type,
    ...params || {},
  }
});

// 获取流程审批历史
export const getTaskApprovalHistory = (businessKey, currentProcessInstanceId, params) => http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/historyApproval`, {}, {
  params: {
    businessKey,
    currentProcessInstanceId,
    filterAuto: true,
    ...params || {},
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
export const revokeProcessApi = (processInstanceId) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/runtime/prc/revoke/${processInstanceId}`;
  return http.get(url);
};
// 撤回
export const recallProcessApi = (processInstanceId) => {
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

//获取工作流驳回节点信息
export const getJumpList = (taskId, { params }) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/getJumpList/${taskId}`, { params });

/**
 * 获取附件信息
 * @param attachmentUuid
 * @return {any}
 */
export const getFileApi = (attachmentUuid) => {
  const url = `hfle/v1/${SrmUtil.getTenantId()}/files/${attachmentUuid}/file?attachmentUUID=${attachmentUuid}&bucketName=private-bucket`;
  return http.get(url);
};

/**
 *  获取预测审批流程数据
 */
export const getForecastInstancesApi = (processInstanceId, processDefinitionId) => {
  const url = `hwfp/v1/${SrmUtil.getTenantId()}/instance/forecast/${processInstanceId}?processDefinitionId=${processDefinitionId}`;
  return http.get(url);
};

/**
 * 获取按钮提示
 */
export const getApprovalButtonTipsApi = () => {
  const url = `hwfp/v1/${SrmUtil.getTenantId()}/notification/approval-action-tooltip`;
  return http.get(url);
};

export const getApprovalGlobalConfig = () => {
  const url = `hwfp/v1/${SrmUtil.getTenantId()}/notification`;
  return http.post(url);
};

/**
 * 传阅
 */
export const postCarbonCopyUserApi = (params) => {
  const url = `hwfp/v1/${SrmUtil.getTenantId()}/process/instance/new-carbon-copy`;
  return http.post(url, {
    ...params,
  });
};

// 查询评论
export const postReplyRecords = (params) => {
  const url = `hwfp/v1/${SrmUtil.getTenantId()}/process-comment-records/proc-list`;
  return http.post(url, {
    ...params,
  });
};

// 回复评论
export const postReplyComment = (params) => {
  const url = `hwfp/v1/${SrmUtil.getTenantId()}/process-comment-records/reply-comment`;
  return http.post(url, {
    ...params,
  });
};

// 添加评论
export const postStartComment = (params) => {
  const url = `hwfp/v1/${SrmUtil.getTenantId()}/process-comment-records/start-comment`;
  return http.post(url, {
    ...params,
  });
};

// 批量查询附件数量
export const postFileCountBatch = (body) => {
  const url = `hfle/v1/${SrmUtil.getTenantId()}/files/count-batch`;
  return http.post(url, body);
};

// 查询默认提醒审批人配置
export const fetchSettingAndSetRemindApprover = () => {
  const url = `hwfp/v1/${SrmUtil.getTenantId()}/process-comment-records/get-default-remind`;
  return http.get(url);
};

// 点击按钮获取当前配置的提醒人数据
export const getRemindEmployee = (commentRemindMode, procInstId) => http.post(`hwfp/v1/${SrmUtil.getTenantId()}/process-comment-records/quick-get-remind-employees`, {
  commentRemindMode,
  procInstId,
});