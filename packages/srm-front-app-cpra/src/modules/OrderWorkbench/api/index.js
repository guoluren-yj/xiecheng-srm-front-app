/**
 * @author biao.zhu@going-link.com
 * @since 2022-09-08 20:58:59
 * @lastTime 2022-09-08 21:02:49
 * @description 订单工作台API
 * @copyright Copyright (c) 2020, Hand
 */
import { http, SrmUtil } from "srm-mobile-ui";

const storage = window.localStorage;
// 获取操作记录
export const getActionsRecordApi = (poHeaderId) => {
  let url = `/spuc/v1/${SrmUtil.getTenantId()}/po-process-actions/${poHeaderId}`;
  return http.get(url);
};

/*
 * 保存文件上传后的UUID
 */
export const saveAttachmentUUID = (params) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-header/attachmentUUID`;
  return http.put(url, null, { params });
};

// 订单发布-批量
export const batchReleaseApi = (params) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-header/batch-publish`;
  return http.post(url, params);
};

// 订单同意
export const agreeApi = (params, cuzCodes) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-header/delivery-date-review/agree?customizeUnitCode=${cuzCodes}`;
  return http.post(url, params);
};

// 订单退回
export const rejectApi = (params, cuzCodes) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-header/delivery-date-review/reject?customizeUnitCode=${cuzCodes}`;
  return http.post(url, params);
};

// 订单发布
export const releaseApi = (params, cuzCodes) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/po-header/detail-publish?customizeUnitCode=${cuzCodes}`;
  return http.post(url, params);
};

/**
 * 查询是否开启双单位配置
 * @function queryDoubleUomConfig
 * @returns {object} fetch Promise 0不开启双单位，1上下游和订单都开启，2仅订单开启
 */
export const queryDoubleUomConfigApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/secondary/getcnf`;
  return http.get(url, { params });
};

// 五菱
export function cuxBatchSilentSigning(params) {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/YhmFOTMPiayPFvrkHtdib7zBurW1GuaFdxkAN6X4yroYs`;
  return http.post(url, params);
}
