import { $T, SrmUtil } from "srm-mobile-ui";
import { getLabelName } from "../../../utils/index";

//待收货
function reverseDs(isDoubleUnit) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    editable:true,
    // editFlag: true,
    filterCustomizeCode: "SMBL.RECEIVE_WORKPLACE.REVERSE_LIST.SEARCH",
    queryParameter: { customizeFilterComparison: "itemCode:=,itemName:LIKE,invOrganizationId:=,companyId:=,agentId:=" },
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
        fieldCode: "secondaryUomName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        // fieldName: $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位"),
        fieldName: getLabelName(isDoubleUnit, "uomName"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "secondaryLeftQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D("可退货数量"),
        editor:false
      },
      {
        fieldCode: "leftQuantity",
        fieldType: "INPUT_NUMBER",
        // fieldName: $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D("可退货数量"),
        fieldName: getLabelName(isDoubleUnit, "leftQuantity", 1),
        editor:false
      },
      {
        fieldCode: "leftTaxAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptExecution.model.receipt.can.return.leftTaxAmount").$D("可退回金额(含税)"),
        editor:false
      },
      {
        fieldCode: "displayTrxHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.orderTypeName.receiveNumByTrx").$D("收货单编号 | 行号"),
      },
      {
        fieldCode: "trxDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.trxDate").$D("实际操作日期"),
        // timePicker: true,
        editor:false
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
        fieldCode: "agentName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.agentName").$D("采购员"),
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
    // 查询表单字段
    // queryFields: [ {
    //   fieldCode: "itemCode",
    //   fieldType: "LOV",
    //   lovCode: "SODR.PO_ITEM",
    //   fieldName: $T("sinv.receipWorkbench.model.receipt.itemCode").$D("物料编码"),
    //   options:{
    //     displayField: "itemName",
    //     subDisplayField:"itemCode"
    //   }
    // }, {
    //   fieldCode: "itemName",
    //   fieldType: "TEXT",
    //   fieldName: $T("sinv.receipWorkbench.model.receipt.itemName").$D("物料名称"),
    // }, {
    //   fieldCode: "tempKey",
    //   fieldType: "LOV",
    //   lovCode: "SPUC.SINV.SUPPLIER",
    //   fieldName: $T("sinv.receiptExecution.model.receipt.supplierCompanyName").$D("供应商"),
    //   options:{
    //     displayField: "supplierCompanyName",
    //     subDisplayField: "supplierCompanyNum"
    //   }
    // }, {
    //   fieldCode: "companyId",
    //   fieldType: "LOV",
    //   lovCode: "SPFM.USER_AUTH.COMPANY",
    //   fieldName: $T("sinv.receipWorkbench.model.receipt.companyName").$D("公司"),
    //   options:{
    //     displayField: "companyName",
    //     subDisplayField: "companyNum"
    //   }
    // }, {
    //   fieldCode: "invOrganizationId",
    //   fieldType: "LOV",
    //   lovCode: "SPFM.USER_AUTH.INVORG",
    //   fieldName: $T("sinv.receipWorkbench.model.receipt.invOrganizationName").$D("收货组织"),
    //   options:{
    //     displayField: "organizationName",
    //     subDisplayField: "organizationCode"
    //   }
    // }, {
    //   fieldCode: "agentId",
    //   fieldType: "LOV",
    //   lovCode: "SPFM.USER_AUTH.PURCHASE_AGENT",
    //   fieldName: $T("sinv.receiptWorkbench.model.receipt.agentName").$D("采购员"),
    //   options:{
    //     displayField: "purchaseAgentName",
    //     subDisplayField: "purchaseAgentCode"
    //   }
    // }, ],
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/trx/can-reverse/line?customizeUnitCode=SINV.RECEIPT_WORKBENCH_THING.RETURN.K,SINV.RECEIPT_WORKBENCH_THING.RETURN_SEARCH`,
        method: "get",
      },
    },
    events: {
    }
  };
}

export { reverseDs };
