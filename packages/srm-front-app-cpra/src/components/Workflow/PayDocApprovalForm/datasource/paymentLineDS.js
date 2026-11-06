import { SrmUtil, $T } from "srm-mobile-ui";

const amountPrecision = (val, record) => val && record.amountPrecision;

export default function (payHeaderId) {
  return {
    paging: false,
    editable: false,
    autoQuery: true,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "lineNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payDocPayLineNum").$D("支付单支付行编号"),
      },
      {
        fieldCode: "payNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payTransactionNum").$D("支付事务编号"),
      },
      {
        fieldCode: "documentNumAndLineNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.srcTransactionNumAndLineNum").$D("来源事务编号-行号"),
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.paymentItemCode").$D("支付商品编码"),
      },
      {
        fieldCode: "itemName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.paymentItemName").$D("支付商品名称"),
      },
      {
        fieldCode: "payAmount",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.thisPayAmount").$D("本次支付金额"),
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
      },
      {
        fieldCode: "remark",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.lineRemark").$D("行备注"),
      },
      {
        fieldCode: "srmPoNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.srmPoNum").$D("采购订单编号"),
      },
    ],
    pathParameter: {
      payHeaderId,
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "/sbdm/v1/{tenantId}/pay-lines/{payHeaderId}",
        method: "get",
      }
    },
  };
}