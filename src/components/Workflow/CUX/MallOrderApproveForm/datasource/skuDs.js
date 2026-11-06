import { $T } from "srm-mobile-ui";

function skuDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    showTotalCount: true,
    enableQuery:false,
    fields: [
      {
        fieldCode: "skuCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.skuCode").$D("商品编码"),
      },
      // {
      //   fieldCode: "primaryUrl",
      //   fieldType: "TEXT",
      //   fieldName: $T("smodr.orderDetail.model.primaryUrl").$D("商品图片"),
      // },
      {
        fieldCode: "skuName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.skuName").$D("商品名称"),
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
        fieldCode: "finalUnitPriceMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.unitPriceTax").$D("含税单价"),
        editor:false
      },
      {
        fieldCode: "finalEntryAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.lineAmountTax").$D("含税行金额"),
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
        fieldName: $T("smodr.orderDetail.model.containFreight").$D("单价是否含运费"),
      },
      {
        fieldCode: "eachFreight",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.fenAmount").$D("分摊运费（每）"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.remark").$D("备注"),
      },
      {
        fieldCode: "attributeVarchar10",
        fieldType: "TEXT",
        fieldName: $T("smbl.common.model.yxApprove.attributeVarchar10").$D("服务类型"),
      }
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
