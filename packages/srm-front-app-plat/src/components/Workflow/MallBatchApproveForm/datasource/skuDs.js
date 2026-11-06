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
        fieldCode: "orderCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.orderCode").$D("商城订单编码"),
      },
      {
        fieldCode: "skuCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.skuCode").$D("商品编码"),
      },
      {
        fieldCode: "entryCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.entryCode").$D("商品行号"),
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
        fieldCode: "productAttributeMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.productAttributeMeaning").$D("销售规格"),
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
        fieldCode: "originalQuantityMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.quantity").$D("数量"),
        editor:false
      },
      {
        fieldCode: "uom",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.uomName").$D("单位"),
        editor:false
      },
      {
        fieldCode: "proxyUnitPriceMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.proxyUnitPriceMeaning").$D("单价(含税)"),
        editor:false
      },
      {
        fieldCode: "per",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.per").$D("每"),
        editor:false
      },
      {
        fieldCode: "unitPriceMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.proxyUnitPriceMeaning").$D("单价(含税)"),
        editor:false
      },
      {
        fieldCode: "proxyEntryAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.lineAmountTaxNew").$D("行金额(含税)"),
        editor:false
      },
      {
        fieldCode: "entryAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.lineAmountTaxNew").$D("行金额(含税)"),
        editor:false
      },
      {
        fieldCode: "neededDate",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.neededDate").$D("需求日期"),
      },
    ],
    transport: {
      read: {
        url: `/smodr/v1/${localStorage.getItem("organizationId")}/order-entrys?freightFlag=0`,
        method: "get",
      },
    },
  };
}

export default skuDs;
