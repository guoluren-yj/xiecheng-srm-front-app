
import { http, SrmUtil } from "srm-mobile-ui";

// 获取供货明细列表
export const getSupplyDetailListApi = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/sanjiang-supply-details/agency/list`;

  return http.get(url, { params });
};

// 获取供货明细详情
export const getSupplyDetailApi = (supplyDetailId) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/sanjiang-supply-details/${supplyDetailId}`;

  return http.get(url);
};

// 确认供货明细
export const confirmSupplyDetailApi = (supplyDetailList) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/sanjiang-supply-details/confirm`;

  return http.post(url, supplyDetailList);
};
