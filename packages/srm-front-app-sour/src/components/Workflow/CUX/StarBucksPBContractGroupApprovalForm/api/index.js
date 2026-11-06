import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (pbContractId) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/pb/${pbContractId}`;
  return http.get(url);
};

// 协议详情
export const getProtocolDetailApi = (pbContractId) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/pb/detail/${pbContractId}`;
  let params = {
    page: 0,
    size: 100,
  };
  return http.get(url, { params });
};

// 中标详情
export const getRfxDetailApi = (pbContractId) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/pb/${pbContractId}/queryRfxByPB`;
  let params = {
    page: 0,
    size: 100,
  };
  return http.get(url, { params });
};

// 寻源详情信息
export const getProjectQuoteLinesApi = (sourceProjectId) => {
  let url = `/ssrc/v1/${SrmUtil.getTenantId()}/project-quote-lines/${sourceProjectId}/finished/detail`;
  let params = {
    page: 0,
    size: 100,
  };
  return http.get(url, { params });
};

/* *
 * 工厂维度
 * @param {*} pcHeaderId 协议id
 * @returns 供应商评审结果
 */
export const getSupplierFactoryScoreResApi = (pcHeaderId) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/${pcHeaderId}/querySupplierScoreResultsFactory`;
  let params = {
    page: 0,
    size: 1000,
  };
  return http.get(url, { params });
};
