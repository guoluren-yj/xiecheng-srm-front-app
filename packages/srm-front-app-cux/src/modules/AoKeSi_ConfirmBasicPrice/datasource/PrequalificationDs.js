import { SrmUtil, $T } from "srm-mobile-ui";
function prequalDetailsDs() {

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
        fieldCode: "name",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMobilephone").$D("联系方式"),
        fieldCode: "mobilephone",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.prequalRequestted").$D("预审申请"),
        fieldCode: "prequalStatusMeaning",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.prequalAdviceResult").$D("预审建议结果"),
        fieldCode: "lineApprovedStatusMeaning",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.groupMainReportResult").$D("组长汇报结果"),
        fieldCode: "leaderSummaryResMeaning",
      },
    ],
    transport: {
      read: {
        url: "/ssrc/v1/{tenantId}/prequal/RFX/{rfxHeaderId}/lines",
        method: "get",
      },
    },
  };
}
function prequalGroupDs() {

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
    ],
    transport: {
      read: {
        url: "/ssrc/v1/{tenantId}/prequal-members/{rfxHeaderId}/RFX",
        method: "get",
      },
    },
  };
}
export {
  prequalDetailsDs,
  prequalGroupDs
};
