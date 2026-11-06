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
