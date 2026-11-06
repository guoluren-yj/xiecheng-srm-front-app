import { http, SrmUtil } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取头信息
export const getHeaderApi = (id) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.HEADER_DETAIL,SSRC.INQUIRY_HALL_DETAIL.HEADER_PREQUAL`;
  return http.get(url);
};

// 新接口
export const getNewHeaderApi = (id, params) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/${id}/detail?customizeUnitCode=SSRC.INQUIRY_HALL_DETAIL.INFO_PREPARE,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_DEMAND,CSSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_EXECUTOR,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_PREQUAL,CSSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_QUOTATION,CSSRC.INQUIRY_HALL_DETAIL.RFXPREPARE`;
  return http.post(url, params);
};

// 获取多标段
export const getAllSectionApi = (id) => {
  const url = `/ssrc/v2/${SrmUtil.getTenantId()}/rfx/${id}/project/all-section`;
  return http.get(url);
};

// 操作记录
export function getHistory(id) {
  const params = {};
  return http.get(`/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/actions`, { params });
}

// 查询报价单头
export const fetchQuotationHeader = (params = {}) => {
  const { rfxHeaderId, } = params || {};
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/supplier/${rfxHeaderId}/header`;
  return http.get(url, { params, });
};

// 查询报价单头
export const fetchQuotationLines = (params = {}) => {
  const { rfxHeaderId, } = params || {};
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/supplier/${rfxHeaderId}/items`;
  return http.get(url, { params, });
};

// 判断是否开启双单位
export const queryEnableDoubleUnit = (params = {}) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/secondary/uom/isEnable`;
  return http.get(url, { params, });
};

//获取配置信息
export const getSetting = () => http.get(`/spfm/v1/${storage.getItem("organizationId")}/settings/batch?011108=011108`);

// 获取资格预审信息
export const getPreQualInfo = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${rfxHeaderId}/prequal`, { params });

// 获取密封头信息
export const getPurQueryHeadInfo = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/tender/${rfxHeaderId}/header`, { params });

// 获取头信息
export const getQueryHeadInfo = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${rfxHeaderId}/header`, { params });

// 获取行信息(报价和竞价订单)
export const getOrderLineInfo = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/quotation/${rfxHeaderId}/lines?`, { params });

// 适用范围-配置列表查询
export const fetchApplicationScoreUnitList = (params = {}) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/source-app-scopes`
  return http.get(url, { params });
}

// 保存生成的UUID
export const saveFileUUIDApi = (params) => {
  const url = `/ssrc/v1/${storage.getItem("organizationId")}/rfx/quotation/header/attachment`;
  return http.post(url, params);
};

// 获取行信息(参与订单)
export const getOrderLineInfos = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/supplier/${rfxHeaderId}/items`, { params });

// 获取密封行信息
export const getPurOrderLineInfos = (rfxHeaderId, params) => http.get(`/ssrc/v1/${storage.getItem("organizationId")}/rfx/tender/${rfxHeaderId}/items`, { params });