import { $T } from "srm-mobile-ui";

function baseInfoDataSet() {
  return {
    autoQuery: false,
    editable: true,
    enableQuery: false,
    editFlag: true,
    selection: Infinity,
    forceValidate: true,
    fields: [
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceNum").$D("寻源单号"),
        fieldCode: "sourceNum",
      },
      {
        fieldName: $T("ssrc.common.title").$D("标题"),
        fieldCode: "sourceTitle",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.initiationAndAllSupplierCount").$D("总供应商数"),
        fieldCode: "initiationAndAllSupplierCount",
      },
      {
        fieldName: $T("ssrc.common.company").$D("公司"),
        fieldCode: "companyName",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.replyEndDate").$D("回复截止时间"),
        fieldCode: "replyEndDate",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.submitDate").$D("提交时间"),
        fieldCode: "submittedDate",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.clarificationRequests").$D("澄清要求"),
        fieldCode: "replyRequirement",
      },
      {
        fieldName: $T("ssrc.common.view.message.startDescription").$D("发起原因"),
        fieldCode: "initiationReason",
      },
      {
        fieldCode: "clarifyNotifyTitle",
      },
      {
        fieldCode: "clarifyNotifyNum",
      },
      {
        fieldCode: "submittedByName",
      },
      {
        fieldCode: "sourceNumTitle",
      },
      {
        fieldCode: "clarifyNotifyType",
      },
    ],
  };
}

function lineDataSet() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    fields: [],
  };
}

function quotationLineDataSet() {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    fields: [
    ],
    transport: {
      read: {
        url: "/ssrc/v1/{tenantId}/clarify-notify/price/price-details/{quotationHeaderId}/quotation-lines",
        method: "get",
      },
    },
  };
}

export {
  baseInfoDataSet,
  lineDataSet,
  quotationLineDataSet,
};
