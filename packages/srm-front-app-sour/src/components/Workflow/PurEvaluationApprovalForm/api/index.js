/**
 * 评估工作台接口
 */

import { http } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";

const storage = window.localStorage;

// 基础信息
export const getBasicInfoApi = (evalHeaderId) => {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-headers/eval-report/${evalHeaderId}`;
  return http.get(url);
};

// 操作记录信息
export const getHistoricApi = (evalHeaderId) => {
  const url = `${SRM_SSLM}/v1/${storage.getItem("organizationId")}/site-eval-opr-historys/${evalHeaderId}`;
  return http.get(url);
};

// 获取附件api
export const getAttachedFile = (payload) => {
  const { attachmentUuid, ...params } = payload || {};
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUuid}/file`;
  return http.get(url, { params });
};

