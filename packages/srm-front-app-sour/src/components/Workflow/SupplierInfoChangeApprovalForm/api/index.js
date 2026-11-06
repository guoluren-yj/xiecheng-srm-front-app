import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// 获取供应商基本信息
const getSupplyBasicInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-change-reqs/firm-detail`;

  return http.get(url, { params });
};
//获取供应登记信息
const getSupplyRegisterInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-basic-req/compare-supplier-basic`;

  return http.get(url, { params });
};
//获取业务信息
const getBusinessInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-business-req/compare-supplier-business`;

  return http.get(url, { params });
};
//获取联系人列表
const getContactInfoListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-contacts-reqs/compare`;

  return http.get(url, { params });
};

//获取联系人列表（修改后）
const getContactInfoListApiB = (changeReqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/detail/investigate-contacts/compare?dataSource=2&changeReqId=${changeReqId}`;

  return http.get(url);
};

//获取地址信息列表
const getAddressInfoListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-address-reqs/compare`;

  return http.get(url, { params });
};
//获取银行信息列表
const getBankInfoListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-bank-acc-reqs/compare`;

  return http.get(url, { params });
};
//获取开票信息
const getInvoiceInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-invoice-reqs/compare`;

  return http.get(url, { params });
};
//获取附件信息
const getAttachmentInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-attachment-reqs/compare`;

  return http.get(url, { params });
};
//获取供货能力清单
const getSupplyAbilityInfoApi = (changeReqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/ability?changeReqId=${changeReqId}`;

  return http.get(url);
};
//获取供应商分类
const getSupplyCategoryInfoApi = (changeReqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/category?changeReqId=${changeReqId}`;

  return http.get(url);
};
//获取采购/财务信息
const getPurchaseFinanceInfoApi = (changeReqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/sync?changeReqId=${changeReqId}`;

  return http.get(url);
};
//获取采购/财务行信息
const getPurchaseFinanceLineInfoApi = (changeReqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/pf?changeReqId=${changeReqId}`;

  return http.get(url);
};
//获取地点层信息
const getSiteLayerInfoApi = (changeReqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/address?changeReqId=${changeReqId}`;

  return http.get(url);
};
//获取供应商其他信息
const getOtherInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-others/getSupChangeOther`;

  return http.get(url, { params });
};
//获取OU层信息
const getOuLayerInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-compare/ou`;

  return http.get(url, { params });
};
//获取供货清单附件信息
const getSupplyAbilityAttachmentInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-ability-ln-atts/compare`;

  return http.get(url, { params });
};
/**
 * 查询调查表配置
 * @async
 * @param {Object} payload - 查询参数
 */
//获取供货清单附件信息
const queryInvestigateConfigApi = (payload) => {
  const { changeReqId, ...params } = payload || {};
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-change-investigate-config/${changeReqId}`;
  return http.get(url, { params });
};

/**
 *
 *查询调查表数据
 * @export
 * @param {*} params
 * @returns
 */
const queryInvestigateApi = (params) => {
  const { configName, ...others } = params;
  let interfaceName = "";
  switch (configName) {
  // 基础信息
  case "sslmInvestgBasic":
    interfaceName = "basics/compare";
    break;
    // 业务信息
  case "sslmInvestgBusiness":
    interfaceName = "business/compare";
    break;
    // 产品及服务
  case "sslmInvestgProservice":
    interfaceName = "proservices/compare";
    break;
    // 近三年财务状况
  case "sslmInvestgFin":
    interfaceName = "finances/compare";
    break;
    // 分支机构
  case "sslmInvestgFinBranch":
    interfaceName = "finances-branchs/compare";
    break;
    // 资质信息
  case "sslmInvestgAuth":
    interfaceName = "authes/compare";
    break;
    // 联系人信息
  case "sslmInvestgContact":
    interfaceName = "contacts/compare";
    break;
    // 地址信息
  case "sslmInvestgAddress":
    interfaceName = "addresses/compare";
    break;
    // 开户行信息
  case "sslmInvestgBankAccount":
    interfaceName = "bank-accounts/compare";
    break;
    // 主要客户情况
  case "sslmInvestgCustomer":
    interfaceName = "customers/compare";
    break;
    // 分供方情况
  case "sslmInvestgSubSupplier":
    interfaceName = "sub-suppliers/compare";
    break;
    // 设备信息
  case "sslmInvestgEquipment":
    interfaceName = "equipments/compare";
    break;
    // 研发能力
  case "sslmInvestgRd":
    interfaceName = "rds/compare";
    break;
    // 生产能力
  case "sslmInvestgProduce":
    interfaceName = "produces/compare";
    break;
    // 质保能力
  case "sslmInvestgQa":
    interfaceName = "qas/compare";
    break;
    // 售后服务
  case "sslmInvestgCustservice":
    interfaceName = "custservices/compare";
    break;
    // 附件信息
  case "sslmInvestgAttachment":
    return http.get(`/sslm/v1/${storage.getItem("organizationId")}/firm-change-attachments/compare`, { params: others });
  default:
    break;
  }
  const url = `/sslm/v1/${storage.getItem("organizationId")}/enterprise-change/detail/investigate-${interfaceName}`;
  return http.get(url, { params: others });
};

export {
  getSupplyBasicInfoApi,
  getSupplyRegisterInfoApi,
  getBusinessInfoApi,
  getContactInfoListApi,
  getContactInfoListApiB,
  getAddressInfoListApi,
  getBankInfoListApi,
  getInvoiceInfoApi,
  getAttachmentInfoApi,
  getSupplyAbilityInfoApi,
  getSupplyCategoryInfoApi,
  getOtherInfoApi,
  getPurchaseFinanceInfoApi,
  getPurchaseFinanceLineInfoApi,
  getSiteLayerInfoApi,
  getOuLayerInfoApi,
  getSupplyAbilityAttachmentInfoApi,
  queryInvestigateConfigApi,
  queryInvestigateApi,
};
