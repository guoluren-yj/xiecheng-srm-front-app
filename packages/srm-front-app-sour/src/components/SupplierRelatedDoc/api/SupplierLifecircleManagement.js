import { SrmUtil, http } from "srm-mobile-ui";

/**
 * 获取调查表详情信息
 * @param investgHeaderId 调查表头id
 */
export const getInvestigateDetail = (investgHeaderId) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/investigate/${investgHeaderId}`;
  const params = { customizeUnitCode: "SSLM.INVESTIGATION_APPROVAL_DETAIL.HEADER" };
  return http.get(url, { params });
};

/**
 * 获取到调查表配置信息
 * @param investigateTemplateId 调查表模板id
 */
export const getInvestigateConfigPreview = (investigateTemplateId) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/investigate-confighs-preview/${investigateTemplateId}`;
  return http.get(url);
};
