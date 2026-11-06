
import { http, SrmUtil } from "srm-mobile-ui";

// eslint-disable-next-line valid-jsdoc
/**
 * 点赞数据查询
 * @returns
 */
export const fetchSupplierGiveThumbsUp = () => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/eUBvlofDvTCKxVahSBuJTibSob5zLz0nHfwhJN1CRlWc`;

  return http.get(url);
};
// 点赞发布
export const fetchLikeRelease = (params) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/jala-like-headers/release`;

  return http.post(url, params);
};

// 点赞勋章数
export const fetchThumbsUp = (params) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/jala-like-Leaderboard/medal/list`;

  return http.get(url, { params });
};