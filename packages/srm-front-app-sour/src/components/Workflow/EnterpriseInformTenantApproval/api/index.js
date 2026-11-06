import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export const fetchSupplierBasicInfo = (params) => {
  const { key, isAllPlatform = false, routerParams = {}, newFirmChangeInsertFlag, ...others } = params;
  const { partnerTenantId, companyId } = routerParams;
  let interfaceName = "";
  let customizeUnitCode = "";
  let otherParams = {};
  const platformTabParam = {
    partnerTenantId,
    companyId: isAllPlatform ? companyId : null,
    newFirmChangeInsertFlag:
      !isAllPlatform &&
      [ "comContactsReqs", "comAddressReqs", "comBankAccReqs", "financialInfo", "supAttachmentReqs" ].includes(key) ?
        // eslint-disable-next-line no-undefined
        newFirmChangeInsertFlag : undefined, // 对应变更采购方的重合页签需要这个参数
  };
  switch (key) {
  case "basicInfo": // 基础信息
    interfaceName = "enterprise-change/firm-confirm-detail";
    customizeUnitCode = isAllPlatform ?
      "" :
      "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.BASICS";
    otherParams = { newPageQuery: 1 };
    break;
  case "comBasicReq": // 登记信息
    interfaceName = isAllPlatform ?
      "com-basic-req/compare-company-basic" :
      "firmchange-req-all/query-sup-basic";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.OVERSEAS,SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.PERSONAL";
    break;
  case "comBusinessReqDTO": // 业务信息
    interfaceName = isAllPlatform ?
      "com-business-req/compare-company-business" :
      "firmchange-req-all/query-sup-bussiness";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.BUSINESS";
    break;
  case "comContactsReqs": // 联系人信息
    interfaceName = isAllPlatform ?
      "firm-change-compare/contacts-compare" :
      "firmchange-req-all/query-sup-contacts";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.CONTACT";
    break;
  case "comAddressReqs": // 地址信息
    interfaceName = isAllPlatform ?
      "firm-change-compare/address-compare" :
      "firmchange-req-all/query-sup-address";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.ADDRESS";
    break;
  case "comBankAccReqs": // 银行信息
    interfaceName = isAllPlatform ?
      "firm-change-compare/bank-acc-compare" :
      "firmchange-req-all/query-sup-bank-acc";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.BANK";
    break;
  case "supInvoiceReq": // 开票信息
    interfaceName = isAllPlatform ?
      "com-invoice-reqs/compare" :
      "firmchange-req-all/query-sup-invoice";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.INVOICE";
    break;
  case "financialInfo": // 财务信息
    interfaceName = isAllPlatform ?
      "firm-change-compare/finace-compare" :
      "firmchange-req-all/query-sup-finance";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.FINANCIAL";
    break;
  case "supAttachmentReqs": // 附件信息
    interfaceName = isAllPlatform ?
      "firm-change-compare/attachment-compare" :
      "firmchange-req-all/query-sup-attachment";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.ATTA_INFO";
    break;
  case "supChangeCate": // 供应商分类
    interfaceName = "firmchange-req-all/query-sup-cate";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.CLASSIFY";
    break;
  case "supChangeOther": // 其他信息
    interfaceName = "firmchange-req-all/query-sup-other";
    otherParams = { ...platformTabParam };
    customizeUnitCode = isAllPlatform ? "" : "SSLM.ENTERPRISE_TENANT_APPROVAL_DETAIL.WF.OTHER";
    break;
    // 调查表页签
  case "sslmInvestgBasic": // 基础信息
    interfaceName = "enterprise-change/detail/investigate-basics";
    // otherParams = { tenantId: currentOrganizationId, };
    break;
  case "sslmInvestgBusiness": // 业务信息
    interfaceName = "enterprise-change/detail/investigate-business";
    break;
  case "sslmInvestgProservice": // 产品及服务
    interfaceName = "firmchange-req-all/query-firm-proservices";
    break;
  case "sslmInvestgFin": // 近三年财务状况
    interfaceName = "firmchange-req-all/query-firm-finances";
    break;
  case "sslmInvestgFinBranch": // 分支机构
    interfaceName = "firmchange-req-all/query-firm-finances-branchs";
    break;
  case "sslmInvestgAuth": // 资质信息
    interfaceName = "firmchange-req-all/query-firm-authes";
    break;
  case "sslmInvestgContact": // 联系人信息
    interfaceName = "firmchange-req-all/query-firm-contacts";
    break;
  case "sslmInvestgAddress": // 地址信息
    interfaceName = "firmchange-req-all/query-firm-address";
    break;
  case "sslmInvestgBankAccount": // 开户行信息
    interfaceName = "firmchange-req-all/query-firm-bank-acc";
    break;
  case "sslmInvestgCustomer": // 主要客户情况
    interfaceName = "firmchange-req-all/query-firm-customers";
    break;
  case "sslmInvestgSubSupplier": // 分供方情况
    interfaceName = "firmchange-req-all/query-firm-sub-suppliers";
    break;
  case "sslmInvestgEquipment": // 设备信息
    interfaceName = "firmchange-req-all/query-firm-equipments";
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
    interfaceName = "firmchange-req-all/query-firm-attachment";
    break;
  case "sslmInvestgReserve1": // 预留表格1
    interfaceName = "firmchange-req-all/query-firm-reserve1";
    break;
  case "sslmInvestgReserve2": // 预留表格2
    interfaceName = "firmchange-req-all/query-firm-reserve2";
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
  const serviceId = isAllPlatform ? "spfm" : "sslm";
  return http.get(`${serviceId}/v1/${storage.getItem("organizationId")}/${interfaceName}`, { params: { ...others, customizeUnitCode, ...otherParams } });
};

// 查询调查表配置
export const fetchInvestigateConfig = (payload) => {
  const { changeReqId, ...params } = payload || {};
  const url = `/sslm/v1/${storage.getItem("organizationId")}/firm-change-investigate-confighs/${changeReqId}`;
  return http.get(url, { params });
};

// 查询产品及服务附件
export const fetchProserviceFiles = (payload) => {
  const { investgProserviceId, ...params } = payload || {};
  const url = `/sslm/v1/${storage.getItem("organizationId")}/firm-change-proservice-atts/${investgProserviceId}`;
  return http.get(url, { params });
};