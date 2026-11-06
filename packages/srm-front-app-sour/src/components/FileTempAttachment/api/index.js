import { http, SrmUtil } from "srm-mobile-ui";

// 获取头信息
export async function fetchAttTemplateDataByAttType(params) {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/attachment-lines/change-type`;
  return http.post(url, {}, { params });
}

// 切换附件类型查询模板中的配置
export async function generateAttTemplate(params) {
  return http.post(`/ssrc/v1/${SrmUtil.getTenantId()}/attachment-lines/generate-file`, params);
}

// 删除附件行
export const deleteAttachmentLine = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/attachment-lines/delete`;
  return http.post(url, params);
};

// 查询配置表
export async function fetchConfigSheet(params = {}) {
  const { configCode = null, data = {} } = params;
  const url = `/spfm/v1/${SrmUtil.getTenantId()}/rel-table-records/${configCode}/list-from-site`;
  return http.post(url, data);
}