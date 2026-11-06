import { $T } from "srm-mobile-ui";

const detailUnitCode = [
  "SSTA.PURCHASER_BILL_DETAIL.BASIC_INFO",
  "SSTA.PURCHASER_BILL_DETAIL.TRADING_PARTY",
  "SSTA.PURCHASER_BILL_DETAIL.TRANSACTION_AMOUNT",
  "SSTA.PURCHASER_BILL_DETAIL.TRANSACTION_DETAILS",
  "SSTA.PURCHASER_BILL_DETAIL.SETTLE_CONFIG",
  "SSTA.PURCHASER_BILL_DETAIL.OTHERS_INFO",
  "SSTA.PURCHASER_BILL_DETAIL.ENCLOSURE",
  "SSTA.PURCHASER_BILL_DETAIL.HEADER_BTNS",
  "SSTA.PURCHASER_BILL_DETAIL.PRE_CONFIRM",
  "SSTA.PURCHASER_BILL_DETAIL.PRE_RETURN",
  "SSTA.PURCHASER_BILL_DETAIL.PRE_CANCEL",
  "SSTA.PURCHASER_BILL_DETAIL.COLLAPSE",
  "SSTA.PURCHASER_BILL_DETAIL.HEADER_BTNS_UPDATE",
];
export const detailCustomizeUnit = detailUnitCode.join();

