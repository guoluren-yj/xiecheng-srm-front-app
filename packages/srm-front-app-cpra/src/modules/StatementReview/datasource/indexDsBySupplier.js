import { SrmUtil, $T } from "srm-mobile-ui";

export const Type = {
  ALL: "ALL",
  APPROVE: "APPROVE",
  UPDATE: "UPDATE",
  CANCEL: "CANCEL",
  // SYNC: "SYNC",
};

export const Customize = {
  ALL: "SSTA.SUPPLIER_BILL_LIST.GRID_ALL,SSTA.SUPPLIER_BILL_LIST.SEARCH_BAR_ALL",
  APPROVE:
    "SSTA.SUPPLIER_BILL_LIST.GRID_APPROVE,SSTA.SUPPLIER_BILL_LIST.SEARCH_BAR_APPROVE",
  UPDATE:
    "SSTA.SUPPLIER_BILL_LIST.GRID_UPDATE,SSTA.SUPPLIER_BILL_LIST.SEARCH_BAR_UPDATE",
  CANCEL:
    "SSTA.SUPPLIER_BILL_LIST.GRID_CANCEL,SSTA.SUPPLIER_BILL_LIST.SEARCH_BAR_CANCEL",
  // SYNC: "SSTA.SUPPLIER_BILL_LIST.GRID_SYNC,SSTA.SUPPLIER_BILL_LIST.SEARCH_BAR_SYNC",
};

const unitCode = [
  "SSTA.SUPPLIER_BILL_DETAIL.BASIC_INFO",
  "SSTA.SUPPLIER_BILL_DETAIL.TRADING_PARTY",
  "SSTA.SUPPLIER_BILL_DETAIL.TRANSACTION_AMOUNT",
  "SSTA.SUPPLIER_BILL_DETAIL.TRANSACTION_DETAILS",
  "SSTA.SUPPLIER_BILL_DETAIL.SETTLE_CONFIG",
  "SSTA.SUPPLIER_BILL_DETAIL.OTHERS_INFO",
  "SSTA.SUPPLIER_BILL_DETAIL.ENCLOSURE",
  "SSTA.SUPPLIER_BILL_DETAIL.HEADER_BTNS",
  "SSTA.SUPPLIER_BILL_DETAIL.PRE_CONFIRM",
  "SSTA.SUPPLIER_BILL_DETAIL.PRE_RETURN",
  "SSTA.SUPPLIER_BILL_DETAIL.PRE_CANCEL",
  "SSTA.SUPPLIER_BILL_DETAIL.COLLAPSE",
  "SSTA.SUPPLIER_BILL_DETAIL.HEADER_BTNS_UPDATE",
];
export const supDetailCustomizeUnit = unitCode.join();

