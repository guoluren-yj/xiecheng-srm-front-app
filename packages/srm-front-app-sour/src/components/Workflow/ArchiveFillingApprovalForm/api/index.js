import { http, SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

// 获取考评附件信息
export const getAppraisalAttachmentApi = (params) => {
  const url = `/sslm/v1/${organizationId}/kpi-eval-header-atts`;
  return http.get(url, { params });
};