import { http } from "srm-mobile-ui";

const storage = window.localStorage;

//采购申请查询接口
export const getPurchaseApi = (params) => http.get(`/sprm/v1/${storage.getItem("organizationId")}/purchase-request/purchase-platform/execution-status-tracking-tiled/page`, { params });

//采购订单查询接口
export const getPoPurchaserApi = (params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/po-location/purchaser`, { params });

//寻源工作台查询接口
export const getRfxApi = (params) => http.get(`/ssrc/v2/${storage.getItem("organizationId")}/rfx/list/all`, { params });

//协议阶段详情接口
export const getAgreementPhaseApi = (pcHeaderId, params) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/stage/page`;
  return http.get(url, { params });
};

//伙伴信息接口
export const getAgreementPartnerApi = (pcHeaderId, params) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/pc-partner/list`;
  return http.get(url, { params });
};

//采购协议业务条款
export const getAgreementProcurementApi = (pcHeaderId, params) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/pc-term/page`;
  return http.get(url, { params });
};

// 获取协议附件明细
export const getAgreementAttApi = (pcHeaderId) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/pc-attachment/list`;
  return http.get(url);
};

//协议标的详情接口
export const getAgreementApi = (pcHeaderId) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/pc-subject/page?customizeUnitCode=SPCM.PURCHASE_CONTRACT_MAINTAIN.SUBJECT&page=0&size=1000`;
  return http.get(url);
};

//协议审批详情接口
export const getAgreementDetailApi = (pcHeaderId) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}?customizeUnitCode=SPCM.PURCHASE_CONTRACT_MAINTAIN.DETAIL`;
  return http.get(url);
};

/* *
 * 获取合同审批记录
 * @param {string} pcHeaderId 协议id
 * @returns
 */
export const getContractApprovalApi = (pcHeaderId) => {
  let url = `/spcm/v1/${storage.getItem("organizationId")}/pc-approval-records/workbench`;
  let params = {
    page: 0,
    size: 1000,
    pcHeaderId,
  };
  return http.get(url, { params });
};