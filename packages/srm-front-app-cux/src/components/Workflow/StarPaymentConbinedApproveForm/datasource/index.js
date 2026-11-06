import { $T } from "srm-mobile-ui";

export function headerDs() {
  return {
    autoQuery: false,
    fields: [
      {
        fieldCode: "documentCode",
        fieldName: $T("scux.paymentConbined.model.documentCode").$D("付款申请组合编号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "paymentGroupName",
        fieldName: $T("scux.paymentConbined.model.paymentGroupName").$D("付款申请组合名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sumTaxIncludedAmount",
        fieldName: $T("scux.paymentConbined.model.sumTaxIncludedAmount").$D("付款组合汇总金额（含税）"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "firstUnitName",
        fieldName: $T("scux.paymentConbined.model.firstUnitName").$D("大部门"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "remark",
        fieldName: $T("scux.paymentConbined.model.remark").$D("付款组合摘要"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.paymentConbined.model.creationDate").$D("创建日期"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("scux.paymentConbined.model.supplierName").$D("供应商名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "documentApprovalStatusMeaning",
        fieldName: $T("scux.paymentConbined.model.documentApprovalStatus").$D("审批状态"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "employeeName",
        fieldName: $T("scux.paymentConbined.model.employeeName").$D("指定审批人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "totalAttachmentUuid",
        fieldName: $T("scux.paymentConbined.model.totalAttachmentUuid").$D("附件"),
        fieldType: "UPLOAD",
        bucketName: "private-bucket",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/bYMUEPVMwDWEc7YHbsOvmuy9pXBicoDJibJFSn5zgMwFI137cPaFNzk9ly5IZjNUsw?queryType=DETAIL`,
        method: "get",
      },
    },
  };
}

export function lineDs() {
  return {
    autoQuery: false,
    paging: false,
    editable: false,
    fields: [
      {
        fieldCode: "rfxLineItemNum",
        fieldType: "TEXT",
      },
      {
        fieldCode: "settleNum",
        fieldName: $T("scux.paymentConbined.model.settleNum").$D("付款申请编号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("scux.paymentConbined.model.supplierName").$D("供应商名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "companyName",
        fieldName: $T("scux.paymentConbined.model.companyName").$D("法人公司"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldName: $T("scux.paymentConbined.model.taxIncludedAmount").$D("付款申请金额(含税)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "remark",
        fieldName: $T("scux.paymentConbined.model.remark").$D("付款申请摘要"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "paymentCreatedName",
        fieldName: $T("scux.paymentConbined.model.paymentCreatedBy").$D("付款创建人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "unitName",
        fieldName: $T("scux.paymentConbined.model.createdUnitName").$D("创建人部门"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/bYMUEPVMwDWEc7YHbsOvmuy9pXBicoDJibJFSn5zgMwFI137cPaFNzk9ly5IZjNUsw?queryType=LINE-LIST`,
        method: "get",
      },
    },
  };
}