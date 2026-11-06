import { http, SrmUtil } from "srm-mobile-ui";
import { SRM_PLATFORM, SRM_SSLM } from "@/utils/utils";

/**
 * 获取页面数据
 */
export const getCompaniesApi = (params) => {
  const url = `${SRM_PLATFORM}/v1/companies/latest`;
  return http.get(url, { params });
};

// 获取供应商公司信息
export const getCompanyInfoApi = (params) => {
  const url = `${SRM_SSLM}/v1/${SrmUtil.getTenantId()}/investigate/queryCompanyDTOLatest`;
  return http.get(url, { params });
};