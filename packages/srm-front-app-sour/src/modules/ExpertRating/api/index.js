
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取专家评分列表
export const getExpertRatingListApi = (params, name) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/${name}`;
  return http.get(url, { params });
};
// 获取专家评分单头信息-打分
export const getExpertRatingHeaderApi = (params, quotationHeaderId, sourceFrom) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/${quotationHeaderId}/${sourceFrom}/header`;
  return http.get(url, { params });
};
// 获取专家评分单要素信息-打分
export const getExpertRatingLineApi = (params, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/${sourceHeaderId}/score-indic`;
  return http.get(url, { params });
};
//批量获取值集（通过/不通过
export const getApprovedStatusApi = (params) => {
  const url = "/hpfm/v1/lovs/value/batch";
  return http.get(url, { params });
};
// 保存-专家评分页
export const postScoreIndicApi = (params, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/${sourceHeaderId}/score-indic`;
  return http.post(url, params);
};
// 专家信息查询-评分管理页-重新评分
export const getSectionExpertApi = (params, sourceHeaderId, sourceFrom) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/${sourceFrom}/${sourceHeaderId}/section-expert`;
  return http.get(url, { params });
};
// 专评分管理页-重新评分
export const getSectionExpertLineApi = (sourceFrom, sourceHeaderId, evaluateExpertId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/${sourceFrom}/${sourceHeaderId}/score/expert/${evaluateExpertId}`;
  return http.get(url);
};
// 评分细项查询
export const getSectionScoreLineApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/score-line`;
  return http.get(url, { params });
};
// 重新评分
export const getSectionRescoreApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/rescore`;
  return http.post(url, params);
};

//评分详情-评分供应商查询
export const getRatingDetailApi = (params, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/${sourceHeaderId}/suppliers`;
  return http.get(url, { params });
};
//评分详情-供应商投标物料行查询
export const getRatingDetailLineApi = (params, quotationHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/${quotationHeaderId}/items`;
  return http.get(url, { params });
};
//评分管理-供应商查询
export const getRatingManageApi = (sourceFrom, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/${sourceFrom}/${sourceHeaderId}/section-supplier`;
  return http.get(url);
};
// 获取寻源类型
export const getSourceTypeApi = () => {
  const url = "/hpfm/v1/lovs/value/batch?inquiryMethod=SSRC.SOURCE_METHOD&scoreStatus=SSRC.SOURCE_STATUS&sourceCategory=SSRC.SOURCE_CATEGORY";
  return http.get(url);
};
// 提交
export const submitScoreApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/submit`;
  return http.post(url, params);
};
// 评分及汇总
export const submitSummaryApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/submit`;
  return http.post(url, params);
};
// 获取上传attachmentUUID
export const getUUIDApi = () => {
  const url = `/hfle/v1/3/files/uuid?tenantId=${storage.getItem("organizationId")}`;
  return http.post(url);
};

// 获取询价单头表明细信息
export const getInquiryHeadInfoApi = (rfxHeaderId, otherParams = {}) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${rfxHeaderId}`;
  return http.get(url, otherParams);
};

// 获取招投标头表明细信息
export const getBiddingHeadInfoApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/${bidHeaderId}`;
  return http.get(url);
};

// 获取询价单物料明细信息
export const getInquiryMaterialDetailApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${rfxHeaderId}/items?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.ITEM_LINE&page=0&size=10`;
  return http.get(url);
};

// 获取招投标物料明细信息
export const getBiddingMaterialDetailApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/items/${bidHeaderId}`;
  return http.get(url);
};

// 获取询价单专家信息
export const getInquiryExpertsInfoApi = (sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-experts?expertStatus=SUBMITTED&organizationId=${storage.getItem("organizationId")}&sourceFrom=RFX&sourceHeaderId=${sourceHeaderId}`;
  return http.get(url);
};

// 获取招投标专家信息
export const getBiddingExpertsInfoApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-experts?expertStatus=SUBMITTED&organizationId=${storage.getItem("organizationId")}&sourceFrom=BID&sourceHeaderId=${bidHeaderId}`;
  return http.get(url);
};

// 获取询价单评分要素信息
export const getInquiryScoringElementsApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indics?expertStatus=SUBMITTED&organizationId=${storage.getItem("organizationId")}&sourceFrom=RFX&sourceHeaderId=${rfxHeaderId}`;
  return http.get(url);
};