export const CustomizeCode = {
  ALL: supDetailCustomizeUnit,
  APPROVE: supDetailCustomizeUnit,
  UPDATE: supDetailCustomizeUnit,
  CANCEL: supDetailCustomizeUnit,
  // SYNC: "SSTA.SUPPLIER_BILL_DETAIL.BASIC,SSTA.SUPPLIER_BILL_DETAIL.TRADING_PARTY,SSTA.SUPPLIER_BILL_DETAIL.TRANSACTION_AMOUNT,SSTA.SUPPLIER_BILL_DETAIL.TRANSACTION_DETAILS,SSTA.SUPPLIER_BILL_DETAIL.SETTLE_CONFIG,SSTA.SUPPLIER_BILL_DETAIL.OTHERS",
};
function indexDs(type) {
  const updateUrlMap = {
    APPROVE:
      "/ssta/v1/{tenantId}/bill-headers/supplier/return-back?customizeUnitCode={customizeCode}", // 退回
    UPDATE:
      "/ssta/v1/{tenantId}/bill-headers/supplier/batch-delete?customizeUnitCode={customizeCode}", // 取消
    CANCEL:
      "/ssta/v1/{tenantId}/bill-headers/supplier/cancel?customizeUnitCode={customizeCode}", // 取消
  };
  const submitUrlMap = {
    APPROVE:
      "/ssta/v1/{tenantId}/bill-headers/supplier/confirm?customizeUnitCode={customizeCode}", // 确认
    UPDATE:
      "/ssta/v1/{tenantId}/bill-headers/supplier/submit?customizeUnitCode={customizeCode}", // 提交
    SYNC: "/ssta/v1/{tenantId}/bill-headers/supplier/sync", // 同步
  };
  return {
    autoQuery: true,
    selection: Infinity,
    // eslint-disable-next-line no-unneeded-ternary
    editable: type === "ALL" ? false : true,
    queryParameter: {
      customizeFilterComparison:
        "ecBillNum:LIKE,confirmCollaborativeMode:=,billNum:LIKE,billStatus:IN,creationDate:~,camp:IN,companyId:IN,sourceSupplierCompanyId:IN,settleConfigNum:IN,currencyCode:IN,invOrganizationId:IN",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      action: Type[type],
      customizeUnitCode: Customize[type],
      customizeUnitCodeConfirm: CustomizeCode[type],
    },
    fields: [
      {
        fieldCode: "currencyCode",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.billCurrencyCode"
        ).$D("币种"),
        editor: false,
      },
      {
        fieldCode: "netAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.netAmountSumMeaning"
        ).$D("不含税总金额"),
        editor: false,
      },
      {
        fieldCode: "taxAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.taxAmountMeaning"
        ).$D("税额"),
        editor: false,
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.taxIncludedAmountMeaning"
        ).$D("含税总金额"),
        editor: false,
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.billCustomerCompany"
        ).$D("对账客户公司"),
        editor: false,
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.billSupplierCompany"
        ).$D("对账供应商公司"),
        editor: false,
      },
      {
        fieldCode: "creationDate",
        fieldType: "DATE_PICKER",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.creationDate"
        ).$D("创建日期"),
        options: {
          format: "yyyy-MM-dd",
        },
        editor: false,
      },
      {
        fieldCode: "createdUserName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.createdUserName"
        ).$D("创建人"),
        editor: false,
      },
    ],
    fastQueryField: {
      fieldCode: "billNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billNum"
      ).$D("对账单编号"),
    },
    queryFields: [
      {
        fieldCode: "billStatus_range",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.billStatus_range"
        ).$D("对账单状态"),
        lovCode: "SSTA.BILL_STATUS",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "companyId_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.customerCompany"
        ).$D("客户公司"),
        lovCode: "SPFM.USER_AUTH.CUSTOMER",
        options: {
          multiple: true,
          subDisplayField: "companyNum",
        },
      },
      {
        fieldCode: "supplierCompanyId",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.supplierCompanyId"
        ).$D("供应商"),
        lovCode: "SSTA.USER_AUTH.COMPANY_FOR_SUPPLIER",
        options: {
          subDisplayField: "companyNum",
        },
      },
      {
        fieldCode: "param",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.param1"
        ).$D("输入供应商、公司"),
      },
      {
        fieldCode: "ecBillNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.ecBillNum"
        ).$D("电商对账单编号"),
      },
      {
        fieldCode: "confirmCollaborativeMode",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.confirmCollaborativeMode"
        ).$D("协同模式"),
        lovCode: "SSTA.COOPERATION_MODE",
      },
      {
        fieldCode: "creationDateStart",
        fieldType: "DATE_PICKER",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.creationDate"
        ).$D("创建日期"),
        selectType: "start-end",
        endDateFieldCode: "creationDateEnd",
        options: {
          format: "yyyy-MM-dd",
        },
      },
      {
        fieldCode: "camp_range",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.camp_range"
        ).$D("创建方阵营"),
        lovCode: "SSTA.CAMP",
      },
      {
        fieldCode: "sourceSupplierCompanyId_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.sourceSupplierCompanyId_range"
        ).$D("数据源平台供应商名称"),
        lovCode: "SSTA.USER_AUTH.COMPANY_FOR_SUPPLIER",
        options: {
          multiple: true,
          subDisplayField: "companyNum",
        },
      },
      {
        fieldCode: "settleConfigNum_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.settleConfigNum_range"
        ).$D("结算策略"),
        lovCode: "SSTA.SETTLE_CONFIG",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "currencyCode_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.billCurrencyCode"
        ).$D("币种"),
        lovCode: "SSTA.CURRENCY",
        options: {
          multiple: true,
          subDisplayField: "currencyName",
        },
      },
      {
        fieldCode: "invOrganizationId_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.invOrganizationId_range"
        ).$D("库存组织"),
        lovCode: "HPFM.INV_ORGANIZATION",
        options: {
          multiple: true,
          subDisplayField: "organizationCode",
        },
      },
      // {
      //   fieldCode: "syncStatus",
      //   fieldType: "SELECT",
      //   fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.settle-sync-status").$D("对账单-同步外部系统-状态"),
      //   lovCode: "SSTA.BILL_SYNC_STATUS",
      //   // eslint-disable-next-line no-unneeded-ternary
      //   visible: type === "ALL" ? true : false,
      // }
    ],
    events: {
      beforeQuery: (ds, params) => {
        params["creationDate_range"] = [];
        if (params.creationDateStart) {
          params["creationDate_range"].push(params.creationDateStart);
        }
        if (params.creationDateEnd) {
          params["creationDate_range"].push(params.creationDateEnd);
        }
        params["creationDate_range"] = params["creationDate_range"].join(",");
        if (
          params.supplierCompanyId &&
          params.supplierCompanyId.includes("_")
        ) {
          params["supplierId"] = params.supplierCompanyId.split("_")[1];
          params["supplierCompanyId"] = params.supplierCompanyId.split("_")[0];
        } else {
          delete params["supplierId"];
        }
      },
    },
    transport: {
      read: {
        url: "/ssta/v1/{tenantId}/bill-headers/supplier?action={action}&customizeUnitCode={customizeUnitCode}&customizeUnitCodeConfirm={customizeUnitCodeConfirm}",
        method: "get",
      },
      update: {
        url: updateUrlMap[type],
        method: "put",
      },
      submit: {
        url: submitUrlMap[type],
        method: "put",
      },
    },
  };
}

export default indexDs;
