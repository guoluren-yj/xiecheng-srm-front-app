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

// 审批操作接口
export const getOperatorTypeApi = (taskId) => http.get(`/hwfp/v1/${SrmUtil.getTenantId()}/activiti/task/${taskId}`);
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
