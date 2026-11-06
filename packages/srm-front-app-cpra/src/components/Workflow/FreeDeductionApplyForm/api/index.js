import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export const getChargeHeader = (id, params) => http.get(`/ssta/v1/${storage.getItem("organizationId")}/charge-headers/${id}`, { params });

export const getChargeLine = (params) => http.get(`/ssta/v1/${storage.getItem("organizationId")}/charge-lines`, { params });

export const getChargeRecord = (params) => http.get(`/ssta/v1/${storage.getItem("organizationId")}/charge-records/record`, { params });

export const getCuszTemplate = (body) => http.post("/ssta/v1/customize/template-cusz", body);
