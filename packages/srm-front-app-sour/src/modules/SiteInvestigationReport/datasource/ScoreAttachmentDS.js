import { SrmUtil, $T } from "srm-mobile-ui";

function scoreAttachmentDS(evalLineId, evalHeaderId) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    selection: 20,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    fields: [ {
      fieldName: $T("sslm.common.model.attachment.name").$D("附件名称"),
      fieldCode: "attachmentName",
      fieldType: "TEXT",
    }, {
      fieldName: $T("sslm.common.model.attachment.uploadDate").$D("上传时间"),
      fieldCode: "uploadTime",
      fieldType: "TEXT",
    }, {
      fieldName: $T("sslm.common.model.attachment.uploadName").$D("上传人"),
      fieldCode: "uploadUserName",
      fieldType: "TEXT",
    }, {
      fieldType: "INPUT",
      fieldCode: "remark",
      fieldName: $T("sslm.common.remark").$D("备注"),
      editor: true,
    }, ],
    queryParameter: {
      evalLineId: evalLineId,
      // uploadUserId: null,
    },
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-att`,
        method: "get",
      },
      destroy: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-att`,
        method: "delete",
      },
      submit: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-att`,
        method: "post",
      }
    },
    events: {
      beforeDelete: (ds, datas) => datas.length,
      beforeSubmit: (ds, datas) => {
        datas.forEach((e) => {
          e.evalHeaderId = evalHeaderId;
          e.evalLineId = evalLineId;
        });
        return datas.length;
      },
      afterQuery: () => {
      }
    }
  };
}

export {
  scoreAttachmentDS
};