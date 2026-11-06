import { http, SrmUtil } from "srm-mobile-ui";

// 参与放弃
export const advanceOrGiveUpApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/BMJeicIeuS8hSw1Oqw1SW9wBQnSABwA56TwFCBTMD4m8TzIW48lmuAdXGwHddqNyF`;
  return http.post(url, params);
};