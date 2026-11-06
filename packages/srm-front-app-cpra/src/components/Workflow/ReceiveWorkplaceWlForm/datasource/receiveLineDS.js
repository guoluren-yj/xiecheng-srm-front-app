import { $T, SrmUtil } from "srm-mobile-ui";
// import { getLabelName } from '../../../../utils/index';

function receiveLineDs(vue) {
  return {
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    fields: [
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
        fieldCode: "secondaryUomId",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
      },
      {
        fieldCode: "secondaryQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false
      },
      {
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        // fieldName: getLabelName(isDoubleUnit, 'quantity'),
      },
      {
        fieldCode: "secondaryLeftQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false
      },
      {
        fieldCode: "leftQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        editor: false
      },
      {
        fieldCode: "leftTaxAmount",
        fieldType: "INPUT_NUMBER",
        editor: false
      },
      {
        fieldCode: "trxDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.trxDate").$D("实际操作日期"),
        editor:false
      },
      {
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.invOrganizationName").$D("收货组织"),
      },
      {
        fieldCode: "inventoryId",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.inventoryName").$D("库房"),
        displayField: "inventoryName",
      },
      {
        fieldCode: "locatorId",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.locationName").$D("库位"),
        // displayField: "locationName",
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
        fieldCode: "productName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.productName").$D("商品名称"),
      },
      {
        fieldCode: "fromDisplayPoLineNum",
      },
      {
        fieldCode: "fromDisplayPoNum",
      },
      {
        fieldCode: "fromDisplayPoHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theFromDisplayPoLineNum").$D("来源订单编号｜行号"),
      },
      {
        fieldCode: "fromPcNum",
      },
      {
        fieldCode: "fromPcSubjectNum",
      },
      {
        fieldCode: "fromPcHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theFromPcNum").$D("来源协议编号｜行号"),
      },
      {
        fieldCode: "fromDisplayAsnNum",
      },
      {
        fieldCode: "fromDisplayAsnLineNum",
      },
      {
        fieldCode: "fromDisplayAsnHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theFromPcSubjectNum").$D("来源送货单编号｜行号"),
      },
      {
        fieldCode: "deliverTime",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receipWorkbench.model.receipt.deliverTime").$D("妥投时间"),
        editor: false
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
        fieldCode: "agentName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.agentName").$D("采购员"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.lineRemark").$D("行备注"),
      },
      {
        fieldCode: "sinvLineAttachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.lineUuid").$D("行附件"),
      },
      {
        fieldCode: "fromOrderTypeName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.orderTypeName").$D("来源单据类型"),
      },
      //退回原因
      {
        fieldCode: "moveReason",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.moveReason").$D("退回原因"),
        // lovCode: "SPUC.SINV.MOVE.REASON"
      },
      {
        fieldCode: "fromDisplayTrxNum",
      },
      {
        fieldCode: "fromDisplayTrxLineNum",
      },
      {
        fieldCode: "fromDisplayTrxHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.theDisplayTrxNum").$D("参考凭证编号｜行号"),
      },
      {
        fieldCode: "hidePriceFlag",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/trx/line/{rcvTrxHeaderId}/detail`,
        method: "get",
      },
      destroy: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/line/delete`,
        method: "delete",
      }
    },
    events: {
      afterQuery: (ds, result) => {
        //如果行上面没有进行金额隐藏，头金额需还原
        if (result && result.length > 0) {
          let temps = result.filter((item) => item.hidePriceFlag && Number(item.hidePriceFlag));
          if (temps.length === 0) {
            vue.headDataSet.current.setField("totalTaxIncludedAmount", vue.headDataSet.current.data["totalTaxIncludedAmountTemp"]);
          }
        } else {
          vue.headDataSet.current.setField("totalTaxIncludedAmount", vue.headDataSet.current.data["totalTaxIncludedAmountTemp"]);
        }
      }
    }
  };
}

export { receiveLineDs };
