import { http, SrmUtil } from "srm-mobile-ui";
// 获取送样申请列表
export const getSampleFeedbackListApi = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/sample-send-reqs/pageSampleSendReq/feedback`;
  return http.get(url, { params });
};
/*
送样反馈基础信息查询
*/
export const getsampleBasicInfoApi = (reqId) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/sample-send-reqs/${reqId}`;
  //customizeUnitCode=SSLM.SAMPLE_DELIVERY_CALLBACK.BASIC_INFO,SSLM.SAMPLE_DELIVERY_CALLBACK.LINE_FORM
  return http.get(url);
};
/*
送样信息查询
暂时信息直接在基础信息上，直接复用即可
*/
/*export const getsampleDeliveryInfoApi = (reqId) => {
  const url = `/sslm/v1/${storage.getItem('organizationId')}/sample-send-reqs/${reqId}`
  return http.get(url, { params });
}*/
/*
样品信息查询
*/
export const getsampleInfoApi = (reqId) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/sample-infos/${reqId}/list`;
  return http.get(url);
};
// 获取样件反馈采购方附件信息
export const getSampleOrderAttachmentsApi = (attachmentUUID, params) => {
  const url = `/hfle/v1/${SrmUtil.getTenantId()}/files/${attachmentUUID}/file`;
  return http.get(url, { params });
};
// 样件反馈保存
export const sampleFeedbacksaveApi = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/sample-send-reqs/updateSendReq?customizeUnitCode=SSLM.SAMPLE_DELIVERY_CALLBACK.SAMPLE_INFO,SSLM.SAMPLE_DELIVERY_CALLBACK.BASIC_INFO,SSLM.SAMPLE_DELIVERY_CALLBACK.LINE_FORM`;
  return http.post(url, params);
};
// 样件反馈提交
export const sampleFeedbackSubmmitApi = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/sample-send-reqs/batchFeedback?customizeUnitCode=SSLM.SAMPLE_DELIVERY_CALLBACK.SAMPLE_INFO,SSLM.SAMPLE_DELIVERY_CALLBACK.BASIC_INFO,SSLM.SAMPLE_DELIVERY_CALLBACK.LINE_FORM`;
  return http.post(url, params);
};
// 获取样件反馈供应方附件信息
export const getSampleVendorAttachmentApi = (sampleId, params) => {
  ///sslm/v1/7737/sample-attachments/__-XvKdRB6tKPaKGv6tPdqqRg-__/list
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/sample-attachments/${sampleId}/list`;
  return http.get(url, params);
};