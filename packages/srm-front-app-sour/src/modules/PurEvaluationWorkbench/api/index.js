/**
 * 评估工作台接口
 */
import { http } from "srm-mobile-ui";
import { SRM_SSLM, SRM_HPFM } from "@/utils/utils";

const storage = window.localStorage;

// 基础信息
export const getBasicInfoApi = (evalHeaderId, params = {}) => {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/eval-report/${evalHeaderId}`;
  return http.get(url, { params });
};

// 评估阶段信息
export const getEvalReportStageApi = () => {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/eval-report/stage`;
  return http.get(url);
};

// 操作记录信息
export const getHistoricApi = (evalHeaderId) => {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-opr-historys/${evalHeaderId}`;
  return http.get(url);
};

// 保存
export const saveAllApi = (params) => {
  const { customizeUnitCode, ...otherParams } = params || {};
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/eval-report/create?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, otherParams);
};

// 新建评估报告
export const createEvaluationApi = (params) => {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/eval-plan-lines/strategy-is-last`;
  return http.post(url, params);
};

// 引用评估计划创建
export const handleEvalPlanCreateApi = (params) => {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/eval-plan-lines/batch-create-site-eval`;
  return http.post(url, params);
};

// 评估信息保存接口
export async function saveAssessmentApi(params) {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-lines/eval-report-line/update`;
  return http.post(url, params);
}

/**
 * 批量保存评分人
 * @param params
 * @returns {Promise<void>}
 */
export async function batchSaveGraderApi(params) {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-line-resps/batchCreate`;
  return http.post(url, params);
}

/**
 * 详情-作废
 * @async
 * @param {Object} params - 查询参数
 */
export async function detailInvalidApi(params) {
  const { evalHeaderId } = params;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/${evalHeaderId}`;
  return http.put(url, params);
}

/**
 * 退回自评
 * @async
 * @param {Object} params - 查询参数
 */
export async function backApi(params) {
  const { customizeUnitCode = "", evalHeaderId, ...others } = params;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/${evalHeaderId}/back?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, { ...others, evalHeaderId });
}

// 评分人汇总信息
export const getSummaryInfoApi = (evalHeaderId, params) => {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-resp-headers/get-resp-header/${evalHeaderId}`;
  return http.get(url, { params });
};

// 评分人汇总信息
export const getTreeApi = (evalHeaderId) => {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-lines/eval-report-line/tree/${evalHeaderId}`;
  return http.get(url);
};

/**
 * 详情 --- 执行评分
 * @export
 * @returns
 */
export async function executiveScoreApi(params) {
  const { customizeUnitCode = "", evalHeaderId, ...others } = params;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/eval-report/${evalHeaderId}/evaluate?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, { ...others, evalHeaderId });
}

/**
 * 详情页-删除
 * @async
 * @param {Object} params - 查询参数
 */
export const detailDeleteApi = (params) => {
  console.log("params", params);
  const { evalHeaderId } = params;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/${evalHeaderId}`;
  return http.delete(url);
};

/**
 * 汇总统计
 * @async
 * @param {Object} params - 查询参数
 */
export async function summaryStatisticsApi(params) {
  const { evalHeaderId } = params;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/${evalHeaderId}/final-collect`;
  return http.post(url);
}

/**
 * 退回评分
 */
export async function backScoreApi(params) {
  const { evalHeaderId } = params;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/processEvalScoreBack/${evalHeaderId}`;
  return http.post(url, params);
}

/**
 * 提交审批
 * @async
 * @param {Object} params - 查询参数
 */
export async function submitApprovalApi(params) {
  const { customizeUnitCode, evalHeaderId, ...otherParams } = params;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/submit/${evalHeaderId}?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, otherParams);
}

// 供应商现场考察档案指标明细-只包含最顶级和叶子节点指标 - 评分要素
export const getAssessmentelEmentApi = (payload) => {
  const { evalHeaderId, ...params } = payload || {};
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-lines/listTopIndAndLeafInd/${evalHeaderId}`;
  return http.get(url, { params:{
    ...params,
    customizeUnitCode:[ "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATION_INFORMATION", "SSLM.PURCHASER_ASSESS_DETAIL.SCORE_INFORMATION" ].join(),
  } });
};

// 供应商现场考察档案指标明细-只包含最顶级和叶子节点指标 - 评分人
export const getAssessmentScoreApi = (payload) => {
  const { evalHeaderId, scorerId, ...params } = payload || {};
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-lines/listTopIndAndLeafInd/${evalHeaderId}/${scorerId}`;
  return http.get(url, { params:{
    ...params,
    customizeUnitCode:[ "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATION_INFORMATION", "SSLM.PURCHASER_ASSESS_DETAIL.SCORE_INFORMATION" ].join(),
  } });
};

// 供应商现场考察档案指标明细-只包含最顶级和叶子节点指标 - 评分要素/评分人
export const getAssessmentApi = (payload) => {
  const { evalHeaderId, scorerId, apiType, ...params } = payload || {};
  let url = "";
  // 评分要素维度
  if (apiType === "element") {
    url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-lines/listTopIndAndLeafInd/${evalHeaderId}`;
  } else {
    url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-lines/listTopIndAndLeafInd/${evalHeaderId}/${scorerId}`;
  }
  return http.get(url, { params:{
    ...params,
    customizeUnitCode:[ "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATION_INFORMATION", "SSLM.PURCHASER_ASSESS_DETAIL.SCORE_INFORMATION" ].join(),
  } });
};

//批量获取值集
export const getLovListApi = (params) => {
  const url = "/hpfm/v1/lovs/value/batch";
  return http.get(url, { params });
};

// 获取编码对应值集
export const getLovApi = (params) => {
  const url = "/hpfm/v1/lovs/data";
  return http.get(url, { params });
};

/**
 * 评分详情 - 保存
 * @async
 * @param {Object} params - 查询参数
 */
export const saveFillingScore = (payload) => {
  const { customizeUnitCode = "", ...params } = payload;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-line-resps/preservation?customizeUnitCode=${customizeUnitCode}`;
  return http.put(url, params);
};

/**
 * 评分详情-提交
 * @async
 * @param {Object} params - 查询参数
 */
export const submitFillingScore = (payload) => {
  const { customizeUnitCode = "", ...params } = payload;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-line-resps?customizeUnitCode=${customizeUnitCode}`;
  return http.put(url, params);
};

// 放弃评分
export async function batchCancel(payload) {
  const { evalHeaderId, ...params } = payload;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-line-resps/batchCancel/${evalHeaderId}`;
  return http.post(url, params);
}

// 发布
export async function releaseApi(payload) {
  const { customizeUnitCode, ...params } = payload;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/releaseSiteEval?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
}

// 查询个性化配置
export async function queryCustomizeApi(params) {
  const url = `${SRM_HPFM}/v1/${storage.getItem("organizationId")}/ui-customize`;
  return http.post(url, params);
}

// 执行自评
export async function handleFeedBackApi(payload) {
  const { customizeUnitCode, ...params } = payload;
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/feedbackSiteEval?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
}

// 获取整改单据
export async function getRectificationItemsApi(params) {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/eval-report/create_problem_headers`;
  return http.post(url, params);
}

// 获取附件api
export const getAttachedFile = (payload) => {
  const { attachmentUuid, ...params } = payload || {};
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUuid}/file`;
  return http.get(url, { params });
};
