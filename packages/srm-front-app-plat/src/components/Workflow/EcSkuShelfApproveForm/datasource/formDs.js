import { $T } from "srm-mobile-ui";

function formDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: false,
    showTotalCount: true,
    enableQuery:false,
    fields: [
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.model.supplier").$D("供应商"),
      },
      {
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T("sagm.common.model.plateformCategory").$D("平台分类"),
      },
      {
        fieldCode: "catalogName",
        fieldName: $T("smpc.product.model.productCatalog").$D("商品目录"),
      },
      {
        fieldCode: "introductions",
        fieldName: $T("smpc.product.view.title.skuDescription").$D("商品描述"),
      },
      {
        fieldCode: "labels",
        fieldName: $T("smpc.product.view.skuLabel").$D("商品标签"),
      },
      {
        fieldCode: "shelfRemark",
        fieldName: $T("smpc.workbench.view.confirm.shelfReason").$D("上架原因"),
      },
      // 价格信息
      {
        fieldName: $T("smpc.product.model.marketPrice").$D("市场价"),
        type: "number",
        fieldCode: "marketPrice",
        // transformResponse: (_, data) => data?.skuPreviewInfoDTO?.platPrice,
      },
      {
        fieldCode: "agreementTaxedPrice",
        type: "number",
        fieldName: $T("smpc.product.model.taxAgreementPrice").$D("协议价格(含税)"),
      },
      {
        fieldCode: "agreementPrice",
        type: "number",
        fieldName: $T("smpc.product.model.noTaxPlatPrice").$D("协议价格(不含税)"),
      },
      {
        fieldCode: "tax",
        type: "number",
        fieldName: $T("smpc.product.model.tax").$D("税率"),
      },
      {
        fieldCode: "currencyName",
        fieldName: $T("smpc.product.model.currency").$D("币种"),
      },
      {
        fieldCode: "allUnitFlag",
        fieldName: $T("smpc.product.model.buyOrg").$D("可采买组织"),
      },
      {
        fieldName: $T("smpc.product.model.deliveryDay").$D("供货周期(天)"),
        fieldCode: "deliveryDay",
        type: "number",
      },
      // 商品属性
      {
        fieldCode: "brandName",
        fieldName: $T("smpc.product.view.brand").$D("品牌"),
      },
      // 物料信息
      {
        fieldName: $T("smpc.product.model.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("smpc.product.model.itemName").$D("物料名称"),
        fieldCode: "itemName",
      },
      {
        fieldCode: "itemCategoryCode",
        fieldName: $T("smpc.product.view.itemCategoryCode").$D("物料品类编码"),
      },
      {
        fieldCode: "itemCategoryName",
        fieldName: $T("smpc.product.view.itemCategoryName").$D("物料品类名称"),
      },
    ],
  };
}

export default formDs;
