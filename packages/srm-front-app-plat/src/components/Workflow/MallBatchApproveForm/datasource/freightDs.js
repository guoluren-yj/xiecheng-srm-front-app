import { $T } from "srm-mobile-ui";

function basicDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: false,
    showTotalCount: true,
    enableQuery:false,
    fields: [
      {
        fieldCode: "orderCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.orderCode").$D("商城订单编码"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "entryCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.lineNumber").$D("行号"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.itemName").$D("物料名称"),
      },
      {
        fieldCode: "extraCostTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.additionType").$D("附加费种类"),
      },
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
        fieldCode: "unitPriceMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.freightAmountTaxNew").$D("单价(含税)"),
      },
      {
        fieldCode: "entryAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.lineAmountTaxNew").$D("行金额(含税)"),
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
