import { http, SrmUtil } from "srm-mobile-ui";

// 送货单头信息获取
export const getHeadInfoApi = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/E5N59LtO05lFnibKaA2tqS35oYTNAYHgW98XGLBxALicvF7jhKgzFZoTfrNT95CH3f?id=${
    params.id
  }`;
  return http.get(url, params);
};

// 操作记录获取
export const getOperatingDataApi = (params) => {
  const url = `/sada/v1/${SrmUtil.getTenantId()}/rel-table-records/scux_srm_xxjt_service_fee_settle_action/page?serviceFeeSettleId=${
    params.serviceFeeSettleId
  }`;
  return http.post(url, { ...params });
};

// 送货单新建
export const createAsnInfoApi = (nodeConfigId, headParams, params) => {
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/ASN/${nodeConfigId}/create?${headParams.join(
    "&"
  )}&campKey=p`;
  return http.post(url, params);
};

// 送货单行信息获取
export const getLineInfoApi = (params) => {
  const url = `/sada/v1/${SrmUtil.getTenantId()}/rel-table-records/scux_srm_xxjt_service_fee_settle_line/page`;
  return http.post(url, params);
};
