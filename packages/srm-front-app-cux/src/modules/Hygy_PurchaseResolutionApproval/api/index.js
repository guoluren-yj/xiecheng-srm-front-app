import { http, SrmUtil } from "srm-mobile-ui";

const storage = window.localStorage;

/*
* 审批接口
* */
export const sendProcureSchemeApproval = (pamams) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/runtime/batch-tasks`;

  return http.post(url, pamams);
};

/*
* 获取附件列表
* */
export const getAttachmentFilesApi = (fileUrl) => {
  const url = `https://gateway.dev.isrm.going-link.com/hfle/v1/${
    SrmUtil.getTenantId()
  }/file-preview/by-url?url=${encodeURIComponent(
    fileUrl
  )}&bucketName=private-bucket&access_token=${storage.getItem("user-token")}`;

  return http.get(url, { responseType: "arraybuffer" });
};

// eslint-disable-next-line valid-jsdoc
/**
 * 获取采购决议
 * @param {*采购决议id} id
 * @returns
 */
export const getProcurementDecisionApi = (id) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/hygy-decision-reviews/${id}`;

  return http.get(url);
};

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

// 获取审批类型
export const getmobileFormUrlApi = (params) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/getMobileFormUrl`, { params });
// 审批操作接口
export const getOperatorTypeApi = (taskId) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/${taskId}`);

// 操作接口
export const getOperatorApi = (taskId, params) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/runtime/tasks/${taskId}`, params);

// 获取我的待办列表
export const getTodoListApi = (params) => {
  const url = `/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/query/page`;

  return http.post(url, params);
};

// 获取流程审批历史
export const getTaskApprovalHistory = (businessKey) => http.post(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/historyApproval`, {}, {
  params: {
    businessKey
  }
});

export const getProcessLovApi = () => http.get(`/hpfm/v1/${storage.getItem("organizationId")}/lovs/value?lovCode=HWFP.PROCESS_APPROVE_STATUS`);

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