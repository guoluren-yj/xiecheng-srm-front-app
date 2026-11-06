import { $T } from "srm-mobile-ui";

function orderDs() {
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
        fieldName: $T("smodr.orderDetail.model.orderCoder").$D("订单编码"),
      },
      {
        fieldCode: "batchAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.batchAmountMeaning").$D("商品项数"),
      },
      {
        fieldCode: "currencyName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.currencyCode").$D("币种"),
      },
      {
        fieldCode: "proxyOrderAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.batchProxyOrderAmountMeaning").$D("总金额(含税)"),
      },
      {
        fieldCode: "nakedPriceMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.batchNakedPriceMeaning").$D("总金额(不含税)"),
      },
      {
        fieldCode: "contactName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.view.reveiver").$D("收货人"),
      },
      {
        fieldCode: "mobilePhone",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.batchMobilePhone").$D("收货手机"),
      },
      {
        fieldCode: "fullAddress",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.batchFullAddress").$D("收货地址"),
      },
      {
        fieldCode: "showSupplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "attachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.accessoryInner").$D("内部附件"),
      },
      {
        fieldCode: "outerAttachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.accessoryOutter").$D("外部附件"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.remark").$D("备注"),
      },
    ],
    transport: {
      read: {
        url: `/smodr/v1/${localStorage.getItem("organizationId")}/orders/order-list`,
        method: "get",
      },
    },
  };
}

export default orderDs;
