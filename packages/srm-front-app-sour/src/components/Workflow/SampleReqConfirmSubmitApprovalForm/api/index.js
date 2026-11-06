import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;
// 获取基本信息
const getBasicInfoApi = (reqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sample-send-reqs/${reqId}?customizeUnitCode=SSLM.SAMPLE_DELIVERY_CONFIRM.BASIC_INFO`;

  return http.get(url);
};
//获取样品信息列表
const getSampleInfoListApi = (reqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sample-infos/${reqId}/list?customizeUnitCode=SSLM.SAMPLE_DELIVERY_CONFIRM.SAMPLE_INFO`;
  return http.get(url);
};
//获取供应商附件信息列表
const getSampleAttachmentInfoListApi = (sampleId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sample-attachments/${sampleId}/list?sampleId=${sampleId}`;
  return http.get(url);
};
export {
  getBasicInfoApi,
  getSampleInfoListApi,
  getSampleAttachmentInfoListApi
};