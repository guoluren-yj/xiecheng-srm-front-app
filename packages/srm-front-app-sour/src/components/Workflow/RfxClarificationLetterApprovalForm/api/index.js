import { http } from "srm-mobile-ui";
import { SrmUtil } from "srm-mobile-ui";

// 获取基础信息
export const getHeaderInfo = ({ clarifyId, customizeUnitCode }) => {
  const params = { customizeUnitCode };
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/clarify/${clarifyId}`;
  return http.get(url, { params });
};