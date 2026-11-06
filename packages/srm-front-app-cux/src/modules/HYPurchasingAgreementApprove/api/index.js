/**
 * 与 【采购协议审批】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

//获取协议终止
export const getAgreementTerminationApi = (id) => {

  const url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-workflow-hygy/listTaskPage/termination?pcHeaderId=${id}`;

  return http.get(url);
};

// const bucketName = "private-bucket";

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
 * 获取评标报告
 * @param {*评标id} id
 * @returns
 */
export const getBidEvaluationApi = (id) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/hygy-evaluation-reports/${id}`;

  return http.get(url);
};
// eslint-disable-next-line valid-jsdoc
/**
 * 获取采购协议
 * @param {*采购协议id} id
 * @returns
 */
export const getPurchasingAgreementApi = (id) => {

  const url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-workflow-hygy/listTaskPage?pcHeaderId=${id}`;

  return http.get(url);
};
/*
* 获取附件列表
*/
export const getAttachmentFilesApi = (attachmentUUID) => {
  const url = `/hfle/v1/${SrmUtil.getTenantId()}/files/${attachmentUUID}/file`;
  let pamams = {
    attachmentUUID,
  };

  return http.get(url, pamams);
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

