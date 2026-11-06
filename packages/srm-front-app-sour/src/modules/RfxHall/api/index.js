import { http, SrmUtil } from "srm-mobile-ui";

// 获取头信息
export const getHeaderApi = (id) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.HEADER_DETAIL,SSRC.INQUIRY_HALL_DETAIL.HEADER_PREQUAL`;
  return http.get(url);
};

// 新接口
export const getNewHeaderApi = (id, params) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/${id}/detail?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.INFO_PREPARE,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_DEMAND,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_EXECUTOR,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_PREQUAL,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_QUOTATION,CSSRC.INQUIRY_HALL_DETAIL.RFXPREPARE`;
  return http.post(url, params);
};

// 获取多标段
export const getAllSectionApi = (id) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/${id}/project/all-section`;
  return http.get(url);
};

// 获取多阶段
export const getProgressApi = (params) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/progress`;
  return http.post(url, params);
};

// 操作记录
export function getHistory(id) {
  const params = {};
  return http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/actions`, { params });
}
