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
      customizeUnitCode: "SFIN.INVOICE_CREATE_LIST.GRID,SFIN.INVOICE_CREATE_LIST.FILTER",
      needInvoiceFlag:0
    },
    fastQueryField: {
      fieldCode: "poNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.invoiceBill.model.invoiceBill.poNum").$D("订单号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "trxDateFrom",
        endDateFieldCode: "trxDateTo",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.trxDate").$D("事务日期"),
      },
      {
        fieldCode: "businessType",
        fieldType: "LOV",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.businessType").$D("业务类别"),
        lovCode: "SFIN.EN_BUSINESS_TYPE_CONFIG",
        displayField: "businessTypeMeaning",
        defaultValue:{
          value:"STANDARD",
          meaning:$T("sfin.invoiceBill.standard").$D("标准"),
        }
      },
      {
        fieldCode: "companyName",
        fieldType: "LOV",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.companyName").$D("客户公司"),
        lovCode: "SPFM.USER_AUTH.CUSTOMER",
        options:{
          valueField: "companyName",
          displayField:"companyName",
        },
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.material").$D("物料"),
      },
      {
        fieldCode: "billNumber",
        fieldType: "TEXT",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.invoiceApplicationForm").$D("开票申请单"),
      },
      {
        fieldCode: "displayTrxNum",
        fieldType: "TEXT",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.displayTrxNum").$D("事务编号"),
      },
      {
        fieldCode: "purchaseOrgId",
        fieldType: "LOV",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.purchaseOrgName").$D("采购组织"),
        lovCode: "HPFM.PURCHASE_ORGANIZATION",
      },
      {
        fieldCode: "inventoryId",
        fieldType: "LOV",
        fieldName: $T("sodr.common.model.common.inventoryId").$D("库房"),
        lovCode: "SODR.INVENTORY",
      },
      {
        fieldCode: "agentName",
        fieldType: "TEXT",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.purAgentName").$D("采购员"),
      },
      {
        fieldCode: "displayReverseFlag",
        fieldType: "SWITCH",
        fieldName: $T("sfin.invoiceBill.model.invoiceBill.filter.displayReverseFlag").$D("显示冲销数据"),
        defaultValue: 1
      },
      {
        fieldCode: "needInvoiceFlag",
        fieldType: "SWITCH",
        fieldName: $T("hipspfm.createInvoice.view.message.removedData").$D("显示已移除数据"),
        defaultValue: 0
      },
    ],
    transport: {
      read: {
        url: `/sfin/v1/${localStorage.getItem("organizationId")}/invoice/create`,
        method: "get",
      },
      create: {
        url: `/sfin/v1/${localStorage.getItem("organizationId")}/invoice/create`,
        method: "post",
      },
      update: {
        url: `/sfin/v1/${localStorage.getItem("organizationId")}/invoice/create`,
        method: "put",
      },
      destroy: {
        url: `/sfin/v1/${localStorage.getItem("organizationId")}/invoice/create`,
        method: "delete",
      },
    },
    events: {
      beforeQuery: (ds, params) => {
        params.needInvoiceFlag = params.needInvoiceFlag ? 0 : 1;
      }
    }
  };
}

export default indexDS;
