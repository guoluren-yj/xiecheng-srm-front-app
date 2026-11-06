import { SrmUtil, $T } from "srm-mobile-ui";
function quotationDetailsDs() {

  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    fields:[
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierCompanysName").$D("供应商名称"),
        fieldCode:"supplierCompanyName",
      },
      {
        fieldName: $T("ssrc.inquiryHall.inquiryHall.contactName").$D("联系人"),
        fieldCode: "contactName",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMobilephone").$D("联系方式"),
        fieldCode: "contactMobilephone",
        render:(val, record) => <span>{record.internationalTelCodeMeaning} | {val}</span>
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.feedBackStatus").$D("是否参与"),
        fieldCode: "feedbackStatusMeaning",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.whetherQuotation").$D("是否报价"),
        fieldCode: "quotationStatusMeaning",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierCompanyIp").$D("报价IP"),
        fieldCode: "supplierCompanyIp",
        render:(val, record) => <span style={{ "color":record.repeatIpFlag ? "var(--color-other-default)" : "#AFAFAF" }}>{val}</span>
      },
    ],
    transport: {
      read: {
        url: "/ssrc/v1/{tenantId}/rfx/{rfxHeaderId}/quotation/detail?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.QUOTATION_DETAIL",
        method: "get",
      },
    },
  };
}

export { quotationDetailsDs };
