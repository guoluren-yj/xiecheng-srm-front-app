import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (shiftId) => {
  let url = `/scux/v1/${SrmUtil.getTenantId()}/yx-deposit-shifts/header/${shiftId}`;
  return http.get(url);
};

// 行信息
// export const getLinefoApi = (shiftId) => {
//   let url = `/scux/v1/${SrmUtil.getTenantId()}/yx-deposit-shifts/line/${shiftId}`;
//   return http.get(url);
// };