import { http, SrmUtil } from "srm-mobile-ui";

// 获取规则淘汰基本信息
export const getHeadInfoApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux/rfx/${rfxHeaderId}/header?customizeUnitCode=SSRC.INQUIRY_HALL.NEW_EDIT.RFX_DEM_QUOTE_V2`;

  return http.get(url);
};

// 获取规则淘汰供应商信息
export const getSupplierDataApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux/rfx/${rfxHeaderId}/item?outFlag=1`;

  return http.get(url);
};

// 获取规则淘汰供应商行信息
export const getSupplierLineTableDataApi = (rfxLineItemId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux/rfx/${rfxLineItemId}/quotation`;

  return http.get(url);
};

// 获取报价详情信息
export const getQuotationDetailApi = (rfxLineItemId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux/rfx/${rfxLineItemId}/quotation/detail?page=0&size=10`;

  return http.get(url);
};

// 获取规则淘汰列表信息(标段)
export const getSessionListApi = (params = {}) => {
  const { sourceProjectId } = params;
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux/rfx/${sourceProjectId}/session-list`;

  return http.get(url, { params });
};

// 获取规则淘汰行信息(按总价淘汰)
export const getSessionLineApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/aux/rfx/${rfxHeaderId}/session-line?page=0&size=100`;

  return http.get(url);
};