import { http, SrmUtil } from "srm-mobile-ui";

const { getTenantId } = SrmUtil;

const tenantId = getTenantId();

// 模具审批通过
export async function approveMould(params) {
  let url = `/siec/v1/${tenantId}/mould/change/approve`;
  return http.post(url, params);
}

// 模具审批拒绝
export async function rejecteMould(params) {
  let url = `/siec/v1/${tenantId}/mould/change/rejected`;
  return http.post(url, params);
}

// 模具审批批量通过
export async function approveBatchMould(params) {
  let url = `/siec/v1/${tenantId}/mould/change/batch/approve-reject?approveResult=APPROVED`;
  return http.post(url, params);
}

// 模具审批批量拒绝
export async function rejecteBactchMould(params) {
  let url = `/siec/v1/${tenantId}/mould/change/batch/approve-reject?approveResult=REJECTED`;
  return http.post(url, params);
}

// 获取详情数据
export async function getMouldDetailData(mouldId) {
  let url = `/siec/v1/${tenantId}/mould/${mouldId}?customizeUnitCode=SIEC.MOULD_DATA.DETAIL.HEADER_CHANGE,SIEC.MOULD_DATA.DETAIL.LIST,SIEC.MOULD_DATA.DETAIL.EXPAND_LIST&mouldStatus=CHANGE_APPROVING&mouldId=${mouldId}`;
  return http.get(url);
}

// /siec/v1/{tenantId}/mould/change-history-detail/{mouldId}?customizeUnitCode=SIEC.MOULD_DATA.DETAIL.HEADER,SIEC.MOULD_DATA.DETAIL.LIST,SIEC.MOULD_DATA.DETAIL.EXPAND_LIST
// 获取变更详情数据
export async function getMouldChangeData(mouldId) {
  let url = `/siec/v1/${tenantId}/mould/change-history-detail/${mouldId}?customizeUnitCode=SIEC.MOULD_DATA.DETAIL.HEADER,SIEC.MOULD_DATA.DETAIL.LIST,SIEC.MOULD_DATA.DETAIL.EXPAND_LIST&mouldStatus=CHANGE_APPROVING&mouldId=${mouldId}`;
  return http.get(url);
}


// 获取操作记录
export async function getHistoryData(mouldId) {
  let url = `/siec/v1/${tenantId}/mould/action/${mouldId}`;
  return http.get(url);
}