/**
 * 企业信息变更审批接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 批量审批通过
export const batchApprovedApi = (params) => {
  const customizeUnitCode = "SSLM.ENTERPRISE_INFORM_CONFIRM.LIST";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/confirm?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

// 审批通过（详情页）
export const approvedApi = (params) => {
  const customizeUnitCode = "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.HEADER,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.BANK_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.INVOICE_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.OTHER_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.CONTACT_INFOMATION,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.ADDRESS_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.ATT_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.FINANCIAL_INFO";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/confirm?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

// 批量审批拒绝
export const batchRejectApi = (params) => {
  const customizeUnitCode = "SSLM.ENTERPRISE_INFORM_CONFIRM.LIST";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/reject?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

// 审批拒绝（详情页）
export const rejectApi = (params) => {
  const customizeUnitCode = "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.HEADER,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.BANK_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.INVOICE_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.OTHER_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.CONTACT_INFOMATION,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.ADDRESS_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.ATT_INFO,SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.FINANCIAL_INFO";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/reject?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

// 批量确定
export const batchOkApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/tenant-confirm-platform-req`;
  return http.post(url, params);
};

// 基础信息查询接口
export const getBasisInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/firm-detail`;
  return http.get(url, { params });
};

/**
 * @description: 各tab页变更前后信息相关接口
 */

/**
 * 租户级查询接口
 */
// 登记信息（租户级）
export const getTenantBasicInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-basic-req/compare-supplier-basic`;
  return http.get(url, { params });
};

// 注册业务信息（租户级）
export const getTenantBusinessInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-business-req/compare-supplier-business`;
  return http.get(url, { params });
};

// 联系人信息（租户级）
export const getTenantContactInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-contacts-reqs/compare`;
  return http.get(url, { params });
};

// 地址信息（租户级）
export const getTenantAddressInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-address-reqs/compare`;
  return http.get(url, { params });
};

// 银行信息（租户级）
export const getTenantBankInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-bank-acc-reqs/compare`;
  return http.get(url, { params });
};

// 开票信息（租户级）
export const getTenantInvoiceInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-invoice-reqs/compare`;
  return http.get(url, { params });
};

// 财务信息（租户级）
export const getTenantFinanceInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-finance-reqs/compare`;
  return http.get(url, { params });
};

// 附件信息（租户级）
export const getTenantAttachmentInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-attachment-reqs/compare`;
  return http.get(url, { params });
};

// 供应商分类信息（租户级）
export const getTenantSupClassInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/detail/investigate-cate`;
  return http.get(url, { params });
};

// 其他信息（租户级）
export const getTenantOtherInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-others/firm-change/compare`;
  return http.get(url, { params });
};

// 获取调查表配置
export const getInvestigateConfig = (parameters = {}) => {
  const { changeReqId, partnerTenantId } = parameters;
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/firm-change-investigate-confighs/${changeReqId}`, {
    params: {
      partnerTenantId,
    }
  });
};

// 获取对应tab页调查表详情信息
export const getInvestigateInfoApi = (url, parameters = {}) => {
  const { changeReqId, partnerTenantId } = parameters;
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/detail/investigate-${url}`, {
    params: {
      changeReqId,
      partnerTenantId,
    }
  });
};

/**
 * 平台级查询接口
 */
// 登记信息（平台级）
export const getPlatformBasicInfoApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/com-basic-req/compare-company-basic`;
  return http.get(url, { params });
};

// 注册业务信息（平台级）
export const getPlatformBusinessInfoApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/com-business-req/compare-company-business`;
  return http.get(url, { params });
};

// 开票信息信息（平台级）
export const getPlatformInvoiceInfoApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/com-invoice-reqs/compare`;
  return http.get(url, { params });
};

// 联系人信息（平台级）
export const getPlatformContactInfoApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/com-contacts-reqs/compare`;
  return http.get(url, { params });
};

// 银行信息（平台级）
export const getPlatformBankInfoApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/com-bank-acc-reqs/compare`;
  return http.get(url, { params });
};

// 地址信息（平台级）
export const getPlatformAddressInfoApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/com-address-reqs/compare`;
  return http.get(url, { params });
};

// 财务状况（平台级）
export const getPlatformFinanceInfoApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/com-finance-reqs`;
  return http.get(url, { params });
};

// 附件信息（平台级）
export const getPlatformAttachmentInfoApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/com-attachment-reqs/compare`;
  return http.get(url, { params });
};