
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取询价单基本信息
export const getRfxHeader = (id, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/${id}`, { params });

// 获取询价单基本信息详情
export const getRfxHeaderInfoDetail = (id, params) => http.post(`/ssrc/v2/${storage.getItem("organizationId")}/rfx/${id}/detail?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.INFO_PREPARE,SSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_DEMAND,SSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_EXECUTOR,SSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_PREQUAL,SSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_QUOTATION`, params);

// 获取询价单-资格预审小组
export const getRfxHeaderDetail = (id) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/prequal-members/${id}/RFX`);

// 获取 标的物
export const getRfxItemLines = (params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/items`, { params });

// 获取 分配物料
export const getRfxItems = (id, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/hist/${id}/items`, { params });
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
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/prequal/${id}/score-indic`;

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

// 获取询价单基本信息
export const getRfxHeaderOld = (id, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/${id}`, { params });

// 获取询价单物料行信息
export const getRfxItemsOld = (id, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/${id}/items`, { params });

// 获取询价单供应商信息
export const getRfxSuppliersOld = (id, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/${id}/suppliers`, { params });

// 获取询价单专家信息
export const getRfxExpertsOld = (id) => {
  const tenantId = storage.getItem("organizationId");
  const params = {
    sourceHeaderId: id,
    sourceFrom: "RFX",
    organizationId: tenantId,
    expertStatus: "SUBMITTED",
  };

  return http.get(`/ssrc/v1/${tenantId}/evaluate-experts`, { params });
};

// 获取询价单评分要素
export const getRfxIndicsOld = (id) => {
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
export const getRfxMembersOld = (id) => {
  const tenantId = storage.getItem("organizationId");
  const params = {
    readOnly: true,
  };

  return http.get(`/ssrc/v1/${tenantId}/rfx/members/${id}`, { params });
};

// 获取供应商分配信息
export const getSupplierAssignedApiOld = (rfxHeaderId, lineItemId) => {
  const params = {
    itemIds: lineItemId,
    rfxHeaderId,
  };
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/item-sup-assign`;

  return http.get(url, { params });
};
