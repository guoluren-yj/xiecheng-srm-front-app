import { http, SrmUtil } from "srm-mobile-ui";

// 评分接口
export const getDataByCeApi = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/watsons-store-scores/list`;
  return http.get(url, { params });
};

// 评分接口
export const scoreApi = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/store-score/receive`;
  return http.post(url, params);
};

// 获取附件
export const getAttachApi = (id, bucketName) => {
  const url = `/hfle/v1/${SrmUtil.getTenantId()}/files/${id}/file?attachmentUUID=${id}&bucketName=${bucketName}`;
  return http.get(url);
};