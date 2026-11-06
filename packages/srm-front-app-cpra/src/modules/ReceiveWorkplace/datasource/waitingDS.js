import { $T, SrmUtil } from "srm-mobile-ui";
import { getLabelName } from "../../../utils/index";

//待收货
function waitingDS(vue, isDoubleUnit) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    editable:true,
    editFlag: false,
    filterCustomizeCode: "SMBL.RECEIVE_WORKPLACE.WAITIN_LIST.SEARCH",
    queryParameter: {
      customizeFilterComparison: "itemCode:=,itemName:LIKE,invOrganizationId:=,companyId:=,agentId:=",
    },
    fields: [
      {
        fieldCode: "nodeConfigName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName.nodeConfigName").$D("收货节点"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.itemName").$D("物料名称"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: getLabelName(isDoubleUnit, "uomName",),
      },
      {
        fieldCode: "secondaryUomName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位"),
      },
      {
        fieldCode: "secondaryUomId",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "secondaryQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量"),
      },
      {
        fieldCode: "secondaryLeftQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量"),
        editor:false,
      },
      {
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        fieldName: getLabelName(isDoubleUnit, "quantity", 1),
      },
      {
        fieldCode: "leftQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: getLabelName(isDoubleUnit, "leftQuantity", 0),
        editor:false,
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.taxIncludedAmount").$D("执行金额(含税)"),
      },
      {
        fieldCode: "leftTaxAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptExecution.model.receipt.leftTaxAmount.tax").$D("可执行金额(含税)"),
        editor:false,
      },
      {
        fieldCode: "trxDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.trxDate").$D("实际操作日期"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.invOrganizationName").$D("收货组织"),
      },
      {
        fieldCode: "organizationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.invOrganizationName").$D("收货组织"),
      },
      {
        fieldCode: "inventoryId",
        fieldType: "TEXT",
        // lovCode: "SODR.INVENTORY",
        // displayField:"inventoryName",
        fieldName: $T("sinv.receipWorkbench.model.receipt.inventoryName").$D("库房"),
      },
      {
        fieldCode: "locatorId",
        fieldType: "TEXT",
        // lovCode: "HPFM.LOCATION",
        // displayField:"locationName",
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
        fieldCode: "fromOrderTypeName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.orderTypeName").$D("来源单据类型"),
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
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.agentName").$D("采购员"),
      },
      {
        fieldCode: "creationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.creationName").$D("创建人"),
      },
      {
        fieldCode: "dueDate",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.deliverTime").$D("妥投时间"),
      },
      {
        fieldCode: "fromDisplayTrxHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theDisplayTrxNum").$D("参考凭证编号｜行号"),
      },
      {
        fieldCode: "fromPcHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theFromPcNum").$D("来源协议编号｜行号"),
      },
      {
        fieldCode: "strategyCode",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.receiptStrategy").$D("收货策略"),
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
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/trx/waiting`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, result) => {
        vue.btnDisabled = false;
        if (vue.scanFlag) {
          console.info("扫码后查询结果", vue.scanFlag, result);
          if (result && result.length > 0) {
            console.info("执行扫码创建", vue.waitingDataSet.selected);
            vue.createReceive(result);
          }
          vue.scanFlag = false;
        }
      },
      beforeQuery: () => {
        vue.btnDisabled = true;
      },
    }
  };
}

export { waitingDS };
