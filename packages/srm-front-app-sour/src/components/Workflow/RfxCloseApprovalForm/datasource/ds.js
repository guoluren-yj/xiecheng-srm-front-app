import { SrmUtil, $T } from "srm-mobile-ui";
const promptCode = "ssrc.inquiryHall";

function closeBasisDS({ rfxId, bidFlag, documentTypeName }) {
  const rfxOrBidName = bidFlag ? "BID" : "RFX";
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "rfxNum",
        fieldType: "TEXT",
        fieldName: $T(`${promptCode}.model.inquiryHall.commonRfxNo`, [
          rfxOrBidName
        ])
          .$D("{documentTypeName}单号"),
      },
      {
        fieldCode: "rfxTitle",
        fieldType: "TEXT",
        fieldName: $T(`${promptCode}.model.inquiryHall.commonApproveTitle`, [ documentTypeName ])
          .$D("{documentTypeName}标题"),
      },
      {
        fieldCode: "templateName",
        fieldType: "TEXT",
        fieldName: $T(`${promptCode}.model.inquiryHall.sourcingTemplate`).$D("寻源模板"),
      },
      {
        fieldCode: "terminatedRemark",
        fieldType: "TEXT",
        fieldName: $T(`${promptCode}.view.message.close.inquiryListReason`).$D("关闭理由"),
      },
      {
        fieldCode: "closeAttachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("ssrc.common.model.common.attachment").$D("附件"),
      }
    ],
    transport: {
      read: {
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/snap/simple/${rfxId}?customizeUnitCode=${bidFlag ? "SMBL.WORKFLOW.CLOSE_RFX_APPROVAL_BID.BASE_FORM" : "SMBL.WORKFLOW.CLOSE_RFX_APPROVAL.BASE_FORM"}`,
        method: "GET",
      }
    }
  };
}

export {
  closeBasisDS
};