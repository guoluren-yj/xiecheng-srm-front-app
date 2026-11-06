import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export const getPrePayHeader = (id, params) => http.get(`/ssta/v1/${storage.getItem("organizationId")}/pre-pay-headers/${id}`, { params });

export const getPrePayLine = (id, params) => http.get(`/ssta/v1/${storage.getItem("organizationId")}/pre-payment-lines/${id}`, { params });

export const getPrePayLineRecord = (id, params) => http.get(`/ssta/v1/${storage.getItem("organizationId")}/pre-payment-lines/write/off/record/${id}`, { params });

export const updatePrePay = (data, params) => http.put(`/ssta/v1/${storage.getItem("organizationId")}/pre-pay-headers/purchaser/save`, data, { params });