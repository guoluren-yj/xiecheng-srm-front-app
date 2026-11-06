import { http, SrmUtil } from "srm-mobile-ui";

// 评分接口-获取供应商信息
export const getComDataApi = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/watsons-store-template-sds/supplier`;
  return http.get(url, { params });
};
// 评分接口-获取供应商信息/评分项
export const getScoreDataApi = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/watsons-store-template-sds/list`;
  return http.get(url, { params });
};
// 评分接口
export const scoreApi = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/watsons-store-score-sds/score`;
  return http.post(url, params);
};

// 获取附件
export const getAttachApi = (id, bucketName) => {
  const url = `/hfle/v1/${SrmUtil.getTenantId()}/files/${id}/file?attachmentUUID=${id}&bucketName=${bucketName}`;
  return http.get(url);
};