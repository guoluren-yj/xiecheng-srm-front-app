/*
 * @Date: 2023-04-11 11:18:34
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { getRedFlag, renderRedNode, renderUpdateTag } from "../utils/utils";
import { yesOrNoRenderer } from "@/utils/renderer";

export const getAttachmentDS = () => ({
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "attachmentMeaning",
      fieldName: $T("sslm.enterpriseInform.view.model.attachment.type").$D("附件类型"),
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.attachment.$Description").$D("附件描述"),
      fieldCode: "description",
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.attachment.endDate").$D("文件到期日"),
      fieldCode: "endDate",
    },
    {
      fieldName: $T("sslm.supplierInform.model.attachment.longEffective").$D("是否长期有效"),
      fieldCode: "longEffectiveFlag",
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.attachment.uploadDate").$D("最后上传时间"),
      fieldCode: "uploadDate",
    },
    {
      fieldName: $T("sslm.enterpriseInform.view.model.attachment.upload").$D("附件上传"),
      fieldCode: "attachmentUuid",
      fieldType: "UPLOAD",
    },
    {
      fieldName: $T("hzero.common.remark").$D("备注"),
      fieldCode: "remark",
    },
  ],
});

export const getAttachmentColums = () => [
  {
    fieldCode: "attachmentMeaning",
    render: (val, item) => <SrmListHeader showOpenTag={false}>
      <span style={{ fontWeight:600 }}>{renderRedNode({ name: "attachmentMeaning", record:item })}</span>
      <span slot="right">{renderUpdateTag(item)}</span>
    </SrmListHeader>,
  },
  {
    fieldCode: "description",
  },
  {
    fieldCode: "endDate",
  },
  {
    fieldCode: "longEffectiveFlag",
    render: (val, item, field) => {
      const redFlag = getRedFlag({ name: field.fieldCode, record:item });
      return <span style={{ color: redFlag && "red" }}>
        {yesOrNoRenderer(val)}
      </span>;
    }
  },
  {
    fieldCode: "uploadDate",
  },
  {
    fieldCode: "attachmentUuid",
  },
  {
    fieldCode: "remark",
  },
].map((col) => ({ render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item }), ...col, }));
