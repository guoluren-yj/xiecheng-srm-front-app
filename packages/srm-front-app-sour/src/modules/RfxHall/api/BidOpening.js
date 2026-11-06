import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBasicInfoApi = (id, { data = {} }) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/simple/${id}`;
  return http.get(url, { params: data || {} });
};

// 重发开标密码
export const resendOpenPasswordApi = (rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}/password`;
  return http.get(url);
};

// 开标
export const openBidApi = (rfxHeaderId, openPassword) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/open`;
  let params = {
    rfxHeaderId,
    openPassword,
    sourceMobileEndFlag: 1,
  };
  return http.post(url, params);
};

// 查询二阶段开标配置表
export const getSecBidOpeningEnableApi = (params) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/share/common/second-open-bid/enable`;
  return http.get(url, { params });
};

export const getRfxHeaderApi = (params, rfxHeaderId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${rfxHeaderId}`;
  return http.get(url, { params });
};

// 获取开标员
export const getRfxMembersApi = (rfxHeaderId) => {
  let url = `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/members/${rfxHeaderId}`;
  let params = {
    "customizeUnitCode": "SSRC.INQUIRY_HALL_DETAIL.OPEN_BID_DETAIL_TABLE",
    "rfxRole": "OPENED_BY",
    sourceMobileEndFlag: 1,
  };
  return http.get(url, { params });
};
