import { $T, SrmUtil } from "srm-mobile-ui";
import { getLabelName } from "../../../utils/index";

//待收货
function doingDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    editable: true,
    filterCustomizeCode: "SMBL.RECEIVE_WORKPLACE.DOING_LIST.SEARCH",
    // editFlag: true,
    queryParameter: { customizeFilterComparison: "itemCode:=,itemName:LIKE,invOrganizationId:=,companyId:=,agentId:=" },
    fields:  [
      {
        fieldCode: "rcvStatusCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.orderTypeName.rcvStatusCodeMeaning").$D("状态"),
      },
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
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.companyName").$D("公司"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.remark").$D("备注"),
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
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/trx/doing?customizeUnitCode=SINV.RECEIPT_WORKBENCH_THING.COURSE.null,SINV.RECEIPT_WORKBENCH_THING.COURSE_SEARCH`,
        method: "get",
      },
    },
    events: {
    }
  };
}
//待收货
function doingByLineDS(isDoubleUnit) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    editable:false,
    // editFlag: true,
    filterCustomizeCode: "SMBL.RECEIVE_WORKPLACE.DOING_LIST_LINE.SEARCH",
    queryParameter: { customizeFilterComparison: "itemCode:=,itemName:LIKE,invOrganizationId:=,companyId:=,agentId:=" },
    fields: [
      {
        fieldCode: "rcvStatusCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.orderTypeName.rcvStatusCodeMeaning").$D("状态"),
      },
      {
        fieldCode: "nodeConfigName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName.nodeConfigName").$D("收货节点"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "displayTrxNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.orderTypeName.receiptTrxNum").$D("收货单号"),
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
        fieldCode: "returnedFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.aogReturnedThings").$D("收货/退回"),
      },
      {
        fieldCode: "secondaryQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量"),
      },
      {
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        fieldName: getLabelName(isDoubleUnit, "quantity", 1),
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.taxIncludedAmount").$D("执行金额(含税)"),
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
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.invOrganizationName").$D("收货组织"),
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
        fieldName: $T("sinv.receipWorkbench.model.receipt.orderTypeName").$D("来源单据类型"),
      },
      {
        fieldCode: "productName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.productName").$D("商品名称"),
      },
      {
        fieldCode: "productNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.productNum").$D("商品编码"),
      },
      {
        fieldCode: "dueDate",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.deliverTime").$D("妥投时间"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT_AREA",
        fieldName: $T("sinv.receiptExecution.model.receipt.remark").$D("备注"),
      },
      {
        fieldCode: "sinvLineAttachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.lineUuid").$D("行附件"),
      },
      {
        fieldCode: "customSpecsJson",
        fieldType: "TEXT",
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
        fieldCode: "inventoryName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.inventoryName").$D("库房"),
      },
      {
        fieldCode: "locationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.locationName").$D("库位"),
      },
    ],
    fastQueryField:{
      fieldCode: "allSource",
      fieldType: "TEXT",
      fieldName: $T("sinv.receiptWorkbench.view.receipt.multipleSearchText").$D("订单/送货单/协议/参考凭证/收货单号查询"),
    },
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/trx/doing-sinv/line`,
        method: "get",
      },
    },
    events: {
    }
  };
}

export { doingDS, doingByLineDS };
