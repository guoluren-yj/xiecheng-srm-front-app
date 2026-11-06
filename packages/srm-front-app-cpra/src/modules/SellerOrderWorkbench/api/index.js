import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const organizationId = storage.getItem("organizationId");
// 个性化编码
const customizeUnitCode = "SMBL.SELLER_ORDER_WORKBENCH.BASEINFO,SMBL.SELLER_ORDER_WORKBENCH.ORGANIZATION,SMBL.SELLER_ORDER_WORKBENCH.DETAILINFO";

/*
查询是否校验附件配置
*/
export const fetchSettingApi = () => {
  const url = `/spfm/v1/${organizationId}/settings`;
  return http.get(url);
};

/*
查询操作记录数据
*/
export const fetchHistory = (poHeaderId) => {
  const url = `/spuc/v1/${organizationId}/po-process-actions/${poHeaderId}`;
  return http.get(url);
};

/*
查询是否按行协同配置
*/
export const queryCollByLine = () => {
  const url = `/spuc/v1/${organizationId}/po-header/enable/coll_by_line`;
  return http.get(url);
};

//查询是否开启双单位配置
export async function queryDoubleUomConfig() {
  const url = `/spuc/v1/${organizationId}/secondary/getcnf`;
  return http.get(url);
}

// 查询双单位基本数量换算关系
export async function queryDoubleUnitConversion(params) {
  const url = `/smdm/v1/${organizationId}/items/uom/calculate/quantity`;
  return http.post(url, params);
}

/*
查询附件
*/
export const queryFileList = (params) => {
  const url = `/hfle/v1/${organizationId}/files/${params.attachmentUUID}/file`;
  return http.get(url, { params });
};

/*
批量查询附件
*/
export const queryFilesList = (page, body, params) => {
  const url = `/hfle/v1/${organizationId}/files/check-uuids`;
  return http.post(url, body, { params });
};

/*
查询订单状态是否含有取消待确认、关闭待确认
*/
export const getVerification = (params) => {
  const url = `/spuc/v1/${organizationId}/po-workbench/po-header/feedback/verify/sidebar`;
  return http.post(url, params);
};

/*
订单反馈确认
*/
export const confirmDetail = (params) => {
  const url = `/spuc/v1/${organizationId}/po-header/confirm-detail?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

/*
订单反馈明细保存
*/
export const saveDetail = (params) => {
  const url = `/spuc/v1/${organizationId}/po-header/supplier/save?customizeUnitCode=${customizeUnitCode}`;
  return http.put(url, params);
};

/*
订单再次反馈
*/
export const afterConfirm = (params) => {
  const url = `/spuc/v1/${organizationId}/po-header/submit/after-confirm?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

/*
 * 保存文件上传后的UUID
 */
export const saveAttachmentUUID = (params) => {
  const url = `/spuc/v1/${organizationId}/po-header/attachmentUUID`;
  return http.put(url, null, { params });
};