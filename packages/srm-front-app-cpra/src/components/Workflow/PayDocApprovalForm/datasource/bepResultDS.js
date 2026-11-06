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
        fieldCode: "payStatus",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payStatus").$D("支付状态"),
        fieldType: "SELECT",
        lovCode: "SBSM.BEP_RECORD_STATUS",
      },
      {
        fieldCode: "bepRecordNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bepRecordNum").$D("银企支付记录编号"),
      },
      {
        fieldCode: "payCommandNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payInstrucNumber").$D("支付指令编号"),
      },
      {
        fieldCode: "statementLineNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payDocSettlementLineNum").$D("支付单流水行号"),
      },
      {
        fieldCode: "verificationCode",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payDocSmsCode").$D("支付单短信验证码"),
      },
      {
        fieldCode: "payInitiationDate",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payInitiationTime").$D("发起支付时间"),
        fieldType: "DATE_PICKER",
        options: {
          format: "yyyy-MM-dd HH:mm:ss"
        }
      },
      {
        fieldCode: "payAmount",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payAmount").$D("支付金额"),
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
      },
      {
        fieldCode: "bepRequestStatus",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bepRequestStatus").$D("支付申请状态"),
        fieldType: "SELECT",
        lovCode: "SBSM.BEP_REQUEST_STATUS",
      },
      {
        fieldCode: "payFailedReason",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payResultInfo").$D("支付结果信息"),
      },
      {
        fieldCode: "createByName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.creator").$D("创建人"),
      },
      {
        fieldCode: "sdatPayNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bepPayPlatformNum").$D("SDAT支付平台单号"),
      },
      {
        fieldCode: "bankSerialNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.bankSerialNum").$D("银行流水号"),
      },
    ],
    pathParameter: {
      payHeaderId,
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "/sbdm/v1/{tenantId}/pay-bep-records/list/by/{payHeaderId}",
        method: "GET",
      }
    },
  };
}