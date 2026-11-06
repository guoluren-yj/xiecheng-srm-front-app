import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export const getHeaderApi = (id, params) => http.get(`/scux/v1/${storage.getItem("organizationId")}/jala-req-liaison-hs/detail/${id}`, { params });
export const getHeaderLineApi = (id, params) => http.get(`/scux/v1/${storage.getItem("organizationId")}/jala-req-liaison-dtls/${id}`, { params });
export const getLineApi = (id, params) => http.get(`/scux/v1/${storage.getItem("organizationId")}/jala-req-liaison-lns/${id}`, { params });
// 值集调用
export const getLovApi = (code, params) => http.get(`/hpfm/v1/${storage.getItem("organizationId")}/lovs/data?lovCode=${code}`, { params });
// 修改字段调用
export const changeDemandContactApi = (params) => http.post(`scux/v1/${storage.getItem("organizationId")}/jala-req-liaison-hs/no/stats/change`, params);