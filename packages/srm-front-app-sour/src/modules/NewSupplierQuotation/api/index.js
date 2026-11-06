import { http, SrmUtil } from "srm-mobile-ui";

const SRM_SSRC = "/ssrc";

/**
 * 请求API前缀
 * @type {string}
 */
const prefix = `${SRM_SSRC}/v1`;

// 获取头信息
export const getHeaderApi = (id) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.HEADER_DETAIL,SSRC.INQUIRY_HALL_DETAIL.HEADER_PREQUAL`;
  return http.get(url);
};

// 新接口
export const getNewHeaderApi = (id, params) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/${id}/detail?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.INFO_PREPARE,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_DEMAND,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_EXECUTOR,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_PREQUAL,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_QUOTATION,CSSRC.INQUIRY_HALL_DETAIL.RFXPREPARE`;
  return http.post(url, params);
};

// 获取多标段
export const getAllSectionApi = (id) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/${id}/project/all-section`;
  return http.get(url);
};

// 操作记录
export function getHistory(id) {
  const params = {};
  return http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/actions`, { params });
}

// 查询报价单头
export const fetchQuotationHeader = (params = {}) => {
  const { organizationId, } = params || {};
  const url = `/ssrc/v2/${organizationId}/rfx/supplier/quotation/header`;
  return http.get(url, { params, });
};

// 回复-参与/明细查询询价单头
export const fetchRfxHeader = (params = {}) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/supplier/rfx-header/participate`;
  return http.get(url, { params, });
};

// 查询报价单头
export const fetchQuotationLines = (params = {}) => {
  const { rfxHeaderId, } = params || {};
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/supplier/${rfxHeaderId}/items`;
  return http.get(url, { params, });
};

