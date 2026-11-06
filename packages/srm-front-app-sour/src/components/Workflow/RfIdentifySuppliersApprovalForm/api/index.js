
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 基础信息
export const getBasicInfoApi = (rfHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rf/${rfHeaderId}`;
  return http.get(url);
};

// 附件信息
export const getAttachmentInfoApi = (attachmentUUID) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file`;
  return http.get(url);
};
