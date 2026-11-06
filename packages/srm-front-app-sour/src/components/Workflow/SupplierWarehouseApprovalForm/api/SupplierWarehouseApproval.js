import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// export const getHeaderApi = (id, params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/external-supplier-reqs/${id}`, { params });
// export const getContactApi = (id, params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-contact-reqs/${id}`, { params });
// export const getAddressApi = (id, params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-address-reqs/${id}`, { params });
// export const getBankAccountApi = (id, params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/ext-sup-bk-account-reqs/${id}`, { params });
// export const getAttachmentApi = (id, params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-attachment-reqs/${id}`, { params });
// export const getPurchaseHeaderApi = (id, params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-pf-req/${id}`, { params });
// export const getPurchaseLineApi = (id, params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-pf-line-req`, { params });

// 数据接口
export const getHeaderCompareApi = (params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/external-supplier-reqs/compare`, { params });
export const getContactCompareApi = (params) => {
  const { showOnlyChange = false, ...others } = params;
  const url = showOnlyChange ? "ext-supplier-contact-reqs/compare-only-change" : "ext-supplier-contact-reqs/compare";
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/${url}`, { params: others });
};
export const getAddressCompareApi = (params) => {
  const { showOnlyChange = false } = params;
  const url = showOnlyChange ? "ext-supplier-address-reqs/compare-only-change" : "ext-supplier-address-reqs/compare";
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/${url}`, { params });
};
export const getBankAccountCompareApi = (params) => {
  const { showOnlyChange = false } = params;
  const url = showOnlyChange ? "ext-sup-bk-account-reqs/compare-only-change" : "ext-sup-bk-account-reqs/compare";
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/${url}`, { params });
};
export const getAttachmentCompareApi = (params) => {
  const { showOnlyChange = false } = params;
  const url = showOnlyChange ? "ext-supplier-attachment-reqs/compare-only-change" : "ext-supplier-attachment-reqs/compare";
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/${url}`, { params });
};
export const getPurchaseHeaderCompareApi = (params) =>
  // const { showOnlyChange = false } = params;
  // const url = showOnlyChange ? "ext-sup-bk-account-reqs/compare-only-change" : "ext-sup-bk-account-reqs/compare";
  http.get(`/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-pf-req/compare`, { params })
;
export const getPurchaseLineCompareApi = (params) => {
  const { showOnlyChange = false } = params;
  const url = showOnlyChange ? "ext-supplier-pf-line-req/compare-only-change" : "ext-supplier-pf-line-req/compare";
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/${url}`, { params });
};