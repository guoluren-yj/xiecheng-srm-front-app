import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export const getOtherInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sup-change-others/compare`;
  return http.get(url, { params });
};