// 判断是否开启双单位
export const queryEnableDoubleUnit = (params = {}) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/secondary/uom/isEnable`;
  return http.get(url, { params, });
};

// 参与
export const participateNew = (params = {}) => {
  const { organizationId, query } = params || {};
  const url = `/ssrc/v2/${organizationId}/rfx/supplier/batch-participate`;
  return http.post(url, params, { params: query, });
};

// 放弃
export const abandonNew = (params = {}) => {
  const { organizationId, query } = params || {};
  const url = `/ssrc/v2/${organizationId}/rfx/supplier/batch-abandon`;
  return http.post(url, params, { params: query, });
};

// save
export const saveQuotationNew = (params = {}) => {
  const { organizationId, query = {}, } = params || {};

  const url = `/ssrc/v2/${organizationId}/rfx/supplier/quotation/save`;
  return http.post(url, params, { params: query, });
};

// submit
export const submitQuotationNew = (params = {}) => {
  const { organizationId, query = {}, } = params || {};
  const url = `/ssrc/v2/${organizationId}/rfx/supplier/batch-submit`;
  return http.post(url, params, { params: query, });
};

// 供应商全部放弃
export const quotationWholeAbandon = (params = {}) => {
  const { organizationId, data, query = {}, } = params || {};
  const url = `/ssrc/v2/${organizationId}/rfx/supplier/batch-whole-abandon`;
  return http.post(url, data, { params: query, });
};

// 保存询价,阅读事项说明标识
export const saveConfirmMatter = (params = {}) => {
  const { organizationId, query = {}, } = params || {};
  const url = `/ssrc/v1/${organizationId}/rfx/confirm-matter`;
  return http.post(url, params, { params: query, });
};

// 报价查询/报价历史版本 头查询
export const fetchQuotationHistoryHeader = (params = {}) => {
  const { organizationId, } = params || {};
  const url = `/ssrc/v2/${organizationId}/rfx/quotation/header/record`;
  return http.get(url, { params, });
};

// 查询配置表
export const fetchConfigSheet = (params = {}) => {
  const { organizationId, configCode, query = {}, data = {}, } = params || {};
  const url = `/spfm/v1/${organizationId}/rel-table-records/${configCode}/list-from-site`;
  return http.post(url, data, { params: query, });
};

// 生成寻源费用并且推送费用工作台
export const quotationInsertExpens = (params = {}) => {
  const { organizationId, query = {}, data = {}, } = params || {};
  const url = `/ssrc/v1/${organizationId}/expenses-headers/insert-expense`;
  return http.post(url, data, { params: query, });
};

/**
 * 查询是否使用新报价配置表
 */
// 查询是否使用新报价配置表
export const fetchNewQuotationConfigSheet = (params = {}) => {
  const { organizationId, } = params || {};
  const url = `/ssrc/v2/${organizationId}/rfx/supplier/ssrc_rfq_quotation_old_ui_config`;
  return http.get(url, { params, });
};

// 报价查询/报价历史版本 头查询
export const fetchQuotationHistoryHeaderPurchaser = (params = {}) => {
  const { organizationId, } = params || {};
  const url = `/ssrc/v2/${organizationId}/rfx/quotation/header/record/pur-query/detail`;
  return http.get(url, { params, });
};

// 竞价大厅 供应商 竞价单头规则信息查询（供）
export const fetchSupplierBiddingRules = (params = {}) => {
  const { organizationId, querys, ...data } = params || {};
  const url = `${prefix}/${organizationId}/bidding/sup/header/cur/rule`;
  return http.post(url, data, { params: querys, });
};

// 竞价大厅 供应商 单价 竞价单头信息查询（供）API
export const fetchSupplierBiddingHeader = (params = {}) => {
  const { organizationId, querys, ...data } = params || {};
  const url = `${prefix}/${organizationId}/bidding/sup/header/cur/info-query`;
  return http.post(url, data, { params: querys, });
};

// 竞价大厅 供应商 单价 提交
export const quotationUnitPriceSubmit = (params = {}) => {
  const { organizationId, querys, ...data } = params || {};
  const url = `${prefix}/${organizationId}/bidding/sup/line/cur/submit`;
  return http.post(url, data, { params: querys, });
};

// 竞价大厅 供应商 单价 save
export const quotationPriceSave = (params = {}) => {
  const { organizationId, querys, ...data } = params || {};
  const url = `${prefix}/${organizationId}/bidding/sup/line/cur/save`;
  return http.post(url, data, { params: querys, });
};

// 竞价大厅 供应商 供应商提交后，单价竞价-需要部分刷新逻辑
export const quotationRefreshLine = (params = {}) => {
  const { organizationId, querys, ...data } = params || {};
  const url = `${prefix}/${organizationId}/bidding/sup/line/cur/refresh`;
  return http.post(url, data, { params: querys, });
};

// 竞价大厅 供应商 回复-签到
export const supplierBiddingHallSignIn = (params = {}) => {
  const { organizationId, querys, ...data } = params || {};
  const url = `${prefix}/${organizationId}/bidding/sup/header/cur/sign-in`;
  return http.post(url, data, { params: querys, });
};

// 竞价大厅 供应商 用户信息监控（供）API
export const userNetSignalInfo = (params = {}) => {
  const { organizationId, querys, ...data } = params || {};
  const url = `${prefix}/${organizationId}/bidding/sup/user-info/monitor`;
  return http.post(url, data, { params: querys, });
};

// 竞价大厅 供应商 节点
export const supplierProcessBar = (params = {}) => {
  const { organizationId, querys, ...data } = params || {};
  const url = `${prefix}/${organizationId}/bidding/sup/header/cur/progress`;
  return http.post(url, data, { params: querys, });
};

// 竞价大厅 供应商 用户信息监控（供）API
export const fetchUnitPriceList = (params = {}) => {
  const { organizationId, querys, ...data } = params || {};
  const url = `${prefix}/${organizationId}/bidding/sup/line/cur/page`;
  return http.post(url, data, { params: querys, });
};


