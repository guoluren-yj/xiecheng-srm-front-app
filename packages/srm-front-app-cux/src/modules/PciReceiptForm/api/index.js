import { http } from "srm-mobile-ui";

// 保存接口
export const toSave = (params, tenantId) => {
  const url = `/scux/v1/${tenantId}/pci-asn-sign-headers/create`;
  return http.post(url, params);
};