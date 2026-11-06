import { http } from "srm-mobile-ui";
const storage = window.localStorage;

// 获取多标段
export const getDBDApi = (headId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/adjust/${headId}/quote-section-batch-list/approve-query?organizationId=${storage.getItem("organizationId")}&type=approval`;
  return http.get(url);
};

// 获取变更后的信息
export const getAfterRfxAdjustInfo = (id) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/adjust/${id}/after-adjust/query`;
  let params = {
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.TIMEADJUST_READ,SSRC.QUOTATION_CONTROLLER_DETAIL.PRE_ONLYREAD,SMBL.WORKFLOW.RFXADJUST.BASE_INFO",
    mobileFlag: 1,
  };

  return http.get(url, { params });
};

// 获取变更前的信息
export const getBeforRfxAdjustInfo = (id) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/adjust/${id}/before-adjust/query`;
  let params = {
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.TIMEADJUST_READ,SSRC.QUOTATION_CONTROLLER_DETAIL.PRE_ONLYREAD,SMBL.WORKFLOW.RFXADJUST.BASE_INFO",
    mobileFlag: 1,
  };

  return http.get(url, { params });
};

// 获取变更后供应商信息
export const getAfterSuppliersAdjustInfo = (id) => {
  const url = `ssrc/v1/${storage.getItem("organizationId")}/rfx/suppliers/adjust/after-query`;
  let params = {
    page: 0,
    size: 1000,
    organizationId: storage.getItem("organizationId"),
    adjustRecordId: id,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.SUPPLIER_ONLYRED",
  };

  return http.get(url, { params });
};

// 获取变更前供应商信息
export const getBeforeSuppliersAdjustInfo = (id) => {
  const url = `ssrc/v1/${storage.getItem("organizationId")}/rfx/suppliers/adjust/before-query`;
  let params = {
    page: 0,
    size: 1000,
    organizationId: storage.getItem("organizationId"),
    adjustRecordId: id,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.SUPPLIER_HIS",
  };

  return http.get(url, { params });
};

// 获取变更后询价标的物
export const getAfterItemInfo = (id) => {
  const url = `ssrc/v1/${storage.getItem("organizationId")}/rfx/item/adjust/after-query`;
  let params = {
    page: 0,
    size: 1000,
    organizationId: storage.getItem("organizationId"),
    adjustRecordId: id,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.ITEMLINE_ONLYRED",
  };

  return http.get(url, { params });
};

// 获取变更前询价标的物
export const getBeforeItemInfo = (id) => {
  const url = `ssrc/v1/${storage.getItem("organizationId")}/rfx/item/adjust/before-query`;
  let params = {
    page: 0,
    size: 1000,
    organizationId: storage.getItem("organizationId"),
    adjustRecordId: id,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.ITEMLINE_HIS",
  };

  return http.get(url, { params });
};

// 获取分配物料信息
export const getAllotItemsInfoForSupplier = (adjustId, adjustRecordId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/item-sup-assign/adjust/after-query`;
  let params = {
    page: 0,
    size: 1000,
    adjustRecordId: adjustRecordId,
    rfxLineSupplierAdjustId: adjustId,
  };

  return http.get(url, { params });
};

// 获取评分要素信息（变更后）
export const getAfterEvaluateInfo = (adjustRecordId, rfxHeaderAdjustId, rfxHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-adjusts/after-query`;
  let params = {
    adjustRecordId,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.SCORE_NONE_READ,SSRC.QUOTATION_CONTROLLER_DETAIL.SCORE_TECH_READ",
    indicStatus: "SUBMITTED",
    indicateLevel: "ONE",
    sourceFrom: "RFX",
    sourceHeaderAdjustId: rfxHeaderAdjustId,
    sourceHeaderId: rfxHeaderId,
    tenantId: storage.getItem("organizationId"),
  };
  return http.get(url, { params });
};

// 获取评分要素信息（变更前）
export const getBeforeEvaluateInfo = (adjustRecordId, rfxHeaderAdjustId, rfxHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-adjusts/before-query`;
  let params = {
    adjustRecordId,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.SCORE_NONE_HIS,SSRC.QUOTATION_CONTROLLER_DETAIL.SCORE_TECH_HIS",
    indicStatus: "SUBMITTED",
    indicateLevel: "ONE",
    sourceFrom: "RFX",
    sourceHeaderAdjustId: rfxHeaderAdjustId,
    sourceHeaderId: rfxHeaderId,
    tenantId: storage.getItem("organizationId"),
  };
  return http.get(url, { params });
};

