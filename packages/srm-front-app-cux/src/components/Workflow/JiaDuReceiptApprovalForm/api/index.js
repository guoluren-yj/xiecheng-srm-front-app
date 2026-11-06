import { http, SrmUtil } from "srm-mobile-ui";

export const getHeaderInfo = (asnSignHeaderId) => {
  let url = `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-sign-headers/${asnSignHeaderId}`;
  return http.get(url);
};

export const getLineInfo = (asnSignHeaderId) => {
  let url = `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-sign-lines/${asnSignHeaderId}/lines`;
  return http.get(url);
};

export const toSave = (params) => {
  let url = `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-sign-headers/create`;
  return http.post(url, params);
};