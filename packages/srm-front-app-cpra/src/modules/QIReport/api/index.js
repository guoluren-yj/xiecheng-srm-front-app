import { http, SrmUtil } from "srm-mobile-ui";
const tenantId = SrmUtil.getTenantId();

export const queryIdpValue = async (lovCode) => {
  const url = `/hpfm/v1/${tenantId}/lovs/value`;
  return http.get(url, { params: { lovCode } });
};

export const querySqlIdpData = async (lovCode, otherParams) => {
  const url = `/hpfm/v1/${tenantId}/lovs/sql/data`;
  return http.get(url, { params: { lovCode, ...otherParams } });
};

export const queryMapIdpValue = async (lovCodes) => {
  const url = `/hpfm/v1/${tenantId}/lovs/value/batch`;
  return http.get(url, { params: lovCodes });
};

export const queryIncomingSearch = async () => {
  const url = `/sqam/v1/${tenantId}/incoming-search-configs/list`;
  return http.get(url);
};

export const batchDeleteQIReport = (body) => {
  const url = `/sqam/v1/${tenantId}/problem-headers`;
  return http.delete(url, body);
};

export const queryOperationRecords = (problemHeaderId) => {
  const url = `/sqam/v1/operation-historys/${problemHeaderId}`;
  return http.get(url);
};

export const queryApprovalRecords = (params) => {
  const url = `/hwfp/v1/${tenantId}/activiti/task/historyApproval`;
  return http.post(url, null, { params });
};

export const saveQIReport = (body) => {
  const { customizeUnitCode } = body || {};
  const url = `/sqam/v1/${tenantId}/problem-headers/save`;
  return http.put(url, body, { params: { customizeUnitCode } });
};

export const releaseQIReport = (data) => {
  const { customizeUnitCode } = data || {};
  const url = `/sqam/v1/${tenantId}/problem-headers/publish`;
  return http.put(url, [ data ], { params: { saveFlag: 1, customizeUnitCode } });
};

export const recallQIReport = (body) => {
  const url = `/sqam/v1/${tenantId}/problem-headers/undo`;
  return http.put(url, body);
};

export const batchSyncQIReport = (body) => {
  const url = `/sqam/v1/${tenantId}/problem-headers/sync-external-system`;
  return http.post(url, body);
};

export const saveAttachment = (params) => {
  const { problemHeaderId } = params;
  const url = `/sqam/v1/${tenantId}/problem-headers/${problemHeaderId}/attachment-uuid`;
  return http.post(url, null, { params });
};

export const auditContinuePCA = (body, params) => {
  const { problemHeaderId } = body;
  const url = `/sqam/v1/${tenantId}/problem-headers/${problemHeaderId}/ask-pca`;
  return http.post(url, body, { params });
};

export const auditComplete = (body, params) => {
  const { problemHeaderId } = body;
  const url = `/sqam/v1/${tenantId}/problem-headers/${problemHeaderId}/complete`;
  return http.post(url, body, { params });
};

export const auditReject = (body, params) => {
  const { problemHeaderId } = body;
  const url = `/sqam/v1/${tenantId}/problem-headers/${problemHeaderId}/reject`;
  return http.post(url, body, { params });
};

export const auditCancel = (body, params) => {
  const { problemHeaderId } = body;
  const url = `/sqam/v1/${tenantId}/problem-headers/${problemHeaderId}/cancel`;
  return http.post(url, body, { params });
};

export const adjustTime = (body) => {
  const { problemHeaderId } = body;
  const url = `/sqam/v1/${tenantId}/problem-headers/${problemHeaderId}/updateTime`;
  return http.post(url, body);
};