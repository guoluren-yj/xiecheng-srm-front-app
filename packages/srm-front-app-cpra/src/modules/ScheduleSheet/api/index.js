import { SrmUtil, http } from "srm-mobile-ui";

/**
 * 创建计划排程
 * @param data
 * @returns {any}
 */
export function createScheduleSheet(data) {
  return http.post(`/spuc/v1/${SrmUtil.getTenantId()}/plans`, data);
}

/**
 * 计划排程操作记录
 * @param planId
 * @returns {any}
 */
export function getPlanHistory(planId) {
  const params = {};
  return http.get(`/spuc/v1/${SrmUtil.getTenantId()}/plan-actions/${planId}`, { params });
}

// 获取配置中心的code配置
export const getSettingApi = (code) => {
  const url = `/spfm/v1/${SrmUtil.getTenantId()}/settings/batch?${code}=${code}`;
  return http.get(url);
};

