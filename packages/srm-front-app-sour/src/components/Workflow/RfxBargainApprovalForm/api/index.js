import { http, SrmUtil } from "srm-mobile-ui";

//获取议价头信息
export const getRfxBargainInfoApi = (rfxHeaderId, params = {}) => {
  let url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/snap/simple/${rfxHeaderId}`;
  return http.get(url, { params, });
};

//获取报价明细信息
export const getQuotaionDetailInfoApi = (rfxHeaderId, params) => {
  let url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}/quotationTemplate/view`;
  return http.get(url, { params });
};