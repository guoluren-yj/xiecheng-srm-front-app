import { http, SrmUtil } from "srm-mobile-ui";

export const batchSilentSignatureApi = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/CpBkgiarak1B4lpGpQJ2hK0xSeVNgogWx6NRUZg01bv8`;
  return http.post(url, params);
};