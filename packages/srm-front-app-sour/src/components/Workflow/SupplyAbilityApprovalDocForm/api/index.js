import { http, SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

// 查询头信息
export const fetchHeaderInfo = (payload) => {
  const { abilityReqId, ...params } = payload || {};
  const url = `/sslm/v1/${organizationId}/supply-ability-change-reqs/${abilityReqId}`;
  return http.get(url, { params });
};

// 查询行信息附件
export const fetchLineAttachment = (payload) => {
  const { abilityChangeLineId, ...params } = payload || {};
  const url = `/sslm/v1/${organizationId}/supply-ability-change-att-lns/${abilityChangeLineId}`;
  return http.get(url, { params });
};