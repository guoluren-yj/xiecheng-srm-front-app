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

// 头信息获取
export const getHeadInfoApi = (node, nodeConfigId, id, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${nodeConfigId}/detail/header/${id}?campKey=p`;
  return http.get(url, { params });
};

// 新建
export const createAsnInfoApi = (nodeTemplateCode, nodeConfigId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${nodeTemplateCode}/${nodeConfigId}/create?${headParams.join("&")}&campKey=p`;
  return http.post(url, params);
};

// 删除
export const deleteAsnInfoApi = (nodeConfigId, node, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${nodeConfigId}/header?campKey=p`;
  return http.delete(url, params);
};

// 保存 - 待提交页签
export const saveAsnInfoApi = (asnHeaderId, node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${asnHeaderId}/save?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 保存 - 全部页签
export const saveAsnInfoApiByAll = (asnHeaderId, node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${asnHeaderId}/all/save?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 提交
export const submitAsnInfoApi = (nodeConfigId, node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${nodeConfigId}/submit/detail?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 关闭
export const closeAsnInfoApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/close?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 行关闭
export const closeLineApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/close-line?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 确认
export const sureAsnInfoApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/confirm/detail?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 行确认
export const sureLineApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/confirm-line/detail?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 行删除
export const deleteLineApi = (node, asnHeaderId, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/${asnHeaderId}/line?campKey=p`;
  return http.delete(url, params);
};

// 拒绝
export const refuseAsnInfoApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/refuse/detail?${headParams.join("&")}&campKey=p`;
  return http.put(url, params);
};

// 行拒绝
export const refuseLineApi = (node, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/refuse/line/detail?${headParams.join("&")}&campKey=p`;
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