import { $T } from "srm-mobile-ui";
import { validatorMobile, validatorPostCode, validatorBankAccount } from "@/utils/sslmUtils.js";
import { getFields } from "@/utils/utils";

function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

// 基础信息
function basicInfoDS(extSupplierReqId) {
  return {
    autoQuery: Boolean(extSupplierReqId),
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    forceValidate: true,
    data: [],
    queryParameter: {
      customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.BASIC_INFO",
    },
    fastQueryField: {},
    // 查询表单字段
    queryFields: [],
    fields: [],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/external-supplier-reqs/${extSupplierReqId}`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        const newdata = data.map((e) => ({ ...e, enabledFlag: String(e.enabledFlag) }));
        return newdata;
      },
    }
  };
}
// 联系人
function contactDataSet(extSupplierReqId, _that) {
  return {
    autoQuery: Boolean(extSupplierReqId),
    editable: false,
    enableQuery: false,
    selection: Infinity,
    forceValidate: true,
    queryParameter: {
      customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.CONTACT_INFO",
    },
    fields: [
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.mobilephone").$D("移动电话"),
        fieldCode: "mobilephone",
        fieldType: "INPUT_NUMBER",
        required: true,
        prefixField:{
          lovCode:"HPFM.IDD",
          defaultValue:{ value: "+86", meaning: $T("smbl.common.message.internationalTel.china86").$D("中国大陆 +86") },
          // displayField:"internationalTelCodeMeaning",
          fieldCode:"internationalTelCode",
          fieldType: "SELECT"
        },
        validator: (val, record, field) => validatorMobile(val, record, field, _that)
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/ext-supplier-contact-reqs/${extSupplierReqId}`,
        method: "get",
      },
      destroy: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/ext-supplier-contact-reqs/batch-delete`,
        method: "delete",
      },
    },
  };
}
// 地址
function addressDataSet(extSupplierReqId) {
  return {
    autoQuery: Boolean(extSupplierReqId),
    editable: false,
    enableQuery: false,
    selection: Infinity,
    forceValidate: true,
    queryParameter: {
      customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.ADDRESS_INFO",
    },
    fields: [
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.countryIdMeaning").$D("国家/地区"),
        fieldCode: "countryId",
        fieldType: "LOV",
        lovCode: "HPFM.COUNTRY",
        displayField:"countryIdMeaning",
        options: {
          displayField: "countryName",
          subDisplayField: "countryCode",
          valueField: "countryId",
        },
        required: true
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.empty.warehouse.regionPathName").$D("省/市/区"),
        fieldCode: "regionPathName",
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.detailedAddress").$D("详细地址"),
        fieldCode: "addressDetail",
        fieldType: "INPUT",
        required: true
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.postalCode").$D("邮政编码"),
        fieldCode: "postCode",
        fieldType: "INPUT",
        validator: (val, record, field) => validatorPostCode(val, record, field)
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.addressRemark").$D("地址备注"),
        fieldCode: "remark",
        fieldType: "INPUT"
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用"),
        fieldCode: "enabledFlag",
        fieldType: "SWITCH",
        defaultValue:"1"
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/ext-supplier-address-reqs/${extSupplierReqId}`,
        method: "get",
      },
    },
  };
}
// 银行账户
function bankDataSet(extSupplierReqId) {
  return {
    autoQuery: Boolean(extSupplierReqId),
    editable: false,
    enableQuery: false,
    selection: Infinity,
    forceValidate: true,
    queryParameter: {
      customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.BANK_ACCOUNT",
    },
    fields: [
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.countryIdMeaning").$D("国家/地区"),
        fieldCode: "countryId",
        fieldType: "LOV",
        lovCode: "HPFM.COUNTRY",
        displayField:"countryName",
        options: {
          displayField: "countryName",
          subDisplayField: "countryCode",
          valueField: "countryId",
        },
        required: true
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankCode").$D("银行代码"),
        fieldCode: "bankId",
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankName").$D("银行名称"),
        fieldCode: "bankName",
        fieldType: "TEXT"
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankFirm").$D("联行行号"),
        fieldCode: "bankFirm",
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.openeBankName").$D("开户行名称"),
        fieldCode: "bankBranchName",
        fieldType: "TEXT"
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankAccountName").$D("账户名称"),
        fieldCode: "bankAccountName",
        fieldType: "INPUT",
        required: true
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.bankAccount").$D("银行账号"),
        fieldCode: "bankAccountNum",
        fieldType: "INPUT",
        validator: (val, record, field) => validatorBankAccount(val, record, field, null, /^[0-9A-Za-z-@._,/]*$/),
        required: true
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.enable").$D("启用"),
        fieldCode: "enabledFlag",
        fieldType: "SWITCH",
        defaultValue:"1"
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.mainAccount").$D("主账号"),
        fieldCode: "masterFlag",
        fieldType: "SWITCH",
        defaultValue:"0"
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.remark").$D("备注"),
        fieldCode: "remark",
        fieldType: "INPUT"
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/ext-sup-bk-account-reqs/${extSupplierReqId}`,
        method: "get",
      },
    },
  };
}

// 附件
function attachmentDataSet(extSupplierReqId) {
  return {
    autoQuery: Boolean(extSupplierReqId),
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.ATTACHMENT",
    },
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/ext-supplier-attachment-reqs/${extSupplierReqId}`,
        method: "get",
      },
    },
  };
}

