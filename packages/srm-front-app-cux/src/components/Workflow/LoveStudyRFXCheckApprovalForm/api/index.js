import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (rfxHeaderId) => {
  let url = `/scux/v1/${SrmUtil.getTenantId()}/aixuexi-header/${rfxHeaderId}`;
  return http.get(url);
};

