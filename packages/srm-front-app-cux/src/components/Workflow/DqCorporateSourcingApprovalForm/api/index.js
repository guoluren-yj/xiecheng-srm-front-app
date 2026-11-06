import { http, SrmUtil } from "srm-mobile-ui";

// 供应商信息
export const getSupplierInfoApi = (id) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/SC7ibZs54z7m0fnIxVB6sVwt9iazOSBpuv9GEMzKuwEPA`;
  return http.post(url, { id });
};
