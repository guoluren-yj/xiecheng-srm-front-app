/**
 * 与 【预算编制】相关的业务接口
 */

import { http } from "srm-mobile-ui";
import { SrmUtil } from "srm-mobile-ui";

const storage = window.localStorage;

//保存评分行附件
export const saveGradeAttachment = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-att`;

  return http.post(url, params);
};

// 获取现场考察列表页数据
export const getEvaluatListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-headers/evaluating`;

  return http.get(url, { params });
};

// 获取现场考察详情页头数据
export const getHeadInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-headers/${params}`;

  return http.get(url);
};

// 获取现场考察详情页评分数据
export const getLineInfoApi = (evalHeaderId, params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-lines/${evalHeaderId}/evaluating`;

  return http.get(url, { params });
};

// 获取现场考察详情页品类数据
export const getMaterielInfoApi = (id, params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-item-cates/${id}`;

  return http.get(url, { params });
};

// 获取现场考察详情页小组数据
export const getGroupInfoApi = (id, params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-groups/${id}`;

  return http.get(url, { params });
};

// 获取现场考察详情页附件数据
export const getFileInfoApi = (id, params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-att-lns/${id}`;

  return http.get(url, { params });
};

// 保存现场考察详情页数据
export const getSetLineInfoApi = ({ customizeUnitCode, ...rest }) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-line-resps/preservation?customizeUnitCode=${customizeUnitCode}`;

  return http.put(url, rest);
};

// 提交现场考察详情页数据
export const getSaveLineInfoApi = ({ customizeUnitCode, ...rest }) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-line-resps?customizeUnitCode=${customizeUnitCode}`;

  return http.put(url, rest);
};

// 获取评分选项下拉内容
export const fetchIndOpt = (params) => http.get(`/hpfm/v1/${storage.getItem("organizationId")}/lovs/data`, { params });