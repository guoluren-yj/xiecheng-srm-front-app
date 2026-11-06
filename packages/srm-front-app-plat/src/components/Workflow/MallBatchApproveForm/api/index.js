import { http } from "srm-mobile-ui";

export const getBasicDataApi = (params) => {
  let url = `/smodr/v1/${localStorage.getItem("organizationId")}/orders/batch-detail`;
  return http.get(url, { params });
};
