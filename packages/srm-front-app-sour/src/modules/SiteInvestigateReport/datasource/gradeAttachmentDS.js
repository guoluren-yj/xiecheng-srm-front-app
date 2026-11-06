import { $T, SrmUtil } from "srm-mobile-ui";

//待收货
function gradeAttachmentDS() {
  return {
    autoQuery: false,
    pageSize: 10,
    selection: Infinity,
    enableQuery: false,
    showTotalCount: true,
    editable:true,
    editFlag:true,
    fields:  [
      {
        fieldCode: "evalHeaderId",
        fieldType: "TEXT",
      },
      {
        fieldCode: "evalLineId",
        fieldType: "TEXT",
      },
      {
        fieldCode: "attachmentLineId",
        fieldType: "TEXT",
      },
      {
        fieldCode: "attachmentUrl",
        fieldType: "TEXT",
      },
      {
        fieldCode: "attachmentName",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.attachmentName").$D("附件名称"),
      },
      {
        fieldCode: "uploadUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.uploadedBy").$D("上传人"),
      },
      {
        fieldCode: "uploadTime",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.uploadedTime").$D("上传时间"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("smbl.common.model.comment").$D("备注"),
      },
    ],
    //查询条件
    queryFields: [ ],
    transport: {
      //gateway.dev.isrm.going-link.com/sslm/v1/30/site-eval-line-att?evalLineId=__-KmKFxSRQ3b9PS4xASvUR8g-__&page=0&size=10&uploadUserId=28176
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-att?`,
        method: "get",
      },
      destroy:{
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-att?`,
        method: "delete",
      }
    },
    events: {
    }
  };
}

export { gradeAttachmentDS };