// 获取招投标评分要素信息
export const getBiddingScoringElementsApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indics?expertStatus=SUBMITTED&organizationId=${storage.getItem("organizationId")}&sourceFrom=BID&sourceHeaderId=${bidHeaderId}`;
  return http.get(url);
};

// 获取询价单/招投标专家分配信息
export const getExpertAssignedApi = (evaluateIndicCategory, evaluateIndicId, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-assigns?evaluateIndicCategory=${evaluateIndicCategory}&evaluateIndicId=${evaluateIndicId}&sourceHeaderId=${sourceHeaderId}`;
  return http.get(url);
};

// 获取招投标供应商分配信息
export const getSupplierAssignedApi = (bidHeaderId, bidLineItemId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/item-sup-assign?bidHeaderId=${bidHeaderId}&bidLineItemId=${bidLineItemId}`;
  return http.get(url);
};

// 获取招投标供应商信息
export const getBiddingSupplierApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/suppliers/${bidHeaderId}`;
  return http.get(url);
};

// 获取询价单供应商信息
export const getInquirySupplierApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${rfxHeaderId}/suppliers`;
  return http.get(url);
};

// 获取询价单/招投标操作记录
export const getOperationRecordsApi = (sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${sourceHeaderId}/actions`;
  return http.get(url);
};

// 获取询价单/招投标操作记录
export const getSettingApi = (code) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/settings/batch?${code}=${code}`;
  return http.get(url);
};

// 操作记录查询
export const getOperationRecordApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/actions/${bidHeaderId}`;
  return http.get(url);
};

// 配置表-查询是否开启新招标
export const fetchBidConfig = (params = {}) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/rel-table-records/source_new_bid_config/list-from-site`;
  return http.post(url, params);
};

// 评分中基础信息查询
export const fetchHeaderInfo = (params = {}) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/simple/${params.sourceHeaderId}`;
  return http.get(url);
};

// 评分中进度条查询
export const fetchProgress = (params = {}) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/${params.sourceFrom}/${params.sourceHeaderId}/progress`;
  return http.get(url);
};

// 评分中专家查询
export const fetchExpertInfo = (params = {}) => {
  const { sourceFrom, sourceHeaderId, ...others } = params;
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/${sourceFrom}/${sourceHeaderId}/expert`;
  return http.get(url, { others });
};

// 评分中供应商查询
export const fetchSupplierInfo = (params = {}) => {
  const { sourceFrom, sourceHeaderId, ...others } = params;
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/${sourceFrom}/${sourceHeaderId}/supplier`;
  return http.get(url, { others });
};

// 专家评分转交
export const getTransfer = (params = {}) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-experts/deliver`;
  return http.post(url, params);
};

// 获取权限集配置
export const getApermissionsApi = (params) => {
  const url = "/iam/hzero/v1/menus/check-permissions";
  return http.post(url, params);
};

//评分详情-评分要素查询
export const getRatingElementApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-assigns/list-by-expert`;
  return http.post(url, params);
};

//评分详情-评分要素保存
export const saveElementScoreApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/mobile/score-indic/save-score`;
  return http.post(url, params);
};

//评分详情-查看评分汇总
export const getScoreSummaryData = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/expert/score-summary`;
  return http.post(url, params);
};

// 要素维度提交
export const submitElementScoreApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/mobile/score-indic/submit-query`;
  return http.post(url, params);
};

// 要素维度提交
export const submitElementApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-scores/submit`;
  return http.post(url, params);
};

export const submitEvaluateNewOpenBidSummary = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-summary/submit/second`;
  return http.post(url, params);
};

/**
 * 查询是否使用新报价配置表
 */
// 查询是否使用新报价配置表
export const fetchNewQuotationConfigSheet = (params = {}) => {
  const url = `/ssrc/v2/${storage.getItem("organizationId")}/rfx/supplier/ssrc_rfq_quotation_old_ui_config`;
  return http.get(url, { params });
};