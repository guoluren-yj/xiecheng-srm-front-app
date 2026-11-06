import { $T } from "srm-mobile-ui";

const storage = window.localStorage;

export const baseInfoDS = ({ rfxHeaderId }) => ({
  autoQuery: true,
  fields: [
    {
      fieldCode: "rfxNum",
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssrc.prequalification.model.rfxTitle").$D("标书标题"),
      fieldType: "TEXT",
      fieldCode: "rfxTitle",
    },
    {
      fieldName: $T("ssrc.prequalification.model.companyName").$D("公司"),
      fieldType: "TEXT",
      fieldCode: "companyName",
    },
    {
      fieldName: $T("ssrc.prequalification.model.purOrganizationName").$D("采购组织"),
      fieldType: "TEXT",
      fieldCode: "purOrganizationName",
    },
    {
      fieldName: $T("ssrc.prequalification.model.quotationStartDate").$D("投标开始时间"),
      fieldType: "TEXT",
      fieldCode: "quotationStartDate",
    },
    {
      fieldName: $T("ssrc.prequalification.model.quotationEndDate").$D("投标截止时间"),
      fieldType: "TEXT",
      fieldCode: "quotationEndDate",
    },
    {
      fieldName: $T("ssrc.prequalification.model.rfxRemark").$D("备注"),
      fieldType: "TEXT",
      fieldCode: "rfxRemark",
    },
    {
      fieldName: $T("ssrc.prequalification.model.prequalEndDate").$D("预审截止时间"),
      fieldType: "TEXT",
      fieldCode: "prequalEndDate",
    },
    {
      fieldName: $T("ssrc.prequalification.model.reviewMethodMeaning").$D("审查方法"),
      fieldType: "TEXT",
      fieldCode: "reviewMethodMeaning",
    },
    {
      fieldName: $T("ssrc.prequalification.model.prequalAttachmentUuid").$D("资格预审文件"),
      fieldType: "TEXT",
      fieldCode: "prequalAttachmentUuid",
    },
    {
      fieldName: $T("ssrc.prequalification.model.prequalRemark").$D("资质要求"),
      fieldType: "TEXT",
      fieldCode: "prequalRemark",
    },
    {
      fieldName: $T("ssrc.prequalification.model.attributeLongtext6").$D("预审意见"),
      fieldType: "TEXT",
      fieldCode: "attributeLongtext6",
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${storage.getItem(
        "organizationId"
      )}/yongxiang/prequal/${rfxHeaderId}`,
      method: "get",
    },
  },
});

export const supplierDS = ({ rfxHeaderId }) => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldType: "TEXT",
      fieldCode: "companyNum",
    },
    {
      fieldType: "TEXT",
      fieldCode: "supplierCompanyName",
    },
    {
      fieldType: "TEXT",
      fieldCode: "supplierCompanyIp",
      fieldName: $T("ssrc.prequalification.model.supplierCompanyIp").$D("投标IP"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "applicationRemark",
      fieldName: $T("ssrc.prequalification.model.applicationRemark").$D("资格预审申请说明"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "lineApprovedStatusMeaning",
      fieldName: $T("ssrc.prequalification.model.lineApprovedStatusMeaning").$D("预审审批结果"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "approvedRemark",
      fieldName: $T("ssrc.prequalification.model.approvedRemark").$D("备注"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "validAttachmentUuid",
      fieldName: $T("ssrc.prequalification.model.validAttachmentUuid").$D("附件"),
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${storage.getItem(
        "organizationId"
      )}/yongxiang/prequal/${rfxHeaderId}/detail`,
      method: "get",
    },
  },
});

export const teamDS = () => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldType: "TEXT",
      fieldCode: "loginName",
      fieldName: $T("ssrc.prequalification.model.loginName").$D("账号"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "realName",
      fieldName: $T("ssrc.prequalification.model.realName").$D("名称"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "leaderFlagMeaning",
      fieldName: $T("ssrc.prequalification.model.leaderFlag").$D("职责"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "internationalTelCodeMeaning",
      fieldName: $T("ssrc.prequalification.model.internationalTelCode").$D("手机号码"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "email",
      fieldName: $T("ssrc.prequalification.model.email").$D("邮箱"),
    },
  ],
  transport: {
    read: {
      url: `/ssrc/v1/${storage.getItem(
        "organizationId"
      )}/prequal-members/{rfxHeaderId}/RFX`,
      method: "get",
    },
  },
});