function billDs(id, param) {
  return {
    autoQuery: true,
    editable: false,
    selection: Infinity,
    pageSize: 5,
    queryParameter: {
      ...param,
      customMergeFilterField: "contractNum",
      customizeFilterComparison:
        "sourcePlatformCode:IN,invOrganizationId:IN,orderType:IN,agentId:IN,costId:IN,trxTypeCode:IN,sourceCompanyNum:IN,taxCode:IN,purOrganizationId:IN,sourceSupplierCompanyNum:IN,settleConfigNum:IN,priceAction:IN,settleBasePrice:IN,settleMode:IN,settleMatchDimension:IN,priceSource:IN,dataSource:IN,ecPoSubNum:LIKE,sourceSupplierNum:IN,lineNum:LIKE,multiDealPoLineNum:=,poNum:LIKE,asnNum:LIKE,multiDealPoNum:=,multiDealTrxNum:=,multiDealTrxLineNum:=,itemCode:LIKE,itemName:LIKE,trxDate:~,deliverTime:~,priceTime:~",
    },
    queryFields: [
      {
        fieldCode: "contractNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.contractNum"
        ).$D("协议编号"),
      },
      {
        fieldCode: "trxDateStart",
        fieldType: "DATE_PICKER",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.trxDate"
        ).$D("事务日期"),
        selectType: "start-end",
        endDateFieldCode: "trxDateEnd",
        options: {
          format: "yyyy-MM-dd",
        },
      },
      {
        fieldCode: "deliverTimeStart",
        fieldType: "DATE_PICKER",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.deliverTime"
        ).$D("妥投时间"),
        selectType: "start-end",
        endDateFieldCode: "deliverTimeEnd",
        options: {
          format: "yyyy-MM-dd",
        },
      },
      {
        fieldCode: "priceTimeStart",
        fieldType: "DATE_PICKER",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.priceTime"
        ).$D("取价时间"),
        selectType: "start-end",
        endDateFieldCode: "priceTimeEnd",
        options: {
          format: "yyyy-MM-dd",
        },
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.itemCode"
        ).$D("结算商品编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.itemName"
        ).$D("结算商品名称"),
      },
      {
        fieldCode: "multiDealPoLineNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.multiDealPoLineNum"
        ).$D("三方交易关联订单行号"),
      },
      {
        fieldCode: "poNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.poNum"
        ).$D("采购订单编号"),
      },
      {
        fieldCode: "ecPoSubNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.ecPoSubNum"
        ).$D("电商子订单编号"),
      },
      {
        fieldCode: "asnNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.asnNum"
        ).$D("送货单号编号"),
      },
      {
        fieldCode: "sourceSupplierNum_range",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.sourceSupplierNum"
        ).$D("数据源ERP供应商编码"),
      },
      {
        fieldCode: "multiDealPoNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.multiDealPoNum"
        ).$D("三方交易关联订单编号"),
      },
      {
        fieldCode: "multiDealTrxNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.multiDealTrxNum"
        ).$D("三方交易关联事务来源编号"),
      },
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.lineNum"
        ).$D("对账单行号"),
      },
      {
        fieldCode: "multiDealTrxLineNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.multiDealTrxLineNumber"
        ).$D("三方交易关联事务来源行号"),
      },
      {
        fieldCode: "settleConfigNum_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.settleConfigNum"
        ).$D("结算策略编码"),
        lovCode: "SSTA.SETTLE_CONFIG",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "trxTypeCode_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.trxTypesCode"
        ).$D("采购事务类型"),
        lovCode: "SINV.RECEIVE_TRX_TYPE",
        options: {
          multiple: true,
          subDisplayField: "rcvTrxTypeCode",
          valueField: "rcvTrxTypeCode",
        },
      },
      {
        fieldCode: "orderType_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.orderType"
        ).$D("订单类型"),
        lovCode: "SODR.ORDER_TYPE",
        options: {
          multiple: true,
          subDisplayField: "orderTypeCode",
          valueField: "orderTypeCode",
        },
      },
      {
        fieldCode: "agentId_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.agentId"
        ).$D("采购员"),
        lovCode: "SPFM.TENANT_PURCHASE_AGENT",
        options: {
          multiple: true,
          subDisplayField: "purchaseAgentCode",
        },
      },
      {
        fieldCode: "costId_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.costName"
        ).$D("成本中心"),
        lovCode: "SSTA.COST_CENTER",
        options: {
          multiple: true,
          subDisplayField: "costCode",
        },
      },
      {
        fieldCode: "sourceSupplierCompanyNum_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.sourceSupplierCompanyNum"
        ).$D("数据源供应商编码"),
        lovCode: "SPFM.USER_AUTH.SUPPLIER_CODE",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "sourceCompanyNum_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.sourceCompanyNum"
        ).$D("数据源公司编码"),
        lovCode: "SPFM.USER_AUTH.COMPANY",
        options: {
          multiple: true,
          subDisplayField: "companyNum",
        },
      },
      {
        fieldCode: "taxCode_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.taxCode_range"
        ).$D("税率代码"),
        lovCode: "SMDM.TAX",
        options: {
          multiple: true,
          subDisplayField: "taxCode",
          valueField: "taxCode",
        },
      },
      {
        fieldCode: "purOrganizationId_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.purOrganizationId"
        ).$D("采购组织"),
        lovCode: "HPFM.PURCHASE_ORGANIZATION",
        options: {
          multiple: true,
          subDisplayField: "organizationCode",
        },
      },
      {
        fieldCode: "invOrganizationId_range",
        fieldType: "LOV",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.invOrganizationId"
        ).$D("库存组织"),
        lovCode: "HPFM.INV_ORGANIZATION",
        options: {
          multiple: true,
          subDisplayField: "organizationCode",
        },
      },
      {
        fieldCode: "sourcePlatformCode_range",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.sourcePlatformCode"
        ).$D("数据来源类型"),
        lovCode: "SSTA.DATA_SOURCE_PLATFORM",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "priceAction_range",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.priceAction"
        ).$D("取价时点"),
        lovCode: "SSTA.PRICE_ACTION",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "settleBasePrice_range",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.settleBasePrice"
        ).$D("结算基准价"),
        lovCode: "SSTA.BASE_PRICE",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "settleMode_range",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.settleMode"
        ).$D("结算模式"),
        lovCode: "SSTA.SETTLE_MODE",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "settleMatchDimension_range",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.settleMatchDimension"
        ).$D("结算匹配纬度"),
        lovCode: "SSTA.MATCH_DIMENSION",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "priceSource_range",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.priceSource"
        ).$D("价格来源"),
        lovCode: "SSTA.PRICE_SOURCE",
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "dataSource_range",
        fieldType: "SELECT",
        fieldName: $T(
          "ssta.purchaseSettlePool.model.purchaseSettlePool.dataSource"
        ).$D("数据来源系统"),
        lovCode: "SSTA.DATA_SOURCE",
        options: {
          multiple: true,
        },
      },
    ],
    events: {
      beforeQuery: (ds, params) => {
        params["trxDate_range"] = [];
        params["deliverTime_range"] = [];
        params["priceTime_range"] = [];
        if (params.trxDateStart) {
          params["trxDate_range"].push(params.trxDateStart);
        }
        if (params.trxDateEnd) {
          params["trxDate_range"].push(params.trxDateEnd);
        }
        if (params.deliverTimeStart) {
          params["deliverTime_range"].push(params.deliverTimeStart);
        }
        if (params.deliverTimeEnd) {
          params["deliverTime_range"].push(params.deliverTimeEnd);
        }
        if (params.priceTimeStart) {
          params["priceTime_range"].push(params.priceTimeStart);
        }
        if (params.priceTimeEnd) {
          params["priceTime_range"].push(params.priceTimeEnd);
        }
        params["trxDate_range"] = params["trxDate_range"].join(",");
        params["deliverTime_range"] = params["deliverTime_range"].join(",");
        params["priceTime_range"] = params["priceTime_range"].join(",");
      },
    },
    transport: {
      read: {
        url: `/ssta/v1/${window.localStorage.getItem(
          "organizationId"
        )}/bill-lines/${id}`,
        method: "get",
      },
    },
  };
}

export default billDs;
