import { $T } from "srm-mobile-ui";

function lineDs() {
  return {
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    editable: false,
    fields: [
      {
        fieldCode: "statusMeaning",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.statusMeaning").$D("状态"),
      },
      {
        fieldCode: "documentNumber",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.documentNumber").$D("单号"),
      },
      {
        fieldCode: "isManyMeaning",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.isMany").$D("是否一箱多件"),
      },
      {
        fieldCode: "boxRule",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("smbl.workFlow.model.boxRule").$D("箱规"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.itemCode").$D("SKU编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.itemName").$D("SKU名称"),
      },
      {
        fieldCode: "categoryCode",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.categoryCode").$D("叶子类目编码"),
      },
      {
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.categoryName").$D("叶子类目名称"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.uomName").$D("单位"),
      },
      {
        fieldCode: "typeMeaning", // todos 类型
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.type").$D("类型"),
      },
      {
        fieldCode: "creationDate",
        // fieldType: "DATE_PICKER",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "createByName",
        fieldType: "TEXT",
        fieldName: $T("smbl.workFlow.model.createByName").$D("创建人"),
      },
      // {
      //   fieldCode: "operationRecord",
      //   fieldType: "TEXT",
      //   fieldName: $T("smbl.workFlow.model.operationRecord").$D("操作记录"),
      // },
    ],
  };
}

export { lineDs };
