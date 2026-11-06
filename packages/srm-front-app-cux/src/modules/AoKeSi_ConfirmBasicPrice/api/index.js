import { http, SrmUtil } from "srm-mobile-ui";

/**
 * 查询基准价列表
 * @param {*参数对象} params
 * @returns
 */
export const getBasicPriceListApi = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/benchmark/confirm/list`;

  return http.get(url, { params });
};

/**
 * 查询确认基准条数
 * @param {*参数对象} params
 * @param {*基准价id} benchmarkId
 * @returns
 */
export const getBasicPriceDetailApi = (params, benchmarkId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/benchmark/lines/confirm/${benchmarkId}`;

  return http.get(url, { params });
};

/**
 * 查询确认基准头信息
 * @param {*参数对象} params
 * @param {*基准价id} benchmarkId
 * @returns
 */
export const getBasicPriceHeaderDetailApi = (rfxHeaderId,benchmarkId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/benchmark/${rfxHeaderId}?benchmarkId=${benchmarkId}`;

  return http.get(url);
};
/**
 * 保存基准价
 * @param {*数据} params
 * @param {*基准价id} benchmarkId
 * @returns
 */
export const saveBasicPriceApi = (params, benchmarkId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/benchmark/lines/save?benchmarkId=${benchmarkId}`;

  return http.post(url, params);
};

/**
 * 提交基准价
 * @param {*数据} params
 * @param {*基准价id} benchmarkId
 * @returns
 */
export const submitBasicPriceApi = (params, benchmarkId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/benchmark/lines/submit?benchmarkId=${benchmarkId}`;

  return http.post(url, params);
};

// 新接口
export const getNewHeaderApi = (id, params) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/${id}/detail?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.INFO_PREPARE,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_DEMAND,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_EXECUTOR,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_PREQUAL,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_QUOTATION,CSSRC.INQUIRY_HALL_DETAIL.RFXPREPARE`;
  return http.post(url, params);
};

// 操作记录
export function getHistory(id) {
  const params = {};
  return http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/actions`, { params });
}

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