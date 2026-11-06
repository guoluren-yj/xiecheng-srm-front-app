import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 头信息个性化单元
const headerCustomizeCode = [
  "SMBL.WORKFLOW.RFX_APPROVAL_NEW.BASIC",
  "SMBL.WORKFLOW.RFX_APPROVAL_NEW.DEMANDSIDE",
  "SMBL.WORKFLOW.RFX_APPROVAL_NEW.PURORGANDSTAFF",
  "SMBL.WORKFLOW.RFX_APPROVAL_NEW.SUPPLIER_HEAD",
  "SMBL.WORKFLOW.RFX_APPROVAL_NEW.RFXPREPARE",
  "SMBL.WORKFLOW.RFX_APPROVAL_NEW.PREQUALIFICATION",
  "SMBL.WORKFLOW.RFX_APPROVAL_NEW.RULE",
  "SMBL.WORKFLOW.RFX_APPROVAL_NEW.ATTACHMENT",
].join(",");

// 获取询价单基本信息
export const getRfxHeader = (id, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/${id}`, { params });

// 获取询价单基本信息详情
export const getRfxHeaderInfoDetail = (id, params) => http.post(`/ssrc/v2/${storage.getItem("organizationId")}/rfx/${id}/detail?customizeUnitCode=${headerCustomizeCode}`, params);

// 获取询价单-资格预审小组
export const getRfxHeaderDetail = (id) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/prequal-members/${id}/RFX`);

// 获取 标的物
export const getRfxItemLines = (params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/items`, { params });

// 获取 分配物料
export const getRfxItems = (params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/item-sup-assign/items`, { params });
// 获取 标段物料
export const getRfxItem = (hid, projectLineSectionId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/items/${hid}${projectLineSectionId ? `/${projectLineSectionId}` : ""}`, { params });

// 获取 对供应商的要求
export const getRfxSuppliers = (id, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/${id}/suppliers`, { params });

// 获取 专家
export const getRfxExperts = (id) => {
  const tenantId = storage.getItem("organizationId");
  const params = {
    sourceHeaderId: id,
    sourceFrom: "RFX",
    organizationId: tenantId,
    expertStatus: "SUBMITTED",
  };
  return http.get(`/ssrc/v1/${tenantId}/evaluate-experts`, { params });
};

// 获取 询价要求
// 符合性检查initialReviewIndicList
// 评分otherIndicList
// 技术评分technologyIndicList
// 商务评分businessIndicList
export const getRfxIndics = (id) => {
  const tenantId = storage.getItem("organizationId");
  const params = {
    sourceHeaderId: id,
    sourceFrom: "RFX",
    organizationId: tenantId,
    expertStatus: "SUBMITTED",
  };
  return http.get(`/ssrc/v1/${tenantId}/evaluate-indics`, { params });
};

// 获取询价单寻源小组
export const getRfxMembers = (id) => {
  const tenantId = storage.getItem("organizationId");
  const params = {
    readOnly: true,
  };
  return http.get(`/ssrc/v1/${tenantId}/rfx/members/${id}`, { params });
};

// 获取供应商分配信息
export const getSupplierAssignedApi = (rfxHeaderId, lineItemId) => {
  const params = {
    itemIds: lineItemId,
    rfxHeaderId,
  };
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/item-sup-assign`;
  return http.get(url, { params });
};

// 评分细项 查看
export const getScoreIndicateApi = (id) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/prequal/${id}/score-indic?customizeUnitCode=SMBL.WORKFLOW.RFX_APPROVAL_NEW.SCORE`;
  return http.get(url);
};

// 专家分配 查看
export const getExpertAssignedApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-assigns`;
  return http.get(url, { params });
};

// 阶梯报价查询
export const getLadderQuotationApi = (lineId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${lineId}/ladder-inquiry`;
  return http.get(url);
};

// 报价明细
export const getQuotationDetailApi = (headerId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/${headerId}/quotationTemplate/view`;
  return http.get(url, { params });
};