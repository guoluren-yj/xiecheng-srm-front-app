/*
 * @Date: 2023-12-07 11:28:04
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";

import { SRM_SSLM } from "@/utils/utils";

const organizationId = SrmUtil.getTenantId();

export const getAttachmentDs = ({ evalHeaderId }) => ({
  autoQuery:true,
  editable: false,
  enableQuery: false,
  pageSize: 5,
  queryParameter:{
    evalHeaderId,
  },
  fields: [
    {
      fieldCode: "attachmentName",
      fieldName: $T("sslm.common.model.attachment.fieldCode").$D("附件名称"),
    },
    {
      fieldCode: "uploadUserName",
      fieldName: $T("sslm.common.model.attachment.uploadName").$D("上传人"),
    },
    {
      fieldCode: "uploadTime",
      fieldName: $T("sslm.common.model.attachment.uploadDate").$D("上传时间"),
    },
    {
      fieldCode: "remark",
      fieldName: $T("hzero.common.remark").$D("备注"),
    },
    {
      fieldCode: "attachment",
      fieldName:$T("hzero.common.upload.modal.title").$D("附件"),
    }
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${organizationId}/kpi-eval-header-atts`,
      method: "GET",
    },
  },
});

export const appraisalAttachmentColumns = (_this) => [
  {
    fieldCode: "attachmentName",
    fieldType:"EMPTY",
    render: (val) => <SrmListHeader showOpenTag={false}>
      <span>{val}</span>
    </SrmListHeader>
  },
  {
    fieldCode: "uploadUserName",
  },
  {
    fieldCode: "uploadTime",
  },
  {
    fieldCode: "remark",
  },
  {
    fieldCode: "attachment",
    render: (_, data) =>
      <span style="color: var(--color-other-default-b);"
        on-click={(n) => {
          n.stopPropagation();
          _this.$showFileList({
            fileList: [ {
              fileUrl: data.attachmentUrl,
              fileName: data.attachmentName,
              creationDate: data.creationDate,
              bucketName: "private-bucket",
            } ]
          });
        }}>
        {$T("smbl.common.button.viewAttachments").$D("查看附件")}(1)
      </span>,
  },
];
