/*
 * @Date: 2022-11-21 21:32:04
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { http, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

// 合格申请单保存
export const saveQualified = (params) => {
  let url = `/sslm/v1/${tenantId}/life-cycle/qualified`;
  return http.post(url, params);
};

// 查询调查表附件信息
export const queryInvestigationAttachment = (params) => {
  let url = `/sslm/v1/${tenantId}/investigate-attachments`;
  return http.get(url, { params });
};

// 查询工厂信息
export const queryFactory = (params) => {
  const { requisitionId } = params;
  let url = `/sslm/v1/${tenantId}/starbucks-life-cycle-factorys/${requisitionId}`;
  return http.get(url, { params });
};