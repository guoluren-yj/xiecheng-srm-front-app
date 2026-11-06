import { http, SrmUtil } from "srm-mobile-ui";

export const queryHeaderInfo = async (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/hx4pZQibFnQh84iaiclfYI8TKvElSj6fIU3tMA5dLbWl8E`;
  return http.get(url, { params });
};
export const queryMapIdpValue = async (lovCodes) => {
  const url = `/hpfm/v1/${SrmUtil.getTenantId()}/lovs/value/batch`;
  return http.get(url, { params: lovCodes });
};