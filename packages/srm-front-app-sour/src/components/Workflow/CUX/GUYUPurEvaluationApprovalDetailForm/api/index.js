import { SrmUtil, http } from "srm-mobile-ui";

// 保存
export async function handleSaveAllDetail({ customizeUnitCode, wfParams = {}, ...data }) {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/eval-report/create`;
  return http.post(url, data, { params: { customizeUnitCode, ...wfParams } });
}