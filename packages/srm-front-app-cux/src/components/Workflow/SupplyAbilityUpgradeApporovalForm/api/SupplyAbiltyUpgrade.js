import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// 获取供货能力升级申请基本信息
const getBasicInfoApi = (approvalId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/jala-ability-reqs/${approvalId}`;

  return http.get(url);
};
//获取相关信息列表
const getAboutInfoListApi = (approvalId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/jala-ability-req-lines/${approvalId}`;

  return http.get(url);
};
//获取相关附件列表
const getAboutAttachmentListApi = (reqLineId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/jala-ability-req-line-att-lns/${reqLineId}?&reqLineId=${reqLineId}`;

  return http.get(url);
};

export {
  getBasicInfoApi,
  getAboutInfoListApi,
  getAboutAttachmentListApi
};