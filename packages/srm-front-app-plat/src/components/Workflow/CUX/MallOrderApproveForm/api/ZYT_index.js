import { http, SrmUtil } from "srm-mobile-ui";

export const fetchOrderBudgetApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/IxYWpCSFlkpbkedSS0aj3aE5zSA8V6sWyIO9H16vKibM`;
  return http.post(url, params);
};