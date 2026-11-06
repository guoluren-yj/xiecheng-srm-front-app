import { $T } from "srm-mobile-ui";

function basicDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    showTotalCount: true,
    enableQuery:false,
    fields: [
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
        fieldCode: "entryCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.lineNumber").$D("行号"),
      },
      {
        fieldCode: "extraCostTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.additionType").$D("附加费种类"),
      },
      // {
      //   fieldCode: "cecFromMeaning",
      //   fieldType: "TEXT",
      //   fieldName: $T("smodr.orderDetail.model.newOrderTypeMeaning").$D("运费来源"),
      // },
      // {
      //   fieldCode: "freightTypeMeaning",
      //   fieldType: "TEXT",
      //   fieldName: $T("smodr.orderDetail.model.freightTypeMeaning").$D("运费类型"),
      // },
      // {
      //   fieldCode: "freightPricingMethodMeaning",
      //   fieldType: "TEXT",
      //   fieldName: $T("smodr.orderDetail.model.freightRuleTypeMethod").$D("运费计价方式"),
      // },
      {
        fieldCode: "quantityMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.quantity").$D("数量"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.uomName").$D("单位"),
      },
      {
        fieldCode: "taxRateMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.taxRateMeaning").$D("税率"),
      },
      {
        fieldCode: "currencyName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.currencyCode").$D("币种"),
      },
      {
        fieldCode: "unitPriceMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.unitPriceTaxNew").$D("单价(含税)"),
        editor:false
      },
      {
        fieldCode: "entryAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.lineAmountTaxNew").$D("行金额(含税)"),
        editor:false
      },
    ],
    transport: {
      read: {
        url: `/smodr/v1/${localStorage.getItem("organizationId")}/order-entrys/extra-cost-list`,
        method: "get",
      },
    },
  };
}

export default basicDs;
