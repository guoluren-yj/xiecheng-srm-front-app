import { http, SrmUtil } from "srm-mobile-ui";

// 箱码绑定
export const boxBindApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/yroLqv5bzfMxsgS5aic9jfTtVFQPA3ViaUkCbpuRj1HicU`;
  return http.post(url, { params });
};
