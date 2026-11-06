//送样申请反馈样品信息附件
import { $T } from "srm-mobile-ui";

function sampleVendorAttachmentDS(item) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      sampleId: item.sampleId
    },
    fields: [],
    fastQueryField: {
      fieldCode: "attachmentDesc",
      fieldType: "TEXT",
      fieldName: $T("sslm.sample.model.attachmentDesc").$D("附件描述"),
    },
    // 查询表单字段
    queryFields: [],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/sample-attachments/${item.sampleId}/list`,
        method: "get",
      },
    },
    events: {
      // eslint-disable-next-line no-unused-vars
      beforeQuery: (ds, param) => {
      }
    }
  };
}
export default sampleVendorAttachmentDS;
