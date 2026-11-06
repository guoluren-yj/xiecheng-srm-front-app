import { queryTableCodeList, queryRelTableConfig as queryRelTableConfigApi } from "../api";

/**
 * 获取配置表配置
 * @param targetPage: 目标页面标识
 * @returns {*}
 */
export async function queryRelTableConfig(targetPage = "", relationId = null) {
  const tableList = [];
  // 查询配置表code
  await queryTableCodeList({ targetPage, relationId }).then((res) => {
    if (res && Array.isArray(res.content)) {
      const codeList = res.content;
      for (let i = 0; i < codeList.length; i++) {
        tableList.push({
          ...codeList[i],
        });
      }
    }
  });
  return tableList;
}

/**
 * 获取配置表配置,自定义传参
 * 查询配置表显示的字段
 * @returns {*}
 */
export async function queryRelTableConfigByParams(params = {}) {
  // 查询配置表code
  const tableList = await queryRelTableConfigApi(params);
  return tableList;
}
