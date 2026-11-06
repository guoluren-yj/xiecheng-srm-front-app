import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (supplierCompanyId, sourceFrom) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/uhIMaVgLma2rRuRMvdggIxm1tedn1cfflbciaulxfFuITiahDph05Jw6ZvrFaHxk0u?supplierCompanyId=${supplierCompanyId}&sourceFrom=${sourceFrom}`;
  return http.get(url);
};

// 查供应商现场考察报告
export const getSupplierEval = (code, supplierCompanyId) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/fzIt1IqlekV5bp8j3v5w7K90CicTmmvKpB5bRnaQ37zM?code=${code}&supplierCompanyId=${supplierCompanyId}`;
  return http.get(url);
};
