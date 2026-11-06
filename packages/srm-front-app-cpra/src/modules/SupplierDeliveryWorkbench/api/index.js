import { http, SrmUtil } from "srm-mobile-ui";

// 发货节点获取
export const getNodeTemplateCodeApi = () => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/workbench/node/list?campKey=s`;
  return http.get(url);
};

// 操作记录获取
export const getOperatingDataApi = (params, operatingType) => {
  const url = [ "1" ].includes(operatingType) ? `/sdps/v1/${SrmUtil.getTenantId()}/operationRecord/queryOperationRecord?campKey=s` :
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
export const getHeadInfoApi = (node, nodeConfigId, deliveryHeaderId, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${nodeConfigId}/detail/header/${deliveryHeaderId}?campKey=s`;
  return http.get(url, { params });
};

// 送货单新建
export const createAsnInfoApi = (node, nodeConfigId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${nodeConfigId}/create?${headParams.join("&")}&campKey=s`;
  return http.post(url, params);
};

// 送货单删除
export const deleteAsnInfoApi = (node, nodeConfigId, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${nodeConfigId}/header?campKey=s`;
  return http.delete(url, params);
};

// 送货单保存 - 待提交页签
export const saveAsnInfoApi = (node, deliveryHeaderId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${deliveryHeaderId}/save?${headParams.join("&")}&campKey=s`;
  return http.put(url, params);
};

// 送货单保存 - 全部页签
export const saveAsnInfoApiByAll = (node, deliveryHeaderId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${deliveryHeaderId}/all/save?${headParams.join("&")}&campKey=s`;
  return http.put(url, params);
};

// 送货单提交
export const submitAsnInfoApi = (node, nodeConfigId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${nodeConfigId}/submit/detail?${headParams.join("&")}&campKey=s`;
  return http.put(url, params);
};

// 送货单关闭
export const closeAsnInfoApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/close?${headParams.join("&")}&campKey=s`;
  return http.put(url, params);
};

// 送货单行关闭
export const closeLineApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/close-line?${headParams.join("&")}&campKey=s`;
  return http.put(url, params);
};

// 送货单确认
export const sureAsnInfoApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/confirm/detail?${headParams.join("&")}&campKey=s`;
  return http.put(url, params);
};

// 送货单行确认
export const sureLineApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/confirm-line/detail?${headParams.join("&")}&campKey=s`;
  return http.put(url, params);
};

// 送货单行删除
export const deleteLineApi = (node, deliveryHeaderId, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${deliveryHeaderId}/line?campKey=s`;
  return http.delete(url, params);
};

// 送货单拒绝
export const refuseAsnInfoApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/refuse/detail?${headParams.join("&")}&campKey=s`;
  return http.put(url, params);
};

// 送货单行拒绝
export const refuseLineApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/refuse/line/detail?${headParams.join("&")}&campKey=s`;
  return http.put(url, params);
};

// 获取物流信息
export const getLogisticsInfoApi = (asnHeaderId) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/asn/${asnHeaderId}/logistics/locus?campKey=s`;
  return http.get(url);
};

// 物流信息更新
export const refreshLogisticsInfoApi = (asnHeaderId) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/asn/${asnHeaderId}/logistics/refresh?campKey=s`;
  return http.put(url);
};

// 附件上传uuid
export const getHeaderAttachmentUuidApi = (params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/asn/${params.asnHeaderId}/attachment?campKey=s`;
  return http.put(url, params);
};