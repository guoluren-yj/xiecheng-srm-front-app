import { http, SrmUtil } from "srm-mobile-ui";

// 送货单明细 头信息
export const getOrderHeadInfo = (asnHeaderId, params) => http.get(`/spuc/v1/${SrmUtil.getTenantId()}/asn-header/${asnHeaderId}`, { params });

// 送货单明细 行信息
export const getOrderLineInfo = (asnHeaderId, params) => http.get(`/spuc/v1/${SrmUtil.getTenantId()}/asn-header/${asnHeaderId}/page-lines`, { params });

// 送货单关闭
export const closeDeliveryBill = (params) => http.post(`/spuc/v1/${SrmUtil.getTenantId()}/asn-header/close`, params);

// 送货单重新同步
export const reSyncDeliveryBill = (params) => http.post(`/spuc/v1/${SrmUtil.getTenantId()}/asn-header/close/repo`, params);
