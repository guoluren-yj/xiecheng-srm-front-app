import { $T } from "srm-mobile-ui";

// 品质异常单表格数据 attributeVarchar32
export const abnormalAttCountTableDs = () => ({
  autoQuery: false,
  editable: false,
  fields: [
    {
      fieldCode: "problemHeaderId",
      fieldName: $T("sslm.common.model.problemHeaderId").$D("单据号"),
    },
    {
      fieldCode: "problemNum",
      fieldName: $T("sslm.common.model.problemNum").$D("编号"),
    },
  ],
});
// 考评单表格数据 attributeVarchar35
export const evaluationAttCountTableDs = () => ({
  autoQuery: false,
  editable: false,
  fields: [
    {
      fieldCode: "evalHeaderId",
      fieldName: $T("sslm.common.model.evaluationHeaderId").$D("单据主键id"),
    },
    {
      fieldCode: "evalNum",
      fieldName: $T("sslm.common.model.evalNum").$D("考评单号"),
    },
    {
      fieldCode: "evalName",
      fieldName: $T("sslm.common.model.evalDesc").$D("考评描述"),
    },
  ],
});
// 稽核案件表格数据 attributeVarchar33
export const checkAttCountTableDs = () => ({
  autoQuery: false,
  editable: false,
  fields: [
    {
      fieldCode: "title",
      fieldName: $T("sslm.common.model.checkTitle").$D("标题"),
    },
    {
      fieldCode: "supplierCode",
      fieldName: $T("sslm.common.model.checkSupplierCode").$D("供应商编码"),
    },
    {
      fieldCode: "auditCaseCode",
      fieldName: $T("sslm.common.model.checkAuditCaseCode").$D("稽核案件编码"),
    },
    {
      fieldCode: "level",
      fieldName: $T("sslm.common.model.checkLevel").$D("严重程度"),
    },
  ],
});
