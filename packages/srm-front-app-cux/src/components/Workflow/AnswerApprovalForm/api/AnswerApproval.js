import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;
// 获取答疑审批基本信息
const getAnswerBasicInfoApi = (clarifyId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/aux-clarify/clarifyHeader?clarifyId=${clarifyId}`;

  return http.get(url);
};
//获取标的信息列表
const getBindingInfoListApi = (rfxHeaderId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/aux-clarify/clarifyLine?rfxHeaderId=${rfxHeaderId}`;

  return http.get(url);
};

export {
  getAnswerBasicInfoApi,
  getBindingInfoListApi,
};