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
        fieldCode: "skuCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.skuCode").$D("商品编码"),
      },
      {
        fieldCode: "skuName",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.skuName").$D("商品名称"),
      },
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.lineCode").$D("行号"),
      },
      {
        fieldCode:"skuTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.skuTypeMeaning").$D("商品类型"),
      },
      {
        fieldCode: "quantityMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.quantity").$D("数量"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.uomName").$D("单位"),
      },
      {
        fieldCode: "currencyName",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.currency").$D("币种"),
      },
      {
        fieldCode: "unitPriceMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.priceTax").$D("预估单价(含税)"),
      },
      {
        fieldCode: "per",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.per").$D("每"),
      },
      {
        fieldCode: "amountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.amountTax").$D("预估行金额(含税)"),
      },
      {
        fieldCode: "neededDate",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.needDate").$D("需求日期"),
      },
      {
        fieldCode: "requestByName",
        fieldType: "TEXT",
        fieldName: $T("smodr.apply.model.realRequestName").$D("实际需求人"),
      },
      {
        fieldCode: "requestStatus",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.requestStatus").$D("状态"),
      },
      {
        fieldCode: "attachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.attachmentUuid").$D("附件"),
      },
    ],
    transport: {
      read: {
        url: `/smodr/v1/${localStorage.getItem("organizationId")}/mall-request-entrys/list?customizeUnitCode=SMODR.REQUEST.DETAIL.SKU.INFO`,
        method: "get",
      },
    },
  };
}

export default skuDs;
