import { $T } from "srm-mobile-ui";
function supplyInfoDS() {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        fieldName: $T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称"),
        fieldCode: "itemName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.commonApplication.model.coApp.itemCategoryCode").$D("品类代码"),
        fieldCode: "itemCategoryCode",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
        fieldCode: "itemCategoryName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.commonApplication.model.coApp.supplyFlag").$D("是否可供"),
        fieldCode: "supplyFlag",
        fieldType: "TEXT",
        defaultValue: "",
      },
    ],
    transport: {
    },
  };
}

export default supplyInfoDS;
