
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取招标列表
export const getTenderingListApi = (params) => {
  const url = `ssrc/v1/${storage.getItem("organizationId")}/bid/list`;
  return http.get(url, { params });
};

// 获取状态和寻源方式
export const getStatusApi = (params) => {
  const url = "/hpfm/v1/lovs/value/batch";
  return http.get(url, { params });
};

// 查询开标
export const getTenderApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/${bidHeaderId}/open`;
  return http.get(url);
};

// 重发密码
export const getPassWordApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/${bidHeaderId}/open/password`;
  return http.post(url);
};

// 确认开标
export const openTenderApi = (params, bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/${bidHeaderId}/open`;
  return http.post(url, params);
};

// 获取招投标供应商信息
export const getBiddingSupplierApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/suppliers/${bidHeaderId}`;
  return http.get(url);
};

// 获取招投标头表明细信息
export const getBiddingHeadInfoApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/${bidHeaderId}`;
  return http.get(url);
};

// 获取招投标物料明细信息
export const getBiddingMaterialDetailApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/items/${bidHeaderId}`;
  return http.get(url);
};

// 获取招投标供应商分配信息
export const getSupplierAssignedApi = (bidHeaderId, bidLineItemId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/item-sup-assign?bidHeaderId=${bidHeaderId}&bidLineItemId=${bidLineItemId}`;
  return http.get(url);
};

// 获取招投标专家信息
export const getBiddingExpertsInfoApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-experts?expertStatus=SUBMITTED&organizationId=${storage.getItem("organizationId")}&sourceFrom=BID&sourceHeaderId=${bidHeaderId}`;
  return http.get(url);
};

// 获取招投标评分要素信息
export const getBiddingScoringElementsApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indics?expertStatus=SUBMITTED&organizationId=${storage.getItem("organizationId")}&sourceFrom=BID&sourceHeaderId=${bidHeaderId}`;
  return http.get(url);
};

// 获取询价单/招投标专家分配信息
export const getExpertAssignedApi = (evaluateIndicCategory, evaluateIndicId, sourceHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/evaluate-indic-assigns?evaluateIndicCategory=${evaluateIndicCategory}&evaluateIndicId=${evaluateIndicId}&sourceHeaderId=${sourceHeaderId}`;
  return http.get(url);
};

// 操作记录查询
export const getOperationRecordApi = (bidHeaderId) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/bid/actions/${bidHeaderId}`;
  return http.get(url);
};
