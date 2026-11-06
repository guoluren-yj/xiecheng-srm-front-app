/**
 * 与 【预算编制】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

// 获取供货明细列表
export const getSupplyDetailListApi = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/sanjiang-supply-details/list`;
  return http.get(url, { params });
};

