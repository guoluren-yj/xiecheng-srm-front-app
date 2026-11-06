import { http } from "srm-mobile-ui";
const storage = window.localStorage;
//获取供应商免评审申请信息
const getNoSiteReviewInfoApi = (noSiteReviewId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/jala-out-site-reviews/list/${noSiteReviewId}`;

  return http.get(url);
};

export {
  getNoSiteReviewInfoApi,
};