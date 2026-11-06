
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

/**验收单审批接口*/

// 获取目录话采购申请需求信息
export const getCataReqHeaderApi = (id, params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/purchase-request/${id}`;

  return http.get(url, { params });
};

// 获取目录话采购申请行信息
export const getCataReqLineApi = (id, params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/purchase-requests/${id}/lines`;

  return http.get(url, { params });
};

// 获取电商采购申请头信息
export const getEcOrderHeadApi = (id, params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/purchase-request/${id}`;

  return http.get(url, { params });
};
