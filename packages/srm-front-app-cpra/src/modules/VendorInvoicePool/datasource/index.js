import { SrmUtil, $T } from "srm-mobile-ui";

export const Type = {
  UNCHECKED: "UNCHECKED",
  CHECKED: "CHECKED",
};

export const UnitCode = {
  UNCHECKED:
    "SSTA.SUPINVOICE_POOL_LIST.UNCHECK_GRID,SSTA.SUPINVOICE_POOL_LIST.SEARCH_BAR_CHECKED",
  CHECKED:
    "SSTA.SUPINVOICE_POOL_LIST.FINISHED_GRID,SSTA.SUPINVOICE_POOL_LIST.SEARCH_BAR_UNCHECKED",
};

function indexDS(type) {
  return {
    autoQuery: true,
    selection: Infinity,
    editFlag: false,
    enableQuery: true,
    queryParameter: {
      customizeUnitCode: UnitCode[type],
      checkStatus: Type[type],
      invoiceTypeList: null,
      invoiceSourceList: null,
      documentStatusList: null,
      invoiceStatusList: null,
      cancelledFlagList: null,
      exceptionStatusList: null,
      invoicingDateFrom: null, // 开票起始日期
      invoicingDateTo: null, // 开票结束日期
    },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "invoiceTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceTypeMeaning"
        ).$D("发票类型"),
      },
      {
        fieldCode: "invoiceType",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceType"
        ).$D("发票类型"),
        displayField: "invoiceTypeMeaning",
        fieldType: "SELECT",
        lovCode: "SSTA.INVOICE_POOL_TYPE",
        options: {
          multiple: false,
        },
        required: true,
      },
      {
        fieldCode: "invoiceCode",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCode"
        ).$D("发票代码"),
        required: (_, item) =>
          item.invoiceType !== "17" &&
          item.invoiceType !== "18" &&
          item.invoiceType !== "19", // 商业发票不必输
      },
      {
        fieldCode: "invoiceNum",
        fieldType: "INPUT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceNum"
        ).$D("发票号码"),
        required: true,
      },
      {
        fieldCode: "invoicingDate",
        fieldType: "DATE_PICKER",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoicingDate"
        ).$D("开票日期"),
        required: true,
      },
      {
        fieldCode: "netAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmount"
        ).$D("不含税金额"),
        required: true,
      },
      {
        fieldCode: "taxAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxAmount"
        ).$D("税额"),
        required: true,
      },
      {
        fieldCode: "belongCompanyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.belongCompanyName1"
        ).$D("所属公司"),
      },
      {
        fieldCode: "belongSupplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.belongSupplierCompanyName1"
        ).$D("所属供应商"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.companyId"
        ).$D("购方"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierCompanyId"
        ).$D("销方名称"),
      },
      {
        fieldCode: "belongCompanyId",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.belongCompanyId1"
        ).$D("所属客户"),
        fieldType: "LOV",
        displayField: "belongCompanyName",
        lovCode: "SPFM.USER_AUTH.CUSTOMER",
        required: true,
      },
      {
        fieldCode: "belongSupplierCompanyId",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.belongSupplierCompanyId1"
        ).$D("所属公司"),
        fieldType: "LOV",
        displayField: "belongSupplierCompanyName",
        lovCode: "SPFM.USER_AUTH.COMPANY",
        required: true,
      },
      {
        fieldCode: "companyId",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.companyId"
        ).$D("购方"),
        fieldType: "LOV",
        displayField: "companyName",
        lovCode: "SSTA.USER_AUTH.CUSTOMER_WITH_TAX",
      },
      {
        fieldCode: "supplierCompanyId",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierCompanyId"
        ).$D("销方名称"),
        fieldType: "LOV",
        displayField: "supplierCompanyName",
        lovCode: "SSTA.USER_AUTH_SUPPLIER_COMPANY_WITH_TAX",
      },
      {
        fieldCode: "checkCode",
        fieldType: "INPUT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.checkcodeWarning"
        ).$D("校验码 (多位时请输入后6位即可)"),
        pattern: /^[a-zA-Z\d]+$/,
        errorMessage: $T(
          "ssta.purchaseInvoicePool.view.validation.onlyDigitOrLetter"
        ).$D("请输入字母或者数字"),
      },
      {
        fieldCode: "memo",
        fieldType: "TEXT_AREA",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.memo"
        ).$D("备忘说明"),
      },
    ],
    fastQueryField: {
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.param"
      ).$D("购方、供方、发票号码、代码查询"),
      fieldCode: "param",
      fieldType: "TEXT",
    },
    queryFields: [
      {
        fieldCode: "invoicingDateFrom",
        endDateFieldCode: "invoicingDateTo",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoicingDateFromAndTo"
        ).$D("创建日期"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.companyName"
        ).$D("购方名称"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierCompanyName"
        ).$D("销方名称"),
      },
      {
        fieldCode: "belongCompanyId",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.belongCompanyId1"
        ).$D("所属客户"),
        lovCode: "SPFM.USER_AUTH.CUSTOMER",
        options: {
          multiple: false,
          subDisplayField: "companyNum",
        },
      },
      {
        fieldCode: "belongSupplierCompanyId",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.belongSupplierCompanyId1"
        ).$D("所属公司"),
        lovCode: "SPFM.USER_AUTH.COMPANY",
        options: {
          multiple: false,
          subDisplayField: "companyNum",
        },
      },
      {
        fieldCode: "invoiceSourceList",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceSourceList"
        ).$D("进池来源"),
        lovCode: "SSTA.INVOICE_SOURCE",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "invoiceStatusList",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceStatusList"
        ).$D("发票状态"),
        lovCode: "SSTA.INVOICE_STATUS",
        options: {
          multiple: false,
        },
      },
      {
        fieldCode: "checkDateFrom",
        fieldType: "DATE",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.checkDateFrom"
        ).$D("查验日期从"),
      },
      {
        fieldCode: "checkDateTo",
        fieldType: "DATE",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.checkDateTo"
        ).$D("查验日期至"),
      },
      {
        fieldCode: "documentStatusList",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.documentStatusList"
        ).$D("单据状态"),
        lovCode: "SSTA.INVOICE_DOC_STATUS",
        options: {
          multiple: false,
        },
      },
      {
        fieldCode: "invoiceTypeList",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceTypeList"
        ).$D("发票类型"),
        lovCode: "SSTA.INVOICE_POOL_TYPE",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "invoiceCode",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCode"
        ).$D("发票代码"),
      },
      {
        fieldCode: "invoiceNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceNum"
        ).$D("发票号码"),
      },
      {
        fieldCode: "checkStatusList",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.checkStatusList"
        ).$D("查验状态"),
        lovCode: "SSTA.INVOICE_CHECK_STATUS",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "cancelledFlagList",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.cancelledFlagList"
        ).$D("取消标识"),
        lovCode: "SPRM.LINE_CANCEL_STATUS",
        options: {
          multiple: true,
        },
        defaultValue: {
          value: "0",
          meaning: $T("smbl.common.view.no.cancel").$D("未取消"),
        },
      },
      {
        fieldCode: "exceptionStatusList",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseInvoicePool.model.purchaseInvoicePool.exceptionStatusList"
        ).$D("异常标识"),
        lovCode: "SSTA.INVOICE_EXCEPTION_STATUS",
        options: {
          multiple: true,
        },
        defaultValue: {
          value: "NONE",
          meaning: $T("smbl.common.view.no.exception").$D("无异常"),
        },
      },
    ],
    transport: {
      read: {
        url: "/ssta/v1/{tenantId}/invoice-header/supplier/page",
        method: "get",
      },
    },
  };
}

export default indexDS;
