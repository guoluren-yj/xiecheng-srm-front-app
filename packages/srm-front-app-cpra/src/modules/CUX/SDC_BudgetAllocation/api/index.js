/**
 * 与 【预算调拨申请】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取预算调拨列表
export const getBudgetListApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget-adjusts`;
  return http.get(url, { params });
};
// 获取预算调拨配置信息
export const getBudgetInfoApi = () => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget-adjusts/to-budget-info`;
  return http.get(url);
};
// 获取预算状态
export const getStatusApi = () => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data?lovCode=SCUX.SD.SBUD_ADJUST_STATUS`;
  return http.get(url);
};
// 获取借调原因
export const getReasonApi = () => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data?lovCode=SCUX.SD.SBUD_ADJUST_REASON`;
  return http.get(url);
};
// 删除
export const deleteApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget-adjusts`;
  return http.delete(url, params);
};
// 提交
export const submitApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget-adjusts/submit`;
  return http.post(url, params);
};
// 保存
export const saveApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget-adjusts`;
  return http.post(url, params);
};
// 审批通过
export const passApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget-adjusts/approved`;
  return http.post(url, params);
};
// 审批拒绝
export const refuseApi = (params) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/budget-adjusts/reject`;
  return http.post(url, params);
};
// 获取操作记录
export const getOpRecordApi = (budgetAdjustId) => {
  const url = `/sprm/v1/${storage.getItem("organizationId")}/adjust-actions?page=0&size=10&budgetAdjustId=${budgetAdjustId}`;
  return http.get(url);
};

// 查询预算数据
export const getBudget = (budgetAccountNum, unitCode, budgetNum, date, type) => {
  const params = {
    lovCode: "SCUX.SD.SUBD_ADJUST_BUDGET_NUM",
    budgetAccountNum, unitCode, budgetNum,
    startDate: date,
    endDate: date,
    type,
    tenantId: storage.getItem("organizationId"),
    page: 0,
    size: 10,
  };
  const url = "/spuc/v1/lovs/sql/data";
  return http.get(url, { params });
};
