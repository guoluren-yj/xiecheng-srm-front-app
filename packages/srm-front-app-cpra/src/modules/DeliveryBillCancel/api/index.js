import { http } from "srm-mobile-ui";
const storage = window.localStorage;

// 送货单明细 头信息
export const getOrderHeadInfo = (asnHeaderId, params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}`, { params });

// 送货单明细 行信息
export const getOrderLineInfo = (asnHeaderId, params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/page-lines`, { params });

// 送货单取消
export const cancelDeliveryBill = (params) => http.post(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/cancel`, params);

// 送货单重新同步
export const reSyncDeliveryBill = (params) => http.post(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/cancel/repo`, params);
