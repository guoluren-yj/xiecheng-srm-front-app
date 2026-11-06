import { http, SrmUtil } from "srm-mobile-ui";

export const getHeaderApi = (id, params) => http.get(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-hs/detail/${id}`, { params });
export const getHeaderLineApi = (id, params) => http.get(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-dtls/${id}`, { params });
export const getLineApi = (id, params) => http.get(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-lns/${id}`, { params });
export const getLovApi = (lovCode, params) => http.get(`/hpfm/v1/${SrmUtil.getTenantId()}/lovs/data?lovCode=${lovCode}`, { params });
// 分配
export const postDistributionApi = (params) => http.post(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-hs/distribution`, params);