import { http } from "srm-mobile-ui";

export const getBasicDataApi = (params) => {
  let url = `/smodr/v1/${localStorage.getItem("organizationId")}/mall-requests/detail?customizeUnitCode=SMODR.REQUEST.DETAIL.BASE.INFO`;
  return http.get(url, {params});
};
