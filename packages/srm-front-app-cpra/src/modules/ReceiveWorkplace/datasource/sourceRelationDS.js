import { $T, SrmUtil } from "srm-mobile-ui";
import { getLabelName } from '../../../utils/index';

function sourceRelationDs(isDoubleUnit) {
  return {
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    data: [],
    showTotalCount: true,
    editable: false,
    fields: [
      {
        fieldCode: "displayTrxHeaderAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.orderTypeName.receiptTrxNums").$D("收货单号｜行号"),
      },
      {
        fieldCode: "rcvTypeName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.rcvTypeReName").$D("收货类型"),
      },
      {
        fieldCode: "secondaryQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.amount").$D("数量"),
      },
      {
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        fieldName: getLabelName(isDoubleUnit, 'quantity', 0),
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.receiptsAmount").$D("单据金额"),
      },
      {
        fieldCode: "returnedFlag",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.aogReturnedThings").$D("收货/退回"),
      },
      {
        fieldCode: "trxDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.trxDate").$D("实际操作日期"),
      },
      {
        fieldCode: "hidePriceFlag",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/source/node-trx/list?`,
        method: "get",
      },
    },
  };
}

export { sourceRelationDs };
