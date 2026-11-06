
import { http, SrmUtil } from "srm-mobile-ui";

//获取行记录
export const fetchLineData = (params) => {
  const { rfxHeaderId, sourceFrom } = params;
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/evaluate-summary/${sourceFrom}/${rfxHeaderId}`;
  return http.get(url);
};

//获取评分要素
export const fetchElementData = (params) => {
  const { evaluateSummaryId } = params;
  const url = `ssrc/v1/${SrmUtil.getTenantId()}/evaluate-summary/summary/${evaluateSummaryId}/indic-detail/two`;
  return http.get(url);
};

