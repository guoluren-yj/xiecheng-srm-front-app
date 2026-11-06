import { $T, SrmUtil } from "srm-mobile-ui";
import moment from "moment";
import { getLabelName } from "../../../utils/index";

const oldDate = moment().subtract(3, "month").format("YYYY-MM-DD 00:00:00");
const date = moment(new Date()).format("YYYY-MM-DD 23:59:59");
// const name = "trxDate_range";
//待收货
function finishDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    editable:false,
    // editFlag: true,
    filterCustomizeCode: "SMBL.RECEIVE_WORKPLACE.FINISH_LIST.SEARCH",
    queryParameter: {
      // customizeFilterComparison: "itemCode:=,itemName:LIKE,invOrganizationId:=,companyId:=,agentId:=",
      // trxDate: oldDate,
      // custEndDate: date,
      // [name]: `${oldDate},${date}`,
    },
    fields: [
      {
        fieldCode: "nodeConfigName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName.nodeConfigName").$D("收货节点"),
      },
      {
        fieldCode: "displayTrxNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.orderTypeName.receiptTrxNum").$D("收货单号"),
      },
      {
        fieldCode: "rcvTypeName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.rcvTypeReName").$D("收货类型"),
      },
      {
        fieldCode: "returnedFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.aogReturnedThings").$D("收货/退回"),
      },
      {
        fieldCode: "printFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.printLabel").$D("打印标记"),
      },
      {
        fieldCode: "printTimes",
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.companyName").$D("公司"),
      },
      {
        fieldCode: "creationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.creationName").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receiptExecution.model.receipt.creationDateTime").$D("创建时间"),
        timePicker:true,
        editor:false
      },
      {
        fieldCode: "hidePriceFlag",
        fieldType: "TEXT",
      },
    ],
    fastQueryField:{
      fieldCode: "allSource",
      fieldType: "TEXT",
      fieldName: $T("sinv.receiptWorkbench.view.receipt.multipleSearchText").$D("订单/送货单/协议/参考凭证/收货单号查询"),
    },
    queryFields: [
      {
        fieldCode: "trxDate",
        fieldType: "DATE_PICKER",
        // fieldName: $T("sinv.common.view.trxDate").$D("实际操作日期"),
        selectType: "start-end",
        endDateFieldCode: "custEndDate",
        defaultValue:`${oldDate},${date}`,
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/trx/finish/header?customizeUnitCode=SINV.RECEIPT_WORKBENCH_THING.END_SEARCH,SINV.RECEIPT_WORKBENCH_THING.END.DAN.K`,
        method: "get",
      },
    },
    events: {
      beforeQuery(ds, params) {
        params["customizeFilterComparison"] = "itemCode:=,itemName:LIKE,invOrganizationId:=,companyId:=,agentId:=,trxDate:~";
      },
    }
  };
}

//待收货
function finishByLineDS(isDoubleUnit) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    editable:false,
    // editFlag: true,
    filterCustomizeCode: "SMBL.RECEIVE_WORKPLACE.FINISH_LIST_LINE.SEARCH",
    queryParameter: {
      // customizeFilterComparison: "itemCode:=,itemName:LIKE,invOrganizationId:=,companyId:=,agentId:=,trxDate:~,trxDate_range:~",
      // trxDate: oldDate,
      // custEndDate: date,
      // [name]: `${oldDate},${date}`,
    },
    fields: [
      {
        fieldCode: "nodeConfigName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName.nodeConfigName").$D("收货节点"),
      },
      {
        fieldCode: "displayTrxHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.orderTypeName.receiptTrxNums").$D("收货单号｜行号"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.itemName").$D("物料名称"),
      },
      {
        fieldCode: "secondaryUomName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: getLabelName(isDoubleUnit, "uomName"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.receiptsAmount").$D("单据金额"),
      },
      {
        fieldCode: "rcvTypeName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.rcvTypeReName").$D("收货类型"),
      },
      {
        fieldCode: "trxDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.trxDate").$D("实际操作日期"),
        // timePicker: true
      },
      {
        fieldCode: "fromDisplayTrxHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theDisplayTrxNum").$D("参考凭证编号｜行号"),
      },
      {
        fieldCode: "fromDisplayPoHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theFromDisplayPoLineNum").$D("来源订单编号｜行号"),
      },
      {
        fieldCode: "fromDisplayAsnHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theFromPcSubjectNum").$D("来源送货单编号｜行号"),
      },
      {
        fieldCode: "fromPcHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theFromPcNum").$D("来源协议编号｜行号"),
      },
      {
        fieldCode: "fromOrderTypeName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.orderTypeName.source").$D("来源单据类型"),
      },
      {
        fieldCode: "sourceStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.sourceReceiveStatusCode").$D("来源单据收货状态"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.companyName").$D("公司"),
      },
      {
        fieldCode: "creationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.creationName").$D("创建人"),
      },
      {
        fieldCode: "billMatchedFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.billMatchedFlag").$D("对账状态"),
      },
      {
        fieldCode: "invoiceMatchedStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.invoiceMatchedStatusMeaning").$D("开票状态"),
      },
      {
        fieldCode: "importStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.common.model.common.erpSyncStatus").$D("导出状态"),
      },
      {
        fieldCode: "returnedFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.aogReturnedThings").$D("收货/退回"),
      },
      {
        fieldCode: "secondaryQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptExecution.model.receipt.sourceQuantity").$D("单据数量"),
      },
      {
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        fieldName: getLabelName(isDoubleUnit, "quantity", 2),
      },
      {
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.invOrganizationName").$D("收货组织"),
      },
      {
        fieldCode: "inventoryName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.inventoryName").$D("库房"),
      },
      {
        fieldCode: "locationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.locationName").$D("库位"),
      },
      {
        fieldCode: "productNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.productNum").$D("商品编码"),
      },
      {
        fieldCode: "productName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.productName").$D("商品名称"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receiptExecution.model.receipt.creationDateTime").$D("创建时间"),
        timePicker:true,
        editor:false
      },
    ],
    fastQueryField:{
      fieldCode: "allSource",
      fieldType: "TEXT",
      fieldName: $T("sinv.receiptWorkbench.view.receipt.multipleSearchText").$D("订单/送货单/协议/参考凭证/收货单号查询"),
    },
    queryFields: [
      {
        fieldCode: "trxDate",
        fieldType: "DATE_PICKER",
        // fieldName: $T("sinv.common.view.trxDate").$D("实际操作日期"),
        selectType: "start-end",
        endDateFieldCode: "custEndDate",
        defaultValue:`${oldDate},${date}`,
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/trx/finish/line?customizeUnitCode=SINV.RECEIPT_WORKBENCH_THING.END_SEARCH,SINV.RECEIPT_WORKBENCH_THING.END.HAN.K`,
        method: "get",
      },
    },
    events: {
      beforeQuery(ds, params) {
        params["customizeFilterComparison"] = "itemCode:=,itemName:LIKE,invOrganizationId:=,companyId:=,agentId:=,trxDate:~";
      },
    }
  };
}
export { finishDS, finishByLineDS };
