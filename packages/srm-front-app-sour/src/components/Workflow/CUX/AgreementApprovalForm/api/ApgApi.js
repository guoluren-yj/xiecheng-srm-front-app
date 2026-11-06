import { http } from "srm-mobile-ui";

const storage = window.localStorage;

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

// 获取分发部门信息
export const getDistributionDepartmentInfo = (params) => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/ui-customize/translateLov?lovViewCode=SPCM.DISTRIBUTION`;
  return http.post(url, params);
};

// 获取审批记录
export const getApprovalRecordsApi = (pcHeaderId) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/pc-approval-records`;
  let params = {
    pcHeaderId,
    page: 0,
    size: 1000,
  };
  return http.get(url, { params });
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

// 获取协议附件明细
export const getAgreementAttApi = (pcHeaderId) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/pc-attachment/list`;
  return http.get(url);
};
