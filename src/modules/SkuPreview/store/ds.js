import { $T } from "srm-mobile-ui";

const inferenceInfoDS = () => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  editFlag: false,
  selection: Infinity,
  fields: [
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.model.supplier").$D("供应商"),
    },
    {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.model.itemCode").$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.model.itemName").$D("物料名称"),
    },
    {
      fieldCode: "skuCode",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.view.skuCode").$D("商品编码"),
    },
    {
      fieldCode: "thirdSkuCode",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.view.thirdSkuCode").$D("第三方商品编码"),
    },
    {
      fieldCode: "brandName",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.view.brand").$D("品牌"),
    },
    {
      fieldCode: "categoryCode",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.model.itemCategoryCode").$D("品类编码"),
    },
    {
      fieldCode: "categoryName",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.model.itemCategoryName").$D("品类名称"),
    },
    {
      fieldCode: "deliveryDay",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.view.supplyCycle").$D("供货周期"),
    },
    {
      fieldCode: "refundsInfo",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.view.refundsInfo").$D("退货信息"),
    },
    {
      fieldCode: "exchangeInfo",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.view.exchangeInfo").$D("换货信息"),
    },
    {
      fieldCode: "warrantyInfo",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.view.warrantyInfo").$D("质保信息"),
    },
    {
      fieldCode: "specialAfs",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.view.specialAfs").$D("特殊售后说明"),
    },
  ],
});

export {
  inferenceInfoDS,
};