import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取电商采购申请头信息
export const getEcOrderHeadApi = (id, params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/purchase-request/${id}`;

  return http.get(url, { params });
};
