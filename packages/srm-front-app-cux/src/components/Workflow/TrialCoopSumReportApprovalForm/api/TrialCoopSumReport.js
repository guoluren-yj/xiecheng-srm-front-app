import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// 获取尝试性合作总结性报告信息
const getTrialCoopSumReportInfoApi = (reportId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/jala-cooperation-reports/list/${reportId}`;

  return http.get(url);
};
//获取考评结果列表
const getEvalResultsListApi = () => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/eval-headers/result/purchase`;

  return http.get(url);
};

export {
  getTrialCoopSumReportInfoApi,
  getEvalResultsListApi
};