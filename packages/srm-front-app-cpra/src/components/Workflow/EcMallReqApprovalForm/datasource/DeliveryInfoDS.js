import { $T } from "srm-mobile-ui";
function deliveryInfoDS() {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        fieldName: $T("sprm.common.model.receiveContactName").$D("收货联系人"),
        fieldCode: "receiverContactName",
      },
      {
        fieldName: $T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
        fieldCode: "receiverTelNum",
      },
      {
        fieldName: $T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
        fieldCode: "receiverAddressName",
      },
      {
        fieldName: $T("sprm.common.model.common.invoiceContactName").$D("收单联系人"),
        fieldCode: "invoiceContactName",
      },
      {
        fieldName: $T("sprm.common.model.common.invoiceTelNum").$D("收单联系电话"),
        fieldCode: "invoiceTelNum",
      },
      {
        fieldName: $T("sprm.common.model.common.purchaseUnitName").$D("收货方组织"),
        fieldCode: "purchaseUnitName",
      },
      {
        fieldName: $T("sprm.common.model.common.receiverEmail").$D("收单邮箱"),
        fieldCode: "receiverEmailAddress",
      },
    ],
    transport: {
    },
  };
}

export default deliveryInfoDS;
