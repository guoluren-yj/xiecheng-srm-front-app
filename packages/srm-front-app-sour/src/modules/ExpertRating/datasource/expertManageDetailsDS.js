import { $T } from "srm-mobile-ui";

const basicInfoDS = () => ({
  autoQuery: false,
  fields: [
    {
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceNum").$D("寻源单号"),
      fieldCode: "rfxNum",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceTitle").$D("寻源单号"),
      fieldCode: "rfxTitle",
      fieldType: "TEXT",
    },
  ],
});

// 专家
const expertDS = () => ({
  autoQuery: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "loginName",
      fieldType: "TEXT",
    },
    {
      fieldCode: "expertName",
      fieldType: "TEXT",
    },
  ],
});

// 供应商
const supplierDS = () => ({
  autoQuery: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "supplierCompanyNum",
      fieldType: "TEXT",
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactName").$D("联系人"),
      fieldCode: "contactName",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purPhone").$D("联系人电话"),
      fieldCode: "contactMobilephone",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purEmail").$D("联系人邮箱"),
      fieldCode: "contactMail",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sectionAttachmentUuid").$D("附件"),
      fieldCode: "sectionAttachmentUuid",
      fieldType: "TEXT",
    },
  ],
});

export { basicInfoDS, expertDS, supplierDS };
