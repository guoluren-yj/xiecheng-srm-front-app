
import { http } from "srm-mobile-ui";
const storage = window.localStorage;

const getPreTrialsListApi = (params) => {
  const url = "/scux/v1/${storage.getItem('organizationId')}/jala-pre-trials";

  return http.get(url, { params });
};
// 获取商务条款基本信息
const getCommericalTermsInfoApi = (preTrialId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/jala-pre-trials/list/${preTrialId}?preTrialId=${preTrialId}`;

  return http.get(url);
};

// 保存商务条款基本信息
const saveCommericalTermsInfoApi = (params) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/jala-pre-trials/save`;
  return http.post(url, params);
};

export {
  getPreTrialsListApi,
  getCommericalTermsInfoApi,
  saveCommericalTermsInfoApi
};
