import { http, httpCatch, SrmUtil } from "srm-mobile-ui";

// 查询头信息
//获取审批记录
export const queryHeader = (acceptHeaderId) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/header-detail/${acceptHeaderId}`;
  return http.get(url);
};

// 查询头信息
//扫码创建
export const created = (bodyList) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/scan-create`;
  return http.post(url, bodyList);
};

export const queryDepApi = () => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/create`;
  return http.post(url);
};

//保存
export const save = (bodyList) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/save`;
  return httpCatch.post(url, bodyList);
};
//提交
export const submit = (bodyList) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/submit`;
  return httpCatch.post(url, [ bodyList ]);
};

//删除
export const deleted = (bodyList) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/remove`;
  return httpCatch.post(url, [ bodyList ]);
};

//取消
export const cancelApi = (bodyList) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/cancel`;
  return httpCatch.post(url, [ bodyList ]);
};

// 附件上传uuid
export const getHeaderAttachmentUuidApi = (params) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/save-file`;
  return http.post(url, params);
};

//获取审批记录
export const getApproveRecord = (rcvTrxHeaderId) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/list-history-approval/${rcvTrxHeaderId}?page=0&size=100`;
  return http.get(url);
};
//获取操作记录
export const getOperationRecord = (rcvTrxHeaderId) => {
  const url = `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/list-action/${rcvTrxHeaderId}?page=0&size=10`;
  return http.get(url);
};

/**
 * 双单位计算公式
 * @function calculateDoubleUom
 * @returns {object}
 */

export async function calculateDoubleUomApi(params) {
  const url = `/smdm/v1/${SrmUtil.getTenantId()}/items/uom/calculate/quantity`;
  return http.post(url, params);
}

// 查询lov值
export async function getLovPara(params) {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/ibDaqYlTQ52B6PzhaXGYha79bicD9RyuhQCe3cgVsibXm63Je2O4daOIPty0LLia2o3u`;
  return http.post(url, params);
}
