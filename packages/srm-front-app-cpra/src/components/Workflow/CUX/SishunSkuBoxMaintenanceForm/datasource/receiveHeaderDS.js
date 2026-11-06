import { $T } from "srm-mobile-ui";

function headerDs() {
  return {
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    editable: false,
    fields: [
      {
        fieldCode: "approveNumber",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.approveNumber").$D("审批单号"),
      },
      {
        fieldCode: "createByName",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.createByName").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        // fieldType: "DATE_PICKER",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "approveTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.approveTypeMeaning").$D("审批类型"),
      },
      {
        fieldCode: "skuType", // SCUX_VEVOR_BOX_RULE_SKU_TYPE
        // fieldType: "TEXT",
        // fieldType: "SELECT",
        // lovCode: "SCUX_VEVOR_BOX_RULE_SKU_TYPE",
        fieldName: $T("smbl.workFlow.model.skuTypeMeaning").$D("SKU类型"),
        // displayField: "skuTypeMeaning", //显示字段
      },
      {
        fieldCode: "approveRemark",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.approveRemark").$D("审批说明"),
      },
    ],
  };

}

export { headerDs };
