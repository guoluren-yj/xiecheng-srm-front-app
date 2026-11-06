
import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

// 获取列表
const getDeliveryList = (params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/for-supplier`, { params });

// 获取送货单状态
const getDeliveryStatusApi = () => http.get("/hpfm/v1/lovs/value/batch?status=SINV.ASN_HEADERS_STATUS");

// 获取客户
const getSupplierApi = (params) => http.get(`/spfm/v1/${storage.getItem("organizationId")}/user-authority-data/customer`, { params });

// 获取我的送货单明细头信息
const getOrderHeadInfo = (asnHeaderId, params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}`, { params });

// 获取我的送货单明细行信息
const getOrderLineInfo = (asnHeaderId, params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/page-lines`, { params });

// 获取操作记录
const getOperationRecordsApi = ({ asnHeaderId, page = 0, size = 10 }) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/action?page=${page}&size=${size}`);

// 保存
const saveApi = (params) => {
  const customizeUnitCode = 'SINV.SUPPLIER_DELIVERY.DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.BASIC_C7N,SINV.SUPPLIER_DELIVERY.DETAIL.OTHER,SINV.SUPPLIER_DELIVERY.DETAIL.ADD_LOGISTICS,SINV.SUPPLIER_DELIVERY.DETAIL.HEADERSHIP,SINV.SUPPLIER_DELIVERY.DETAIL.BUTTONS.BTN,SINV.SUPPLIER_DELIVERY.DETAIL.LOGISTICS';
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/purchase/save?customizeUnitCode=${customizeUnitCode}`;
  return http.put(url, params);
};

/*
物流信息补录
*/
const getLogisticsApi = (params, asnHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/logistics`;
  return http.post(url, params);
};
// 获取附件
const getAttachedFile = (attachmentUUID) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`);

// 获取上传附件UUID
const getFileUUIDApi = () => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/uuid`;
  return http.post(url);
};

// 保存生成的UUID
const saveFileUUIDApi = ({ uuidType, uuid, poHeaderId }) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/attachmentUUID?uuidType=${uuidType}&uuid=${uuid}&poHeaderId=${poHeaderId}`;
  return http.put(url);
};

// 根据uuid获取附件
const getFileApi = (attachmentUUID) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=private-bucket`);

// 获取门店明细
const getStoreInfoList = (itemId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-detail-list/${itemId}`;
  return http.get(url);
};

// 获取打印附件
export const getPrintFileApi = (asnHeaderId) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/query-print?asnHeaderId=${asnHeaderId}&tenantId=${tenantId}`;
  return http.get(url, { responseType: "arraybuffer" });
};

// 获取附件下载地址
export const getPrintFileDownloadeApi = (asnHeaderId) => {
  const baseUrl = http.myRequire.defaults.baseURL;
  const tenantId = localStorage.getItem("tenantId");
  // eslint-disable-next-line camelcase
  const access_token = window.localStorage.getItem("user-token");
  // eslint-disable-next-line camelcase
  const url = `${baseUrl}/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/query-print?asnHeaderId=${asnHeaderId}&tenantId=${tenantId}&access_token=${access_token}`;
  return url;
};

// 保存物流信息补录
const logSave = (asnHeaderId, customizeUnitCode, params) => http.post(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/logistics?customizeUnitCode=${customizeUnitCode}`, params);

export {
  logSave,
  getDeliveryList,
  getFileUUIDApi,
  saveFileUUIDApi,
  getAttachedFile,
  getDeliveryStatusApi,
  getOrderHeadInfo,
  getSupplierApi,
  getOrderLineInfo,
  getOperationRecordsApi,
  getLogisticsApi,
  getFileApi,
  getStoreInfoList,
  saveApi,
};
