/*
 * @Date: 2022-11-21 20:25:46
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";

export const getattachmentDS = () => ({
  editable: false,
  enableQuery: false,
  fields:[
    {
      fieldName: $T("sslm.common.view.attachment.name").$D("附件名称"),
      fieldCode: "attachmentDesc",
    },
    // {
    //   fieldName: $T("sslm.common.view.attachment.size").$D("附件大小(MB)"),
    //   fieldCode: "attachmentSize",
    // },
    // {
    //   fieldName: $T("sslm.commonApplication.model.coApp.uploadUserName").$D("上传人"),
    //   fieldCode: "realName",
    // },
    // {
    //   fieldName: $T("sslm.commonApplication.model.coApp.uploadDate").$D("上传时间"),
    //   fieldCode: "uploadDate",
    // },
    {
      fieldName: $T("hzero.common.remark").$D("备注"),
      fieldCode: "remark",
    },
  ],
});