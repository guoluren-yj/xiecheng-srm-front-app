import { $T } from "srm-mobile-ui";

function skuDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: false,
    showTotalCount: true,
    enableQuery:false,
    fields: [
      {
        fieldCode: "primaryUrl",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.primaryUrl").$D("商品图片"),
      },
      {
        fieldCode: "skuCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.skuCode").$D("商品编码"),
      },
      {
        fieldCode: "skuName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.skuName").$D("商品名称"),
      },
      {
        fieldCode: "productCompareDTO",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.competitive").$D("比价单"),
      },
      {
        fieldCode: "entryCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.entryCode").$D("商品行号"),
      },
      {
        fieldCode: "skuTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.skuTypeMeaning").$D("商品类型"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.itemName").$D("物料名称"),
      },
      {
        fieldCode: "quantityMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.quantity").$D("数量"),
        editor:false
      },
      {
        fieldCode: "unitPriceMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.unitPriceTaxNew").$D("单价(含税)"),
        editor:false
      },
      {
        fieldCode: "per",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.per").$D("每"),
        editor:false
      },
      {
        fieldCode: "entryAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.lineAmountTaxNew").$D("行金额(含税)"),
        editor:false
      },
      {
        fieldCode: "uom",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.uomName").$D("单位"),
      },
      {
        fieldCode: "currencyName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.currencyCode").$D("币种"),
      },
      {
        fieldCode: "taxRateMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.taxRateMeaning").$D("税率"),
      },
      {
        fieldCode: "containFreight",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.containFreight").$D("单价含运费"),
      },
      {
        fieldCode: "eachFreight",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.fenAmount").$D("分摊运费(每)"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.remark").$D("备注"),
      },
    ],
    transport: {
      read: {
        url: `/smodr/v1/${localStorage.getItem("organizationId")}/order-entrys?freightFlag=0&customizeUnitCode=SMODR.ORDER.DETAIL.ORDER.APPROVE.SKU`,
        method: "get",
      },
    },
  };
}

export default skuDs;
