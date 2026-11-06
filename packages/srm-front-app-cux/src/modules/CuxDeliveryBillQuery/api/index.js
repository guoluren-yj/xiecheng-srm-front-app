
import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

// 获取送货单列表
const getDeliveryList = (params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/for-purchase`, { params });

// 获取送货单状态
const getDeliveryStatusApi = () => http.get("/hpfm/v1/lovs/value/batch?status=SINV.ASN_HEADERS_STATUS");

// 获取供应商
const getSupplierApi = (params) => http.get(`/spfm/v1/${storage.getItem("organizationId")}/user-authority-data/supplier`, { params });

// 获取送货单明细头信息
const getOrderHeadInfo = (asnHeaderId, params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}`, { params });

// 获取送货单明细行信息
const getOrderLineInfo = (asnHeaderId, params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/page-lines`, { params });

// 获取操作记录
const getOperationRecordsApi = ({ asnHeaderId, page = 0, size = 10 }) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/action?page=${page}&size=${size}`);

// 获取附件
const getAttachedFile = (attachmentUUID) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`);

// 获取上传附件UUID
const getFileUUIDApi = () => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/uuid`;
  return http.post(url);
};

// 保存生成的UUID
const saveFileUUIDApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/attachment-uuid`;
  return http.put(url, params);
};
// 删除附件
const delSupplierFile = (attachmentUUID, params) => http.post(`/hfle/v1/${storage.getItem("organizationId")}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`, params);

// 获取物流详情
export const getLogisticsDetailsApi = (id) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/${id}/logistics/details`;
  return http.get(url);
};
// 获取物流详信息
export const getLogisticsInfoApi = (id) => {
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/${id}/logistics/sync`;
  return http.get(url);
};

// 获取门店明细
const getStoreInfoList = (itemId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-detail-list/${itemId}`;
  return http.get(url);
};

// 获取打印附件
export const getPrintFileApi = (asnHeaderId) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `/spuc/v1/${storage.getItem("organizationId")}/asn-header/${asnHeaderId}/query-print?asnHeaderId=${asnHeaderId}&tenantId=${tenantId}`;
  return http.get(url, { responseType:"arraybuffer" });
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

//送货单查询明细保存
const saveMaintainDeliveryApi = (params) => {
  const customizeUnitCode = "SINV.PURCHASER_DELIVERY.DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.LOGISTICS,SINV.PURCHASER_DELIVERY.DETAIL.BASIC,SINV.PURCHASER_DELIVERY.DETAIL.OTHER";
  const url = `spuc/v1/${storage.getItem("organizationId")}/asn-header/purchase/save?customizeUnitCode=${customizeUnitCode}`;
  return http.put(url, params);
};

// 获取上传附件UUID
const getSureApi = (params) => {
  const url = `/marmot/v1/${storage.getItem("organizationId")}/marmot-api/P7eXVCZ4g4icicFhdibZ5QMTFYGKmAH8E7qn1zJAL1B5ibB56KZFBh11GopEV2wqm6ok`;
  return http.post(url, params);
};

// 获取物流详信息
export const getQueryInfoApi = (id) => {
  const url = `/marmot/v1/${storage.getItem("organizationId")}/marmot-api/n9S8JqrsTic6e7wThII369ppSdul70wUnIAX6BQPj7Po`;
  return http.get(url, id);
};

export {
  logSave,
  getSureApi,
  delSupplierFile,
  getDeliveryList,
  getFileUUIDApi,
  saveFileUUIDApi,
  getAttachedFile,
  getDeliveryStatusApi,
  getOrderHeadInfo,
  getSupplierApi,
  getOrderLineInfo,
  getOperationRecordsApi,
  getStoreInfoList,
  saveMaintainDeliveryApi,
};
