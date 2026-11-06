/*
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-06 17:49:13
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-12 08:18:30
 */
import { http, SrmUtil } from "srm-mobile-ui";

const { getTenantId, queryStr } = SrmUtil;

const tenantId = getTenantId();

// 保存分配信息
export const saveAssignmentConfigure = (params) => {
  const { prLineVOS, values } = params;
  const { customizeUnitCode } = values;
  let url = `/sprm/v1/${tenantId}/purchase-request/line/assign/batch-new?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, {
    prLineVOS,
    ...values,
  });
};

// 保存暂挂信息
export const saveSuspendConfigure = (params) => {
  const { prLineVOS, values } = params;
  let url = `/sprm/v1/${tenantId}/purchase-request/line/suspend/batch?${queryStr(values)}`;
  return http.post(url, prLineVOS);
};

// 启用
export async function enable(params) {
  let url = `sprm/v1/${tenantId}/purchase-request/line/suspend-cancel/batch`;
  return http.post(url, params);
}

// 退回至待分配
export async function returntoassign(params) {
  const { prLineVOS, values } = params;
  let url = `sprm/v1/${tenantId}/purchase-request/line/batch/back/unassign`;
  return http.put(url, { prLineVOS, ...values });
}

// 获取操作记录
export const getActionsRecordApi = (prHeaderId) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/${prHeaderId}/actions/all`;
  return http.get(url);
};

// 获取业务规则信息-双单位配置
export const getUomControlApi = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/items/secondary/uom/getcnf`;
  return http.get(url, { params });
};