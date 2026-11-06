import { http, SrmUtil } from "srm-mobile-ui";

// 发货节点获取
export const getNodeTemplateCodeApi = () => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/workbench/node/list?campKey=p`;
  return http.get(url);
};

// 操作记录获取
export const getOperatingDataApi = (params, operatingType) => {
  const url = [ "1" ].includes(operatingType) ? `/sdps/v1/${SrmUtil.getTenantId()}/operationRecord/queryOperationRecord?campKey=p` :
    `/slod/v1/${SrmUtil.getTenantId()}/delivery/${params.nodeTemplateCode}/delivery-record`;
  return http.get(url, { params });
};

// 单据样式模版获取
export const getTemplateCuszApi = (params) => {
  const url = "/slod/v1/customize/template-cusz";
  return http.post(url, params);
};

// 单据样式获取
// export const getUiTemplateApi = (params) => {
//   const url = `/hpfm/v1/${SrmUtil.getTenantId()}/ui-template?${params.join("&")}`;
//   return http.post(url);
// };

// 送货单头信息获取
export const getHeadInfoApi = (searchParams = {}, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${searchParams?.node}/${searchParams?.nodeConfigId}/detail/header/${searchParams?.deliveryHeaderId}?campKey=p`;
  return http.get(url, { params });
};

// 送货单新建
export const createAsnInfoApi = (nodeConfigId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/${nodeConfigId}/create?${headParams.join("&")}&campKey=p`;
  return http.post(url, params);
};

// 送货单删除
export const deleteAsnInfoApi = (nodeConfigId, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/${nodeConfigId}/header?campKey=p`;
  return http.delete(url, params);
};

// 送货单保存 - 待提交页签
export const saveAsnInfoApi = (asnHeaderId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/${asnHeaderId}/save?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 送货单保存 - 全部页签
export const saveAsnInfoApiByAll = (asnHeaderId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/${asnHeaderId}/all/save?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 给工作流数据保存
export const handWorkFlowSave = (nodeTemplateCode, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${nodeTemplateCode}/save-field/for-feign?${headParams.join("&")}&updateType=1`;
  return http.post(url, params);
};

// 送货单提交
export const submitAsnInfoApi = (nodeConfigId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/${nodeConfigId}/submit/detail?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 送货单关闭
export const closeAsnInfoApi = (headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/close?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 送货单行关闭
export const closeLineApi = (headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/close-line?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 送货单确认
export const sureAsnInfoApi = (headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/confirm/detail?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 送货单行确认
export const sureLineApi = (headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/confirm-line/detail?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 送货单行删除
export const deleteLineApi = (asnHeaderId, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/${asnHeaderId}/line?campKey=p`;
  return http.delete(url, params);
};

// 送货单拒绝
export const refuseAsnInfoApi = (headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/refuse/detail?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 送货单行拒绝
export const refuseLineApi = (headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/refuse/line/detail?${headParams.join("&")}campKey=p`;
  return http.put(url, params);
};

// 获取物流信息
export const getLogisticsInfoApi = (asnHeaderId) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/asn/${asnHeaderId}/logistics/locus?campKey=p`;
  return http.get(url);
};

// 物流信息更新
export const refreshLogisticsInfoApi = (asnHeaderId) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/asn/${asnHeaderId}/logistics/refresh?campKey=p`;
  return http.put(url);
};

// 附件上传uuid
export const getHeaderAttachmentUuidApi = (params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/asn/${params.asnHeaderId}/attachment?campKey=p`;
  return http.put(url, params);
};

// 获取标签明细
export const getLabelRacordApi = (params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/unique-label/list`;
  return http.get(url, { params });
};