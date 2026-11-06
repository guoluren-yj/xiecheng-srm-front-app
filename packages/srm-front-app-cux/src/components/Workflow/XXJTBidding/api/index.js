import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getSearchData = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/3MHQPwE9BbIOOSKb93UDXiaUu2AuS9m7EdFaCSpxG3ia0TiahDph05Jw6ZvrFaHxk0u`;
  return http.get(url, { params });
};