import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (depositId) => {
  let url = `/scux/v1/${SrmUtil.getTenantId()}/yx-deposit-manages/${depositId}`;
  return http.get(url);
};