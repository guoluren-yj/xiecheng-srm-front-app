
import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

// 获取列表
const  getDeliveryList = (params) => {
  return http.get(`/spuc/v1/${storage.getItem('organizationId')}/asn-header/for-supplier`,{params})
}

// 获取送货单状态
const  getDeliveryStatusApi = () => {
  return http.get(`/hpfm/v1/lovs/value/batch?status=SINV.ASN_HEADERS_STATUS`)
}

// 获取客户
const  getSupplierApi = (params) => {
  return http.get(`/spfm/v1/${storage.getItem('organizationId')}/user-authority-data/customer`,{params})
}

// 获取我的送货单明细头信息
const  getOrderHeadInfo = (asnHeaderId) => {
  return http.get(`/spuc/v1/${storage.getItem('organizationId')}/asn-header/${asnHeaderId}`)
}

// 获取我的送货单明细行信息
const  getOrderLineInfo = (asnHeaderId,params) => {
  const url =`/spuc/v1/${storage.getItem('organizationId')}/asn-header/${asnHeaderId}/page-lines`
  return http.get(url,{params});
}

// 获取操作记录
const  getOperationRecordsApi = ({asnHeaderId,page=0,size=10}) => {
  return http.get(`/spuc/v1/${storage.getItem('organizationId')}/asn-header/${asnHeaderId}/action?page=${page}&size=${size}`)
}

/*
物流信息补录
*/
const getLogisticsApi = (params,asnHeaderId) => {
	const url = `/spuc/v1/${storage.getItem('organizationId')}/asn-header/${asnHeaderId}/logistics`;
	return http.post(url, params);
}
// 获取附件
const  getAttachedFile = (attachmentUUID) => {
  return http.get(`/hfle/v1/${storage.getItem('organizationId')}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`)
}


// 获取上传附件UUID
const getFileUUIDApi = () => {
	const url = `/hfle/v1/${storage.getItem('organizationId')}/files/uuid`
	return http.post(url);
}

// 保存生成的UUID
const saveFileUUIDApi = ({uuidType,uuid,poHeaderId}) => {
	const url = `/spuc/v1/${storage.getItem('organizationId')}/po-header/attachmentUUID?uuidType=${uuidType}&uuid=${uuid}&poHeaderId=${poHeaderId}`
	return http.put(url);
}

// 根据uuid获取附件
const  getFileApi = (attachmentUUID) => {
  return http.get(`/hfle/v1/${storage.getItem('organizationId')}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=private-bucket`)
}

export {
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
}
