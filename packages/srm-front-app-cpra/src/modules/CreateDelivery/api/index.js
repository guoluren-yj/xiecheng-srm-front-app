/**
 * 与 【送货单创建】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

//获取创建送货单列表
const getDeliveryListApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/po-location/purchaser/can-create-asn`;
  return http.get(url, { params });
};

//获取维护送货单列表
const getMaintainDeliveryListApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/for-supplier/maintain`;
  return http.get(url, { params });
};

//获取客户列表
const getBuyerApi = (params) => {
  const url = `spfm/v1/${storage.getItem("organizationId")}/user-authority-data/customer`;
  return http.get(url, { params });
};

//送货单创建-送货单批量创建
const createDeliveryApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/create-by-po-new`;
  return http.post(url, params);
};

//送货单维护明细头查询
const getDetailHeadInfoApi = (asnHeaderId) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}`;
  const params = {
    customizeUnitCode: "SINV.DELIVERY_CREATION_DETAIL.HEADER,SINV.DELIVERY_CREATION_DETAIL.LOGISTICS,SINV.DELIVERY_CREATION_DETAIL.HEADERSHIP",
    // customizeUnitCode: `SMBL.CREATE_DELIVERY.HEAD_INFO,SMBL.CREATE_DELIVERY.LINE_INFO,SMBL.CREATE_DELIVERY.LOGISTIC_INFO,SMBL.CREATE_DELIVERY.LINE_INFO_DETAIL`,
  };
  return http.get(url, { params });
};

//送货单维护明细行查询-不分页
const getDetailLineInfoApi = (asnHeaderId) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/lines`;
  const params = {
    asnHeaderId: asnHeaderId,
    customizeUnitCode: "SINV.DELIVERY_CREATION_DETAIL.LINE_BASIC",
    // customizeUnitCode: `SMBL.CREATE_DELIVERY.HEAD_INFO,SMBL.CREATE_DELIVERY.LINE_INFO,SMBL.CREATE_DELIVERY.LOGISTIC_INFO,SMBL.CREATE_DELIVERY.LINE_INFO_DETAIL`,
  };
  return http.get(url, { params });
};

//送货单维护保存
const saveMaintainDeliveryApi = (params) => {
  const customizeUnitCode = 'SINV.DELIVERY_CREATION_DETAIL.LINE_BASIC,SINV.DELIVERY_CREATION_DETAIL.HEADER,SINV.DELIVERY_CREATION_DETAIL.LOGISTICS,SINV.DELIVERY_CREATION_DETAIL.HEADERSHIP';
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header?customizeUnitCode=${customizeUnitCode}`;
  return http.put(url, params);
};

//送货单维护提交
const submitMaintainDeliveryApi = (params) => {
  const customizeUnitCode = 'SINV.DELIVERY_CREATION_DETAIL.LINE_BASIC,SINV.DELIVERY_CREATION_DETAIL.HEADER,SINV.DELIVERY_CREATION_DETAIL.LOGISTICS,SINV.DELIVERY_CREATION_DETAIL.HEADERSHIP';
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/submit?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

//送货单维护批量提交
const submitMaintainSomeDeliveryApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/submit`;
  return http.post(url, params);
};

//送货单维护删除/送货单维护批量删除
const deleteDeliveryApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header`;
  return http.delete(url, params);
};

//送货单维护行信息删除
const deleteDeliveryLineInfoApi = (asnHeaderId, params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/lines`;
  return http.delete(url, params);
};

//送货单维护行附件ID刷新
const getFileUUIDApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/lines/attachment-uuid`;
  return http.put(url, params);
};

//送货单维护附件查询
const getFileApi = (attachmentUuid) => {
  const url = `hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUuid}/file?attachmentUUID=${attachmentUuid}&bucketName=private-bucket`;
  return http.get(url);
};

//送货单维护附件删除
const deleteFileApi = ({ attachmentUUID, bucketName, params }) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`;
  return http.post(url, params);
};

//送货单维护获取附件上传UUID
const getAttachmentUuidApi = () => {
  const url = `hfle/v1/${storage.getItem("organizationId")}/files/uuid`;
  return http.post(url);
};

//送货单维护头附件ID刷新
const flashAttachmentUuidApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/attachment-uuid`;
  return http.put(url, params);
};

//送货单维护行附件ID刷新
const flashAttachmentLineUuidApi = (params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/lines/attachment-uuid`;
  return http.put(url, params);
};

//送货单维护附件删除
const delFileApi = (attachmentUuid) => {
  const url = `hfle/v1/${storage.getItem("organizationId")}/files/delete-by-uuidurl?attachmentUUID=${attachmentUuid}&bucketName=private-bucket`;
  return http.post(url);
};

//送货单操作记录查询-供应商
const getOpRecordApi = (asnHeaderId, params) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/action`;
  return http.get(url, { params });
};

// 根据编码获取配置中心
const getSettingConfig = (params) => {
  const url = `/spfm/v1/${params.organizationId}/settings/${params.settingCode}`;
  return http.get(url);
};

export {
  delFileApi,
  getFileApi,
  getBuyerApi,
  deleteFileApi,
  getOpRecordApi,
  getFileUUIDApi,
  createDeliveryApi,
  deleteDeliveryApi,
  getDeliveryListApi,
  getDetailHeadInfoApi,
  getAttachmentUuidApi,
  getDetailLineInfoApi,
  flashAttachmentUuidApi,
  saveMaintainDeliveryApi,
  deleteDeliveryLineInfoApi,
  submitMaintainDeliveryApi,
  getMaintainDeliveryListApi,
  flashAttachmentLineUuidApi,
  submitMaintainSomeDeliveryApi,
  getSettingConfig
};
