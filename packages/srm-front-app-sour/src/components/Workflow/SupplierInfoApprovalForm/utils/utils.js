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
export const renderUpdateTag = (record = {}) => {
  const deleteFlag = [ "DELETE" ].includes(record.objectFlag) ||
    [ "DELETE" ].includes(record.firmChangeBeanStateFlag) ||
    [ "delete" ].includes(record.supChangeBeanStateFlag);
  const createFlag = [ "CREATE" ].includes(record.objectFlag) ||
    [ "insert", "CREATE" ].includes(record.firmChangeBeanStateFlag) ||
    [ "insert" ].includes(record.supChangeBeanStateFlag);
  const updateFlag = [ "UPDATE" ].includes(record.objectFlag) ||
    [ "update", "UPDATE" ].includes(record.firmChangeBeanStateFlag) ||
    [ "update", "UPDATE" ].includes(record.supChangeBeanStateFlag);
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

export const getTabItemList = (investigateConfigHeaders) => {
  const configNameList = investigateConfigHeaders.map((header) => header.configName);
  const investigateList = investigateConfigHeaders.map((header) => ({
    key:header.configName,
    label:header.configDescription,
    type:investigateForm.includes(header.configName) ? "FORM" : "LIST",
    newKey: header.configName === "sslmInvestgSupplierCate" ? "newFirmChangeCates" : `new${header.configName}`,
    oldKey:header.configName === "sslmInvestgSupplierCate" ? "oldFirmChangeCates" : `old${header.configName}`,
  }));
  return [
    {
      key:"basicInfo",
      type:"FORM",
      newKey: "newHeader",
      oldKey:"oldHeader",
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.BASIC_INFO",
      label: $T("sslm.supplierInform.view.title.baseInfo").$D("申请单基础信息"),
    },
    {
      key:"comBasicReq",
      type:"FORM",
      newKey: "newBasic",
      oldKey:"oldBasic",
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.REGISTER",
      label: $T("sslm.supplierDetail.view.fixCatalog.registInform").$D("登记信息"),
    },
    {
      key:"comBusinessReqDTO",
      type:"FORM",
      newKey: "newBusiness",
      oldKey:"oldBusiness",
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.BUSINESS",
      label: $T("sslm.supplierDetail.view.fixCatalog.businessInform").$D("业务信息"),
    },
    {
      key:"comContactsReqs",
      type:"LIST",
      newKey: "newContacts",
      oldKey:"oldContacts",
      hidden:configNameList.includes("sslmInvestgContact"),
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.CONTACT",
      label: $T("sslm.supplierDetail.view.fixCatalog.contactInform").$D("联系人信息"),
    },
    {
      key:"comAddressReqs",
      type:"LIST",
      newKey: "newAddresses",
      oldKey:"oldAddresses",
      hidden: configNameList.includes("sslmInvestgAddress"),
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.ADDRESS",
      label: $T("sslm.supplierDetail.view.fixCatalog.addressInform").$D("地址信息"),
    },
    {
      key:"comBankAccReqs",
      type:"LIST",
      newKey: "newBankAccounts",
      oldKey:"oldBankAccounts",
      hidden: configNameList.includes("sslmInvestgBankAccount"),
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.BANK",
      label: $T("sslm.supplierDetail.view.fixCatalog.bankInform").$D("银行信息"),
    },
    {
      key:"supInvoiceReq",
      type:"FORM",
      newKey: "newInvoice",
      oldKey:"oldInvoice",
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.INVOICE",
      label: $T("sslm.supplierDetail.view.fixCatalog.invoiceInform").$D("开票信息"),
    },
    {
      key:"supAttachmentReqs",
      type:"LIST",
      newKey: "newAttachments",
      oldKey:"oldAttachments",
      hidden: configNameList.includes("sslmInvestgAttachment"),
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.ATTACHMENT",
      label: $T("sslm.enterpriseInform.view.fixCatalog.attachmentInform").$D("附件信息"),
    },
    {
      key:"supChangeAbilityLn",
      type:"LIST",
      newKey: "newCapacitys",
      oldKey:"oldCapacitys",
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.SUPPLY_ABILITY",
      label: $T("sslm.supplierDetail.view.fixCatalog.supplyCapacityList").$D("供货能力清单"),
    },
    {
      key:"supChangeCate",
      type:"LIST",
      newKey: "newClassify",
      oldKey:"oldClassify",
      hidden: configNameList.includes("sslmInvestgSupplierCate"),
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.CLASSIFY",
      label: $T("sslm.supplierInform.view.fixCatalog.supplierClassify").$D("供应商分类"),
    },
    {
      key:"purchaseInfo",
      label: $T("sslm.supplierInform.view.fixCatalog.purchaseInform").$D("采购/财务信息"),
      code:"",
      type:"COMBIN",
      combinList:[
        {
          key:"supChangeSync",
          type:"FORM",
          newKey: "newPurchaseHeader",
          oldKey:"oldPurchaseHeader",
          code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.PURCHASE_HEAD",
          label: $T("sslm.supplierInform.view.fixCatalog.purchaseHeaderInform").$D("采购/财务头信息"),
        },
        {
          key:"supChangeSyncPf",
          type:"LIST",
          newKey: "newPurchaseLine",
          oldKey:"oldPurchaseLine",
          code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.PURCHASE_LINE",
          label: $T("sslm.supplierInform.view.fixCatalog.purchaseLineInform").$D("采购/财务行信息"),
        }
      ]
    },
    {
      key:"supChangeEbsAdds",
      type:"LIST",
      newKey: "newEbsAdds",
      oldKey:"oldEbsAdds",
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.LOCATION",
      label: $T("sslm.supplierInform.view.fixCatalog.locationInform").$D("地点层信息"),
    },
    {
      key:"supChangeOther",
      type:"FORM",
      newKey: "newOthers",
      oldKey:"oldOthers",
      code:"SMBL.WORKFLOW.SUPPLIER_INFO_CHANGE_NEW.OTHERS",
      label: $T("sslm.supplierInform.view.fixCatalog.otherInform").$D("其他信息"),
    },
    ...investigateList,
  ].filter((n) => !n.hidden);
};
