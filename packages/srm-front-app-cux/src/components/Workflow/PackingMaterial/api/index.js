import { http, SrmUtil } from "srm-mobile-ui";
// 保存
export const saveApi = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/jala-order-date-hs/save`;
  return http.post(url, params);
};

export const fetchOpinion = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/YiceWp5jMsGRRn8hMsy08icdRVZkun4EcKEejLDOEOibkkTiahDph05Jw6ZvrFaHxk0u`;
  return http.get(url, { params });
};
