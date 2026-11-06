import { http, SrmUtil } from "srm-mobile-ui";
// 点位操作记录
export const hisToryApi = (params, type) => {
  const url = type === "point" ? `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/VuRc1jem3wGgnlgiaBOTvyRy80QPhdT0tgn34EODGKaY` : `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/5JGS51qE89x92icvibZ2uh8XmTLmibLWJL0tgDzDP2JibeY`;
  return http.get(url, { params });
};
// 点位保存
export const saveApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/5JGS51qE89x92icvibZ2uh8dAOvwvo7JcBl4z6d0YnkOc`;
  return http.post(url, params);
};
// 附件
export const uploadApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/5JGS51qE89x92icvibZ2uh8chfiaJ07lV4Kk1PGHLPOpDs`;
  return http.get(url, { params });
};
// 监播资料保存
export const checkSaveApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/5JGS51qE89x92icvibZ2uh8aRn9qWPyiaXjnkYxRajT4iaI`;
  return http.post(url, params);
};
// 监播资料提交
export const checkSubmitApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/5JGS51qE89x92icvibZ2uh8fMS1uFkXMNgqHOwyzL4ElE`;
  return http.post(url, params);
};
// 监播资料删除
export const checkDeleteApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/5JGS51qE89x92icvibZ2uh8YIRKf9btiactVPfRLkG2OicA`;
  return http.post(url, params);
};
export const queryApi = () => {
  const url = `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/L9dsrzib74rhecwfqSn9Ty0RK7mXZP9lVwIp7rKqCsQE
  ?asyncCountFlag=DEFAULT&size=30&page=0`;
  const params = {
    currPage: "region",
    page: 0,
    size: 30,
  };
  return http.post(url, params);
};

