import { http, SrmUtil } from "srm-mobile-ui";

/**
 * 查询表格code集合
 * @param {Object} params - 查询参数
 */
export const queryTableCodeList = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/model-settings`;
  return http.get(url, { params });
};

/**
 * 查询表格列配置
 * @param {Object} params - 查询参数
 */
export const queryRelTableConfig = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/model-settings/rel-table-records`;
  return http.get(url, { params });
};

/**
 * 查询表格数据
 * @param {Object} params - 查询参数
 */
export const queryTableData = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/model-data/listTableData`;
  return http.post(url, params);
};

/**
 * 查询生命周期第一次新建模型表数据
 * @param {Object} params - 查询参数
 */
export const queryLifecycleModelData = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/model-settings/bySource`;
  return http.get(url, { params });
};

/**
 * 保存表格数据
 * @param {Object} params - 查询参数
 */
export const saveData = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/model-data`;
  return http.post(url, params);
};

/**
 * 删除表格数据
 * @param {Object} params - 查询参数
 */
export async function deleteData(params) {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/model-data`;
  return http.delete(url, params);
}
