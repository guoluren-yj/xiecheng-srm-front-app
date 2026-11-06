
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 供应商信息变更接口
// 供应商申请头信息
export const getHeadInfoApi = (changeReqId, params) => {
  if (!params) {
    // eslint-disable-next-line no-param-reassign
    params = {
      flexRuleCode: "SSLM.SUPPLIER_INFO_CHANGE",
      tenantId: storage.getItem("tenantId")
    };
  }
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/supplier-change-reqs/firm-detail?changeReqId=${changeReqId}`, { params });
};

// 获取供货能力清单
export const getSupplyCapacityListApi = (changeReqId) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/ability?changeReqId=${changeReqId}`);

// 获取地点层信息
export const getAddressInfoApi = (changeReqId) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/address?changeReqId=${changeReqId}`);

// // 获取其他信息 // 变更前后
// export const  getOtherInfoApi = (changeReqId) => {
//   const tenantId = storage.getItem("tenantId");
//   return http.get(`/sslm/v1/${storage.getItem('organizationId')}/hyta-sup-change-compare/others?changeReqId=${changeReqId}&tenantId=${tenantId}`)
// }

// 获取其他信息
export const getOtherInfoApi = (changeReqId) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/sup-change-others/getSupChangeOther?changeReqId=${changeReqId}&customizeUnitCode=SSLM.SUPPLIER_INFORM_CHANGE_DETAIL.OTHER_INFO_FORM`);
// 获取OU层信息
export const getOuInfoApi = (supChangeAddId) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/sup-change-ebs-ous?page=0&size=10&supChangeAddId=${supChangeAddId}`);

// 审批操作接口
export const getOperatorTypeApi = (taskId) => http.get(`/hwfp/v1/${storage.getItem("organizationId")}/activiti/task/${taskId}`);

// 操作接口
export const getOperatorApi = (taskId, params) => http.get(`/hwfp/v1/${storage.getItem("organizationId")}/runtime/tasks/${taskId}`, params);
// 登记信息
// export const  getSupplierRegisterInfoApi = (params) => {
//   return http.get(`/spfm/v1/${storage.getItem('organizationId')}/com-basic-req/compare-company-basic`,{params})
// }
export const getSupplierRegisterInfoApi = (id, params) => http.get(`/spfm/v1/${storage.getItem("organizationId")}/com-basic-req/after/${id}`, { params });
// 业务信息
// export const  getSupplierBusinessInfoApi = (params) => {
//   return http.get(`/spfm/v1/${storage.getItem('organizationId')}/com-business-req/compare-company-business`,{params})
// }
export const getSupplierBusinessInfoApi = (id, params) => http.get(`/spfm/v1/${storage.getItem("organizationId")}/com-business-req/after/${id}`, { params });
// 获取联系人信息
export const getContactListApi = (params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/detail/investigate-contacts/compare`, { params });
// 获取地址信息
export const getAddressListApi = (params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/detail/investigate-addresses/compare`, { params });
// 获取银行账户信息
export const getBankAccountListApi = (params) =>
  http.get(`/sslm/v1/${storage.getItem("organizationId")}/firm-change-bk-accounts/firm-change-bk-account`, { params });
  // return http.get(`/sslm/v1/${storage.getItem('organizationId')}/enterprise-change/detail/investigate-bank-accounts/compare`,{params})

// 获取开票信息
export const getBillingInfoListApi = (params) => http.get(`/spfm/v1/${storage.getItem("organizationId")}/com-invoice-reqs/compare`, { params });
// 获取供应商分类信息
export const getSupplierSupplierClassApi = (params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/category`, { params });

// 验收单审批接口

// 获取审批页面信息
export const getReceiptApprovalApi = (taskId) => http.get(`/hwfp/v1/${storage.getItem("organizationId")}/activiti/task/${taskId}`);
// 获取头信息
export const getReceiptOrderHeadInfoApi = (acceptListHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/ac-header/${acceptListHeaderId}`;
  return http.get(url);
};
// 获取验收单明细行信息
export const getReceiptOrderLineInfoApi = (acceptListHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/ac-line/${acceptListHeaderId}/lines`;
  return http.get(url);
};
// 获取操作记录
export const gettReceiptOperationRecordsApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/accept-list-actions`;
  return http.get(url, { params });
};

// 协议审批接口
//协议审批详情接口
export const getAgreementDetailApi = (pcHeaderId, params) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}`;
  return http.get(url, { params });
};

//协议标的详情接口
export const getAgreementApi = (pcHeaderId, params) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/pc-subject/page`;
  return http.get(url, { params });
};

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

// 需求审批
// 获取头信息
export const getDemandOrderHeadInfoApi = (acceptListHeaderId, params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/purchase-request/${acceptListHeaderId}?customizeUnitCode=SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.HEADER&workFlowFlag=1`;
  if (params) {
    return http.get(url, { params });
  }
  return http.get(url);
};
// 获取行信息
export const getDemandOrderLineInfoApi = (acceptListHeaderId, params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/purchase-requests/${acceptListHeaderId}/lines?customizeUnitCode=SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.SRM_LINE&workFlowFlag=1`;
  if (params) {
    return http.get(url, { params });
  }
  return http.get(url);
};

// 获取门店信息
export const getStoreInfo = (params) => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/ui-customize/translateLov?lovViewCode=SCUX.GPP.HPFM.STORE`;
  return http.post(url, params);
};

// 获取协议附件明细
export const getAgreementAttApi = (pcHeaderId) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/pc-attachment/list`;
  return http.get(url);
};
