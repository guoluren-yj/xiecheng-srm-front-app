import { SrmUtil, $T } from "srm-mobile-ui";

const amountPrecision = (val, record) => val && record.amountPrecision;

export default function (payHeaderId) {
  return {
    paging: false,
    editable: false,
    autoQuery: true,
    enableQuery: false,
    fields: [
      {
        fieldCode: "statementLineNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.statementLineNum").$D("流水行编号"),
      },
      {
        fieldCode: "matchAmount",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.matchAmount").$D("匹配金额"),
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
      },
      {
        fieldCode: "payLineNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.matchPayLineNum").$D("匹配支付行号"),
      },
      {
        fieldCode: "payNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payTransactionNum").$D("支付事务编号"),
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
        fieldCode: "matchRuleMeaning",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.autoMatchRule").$D("自动匹配规则"),
      },
    ],
    pathParameter: {
      payHeaderId,
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "/sbdm/v1/{tenantId}/pay-statement-lines/match/{payHeaderId}",
        method: "GET",
      },
    },
    events: {
      beforeQuery: (dsConfig, _, pathParams) => {
        const { statementLineId } = pathParams;
        if (statementLineId) {
          dsConfig.transport.read.url = "/sbdm/v1/{tenantId}/pay-statement-lines/match-detail/{statementLineId}";
        }
      },
    },
  };
}