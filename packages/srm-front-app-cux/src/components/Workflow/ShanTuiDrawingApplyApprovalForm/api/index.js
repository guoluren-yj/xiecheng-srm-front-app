import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (drawingApplyId) => {
  let params = {
    drawingApplyId
  };
  let url = `/scux/v1/${SrmUtil.getTenantId()}/shantui-drawing-applys/${drawingApplyId}/detail`;
  return http.get(url, { params });
};
