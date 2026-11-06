import { $T } from "srm-mobile-ui";
function orderDs() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    fields: [
      {
        fieldName: $T("scux.common.model.common.itemName").$D("物料名称"),
        fieldCode: "itemName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.common.model.common.quantity").$D("订单数量"),
        fieldCode: "quantity",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/watsons-store-scores/list/item`,
        method: "get",
      },
    },
  };
}

export default orderDs;