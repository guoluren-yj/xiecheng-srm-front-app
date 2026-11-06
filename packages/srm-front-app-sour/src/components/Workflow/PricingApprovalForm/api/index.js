import { http, SrmUtil } from "srm-mobile-ui";

// 获取核价结果审批标段信息
export const getProjectSection = (rfxHeaderIds) => http.get(`/ssrc/v2/${SrmUtil.getTenantId()}/rfx/project/section`, { params: { rfxHeaderIds } });

// 获取rfx头信息
export const getRfxHeader = (sourceHeaderId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${sourceHeaderId}`, {
  params: {
    customizeUnitCode: "SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_INFO,SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_COST_DETAIL_INFO,SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_DETAIL_INFO",
    sourceHeaderId
  }
});

// 获取rfx头信息
export const getRfxItemLines = (sourceHeaderId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${sourceHeaderId}`, {
  params: {
    customizeUnitCode: "SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_INFO,SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_COST_DETAIL_INFO,SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_DETAIL_INFO",
    sourceHeaderId
  }
});

// 获取rfx头信息
export const getRfxItemLinesCheck = (rfxHeaderId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/check`, {
  params: {
    page: 0,
    size: 1000,
    customizeUnitCode: "SMBL.WORKFLOW.PRICING_APPROVAL.LINE_CHECK_INFO",
    rfxHeaderId,
    sourceMobileEndFlag: 1,
  }
});

// 获取rfx头信息
export const getRfxItemLinesCheckNew = (rfxHeaderId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/check`, {
  params: {
    page: 0,
    size: 1000,
    customizeUnitCode: "SMBL.WORKFLOW.PRICING_APPROVAL.LINE_CHECK_INFO_NEW",
    rfxHeaderId,
    sourceMobileEndFlag: 1,
  }
});

// 获取过程附件
export const getProcessFileApi = (rfxHeadId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeadId}/process-attachment/download-query`);

// 获取专家评分
export const getRfxScoreApi = (rfxHeadId) => http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeadId}/score/detail`, {
  params: {
    sourceForm: "RFX",
    organizationId: SrmUtil.getTenantId()
  }
});

//采购申请查询接口
export const getPurchaseApi = (params) => http.get(`/sprm/v1/${SrmUtil.getTenantId()}/purchase-request/purchase-platform/execution-status-tracking-tiled/page`, { params });

// 获取文件列表
export const getFileList = ({ uuid } = {}) => http.get(`/hfle/v1/${SrmUtil.getTenantId()}/files/${uuid}/file`, {
  params: {
    attachmentUUID: SrmUtil.getTenantId(),
    bucketName: "public-bucket",
    size: 1000,
  }
});

export const getBiddingSupplier = (rfxHeaderId) => http.post(`/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/XHelD8kldiat9icx8FEqV1pwobVLWRPLyzta8ia5EBbLatQViaZpFMoAt0XI8LB6JMQ7`, { rfxHeaderId });

// supplier
export async function fetchSupplierLine(params) {
  const { organizationId, querys = {}, ...others } = params;
  const url = `/ssrc/v1/${organizationId}/rfx/check/approval-form/supplier/list`;
  return http.post(url, others, { params: querys });
}

// 物品列表-数据查询-不分页Promise
export async function fetchItemLine(params) {
  const { organizationId, querys = {}, ...others } = params;
  const url = `/ssrc/v1/${organizationId}/rfx/check/approval-form/item/list`;
  return http.post(url, others, { params: querys });
}

export async function fetchSupplierData(params = {}) {
  const { organizationId, querys = {}, ...others } = params;
  const url = `/ssrc/v1/${organizationId}/rfx/check/approval-form/supplier/single`;
  return http.post(url, others, { params: querys });
}

// 单一物品数据查询
export async function fetchItemData(params) {
  const { organizationId, querys = {}, ...others } = params;
  const url = `/ssrc/v1/${organizationId}/rfx/check/approval-form/item/single`;
  return http.post(url, others, { params: querys });
}

export async function fetchNewSupplierQuotationFile(params) {
  const { organizationId, } = params;
  const url = `/ssrc/v2/${organizationId}/rfx/quotation/header/record/attachment/history`;
  return http.get(url, { params });
}

export async function checkPriceComparePriceDownloadZip(params = {}) {
  const { organizationId, } = params;
  const url = `/ssrc/v1/${organizationId}/rfx/quotation/price-compare-assistant/print-excel/token`;
  return http.get(url, { params });
}

export async function getUrl(params = {}) {
  const { organizationId, querys = {}, ...others } = params;
  const url = `hrpt/v1/${organizationId}/print/file`;
  return http.post(url, others.token, { params: querys });
}

export async function getRfxHeaderCheckPrice(params = {}) {
  const { rfxHeaderId, } = params;
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}`;
  return http.get(url, { params });
}

// 查询智能审核结果前，获取参数
export async function fetchIntelligentPreReview(params) {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/ai-approve-result/query-result`;
  return http.post(url, params);
};
