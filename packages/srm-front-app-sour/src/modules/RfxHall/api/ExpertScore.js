import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBasicInfoApi = (id, params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/score/detail`;
  return http.get(url, { params });
};

// 供应商评分汇总结果
export function fetchEvaluateSummary(params) {
  const { sourceFrom, sourceHeaderId, ...others } = params;
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/evaluate-summary/${sourceFrom}/${sourceHeaderId}`;
  return http.get(url, { params: others });
}