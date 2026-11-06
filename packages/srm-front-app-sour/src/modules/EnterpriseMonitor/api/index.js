/**
 * 与 【预算编制】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取监控列表
export const getMonitorListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/monitor`;
  return http.get(url, { params });
};
// 创建监控
export const createMonitorApi = (data) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/monitor`;
  return http.post(url, data);
};
// 获取分组权限
export const getMonitorGroupPermission = () => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/monitor-group/permission`;
  return http.get(url);
};

// 查询分组
export const getMonitorGroup = () => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/monitor-group`;
  return http.get(url);
};

// 查询企业
export const getMonitorSupplier = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/monitor/supplier`;
  return http.get(url, { params });
};

// 取消监控
export const cancelMonitor = (data) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/monitor/cancel`;
  return http.delete(url, data);
};

export const validPartnerCompanyNameIsExists = (companyNameList) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/monitor/validPartnerCompanyNameIsExists`;
  return http.post(url, { companyNameList });
};

// 查询所有的跳转地址
export const queryAllMonitor = () => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/monitor/query-all`;
  return http.get(url);
};

// 查询单个跳转地址
export const queryMonitor = (enterpriseName) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/monitor/query-monitor-enterprise?enterpriseName=${enterpriseName}`;
  return http.get(url);
};

