import { http, SrmUtil } from "srm-mobile-ui";

export const getRfxHeader = (data = {}) => {
  const { clarifyNotifyId, ...others } = data;
  return http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/clarify-notify/${clarifyNotifyId}`, { params: others, });
};

export const fetchPriceClarificationDetailSupplierList = (data = {}) => {
  const { sourceHeaderId, ...others } = data;
  return http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/clarify-notify/price/${sourceHeaderId}/supplier-lines/list`, {
    params: others,
  });
};
