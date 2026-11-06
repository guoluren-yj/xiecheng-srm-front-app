import { SrmUtil, $T } from "srm-mobile-ui";

const amountPrecision = (val, record) => val && record.amountPrecision;

export default function (payHeaderId) {
  return {
    paging: false,
    editable: false,
    autoQuery: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "lineNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payDocSettlementLineNum").$D("支付单流水行号"),
      },
      {
        fieldCode: "payTypeName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.paymentMethod").$D("付款方式"),
      },
      {
        fieldCode: "payFormMeaning",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.paymentForm").$D("付款形式"),
      },
      {
        fieldCode: "payAmount",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payAmount").$D("支付金额"),
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
      },
      {
        fieldCode: "payStatus",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payStatus").$D("支付状态"),
        fieldType: "SELECT",
        lovCode: "SBSM.PAY_STATEMENT_STATUS",
      },
      {
        fieldCode: "payCommandNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bankPaymentInstrucNumber").$D("银企支付指令编号"),
      },
      {
        fieldCode: "payBankName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.purchaseBankName").$D("采购方银行名称"),
      },
      {
        fieldCode: "payBankBranchName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.purchaseBankBranchName").$D("采购方开户行名称"),
      },
      {
        fieldCode: "payBankFirm",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.purchaseBankBranchCode").$D("采购方联行行号"),
      },
      {
        fieldCode: "payBankAccountNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.purchaseBankAccount").$D("采购方银行账号"),
      },
      {
        fieldCode: "payBankAccountName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.purchaseBankAccountName").$D("采购方银行账号名称"),
      },
      {
        fieldCode: "bankDirectLinkOrgInfoCode",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bankDirectLinkOrgInfoCode").$D("银企直联组织信息代码"),
      },
      {
        fieldCode: "bankName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.supplierBankName").$D("供应商银行名称"),
      },
      {
        fieldCode: "bankBranchName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.supplierBankBranchName").$D("供应商开户行名称"),
      },
      {
        fieldCode: "bankFirm",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.supplierBankBranchCode").$D("供应商联行行号"),
      },
      {
        fieldCode: "bankAccountNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.supplierBankAccount").$D("供应商银行账号"),
      },
      {
        fieldCode: "bankAccountName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.supplierBankAccountName").$D("供应商银行账号名称"),
      },
      {
        fieldCode: "paperNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bankBillNumber").$D("票据号"),
      },
      {
        fieldCode: "dataSourceMeaning",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bankBillSource").$D("票据来源"),
      },
      {
        fieldCode: "paperTypeMeaning",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bankBillType").$D("票据类型"),
      },
      {
        fieldCode: "paperStatus",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bankBillActualStatus").$D("票据实际状态"),
        fieldType: "SELECT",
        lovCode: "SBSM.BAKN_PAPER_STATUS",
      },
      {
        fieldCode: "receiveBankName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.receivingBank").$D("收票银行"),
      },
      {
        fieldCode: "drawer",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.drawer").$D("出票人"),
      },
      {
        fieldCode: "acceptor",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.acceptor").$D("承兑人"),
      },
      {
        fieldCode: "payer",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payer").$D("付款人"),
      },
      {
        fieldCode: "invoiceDate",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.receiptOrIssuanceDate").$D("收票日/开立日"),
        fieldType: "DATE_PICKER",
      },
      {
        fieldCode: "issueDate",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.draftDate").$D("出票日"),
        fieldType: "DATE_PICKER",
      },
      {
        fieldCode: "draftsDeadLine",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.dueDate").$D("到期日"),
        fieldType: "DATE_PICKER",
      },
    ],
    pathParameter: {
      payHeaderId,
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        method: "GET",
      },
    },
    events: {
      beforeQuery: (dsConfig, _, pathParams) => {
        const { payForm } = pathParams;
        const urlMap = {
          BANK_CORPORATE_EXPRESS: "/sbdm/v1/{tenantId}/pay-statement-lines/bank-info/{payHeaderId}",
          BANK_PAPER: "/sbdm/v1/{tenantId}/pay-statement-lines/bank-paper/{payHeaderId}",
          OFFLINE_PAY: "/sbdm/v1/{tenantId}/pay-statement-lines/list/{payHeaderId}",
        };
        dsConfig.transport.read.url = urlMap[payForm];
      },
    }
  };
}