/*
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-06 20:08:13
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-08 00:54:34
 */
// 获取pc端业务规则配置
import { http, SrmUtil } from "srm-mobile-ui";
const { queryStr, getTenantId, getUserInfo } = SrmUtil;
const tenantId = getTenantId();
const userInfo = getUserInfo();

// 是否开启新链路执行策略
export const fetchNewLinkStrategy = (params) => {
  let url = `/sprm/v1/${tenantId}/purchase-requests/query-new-link/execution-strategy`;
  return http.get(url, params);
};

// 获取老订单工作台租户配置表
export const fetchNewBidConfig = () => {
  const { tenantNum } = userInfo;
  let url = `/spfm/v1/${tenantId}/rel-table-records/source_new_bid_config/list-from-site`;
  return http.post(url, { tenantNum, newBid: 1 });
};

//查询业务规则定义
export const fetchDoExecute = (params) => {
  const fullPathCode = params.map((ele) => ele.fullPathCode);
  let url = `/spfm/v1/${tenantId}/cnf/do-execute?${queryStr({ fullPathCode })}`;
  return http.post(url, params);
};

// 查询采购员
export const queryExecutedBys = (params) => {
  console.log(params);
  let url = "/iam/v1/lovs/sql/data";
  return http.get(url, { params: { tenantId, lovCode: "SSLM.KPI_USER", ...params } });
};

// 获取当前租户是否为执行链路的老租户
export const fetchExecutionLink = () => {
  const { tenantNum } = userInfo;
  let url = `/spfm/v1/${tenantId}/rel-table-records/sprm_execution_link_old_tenant/page/sprm-platform-rel-table`;
  return http.post(url, { tenantNum });
};