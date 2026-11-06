/**
 * 与 【发票查验】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

//发票列表
export const getInvoiceListApi = (params) => {
  const url = `/sfin/v1/${SrmUtil.getTenantId()}/tax-invoice-check/page`;
  return http.get(url, { params });
};

//购买方lov
export const getBuyerApi = (params) => {
  const url = `/spfm/v1/${SrmUtil.getTenantId()}/user-authority-data/company`;
  return http.get(url, { params });
};

//手工录入保存
export const saveInvoiceApi = (params) => {
  const url = `/sfin/v1/${SrmUtil.getTenantId()}/tax-invoice-check`;
  return http.post(url, params);
};

//发票查验
export const checkInvoiceApi = (params) => {
  const url = `/sfin/v1/${SrmUtil.getTenantId()}/tax-invoice-check/check`;
  return http.post(url, params);
};

//查验状态查询
export const getInvoiceStatusApi = (params) => {
  const url = "/hpfm/v1/lovs/value/batch";
  return http.get(url, { params });
};

//OCR识别
export const ocrImportApi = (params) => {
  const url = `/sfin/v1/${SrmUtil.getTenantId()}/tax-invoice-check/ocr-import`;
  return http.post(url, params);
};

//获取微信
export const getWxInfoApi = (paramsUrl, thirdPlatformClient, thirdPlatformCode) => {
  const url = `/hipspfm/hippius/v1/thirdPartyUser/getServiceSignature?url=${paramsUrl}&thirdPlatformClient=${thirdPlatformClient}&thirdPlatformCode=${thirdPlatformCode}`;
  return http.get(url);
};

// 获取OCR上传文件大小
export const getOcrConfig = () => {
  const url = `/sfin/v1/${SrmUtil.getTenantId()}/common/ocr-channel-mapping`;
  return http.get(url);
};
