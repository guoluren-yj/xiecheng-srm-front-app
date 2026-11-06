import { http, SrmUtil } from "srm-mobile-ui";

// 标的信息
export const getBaseInfoApi = (targetInfoId, targetCode) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/judq9RDFJl0tISzwTN1mq4clicACBFRUMgKib6F2ylRhA?targetInfoId=${targetInfoId}&targetCode=${targetCode}`;
  return http.get(url);
};
