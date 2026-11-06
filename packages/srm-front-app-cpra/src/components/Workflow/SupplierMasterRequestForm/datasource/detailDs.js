import { SrmUtil, $T } from "srm-mobile-ui";
// 头信息
function headerDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    fields: [
      // 基础信息
      {
        fieldCode: "applyStatus",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.applyStatus").$D("状态"),
        fieldType: "SELECT",
        // displayField: "transportTypeMeaning",
        lovCode: "SCUX_VEVOR_SUPP_APPLY_STATUS",
      },
      {
        fieldCode: "approveNum",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.approveNum").$D("变更申请单号"),
      },
      {
        fieldCode: "applyType",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.applyType").$D("变更申请类型"),
        // fieldType: "SELECT",
        // displayField: "transportTypeMeaning",
        // lovCode: "SCUX_VEVOR_SUPP_APPLY_TYPE",
      },
      {
        fieldCode: "createdName",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.createdName").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.creationDate").$D("创建时间"),
        fieldType: "DATE",
      },
      {
        fieldCode: "remarks",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.remarks").$D("变更备注"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/yic4zQhxiajPbfPVrGLibibYx1uYHiaoibicsYlp5oEHJuXaWg?queryType=detailHead&id={id}`,
        method: "get",
      },
    },
  };
}
// 行信息
function lineDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    editable: false,
    pageSize: 20,
    // 模型字段
    fields: [
      {
        fieldCode: "lineNum",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.lineNum").$D("行号"),
      },
      {
        fieldCode: "supplierNum",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.supplierNum").$D("SRM供应商编码"),
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.invOrganization").$D("仓库"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.company").$D("公司主体"),
      },
      {
        fieldCode: "createModStatus",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.createModStatus").$D("创建变更单状态"),
        // fieldType: "SELECT",
        // displayField: "transportTypeMeaning",
        // lovCode: "SCUX_VEVOR_CREATE_MOD_STATUS",
      },
      {
        fieldCode: "failReason",
        fieldName: $T("scux.supplierMasterRequestForm.model.supplierMasterRequestForm.failReason").$D("同步失败原因"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/yic4zQhxiajPbfPVrGLibibYx1uYHiaoibicsYlp5oEHJuXaWg?queryType=detailLine&id={id}`,
        method: "get",
      },
    },
  };
}

export {
  headerDs,
  lineDs,
};
