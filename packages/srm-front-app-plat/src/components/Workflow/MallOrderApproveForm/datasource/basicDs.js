import { $T } from "srm-mobile-ui";

function basicDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    showTotalCount: true,
    enableQuery: false,
    fields: [
      {
        fieldCode: "orderCode",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.orderCoder").$D("订单编码"),
      },
      {
        fieldCode: "showOrderStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.orderStatusMeaning").$D(
          "订单状态"
        ),
      },
      {
        fieldCode: "orderTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.orderTypeMeaning").$D(
          "订单类型"
        ),
      },
      {
        fieldCode: "proxyPaymentTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.paymentMethods").$D("支付方式"),
      },
      {
        fieldCode: "currencyName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.currencyCode").$D("币种"),
      },
      {
        fieldCode: "extraCostAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.orderCostTax").$D(
          "附加费金额(含税)"
        ),
        editor: false,
      },
      {
        fieldCode: "proxyProductAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.totalPriceTax").$D(
          "商品总额(含税)"
        ),
        editor: false,
      },
      {
        fieldCode: "proxyOrderAmountMeaning",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.ordMoneyTax").$D(
          "订单金额(含税)"
        ),
        editor: false,
      },
      {
        fieldCode: "purchaseCompanyName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.purchaseCompanyName").$D(
          "采购方"
        ),
      },
      {
        fieldCode: "showSupplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.supplierCompanyName").$D(
          "供应商"
        ),
      },
      {
        fieldCode: "creationDate",
        fieldType: "DATE_PICK",
        fieldName: $T("smodr.orderDetail.model.buyerDate").$D("下单时间"),
        timePicker: true,
        editor: false,
      },
      {
        fieldCode: "buyerName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.buyerName").$D("下单人"),
      },
      {
        fieldCode: "buyerFullPhone",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.phone").$D("手机号码"),
      },
      {
        fieldCode: "unitName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.buyerUnit").$D("所属部门"),
      },
      {
        fieldCode: "contactName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.contactName").$D("收货人姓名"),
      },
      {
        fieldCode: "fullPhone",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.fullPhone").$D("收货人手机号码"),
      },
      {
        fieldCode: "fullAddress",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.address").$D("收货人详细地址"),
      },
      // 收单人
      {
        fieldCode: "invoiceContactName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.acquirerName").$D("收单人姓名"),
      },
      {
        fieldCode: "invoiceTelNum",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.invoiceTelNum").$D(
          "收单人手机号码"
        ),
      },
      {
        fieldCode: "acquireFullAddress",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.acquirerAddress").$D(
          "收单人详细地址"
        ),
      },
      {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.ouName").$D("业务实体"),
      },
      {
        fieldCode: "purOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.purchaseOrg").$D("采购组织"),
      },
      {
        fieldCode: "invoiceTypeName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.invoiceType").$D("发票类型"),
      },
      {
        fieldCode: "invoiceStateName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.invoiceMethod").$D("开票方式"),
      },
      {
        fieldCode: "invoiceTitleTypeName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.invoiceTitle").$D("发票抬头"),
      },
      {
        fieldCode: "invoiceContentName",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.invoiceContent").$D("发票内容"),
      },
      {
        fieldCode: "taxRegisterNum",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.taxNumber").$D("纳税人识别号"),
      },
      {
        fieldCode: "depositBank",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.depositBank").$D("开户银行"),
      },
      {
        fieldCode: "bankAccount",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.bankAccount").$D("银行账户"),
      },
      {
        fieldCode: "registeredAddress",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.contactAddress").$D("联系地址"),
      },
      {
        fieldCode: "registeredPhone",
        fieldType: "TEXT",
        fieldName: $T("smodr.orderDetail.model.contactPhone").$D("联系电话"),
      },
    ],
    transport: {
      read: {
        url: `/smodr/v1/${localStorage.getItem(
          "organizationId"
        )}/orders/inner-detail?customizeUnitCode=SMODR.ORDER.DETAIL.ORDER.APPROVE,SMBL.WORKFLOW.MALL_ORDER.BASIC_MAIN,SMBL.WORKFLOW.MALL_ORDER.BASIC_CONTACT,SMBL.WORKFLOW.MALL_ORDER.BASIC_INVOICE,SMBL.WORKFLOW.MALL_ORDER.BASIC_BUYER,`,
        method: "get",
      },
    },
  };
}

export default basicDs;
