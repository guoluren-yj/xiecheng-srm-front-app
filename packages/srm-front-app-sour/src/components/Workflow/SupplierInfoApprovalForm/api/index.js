import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export const fetchSupplierBasicInfo = (params) => {
  const { key, ...others } = params;
  let interfaceName = "";
  let customizeUnitCode = "";
  let otherParams = {};
  switch (key) {
  case "basicInfo": // 基础信息
    interfaceName = "supplier-change-reqs/firm-detail";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.BASIC";
    otherParams = { newPageQuery: 1, partnerTenantId: null, isNewMenu: null, dataSource: null, changeType: null };
    break;
  case "comBasicReq": // 登记信息
    interfaceName = "firmchange-req-all/query-sup-basic";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.REGISTRATION_OVERSEAS,SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.REGISTRATION_PERSONAL";
    break;
  case "comBusinessReqDTO": // 业务信息
    interfaceName = "firmchange-req-all/query-sup-bussiness";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.BUSINESS";
    break;
  case "comContactsReqs": // 联系人信息
    interfaceName = "firmchange-req-all/query-sup-contacts";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.CONTACT";
    break;
  case "comAddressReqs": // 地址信息
    interfaceName = "firmchange-req-all/query-sup-address";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.ADDRESS";
    break;
  case "comBankAccReqs": // 银行信息
    interfaceName = "firmchange-req-all/query-sup-bank-acc";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.BANK";
    break;
  case "supInvoiceReq": // 开票信息
    interfaceName = "firmchange-req-all/query-sup-invoice";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.INVOICE";
    break;
  case "supAttachmentReqs": // 附件信息
    interfaceName = "firmchange-req-all/query-sup-attachment";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.ATTACHMENT";
    break;
  case "supChangeAbilityLn": // 供货能力清单
    interfaceName = "firmchange-req-all/query-sup-ability";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.SUPPLY_ABILITY";
    break;
  case "supChangeAbilityLnAtts": // 供货能力清单-附件信息
    interfaceName = "sup-change-ability-ln-atts/compare";
    break;
  case "supChangeCate": // 供应商分类
    interfaceName = "firmchange-req-all/query-sup-cate";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.SCLASSIFY";
    break;
  case "supChangeSync": // 采购/财务头
    interfaceName = "firmchange-req-all/query-sup-sync";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.PURCHASE_HEAD";
    break;
  case "supChangeSyncPf": // 采购/财务行
    interfaceName = "firmchange-req-all/query-sup-pf";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.PURCHASE_LINE";
    break;
  case "supChangeEbsAdds": // 地点层
    interfaceName = "firmchange-req-all/query-sup-site";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.LOCATION";
    break;
  case "ouMessage": // ou层
    interfaceName = "sup-change-compare/ou";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.OU";
    break;
  case "supChangeOther": // 其他信息
    interfaceName = "firmchange-req-all/query-sup-other";
    customizeUnitCode = "SSLM.SUPPLIER_INFORM_CHANGE_NEW_DETAIL.OTHERS";
    break;
    // 调查表页签
  case "sslmInvestgBasic": // 基础信息
    interfaceName = "enterprise-change/detail/investigate-basics";
    break;
  case "sslmInvestgBusiness": // 业务信息
    interfaceName = "enterprise-change/detail/investigate-business";
    break;
  case "sslmInvestgProservice": // 产品及服务
    interfaceName = "enterprise-change/detail/investigate-proservices";
    break;
  case "sslmInvestgSupplierCate": // 供应商分类
    interfaceName = "enterprise-change/detail/investigate-cate";
    break;
  case "sslmInvestgFin": // 近三年财务状况
    interfaceName = "enterprise-change/detail/investigate-finances";
    break;
  case "sslmInvestgFinBranch": // 分支机构
    interfaceName = "enterprise-change/detail/investigate-finances-branchs";
    break;
  case "sslmInvestgAuth": // 资质信息
    interfaceName = "enterprise-change/detail/investigate-authes";
    break;
  case "sslmInvestgContact": // 联系人信息
    interfaceName = "enterprise-change/detail/investigate-contacts";
    break;
  case "sslmInvestgAddress": // 地址信息
    interfaceName = "enterprise-change/detail/investigate-addresses";
    break;
  case "sslmInvestgBankAccount": // 开户行信息
    interfaceName = "enterprise-change/detail/investigate-bank-accounts";
    break;
  case "sslmInvestgCustomer": // 主要客户情况
    interfaceName = "enterprise-change/detail/investigate-customers";
    break;
  case "sslmInvestgSubSupplier": // 分供方情况
    interfaceName = "enterprise-change/detail/investigate-sub-suppliers";
    break;
  case "sslmInvestgEquipment": // 设备信息
    interfaceName = "enterprise-change/detail/investigate-equipments";
    break;
  case "sslmInvestgRd": // 研发能力
    interfaceName = "enterprise-change/detail/investigate-rds";
    break;
  case "sslmInvestgProduce": // 生产能力
    interfaceName = "enterprise-change/detail/investigate-produces";
    break;
  case "sslmInvestgQa": // 质保能力
    interfaceName = "enterprise-change/detail/investigate-qas";
    break;
  case "sslmInvestgCustservice": // 售后服务
    interfaceName = "enterprise-change/detail/investigate-custservices";
    break;
  case "sslmInvestgAttachment": // 附件信息
    interfaceName = "enterprise-change/detail/investigate-attachments";
    break;
  case "sslmInvestgReserve1": // 预留表格1
    interfaceName = "enterprise-change/detail/investigate-reserve1";
    break;
  case "sslmInvestgReserve2": // 预留表格2
    interfaceName = "enterprise-change/detail/investigate-reserve2";
    break;
  case "sslmInvestgReserve3": // 预留表单1
    interfaceName = "enterprise-change/detail/investigate-reserve3";
    break;
  case "sslmInvestgReserve4": // 预留表单2
    interfaceName = "enterprise-change/detail/investigate-reserve4";
    break;
  case "sslmInvestgReserve5": // 预留表格3
    interfaceName = "enterprise-change/detail/investigate-reserve5";
    break;
  case "sslmInvestgReserve6": // 预留表格4
    interfaceName = "enterprise-change/detail/investigate-reserve6";
    break;
  case "sslmInvestgReserve7": // 预留表格5
    interfaceName = "enterprise-change/detail/investigate-reserve7";
    break;
  case "sslmInvestgReserve8": // 预留表格6
    interfaceName = "enterprise-change/detail/investigate-reserve8";
    break;
  case "sslmInvestgReserve9": // 预留表格7
    interfaceName = "enterprise-change/detail/investigate-reserve9";
    break;
  case "sslmInvestgReserve10": // 预留表单3
    interfaceName = "enterprise-change/detail/investigate-reserve10";
    break;
  case "sslmInvestgReserve11": // 预留表单4
    interfaceName = "enterprise-change/detail/investigate-reserve11";
    break;
  case "sslmInvestgReserve12": // 预留表单5
    interfaceName = "enterprise-change/detail/investigate-reserve12";
    break;
  case "sslmInvestgReserve13": // 预留表单6
    interfaceName = "enterprise-change/detail/investigate-reserve13";
    break;
  case "sslmInvestgReserve14": // 预留表单7
    interfaceName = "enterprise-change/detail/investigate-reserve14";
    break;
  default:
    break;
  }
  return http.get(`sslm/v1/${storage.getItem("organizationId")}/${interfaceName}`, { params:{ ...others, customizeUnitCode, ...otherParams } });
};

// 查询调查表配置
export const fetchInvestigateConfig = (payload) => {
  const { investigateTemplateId, ...params } = payload || {};
  const url = `/sslm/v1/${storage.getItem("organizationId")}/investigate-confighs-preview/${investigateTemplateId}`;
  return http.get(url, { params });
};
