
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取订单头
export const getOrderHeader = (poHeaderId) => {
  const params = {
    camp: 2,
    customizeUnitCode: "SODR.ORDER_APPROVE_LINE_LIST.HEADER,SODR.ORDER_APPROVE_LINE_LIST.DELIVERY_CATA",
  };
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/detail`;

  return http.get(url, { params });
};

// 获取订单行
export const getOrderLine = (poHeaderId, userId, page) => {
  const params = {
    camp: 2,
    page,
    userId,
    poEntryPoint: "PO_MAINTAIN_DETAIL",
    poHeaderId,
    size: 100, sortType: 0,
    customizeUnitCode: "SODR.RECEIVED_ORDER_DETAIL.BASIC,SODR.RECEIVED_ORDER_DETAIL.OTHER",
  };
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-line/${poHeaderId}/detail_sanjiang`;

  return http.get(url, { params });
};
// 新建供货明细
export const createSupplyDetail = (sanjiangSupplyDetailS) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/sanjiang-supply-details/save`;

  return http.post(url, sanjiangSupplyDetailS);
};
// 提交供货明细
export const submitSupplyDetail = (sanjiangSupplyDetailS) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/sanjiang-supply-details/submit`;

  return http.post(url, sanjiangSupplyDetailS);
};

// 查询用户详情
export const getUserConfig = () => {
  const url = "/iam/hzero/v1/users/self/detail";

  return http.get(url);
};
