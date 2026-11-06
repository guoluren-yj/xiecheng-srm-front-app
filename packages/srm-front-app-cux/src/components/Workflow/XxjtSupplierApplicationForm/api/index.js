import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (applyHeaderId) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/hB4jFRv1VI3lne2MvT3DENwSesypt5yh2ibvyARVIjHoib3ZCDtwfZib9FG9ia5UN6uT?applyHeaderId=${applyHeaderId}&wflFlag=1`;
  return http.get(url);
};

// 查供应商现场考察报告
export const getSupplierEval = (code, supplierCompanyId) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/fzIt1IqlekV5bp8j3v5w7K90CicTmmvKpB5bRnaQ37zM?code=${code}&supplierCompanyId=${supplierCompanyId}`;
  return http.get(url);
};

// 查承诺书内容
export const getText = () => {
  let url = `/sada/v1/${SrmUtil.getTenantId()}/rel-table-records/scux_srm_xxjt_commitment_letter/page?page=0&size=10&asyncCountFlag=DEFAULT`;
  return http.post(url, {});
};
