import { $T, SrmUtil } from "srm-mobile-ui";

function attachmentDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    editFlag: true,
    showTotalCount: true,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "attachmentName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.attachment.name").$D("附件名称"),
      },
      {
        fieldCode: "uploadUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.attachment.uploadName").$D("上传人"),
      },
      {
        fieldCode: "uploadTime",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.attachment.uploadDate").$D("上传时间"),
      },
      {
        fieldCode: "remark",
        fieldType: "INPUT",
        fieldName: $T("sslm.common.remark").$D("备注"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/kpi-eval-header-atts",
        method: "get",
      },
      update: {
        url: "/sslm/v1/{tenantId}/kpi-eval-header-atts",
        method: "post",
      },
      destroy: {
        url: "/sslm/v1/{tenantId}/kpi-eval-header-atts",
        method: "delete",
      },
    },
  };
}

export default attachmentDS;