// 采购财务信息头
function purchaseHeaderDataSet(extSupplierReqId) {
  return {
    autoQuery: Boolean(extSupplierReqId),
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.PURCHASE_HEADER",
    },
    fields: [
      {
        fieldName: $T("spfm.importErp.model.importErp.planGroups").$D("计划组"),
        fieldCode: "programmeGroups",
        fieldType: "SELECT",
        lovCode: "SSLM.PROGRAMME_GROUPS",
        options: {
          queryParams:{
            tenantId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.schemeGroup").$D("方案组"),
        fieldCode: "schemeGroup",
        fieldType: "INPUT",
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.accountGroup").$D("账户组"),
        fieldCode: "accountGroup",
        fieldType: "LOV",
        lovCode: "SSLM.SYNC_ACCOUNT_GROUP",
        displayField:"accountGroupMeaning",
        options: {
          displayField: "meaning",
          valueField: "value",
          queryParams:{
            lovCode: "SSLM.SYNC_ACCOUNT_GROUP",
            tenantId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
        fieldCode: "reconciliationAccount",
        fieldType: "LOV",
        lovCode: "SSLM.RECONCILIATION_ACCOUNT",
        displayField:"reconciliationAccountMeaning",
        options: {
          displayField: "meaning",
          valueField: "value",
          queryParams:{
            lovCode: "SSLM.RECONCILIATION_ACCOUNT",
            tenantId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.erpCompanyCode").$D("erp公司代码"),
        fieldCode: "ouId",
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.OU_CODE",
        displayField:"ouCode",
        options: {
          displayField: "ouCode",
          valueField: "ouId",
        },
      },
      {
        fieldName: $T("spfm.importErp.model.importErp.termName").$D("付款条款"),
        fieldCode: "termId",
        fieldType: "LOV",
        lovCode: "SMDM.PAYMENT.TERM",
        displayField:"termName",
        options: {
          displayField: "termName",
          valueField: "termId",
          queryParams:{
            tenantId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.accountFlag").$D("记账冻结"),
        fieldCode: "frozenFlag",
        fieldType: "SWITCH",
        defaultValue: 0,
      },
      {
        fieldName: $T("spfm.importErp.model.importErp.paymentFreezeCode").$D("付款冻结代码"),
        fieldCode: "paymentFrozen",
        fieldType: "SELECT",
        lovCode: "SSLM.PAYMENT_FROZEN",
        options: {
          queryParams:{
            tenantId: localStorage.getItem("tenantId"),
          },
        },
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/ext-supplier-pf-req/${extSupplierReqId}`,
        method: "get",
      },
    },
  };
}

// 采购财务信息行
function purchaseLineDataSet(extSupplierReqId) {
  return {
    autoQuery: Boolean(extSupplierReqId),
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.PURCHASE_LINE",
      extSupplierReqId,
    },
    fields: [
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.organizationCode").$D("采购组织"),
        fieldCode: "organizationCode",
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.PURORG_CODE",
        required: true,
        displayField:"organizationCode",
        options: {
          displayField: "organizationCode",
          valueField: "organizationCode",
          onClear: (ds) => {
            const {
              purchaseOrgId,
              organizationName,
            } = getFields(ds, [
              "purchaseOrgId",
              "organizationName",
            ]);
            organizationName.setData(null);
            purchaseOrgId.setData(null);
          },
          callback: (val, fieldCode, display, ds) => {
            let item = {};
            if (val.length) {
              item = val[0];
            }
            const {
              purchaseOrgId,
              organizationName,
            } = getFields(ds, [
              "purchaseOrgId",
              "organizationName",
            ]);
            purchaseOrgId.setData(item.purchaseOrgId);
            organizationName.setData(item.organizationName);
          },
        },
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.organizationName").$D("采购组织名称"),
        fieldCode: "organizationName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.purchaseAgent").$D("采购员"),
        fieldCode: "purchaseAgentId",
        fieldType: "LOV",
        lovCode: "SMDM.PURCHASE_AGENT",
        displayField:"purchaseAgentName",
        options: {
          displayField: "purchaseAgentName",
          valueField: "purchaseAgentId",
        },
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.termName").$D("付款条款"),
        fieldCode: "termId",
        fieldType: "LOV",
        required: true,
        lovCode: "SSLM.PAYMENT.TERM",
        displayField:"termName",
        options: {
          displayField: "termName",
          valueField: "termId",
        },
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.payMethod").$D("付款方式"),
        fieldCode: "typeCode",
        fieldType: "LOV",
        lovCode: "SMDM.PAYMENT_TYPE",
        displayField:"typeName",
        options: {
          displayField: "typeName",
          valueField: "typeCode",
        },
      },
      {
        fieldName: $T("spfm.importErp.model.importErp.internationalCondition").$D("国贸条件"),
        fieldCode: "tradeTerms",
        fieldType: "SELECT",
        lovCode: "SSLM.TRADE_TERMS",
        options: {
          queryParams:{
            tenantId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldName: $T("spfm.importErp.model.importErp.internationalSite").$D("国贸地点"),
        fieldCode: "tradeTermsSite",
        fieldType: "INPUT",
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.currencyCode").$D("订单货币"),
        fieldCode: "currencyCode",
        fieldType: "LOV",
        lovCode: "SMDM.CURRENCY",
        displayField:"currencyName",
        required: true,
        options: {
          displayField: "currencyName",
          valueField: "currencyCode",
        },
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
        fieldCode: "reconciliationAccount",
        fieldType: "LOV",
        lovCode: "SSLM.RECONCILIATION_ACCOUNT",
        displayField:"reconciliationAccountMeaning",
        required: true,
        options: {
          displayField: "meaning",
          valueField: "value",
          queryParams:{
            lovCode: "SSLM.RECONCILIATION_ACCOUNT",
            tenantId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.sortNumber").$D("排序码"),
        fieldCode: "sortNumber",
        fieldType: "INPUT_NUMBER",
        required: true,
      },
      {
        fieldName: $T("sslm.supplierInform.model.supplierInform.accountFlag").$D("记账冻结"),
        fieldCode: "frozenFlag",
        fieldType: "SWITCH",
        defaultValue: 0,
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/ext-supplier-pf-line-req`,
        method: "get",
      },
    },
  };
}

// 历史记录
function historyDataSet(supplierId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/external-supplier-reqs?supplierId=${supplierId}`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  basicInfoDS,
  contactDataSet,
  addressDataSet,
  bankDataSet,
  attachmentDataSet,
  purchaseHeaderDataSet,
  purchaseLineDataSet,
  historyDataSet,
};
