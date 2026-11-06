import { SrmUtil, $T } from "srm-mobile-ui";
import { BUCKET_DIRECTORY, PRIVATE_BUCKET } from "../utils";

const amountPrecision = (val, record) => val && record.amountPrecision;

export default function (payHeaderId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "payNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payDocNum").$D("支付单编号"),
      },
      {
        fieldCode: "payStatus",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payDocStatus").$D("支付单状态"),
        fieldType: "SELECT",
        lovCode: "SBSM.PAY_HEADER_STATUS",
      },
      {
        fieldCode: "companyNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.companyNum").$D("公司编号"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.companyName").$D("公司名称"),
      },
      {
        fieldCode: "ouName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.businessEntity").$D("业务实体"),
      },
      {
        fieldCode: "displaySupplierNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.supplierNum").$D("供应商编码"),
      },
      {
        fieldCode: "displaySupplierName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "supplierSiteName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.supplierSite").$D("供应商地点"),
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.currency").$D("币种"),
      },
      {
        fieldCode: "payTypeName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.paymentMethod").$D("付款方式"),
      },
      {
        fieldCode: "payForm",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.paymentForm").$D("付款形式"),
        fieldType: "SELECT",
        lovCode: "SBSM.PAY_FORM",
      },
      {
        fieldCode: "payAmount",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.totalAmount").$D("总金额"),
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
      },
      {
        fieldCode: "createdByName",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.createdBy").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.creationTime").$D("创建时间"),
        fieldType: "DATE_PICKER",
        options: {
          format: "yyyy-MM-dd HH:mm:ss"
        }
      },
      {
        fieldCode: "approveBatchNum",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.payDocBatch").$D("支付单批"),
      },
      {
        fieldCode: "remark",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.remark").$D("备注"),
      },
      {
        fieldCode: "reverseReason",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.reverseReason").$D("冲销原因"),
      },
      {
        fieldCode: "cancelReason",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.cancelReason").$D("取消原因"),
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("sbsm.paymentWorkbench.model.paymentWorkbench.attachment").$D("附件"),
        fieldType: "UPLOAD",
        bucketName: PRIVATE_BUCKET,
        bucketDirectory: BUCKET_DIRECTORY,
      },
    ],
    pathParameter: {
      payHeaderId,
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "/sbdm/v1/{tenantId}/pay-headers/detail/{payHeaderId}",
        method: "get",
      },
    },
  };
}