import { $T } from "srm-mobile-ui";

function rfxItemsDS() {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SSRC.INQUIRY_HALL_CHECK_PRICE.TAB_ITEM_DTL",
    },
    fields: [
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.companyName").$D("公司"),
        fieldCode: "companyName",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.rfxQuantity").$D("需求数量"),
        fieldCode: "secondaryQuantity",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.rfxQuantity").$D("需求数量"),
        fieldCode: "rfxQuantity",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.unitPrice").$D("单价"),
        fieldCode: "validQuotationPrice",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.unitPrice").$D("单价"),
        fieldCode: "validQuotationSecPrice",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.totalAmount").$D("总金额"),
        fieldCode: "totalAmount",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.taxRate").$D("税率（%）"),
        fieldCode: "taxRate",
      },
    ],
    transport: {
      read: {
        url: "/ssrc/v1/{tenantId}/rfx/items",
        method: "get",
      },
      create: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "post",
      },
      update: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "put",
      },
      destroy: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "delete",
      },
    },
  };
}

export const supplierQuotaDS = () => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  showTotalCount: true,
  selection: 0,
  fields: [
    {
      fieldCode: "itemCode",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料名称"),
    },
    {
      fieldCode: "supplierCompanyNum",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierCompanyNum").$D("供应商编码"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称"),
    },
    {
      fieldCode: "categoryName",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemCategory").$D("物料类别"),
    },
    {
      fieldCode: "singleLotPriceDifference",
      fieldName: $T("ssrc.inquiryHall.cux.honghe.model.singleLotPriceDifference").$D("单批量差价"),
    },
    {
      fieldCode: "validQuotationPrice",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.validQuotationPrice").$D("单价"),
    },
    {
      fieldCode: "uomName",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.uomName").$D("单位"),
    },
    {
      fieldCode: "currencyCode",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.currencyName").$D("币种"),
    },
    {
      fieldCode: "quotaRatio",
      fieldName: $T("ssrc.inquiryHall.cux.honghe.model.historyQuotaRatio").$D("历史配额"),
    },
    {
      fieldCode: "currentQuotaRatio",
      fieldName: $T("ssrc.inquiryHall.cux.honghe.model.currentQuotaRatio").$D("本次确定"),
      type: "number"
    },
    {
      fieldCode: "validExpiryDateFrom",
      fieldName: $T("ssrc.inquiryHall.cux.honghe.model.validExpiryDateFrom").$D("配额生效时间"),
    },
    {
      fieldCode: "validExpiryDateTo",
      fieldName: $T("ssrc.inquiryHall.cux.honghe.model.validExpiryDateTo").$D("配额截止时间"),
    },
    {
      fieldCode: "minSplitQuantity",
      fieldName: $T("ssrc.inquiryHall.cux.honghe.model.minSplitQuantity").$D("最小拆分数量"),
      type: "number",
    },
    {
      fieldCode: "minPurchaseQuantity",
      fieldName: $T("ssrc.priceLibrary.model.library.minPurchaseQuantity").$D("最小采购量"),
    },
    {
      fieldCode: "organizationName",
      fieldName: $T("sodr.common.model.common.factory").$D("工厂"),
    },
    {
      fieldCode: "oldItemCode",
      fieldName: $T("sodr.common.model.common.oldItemCode").$D("旧物料号"),
    },
    {
      fieldCode: "erpSupplierNum",
      fieldName: $T("ssrc.inquiryHall.cux.honghe.common.erpSupplierNum").$D("ERP供应商编码"),
    },
  ],
  transport: {
    read: {
      url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/V1y3tCuFele84wx2L8kXGh7oMawlrjomSqibBbL1D8wr3c4wSEGKiaSChEabK7ltuy`,
      method: "get",
    },
  },
});

export const fileListDs = (rfxHeadId) => ({
  autoQuery: true,
  selection: Infinity,
  pageSize: 10,
  editable: false,
  editFlag: false, //是否可编辑
  enableQuery: true,
  data: [],
  showTotalCount: false,
  queryParameter: {},
  fields: [],
  transport: {
    read: {
      url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/${rfxHeadId}/process-attachment/download-query`,
      method: "get",
    },
  },
});

export default rfxItemsDS;
