import { http, SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

// 获取评分附件信息
export const getGradeAttachmentApi = (params) => {
  const url = `/sslm/v1/${organizationId}/site-eval-line-att`;
  return http.get(url, { params });
};