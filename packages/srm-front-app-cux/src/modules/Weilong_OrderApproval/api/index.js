/**
 * 与 【订单审批】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 批量审批通过
export const someAdoptApi = (params) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/weilong/po-location/batch-approve`;
  return http.post(url, params);
};

// 批量审批拒绝
export const someRejectApi = (params) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/weilong/po-location/batch-reject`;
  return http.post(url, params);
};
