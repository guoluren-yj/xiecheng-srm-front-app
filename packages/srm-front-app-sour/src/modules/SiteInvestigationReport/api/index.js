import { http, SrmUtil } from "srm-mobile-ui";

export const getBasicInfoApi = (evalHeaderId) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/${evalHeaderId}`;
  let params = {
    customizeUnitCode: "SSLM_SITEINVESTIGATEREPORT.BASICINFO,SSLM_SITEINVESTIGATEREPORT.INSPECTRESULTS",
  };
  return http.get(url, { params });
};

// 保存评分人
export const saveScorerApi = (params) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-resps/batchCreate`;
  return http.post(url, params);
};

// 请求评分信息子集数据
export const getScoreInfoApi = (id, indicatorCode) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-lines/${id}`;
  let params = {
    page: 0,
    size: 10,
    indicatorCode,
    customizeUnitCode: "SSLM_SITEINVESTIGATEREPORT.SCOREINFO,SSLM_SITEINVESTIGATEREPORT.SCOREINFO_FILTER",
  };
  return http.get(url, { params });
};

// 新建一个考察报告
export const creatReportAction = (basicInfo) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers?customizeUnitCode=SSLM_SITEINVESTIGATEREPORT.BASICINFO,SSLM_SITEINVESTIGATEREPORT.REVIEWMATERIALCATEGORY,SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM,SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO,SSLM_SITEINVESTIGATEREPORT.INSPECTRESULTS`;
  return http.post(url, basicInfo);
};

// 保存附件
export const saveAttachmentApi = (params) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-att-lns`;
  return http.post(url, params);
};

// 填制-保存
export const saveFilledApi = (params) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-resps/preservation?customizeUnitCode=SSLM_SITEINVESTIGATE_FILLING_DETAIL.BASICINFO,SSLM_SITEINVESTIGATE_FILLING_DETAIL.CATEGORY,SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM,SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO,SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCOREINFO`;
  return http.put(url, params);
};

// 填制-提交
export const submitFilledApi = (params) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-resps?customizeUnitCode=SSLM_SITEINVESTIGATE_FILLING_DETAIL.BASICINFO,SSLM_SITEINVESTIGATE_FILLING_DETAIL.CATEGORY,SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM,SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO,SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCOREINFO`;
  return http.put(url, params);
};

// 管理-大保存
export const saveAllApi = (params) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers?customizeUnitCode=SSLM_SITEINVESTIGATEREPORT.BASICINFO,SSLM_SITEINVESTIGATEREPORT.REVIEWMATERIALCATEGORY,SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM,SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO,SSLM_SITEINVESTIGATEREPORT.INSPECTRESULTS`;
  return http.post(url, params);
};

// 执行评分
export const performScoreApi = (params) => {
  const { evalHeaderId } = params;
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/${evalHeaderId}/evaluate?customizeUnitCode=SSLM_SITEINVESTIGATEREPORT.BASICINFO,SSLM_SITEINVESTIGATEREPORT.REVIEWMATERIALCATEGORY,SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM,SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO,SSLM_SITEINVESTIGATEREPORT.INSPECTRESULTS`;
  return http.post(url, params);
};

// 现场考评档案管理提交反馈接口
export const submitFeedback = (params) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/feedbackSiteEval?customizeUnitCode=SSLM_SITEINVESTIGATEREPORT.BASICINFO,SSLM_SITEINVESTIGATEREPORT.REVIEWMATERIALCATEGORY,SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM,SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO,SSLM_SITEINVESTIGATEREPORT.INSPECTRESULTS`;
  return http.post(url, params);
};

// 发布接口
export const publishReport = (params) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/releaseSiteEval?customizeUnitCode=SSLM_SITEINVESTIGATEREPORT.BASICINFO,SSLM_SITEINVESTIGATEREPORT.REVIEWMATERIALCATEGORY,SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM,SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO,SSLM_SITEINVESTIGATEREPORT.INSPECTRESULTS`;
  return http.post(url, params);
};

// 退回
export const handleBack = (params) => {
  const { evalHeaderId } = params;
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/${evalHeaderId}/back?customizeUnitCode=SSLM_SITEINVESTIGATEREPORT.BASICINFO,SSLM_SITEINVESTIGATEREPORT.REVIEWMATERIALCATEGORY,SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM,SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO,SSLM_SITEINVESTIGATEREPORT.INSPECTRESULTS`;
  return http.post(url, params);
};

// 发起质量整改
export const queryProblemHeader = (params) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/create_problem_headers`;
  return http.post(url, params);
};

// 汇总统计
export const summaryStatistics = (params) => {
  const { evalHeaderId } = params;
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/${evalHeaderId}/final-collect`;
  return http.post(url);
};

// 提交审批
export const submitApproval = (params) => {
  const { evalHeaderId } = params;
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/submit/${evalHeaderId}`;
  return http.post(url, params);
};

// 作废
export const detailInvalid = (params) => {
  const { evalHeaderId } = params;
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/${evalHeaderId}`;
  return http.delete(url);
};

// 退回评分
export function handleBackScore(params) {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/processEvalScoreBack/${params.evalHeaderId}`;
  return http.post(url, params);
}
