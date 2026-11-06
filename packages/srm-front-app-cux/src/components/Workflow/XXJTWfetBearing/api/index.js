import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getSearchData = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/BUln7A73rne71rqfiaGicM5M7DwoSQdOOxjxrFz7pXWjTF7jhKgzFZoTfrNT95CH3f`;
  return http.get(url, { params });
};

// 基础信息
export const getBiddingReviewData = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/n74icD6PHxtwjpQb34wHL2pBiaiaNZCthzYEyxaYQaJRJk`;
  return http.get(url, { params });
};

// 基础信息
export const getSearchContractData = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/MEibBxVIEs486GmuxplNx0jlHBNBibEWKXVlwZmodbUgsTiahDph05Jw6ZvrFaHxk0u`;
  return http.get(url, { params });
};

// 标的申请单详情-基础信息
export const getApplicationFormData = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/judq9RDFJl0tISzwTN1mqibibrzp0scYPic9icknVewkEjhEibLqxqgibgecOLVN0hN0rD`;
  return http.get(url, { params });
};
