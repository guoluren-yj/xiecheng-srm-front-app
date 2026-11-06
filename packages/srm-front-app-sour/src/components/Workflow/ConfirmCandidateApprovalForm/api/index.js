import { http, SrmUtil } from "srm-mobile-ui";

// 获取rfx头信息
export const getRfxHeader = (rfxHeaderId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}`, {
  params: {
    customizeUnitCode: "SMBL.WORKFLOW.EXPERT_SCORE_MANAGE.HEADER_BASE",
  }
});

// 获取报价行信息
export const getQuotationSupplierLine = (rfxHeaderId, sourceFrom) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/evaluate-summary/${sourceFrom}/${rfxHeaderId}`, {
  params: {
    customizeUnitCode: "SMBL.WORKFLOW.EXPERT_SCORE_MANAGE.QUOTATIONLINE",
    rfxHeaderId
  }
});

// 获取评分信息
export const fetchScoreDetail = (evaluateSummaryId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/evaluate-summary/summary/${evaluateSummaryId}/indic-detail/two`);

//寻源工作台查询接口
export const getRfxApi = (params) => http.get(`/ssrc/v2/${SrmUtil.getTenantId()}/rfx/list/all`, { params });

