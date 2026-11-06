import { http, SrmUtil } from "srm-mobile-ui";

// 询价基础信息/采购组织及人员/对供应商要求/询价要求 查询
export const getHeaderApi = (id, params) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/${id}/detail?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.INFO_PREPARE,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_DEMAND,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_EXECUTOR,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_PREQUAL,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_QUOTATION,CSSRC.INQUIRY_HALL_DETAIL.RFXPREPARE`;
  return http.post(url, params);
};

// 专家查询
export const getRfxExperts = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/evaluate-experts`;
  return http.get(url, { params });
};

// 符合性检查/评分 查询
export const getRfxIndics = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/evaluate-indics`;
  return http.get(url, { params });
};

// 评分细项 查询
export const getScoreIndicateApi = (id) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/prequal/${id}/score-indic`;
  return http.get(url);
};

// 风险扫描
export const queryMonitor = (enterpriseName) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/monitor/query-monitor-enterprise?enterpriseName=${enterpriseName}`;
  return http.get(url);
};

// 报价明细
export const getQuotationDetailApi = (id, params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/quotationTemplate/view`;
  return http.get(url, { params });
};