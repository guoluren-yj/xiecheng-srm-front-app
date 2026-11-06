import { http, SrmUtil } from "srm-mobile-ui";

export const getBaseInfoApi = (id, params) => http.get(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/result/${id}`, { params });

export const getScoreSumApi = (id, params) => http.get(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/eval-lines/${id}`, { params });

export const getOrderApi = (params) => http.post(`/hpfm/v1/${SrmUtil.getTenantId()}/ui-customize/translateLov?lovViewCode=SPUC.RCV_TRX_HEADER`, params);

export const getLovApi = (params) => http.get(`/hpfm/v1/${SrmUtil.getTenantId()}/lovs/value/batch`, { params });

export const saveApi = (params) => http.put(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers?customizeUnitCode=SSLM.EVALUATION_DOC_MANAGE_DETAIL.HEADER`, params);