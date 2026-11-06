import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (id) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/crhpY4U8ybE8fyooN0hZIUuJW4eRFF3JXqibqtWCDkm24ias5QYlY7zLjOeYp3uK3j`;
  return http.post(url, {
    id
  });
};

export const getLov = (params) => {
  let url = `/hpfm/v1/${SrmUtil.getTenantId()}/lovs/value/batch`;
  return http.get(url,
    { params });
};

//获取操作记录
/**
 * 获取操作记录
 */
export const getOperationRecord = (params) => { // 导出获取操作记录的函数
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/4R8dHbHdw0T34kDspUtZArXhVT2bEEF0nSxdk0T0KIk`;
  return http.get(url, { params });
};
