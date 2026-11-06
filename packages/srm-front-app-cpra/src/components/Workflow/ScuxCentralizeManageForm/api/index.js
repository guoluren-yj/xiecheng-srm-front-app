import { http, SrmUtil } from "srm-mobile-ui";

// 送货单头信息获取
export const getHeadInfoApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/5ickrPo4Je2O5QeSpACHAg1zfibKcJKjQQqTLxkbqSpETXnBibibgAPLsTgE28c6KTicD`;
  return http.post(url, params);
};

// 送货单新建
export const createAsnInfoApi = (nodeConfigId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/${nodeConfigId}/create?${headParams.join(
    "&"
  )}&campKey=p`;
  return http.post(url, params);
};
