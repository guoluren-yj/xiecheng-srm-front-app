import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (projectId) => {
  let url = `ssrc/v1/${SrmUtil.getTenantId()}/project/${projectId}?customizeUnitCode=SSRC.PROJECT_UPDATE.INFO`;
  return http.get(url);
};
