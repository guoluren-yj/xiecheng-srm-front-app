import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;
// 获取询标问卷审批基本信息
const getAnswerBasicInfoApi = (clarifyNotifyId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/aux-clarify/clarifyNotifyHeader?clarifyNotifyId=${clarifyNotifyId}`;

  return http.get(url);
};
//获取标的信息列表
const getBindingInfoListApi = (rfxHeaderId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/aux-clarify/clarifyLine?rfxHeaderId=${rfxHeaderId}`;

  return http.get(url);
};
//获取询标答卷信息
const getBindingInquiryAnswerInfoListApi = (params) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/aux-clarify/clarifyNotifyIssue`;

  return http.get(url, { params });
};

export {
  getAnswerBasicInfoApi,
  getBindingInfoListApi,
  getBindingInquiryAnswerInfoListApi
};