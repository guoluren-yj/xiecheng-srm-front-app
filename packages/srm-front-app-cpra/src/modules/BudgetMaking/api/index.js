/**
 * 与 【预算编制】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取预算编制列表
export const getBudgetListApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget/list/for-mobile`;
  return http.get(url, { params });
};
// 获取预算状态
export const getStatusApi = () => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data?lovCode=SBUD.BUDGET_STATUS`;
  return http.get(url);
};
// 作废
export const cancelApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget/cancel`;
  return http.post(url, params);
};
// 删除
export const deleteApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget`;
  return http.delete(url, params);
};
// 提交
export const submitApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget/submit`;
  return http.post(url, params);
};
// 确认
export const confirmApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget/confirm`;
  return http.post(url, params);
};
// 拆分
export const splitApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget/split`;
  return http.post(url, params);
};
// 查询子部门
export const getChildUnit = (unitCode) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget/child-unit?unitCode=${unitCode}`;
  return http.get(url);
};
// 保存
export const saveApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget`;
  return http.put(url, params);
};
// 获取操作记录
export const getOpRecordApi = (budgetId) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget-action?page=0&size=10&budgetId=${budgetId}`;
  return http.get(url);
};
// 回收
export const recycleBudget = (budgetId) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget/recycle`;
  return http.post(url, { budgetId });
};
// 获取自定义字段
export const getItemApi = () => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget-item`;
  return http.get(url);
};