// 获取评分要素细项（变更后）
export const getAfterEvaluateDetailApi = (evaluateIndicAdjustId, evaluateIndicId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-adjusts/two/after-query`;
  let params = {
    indicateLevel: "TWO",
    parentIndicateAdjustId: evaluateIndicAdjustId,
    parentIndicateId: evaluateIndicId,
    templateEleDetailFlag: "1",
    tenantId: storage.getItem("organizationId"),
  };
  return http.get(url, { params });
};

// 获取评分要素细项（变更前）
export const getBeforeEvaluateDetailApi = (evaluateIndicAdjustId, evaluateIndicId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-adjusts/two/before-query`;
  let params = {
    indicateLevel: "TWO",
    adjustRecordId: evaluateIndicAdjustId,
    parentIndicateId: evaluateIndicId,
    templateEleDetailFlag: "1",
    tenantId: storage.getItem("organizationId"),
  };
  return http.get(url, { params });
};

// 获取评分要素的分配专家（变更后）
export const getAfterEvaluateAssignsApi = (evaluateIndicAdjustId, sourceHeaderId, evaluateIndicId, adjustRecordId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-adjusts/assigns/after-query`;
  let params = {
    organizationId: storage.getItem("organizationId"),
    evaluateIndicAdjustId,
    evaluateIndicCategory: "BUSINESS",
    sourceHeaderId,
    evaluateIndicId,
    adjustRecordId,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.EXPERT_ASSIGN_READ",
  };
  return http.get(url, { params });
};

// 获取评分要素的分配专家（变更前）
export const getBeforeEvaluateAssignsApi = (evaluateIndicAdjustId, sourceHeaderId, evaluateIndicId, adjustRecordId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-adjusts/assigns/before-query`;
  let params = {
    organizationId: storage.getItem("organizationId"),
    currentMode: "history",
    evaluateIndicCategory: "BUSINESS",
    sourceHeaderId,
    evaluateIndicId,
    adjustRecordId,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.EXPERT_ASSIGN_HIS",
  };
  return http.get(url, { params });
};

// 获取专家列表数据(变更后)
export const getAfterExpertListApi = (adjustRecordId, sourceHeaderAdjustId, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-expert-adjusts/after-query`;
  let params = {
    adjustRecordId,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.EXPERT_NONE_READ,SSRC.QUOTATION_CONTROLLER_DETAIL.EXPERT_DIFF_READ",
    expertStatus: "SUBMITTED",
    sourceFrom: "RFX",
    sourceHeaderAdjustId,
    sourceHeaderId,
  };
  return http.get(url, { params });
};

// 获取专家列表数据(变更前)
export const getBeforeExpertListApi = (adjustRecordId, sourceHeaderAdjustId, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-expert-adjusts/before-query`;
  let params = {
    adjustRecordId,
    customizeUnitCode: "SSRC.QUOTATION_CONTROLLER_DETAIL.EXPERT_NONE_HIS,SSRC.QUOTATION_CONTROLLER_DETAIL.EXPERT_DIFF_HIS",
    expertStatus: "SUBMITTED",
    sourceFrom: "RFX",
    sourceHeaderAdjustId,
    sourceHeaderId,
  };
  return http.get(url, { params });
};

