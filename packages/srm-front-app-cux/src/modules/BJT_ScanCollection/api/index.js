/**
 * 与 【发票查验】相关的业务接口
 */

import { http, SrmUtil } from "srm-mobile-ui";

//扫码查询
export const scanQueryApi = (asnNum) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/cux/bestter/asn-header/query-asn-for-mobile?asnNum=${asnNum}`;
  return http.get(url);
};

//扫码确认数据接收
export const receiveDataApi = (params) => {
  // spuc - 22250
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/cux/bestter/asn-header/receiver-asn-from-mobile`;
  return http.post(url, params);
};

//获取微信信息
export const getWxInfoApi = (paramsUrl, thirdPlatformClient, thirdPlatformCode) => {
  const url = `/hipspfm/hippius/v1/thirdPartyUser/getServiceSignature?url=${paramsUrl}&thirdPlatformClient=${thirdPlatformClient}&thirdPlatformCode=${thirdPlatformCode}`;
  return http.get(url);
};

