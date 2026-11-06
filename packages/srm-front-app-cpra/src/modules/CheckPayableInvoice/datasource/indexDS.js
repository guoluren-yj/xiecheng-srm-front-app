import { $T } from "srm-mobile-ui";
function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter: {
      customizeUnitCode: "SODR.CONFIRM_ORDER_LIST.GRID,SODR.CONFIRM_ORDER_LIST.FILTER",
    },
    fastQueryField: {
      fieldCode: "taxInvoiceNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.invoiceBill.model.invoiceBill.taxInvoiceNumber").$D("税务发票号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "submitDateFrom",
        endDateFieldCode: "submitDateTo",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.submittedDate").$D("提交日期"),
      },
      {
        fieldCode: "businessType",
        fieldType: "LOV",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.businessType").$D("业务类别"),
        lovCode: "SFIN.EN_BUSINESS_TYPE_CONFIG",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "LOV",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.supplierCompanyId").$D("供应商"),
        lovCode: "SFIN.USER_AUTH.SUPPLIER",
        options:{
          valueField: "supplierCompanyName",
          displayField:"supplierCompanyName",
          queryParams:{
            organizationId:localStorage.getItem("organizationId")
          },
        },
      },
      {
        fieldCode: "businessType",
        fieldType: "SELECT",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.CheckStatus").$D("查验状态"),
        lovCode: "SFIN.INVOICE_HEADER_VALIDATE_STATUS",
      },
      {
        fieldCode: "orderNumber",
        fieldType: "TEXT",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.displayPoNums").$D("订单号"),
      },
      {
        fieldCode: "invoiceNumber",
        fieldType: "TEXT",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.srmInvoiceNumber").$D("SRM发票号"),
      },
      {
        fieldCode: "taxInvoiceNum",
        fieldType: "TEXT",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.taxInvoiceNumber").$D("税务发票号"),
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        lovCode:"SPFM.USER_AUTHORITY_COMPANY",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.company").$D("公司"),
      },
      {
        fieldCode: "outId",
        fieldType: "LOV",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.ouName").$D("业务实体"),
        lovCode: "SPFM.USER_AUTH.OU",
      },
      {
        fieldCode: "priceDifferenceFlag",
        fieldType: "SELECT",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.priceDifferenceFlag").$D("比对结果"),
        lovCode: "SFIN.INVOICE_PRICE_DIFF",
      },
    ],
    transport: {
      read: {
        url: `/sfin/v1/${localStorage.getItem("organizationId")}/invoice/approve`,
        method: "get",
      },
      create: {
        url: `/sfin/v1/${localStorage.getItem("organizationId")}/invoice/approve`,
        method: "post",
      },
      update: {
        url: `/sfin/v1/${localStorage.getItem("organizationId")}/invoice/approve`,
        method: "put",
      },
      destroy: {
        url: `/sfin/v1/${localStorage.getItem("organizationId")}/invoice/approve`,
        method: "delete",
      },
    },
  };
}

export default indexDS;
