
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

//获取招标小组信息
export const getTenderingGroupApi = (taskId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/members/${taskId}`;
  return http.get(url);
};

export const getBiddingScoringElementsApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indics?expertStatus=SUBMITTED&organizationId=${storage.getItem("organizationId")}&sourceFrom=BID&sourceHeaderId=${bidHeaderId}`;
  return http.get(url);
};

// 获取招投标物料明细信息
export const getBiddingMaterialDetailApi = (bidHeaderId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/items/${bidHeaderId}`;
  return http.get(url, { params });
};

// 获取招投标专家信息
export const getBiddingExpertsInfoApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-experts?expertStatus=SUBMITTED&organizationId=${storage.getItem("organizationId")}&sourceFrom=BID&sourceHeaderId=${bidHeaderId}`;
  return http.get(url);
};

// 获取招投标供应商分配信息
export const getSupplierAssignedApi = (bidHeaderId, bidLineItemId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/item-sup-assign?bidHeaderId=${bidHeaderId}&bidLineItemId=${bidLineItemId}`;
  return http.get(url);
};

// 获取招投标头表明细信息
export const getBiddingHeadInfoApi = (bidHeaderId, params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/${bidHeaderId}`;
  return http.get(url, { params });
};

// 获取招投标供应商信息
export const getBiddingSupplierApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/suppliers/${bidHeaderId}`;
  return http.get(url);
};

// 获取询价单/招投标专家分配信息
export const getExpertAssignedApi = (evaluateIndicCategory, evaluateIndicId, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-assigns?evaluateIndicCategory=${evaluateIndicCategory}&evaluateIndicId=${evaluateIndicId}&sourceHeaderId=${sourceHeaderId}`;
  return http.get(url);
};
