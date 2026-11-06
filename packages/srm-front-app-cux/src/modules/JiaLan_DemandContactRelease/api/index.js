import { http, SrmUtil } from "srm-mobile-ui";

export const getHeaderApi = (id, params) => http.get(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-hs/detail/${id}`, { params });
export const getHeaderLineApi = (id, params) => http.get(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-dtls/${id}`, { params });
export const getLineApi = (id, params) => http.get(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-lns/${id}`, { params });
export const getLovApi = (lovCode, params) => http.get(`/hpfm/v1/${SrmUtil.getTenantId()}/lovs/data?lovCode=${lovCode}`, { params });
// 发布
export const postReleaseApi = (params) => http.post(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-hs/release`, params);
// 退回
export const postReturnApi = (params) => http.post(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-hs/return`, params);
// 发布多条
export const postReleaseAllApi = (params) => http.post(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-hs/batch/release`, params);
// 退回多条
export const postReturnAllApi = (params) => http.post(`/scux/v1/${SrmUtil.getTenantId()}/jala-req-liaison-hs/batch/return`, params);