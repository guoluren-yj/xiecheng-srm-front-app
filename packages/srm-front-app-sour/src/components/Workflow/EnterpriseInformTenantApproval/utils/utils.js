/*
 * @Date: 2024-03-07 17:29:34
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { investigateForm } from "./investigate";

// 获取tag文本
const getTagText = (type = "") => {
  const map = {
    create: {
      text: $T("sslm.common.conent.create").$D("新增"),
      style: {
        color: "#05944F",
        backgroundColor: "#E6F2ED",
      }
    },
    update: {
      text: $T("sslm.common.conent.change").$D("变更"),
      style: {
        color: "#FC8800",
        backgroundColor: "rgb(252, 136, 0, 0.15)",
      },
    },
    delete: {
      text: $T("sslm.common.conent.delete").$D("删除"),
      style: {
        color: "#757575",
        backgroundColor: "#F0F2F5",
      },
    },
  };
  return map[type] || {};
};

// 标红标识
export const getRedFlag = ({ name, record }) => {
  let flag =
      [ "CREATE", "DELETE" ].includes(record.objectFlag) ||
      [ "insert", "CREATE", "DELETE" ].includes(record.firmChangeBeanStateFlag) ||
      record[`${name}Flag`] === "UPDATE" ||
      [ "insert", "delete" ].includes(record.supChangeBeanStateFlag) ||
      [ "update", "insert", "delete", "UPDATE", "DELETE", "INSERT" ].includes(
        record[`${name}StateFlag`]
      );
  return flag;
};

// 标红渲染
export const renderRedNode = ({ name, record, code }) => {
  if (record) {
    const redFlag = getRedFlag({ name, record });
    return <span style={{ color: redFlag && "red" }}>
      {record[code] || record[name] || "-"}
    </span>;
  }
  return "-";
};

// 获取变更的Tag
export const renderUpdateTag = (record = {}, configName = "") => {
  let updateFlag = [ "UPDATE" ].includes(record.objectFlag) ||
    [ "update", "UPDATE" ].includes(record.firmChangeBeanStateFlag) ||
    [ "update", "UPDATE" ].includes(record.supChangeBeanStateFlag);
  if (configName && investigateForm.includes(configName)) {
    updateFlag = Number(record.changeFlag) === 1;
  }
  const deleteFlag = [ "DELETE" ].includes(record.objectFlag) ||
    [ "DELETE" ].includes(record.firmChangeBeanStateFlag) ||
    [ "delete" ].includes(record.supChangeBeanStateFlag);
  const createFlag = [ "CREATE" ].includes(record.objectFlag) ||
    [ "insert", "CREATE" ].includes(record.firmChangeBeanStateFlag) ||
    [ "insert" ].includes(record.supChangeBeanStateFlag);
  // const updateFlag = [ "UPDATE" ].includes(record.objectFlag) ||
  //   [ "update", "UPDATE" ].includes(record.firmChangeBeanStateFlag) ||
  //   [ "update", "UPDATE" ].includes(record.supChangeBeanStateFlag);
  const type = createFlag ? "create" :
    deleteFlag ? "delete" :
      updateFlag ? "update" : "";
  const tagObj = getTagText(type);
  const { text, style = {} } = tagObj;
  if (!text) {
    return null;
  }
  return <SrmTag
    style={{ ...style }}
  >
    {text}
  </SrmTag>;
};

// 主要身份集合
export const businessTypeList = () => ({
  purchase: $T("sslm.enterpriseInform.view.message.purchase").$D("我要采购"),
  sale: $T("sslm.enterpriseInform.view.message.sale").$D("我要销售"),
});

// 经营性质集合
export const serviceTypeList = () => ({
  manufacturer: $T("sslm.common.model.business.manufacturer").$D("制造商"),
  trader: $T("sslm.common.model.business.trader").$D("贸易商"),
  servicer: $T("sslm.common.model.business.servicer").$D("服务商"),
  agent: $T("sslm.common.model.business.agent").$D("代理商"),
  integration: $T("sslm.common.model.business.integration").$D("集成商"),
  contractor: $T("sslm.common.model.business.contractor").$D("承包商"),
  dealer: $T("sslm.common.model.business.dealer").$D("经销商"),
});

// 调查表重合页签
export const INVESTG_CONFIG_NAME = {
  sslmInvestgContact: "contactInfo",
  sslmInvestgAddress: "addressInfo",
  sslmInvestgBankAccount: "bankInfo",
  sslmInvestgAttachment: "attachmentInfo",
  sslmInvestgFin: "financeInfo",
};

export const getTabItemList = (investigateConfigHeaders = [], isAllPlatform = false) => {
  const configNameList = investigateConfigHeaders.map((header) => header.configName);
  const investigateList = investigateConfigHeaders.map((header) => ({
    key:header.configName,
    label:header.configDescription,
    type:investigateForm.includes(header.configName) ? "FORM" : "LIST",
    tabSource: "investigate",
    changeKey: INVESTG_CONFIG_NAME[header.configName] || header.configName, // 是否变更key
  }));
  return [
    {
      key:"basicInfo",
      type:"FORM",
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.HEADER",
      label: $T("sslm.supplierInform.view.title.baseInfo").$D("申请单基础信息"),
    },
    {
      key:"comBasicReq",
      type:"FORM",
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.REGISTRATION",
      label: $T("sslm.supplierDetail.view.fixCatalog.registInform").$D("登记信息"),
      changeKey: "basicInfo", // 是否变更key
      platformDataKey: "newBasic", // 平台确认数据key
    },
    {
      key:"comBusinessReqDTO",
      type:"FORM",
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.BUSINESS",
      label: $T("sslm.supplierDetail.view.fixCatalog.businessInform").$D("业务信息"),
      changeKey: "businessInfo", // 是否变更key
      platformDataKey: "newBusiness", // 平台确认数据key
    },
    {
      key:"comContactsReqs",
      type:"LIST",
      hidden:configNameList.includes("sslmInvestgContact"),
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.CONTACT",
      label: $T("sslm.supplierDetail.view.fixCatalog.contactInform").$D("联系人信息"),
      changeKey: "contactInfo", // 是否变更key
    },
    {
      key:"comAddressReqs",
      type:"LIST",
      hidden: configNameList.includes("sslmInvestgAddress"),
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.ADDRESS",
      label: $T("sslm.supplierDetail.view.fixCatalog.addressInform").$D("地址信息"),
      changeKey: "addressInfo", // 是否变更key
    },
    {
      key:"comBankAccReqs",
      type:"LIST",
      hidden: configNameList.includes("sslmInvestgBankAccount"),
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.BANK",
      label: $T("sslm.supplierDetail.view.fixCatalog.bankInform").$D("银行信息"),
      changeKey: "bankInfo", // 是否变更key
    },
    {
      key:"supInvoiceReq",
      type:"FORM",
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.INVOICE",
      label: $T("sslm.supplierDetail.view.fixCatalog.invoiceInform").$D("开票信息"),
      changeKey: "invoiceInfo", // 是否变更key
      platformDataKey: "newInvoice", // 平台确认数据key
    },
    {
      key:"financialInfo",
      type:"LIST",
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.FINANCIAL",
      label: $T("sslm.enterpriseInform.view.model.financialStatus.title").$D("财务状况"),
      hidden: configNameList.includes("sslmInvestgFin"),
      changeKey: "financeInfo", // 是否变更key
    },
    {
      key:"supAttachmentReqs",
      type:"LIST",
      hidden: configNameList.includes("sslmInvestgAttachment"),
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.ATTA_INFO",
      label: $T("sslm.enterpriseInform.view.fixCatalog.attachmentInform").$D("附件信息"),
      changeKey: "attachmentInfo", // 是否变更key
    },
    {
      key:"supChangeCate",
      type:"LIST",
      // 平台级隐藏
      hidden: isAllPlatform,
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.CLASSIFY",
      label: $T("sslm.supplierInform.view.fixCatalog.supplierClassify").$D("供应商分类"),
      changeKey: "changeCate", // 是否变更key
    },
    {
      key:"supChangeOther",
      type:"FORM",
      // 平台级隐藏
      hidden: isAllPlatform,
      code:"SMBL.WORKFLOW.ENTERPRISE_TENANT_APPROVAL.OTHER",
      label: $T("sslm.supplierInform.view.fixCatalog.otherInform").$D("其他信息"),
      changeKey: "changeOtherInfo", // 是否变更key
    },
    ...investigateList,
  ].filter((n) => !n.hidden).map((i) => {
    const { code, ...others } = i;
    return {
      ...others,
      code: isAllPlatform ? "" : code,
    };
  });
};
