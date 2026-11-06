import { http, httpCatch, SrmUtil } from "srm-mobile-ui";

//调用退回节点值集合
//https://dev.isrm.going-link.com/spuc/v1/30/sinv/rcv/trx/line/reverse-node-url?&page=0&size=10&nodeConfigId=10045&tenantId=30&strategyLineIds=12025
export const getReverseNode = (nodeConfigId, strategyLineIds) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/line/reverse-node-url?nodeConfigId=${nodeConfigId}&tenantId=${SrmUtil.getTenantId()}&strategyLineIds=${strategyLineIds}`;
  return http.get(url);
};
// https://gateway.dev.isrm.going-link.com/spuc/v1/30/rcv-change-records/__-fn48z66MCyOrnmcHzDe5SQ-__/__-cJyYkUNS3mWLZ-WZnHmw2A-__/repost
//导入失败数据重新执行
export const repost = (rcvTrxHeaderId, rcvTrxLineId, body) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/rcv-change-records/${rcvTrxHeaderId}/${rcvTrxLineId}/repost`;
  return http.post(url, body);
};
//保存分数://gateway.dev.isrm.going-link.com/spuc/v1/30/sinv/rcv/trx/score/92441/save
export const savScore = (rcvTrxHeaderId, body) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/score/${rcvTrxHeaderId}/save`;
  return http.post(url, body);
};
//基于为收货的数据新建收货单-批量提交
export const batchSubmitReceive = (cacheKey, body) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/batch/submitted?cacheKey=${cacheKey}`;
  return http.post(url, body);
};
//基于为收货的数据新建收货单-批量删除
export const batchDeleteReceive = (cacheKey, body) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/batch/delete?cacheKey=${cacheKey}`;
  return httpCatch.delete(url, body);
};
//多单合并，切换多收货单接口调用
export const checkReceiveListGet = (cacheKey) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/creating/sinv/list?cacheKey=${cacheKey}`;
  return httpCatch.get(url);
};
//提交
export const submit = (sugRcvStatusCode, bodyList) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/doing-sinv?sugRcvStatusCode=${sugRcvStatusCode}`;
  return httpCatch.post(url, bodyList);
};
//退回执行
export const reverseExecute = (rcvTrxTypeId, nodeConfigId, bodyList) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/finished-line-waiting-todo-sinv?rcvTrxTypeId=${rcvTrxTypeId}&nodeConfigId=${nodeConfigId}`;
  return http.post(url, bodyList);
};
//获取审批记录
export const getApproveRecord = (rcvTrxHeaderId) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/rcv-action-record/list-history-approval?page=0&size=100&rcvTrxHeaderId=${rcvTrxHeaderId}`;
  return http.get(url);
};
//获取操作记录
export const getOperationRecord = (rcvTrxHeaderId) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/rcv-action-record/page?page=0&size=10&rcvTrxHeaderId=${rcvTrxHeaderId}`;
  return http.get(url);
};
//删除收货单行
export const deleteReceiveLine = (body) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/line/delete`;
  return http.delete(url, body);
};
//基于为收货的数据新建收货单-提交
export const submitReceive = (body, customizeUnitCode) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/submitted?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, body);
};
//基于为收货的数据新建收货单-保存
export const saveReceive = (body, customizeUnitCode) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/save?customizeUnitCode=${customizeUnitCode}`;
  return http.put(url, body);
};
//基于为收货的数据新建收货单-删除
export const deleteReceive = (body) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/delete`;
  return http.delete(url, body);
};
//基于为收货的数据新建收货单
export const createReceive = (body) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/waiting-todo-sinv`;
  return http.post(url, body);
};
//获取所有选择节点
export const getAllNodeInfo = () => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench//source/trx/all-node-info`;
  return http.get(url);
};

//获取收货详情节点
export const getReceiveNodeInfo = (param) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/trx/permission-node-list?sourceHeaderNum=${param.sourceHeaderNum}&sourceLineNum=${param.sourceLineNum}&strategyHeaderId=${param.strategyHeaderId}`;
  return http.get(url);
};

// 查询是否开启双单位配置
export const queryDoubleUomConfig = (params) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/sinv/secondary/query-cnf?moduleCode=sinv`;
  return http.get(url, { params });
};

/**
 * 双单位计算公式
 * @function calculateDoubleUom
 * @returns {object}
 */

export async function calculateDoubleUomApi(params) {
  const url = `/smdm/v1/${SrmUtil.getTenantId()}/items/uom/calculate/quantity`;
  return http.post(url, params);
}