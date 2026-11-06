import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (pcHeaderId, params) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/${pcHeaderId}`;
  return http.get(url, { params });
};

// 预算使用情况-分页
export const getSubjectVvcodeApi = (pcHeaderId) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/${pcHeaderId}/pc-subject-vvcode/page`;
  let params = {
    page: 0,
    size: 1000,
  };
  return http.get(url, { params });
};

// 项目里程碑-分页
export const getProjectStageApi = (pcHeaderId) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/${pcHeaderId}/stage/page`;
  let params = {
    page: 0,
    size: 1000,
  };
  return http.get(url, { params });
};

// 协议详情
export const getProtocolDetailApi = (pcHeaderId, { isTermination }) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/${pcHeaderId}/detail`;
  let params = {
    page: 0,
    size: 1000,
    isTermination,
  };
  return http.get(url, { params });
};

// 中标详情
export const getRfxDetailApi = (pcHeaderId) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/${pcHeaderId}/queryRfx`;
  let params = {
    page: 0,
    size: 1000,
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

/* *
 * 获取合同或pb审批记录
 * @param {string} pcHeaderId 协议id
 * @param {boolean} isPbContract 是否是pb审批记录
 * @returns
 */
export const getContractApprovalApi = (pcHeaderId, isPbContract) => {
  let url = `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/workflow/query-history`;
  let params = {
    page: 0,
    size: 1000,
    pcHeaderId,
    isPbContract,
  };
  return http.get(url, { params });
};

// 配置表-星巴克变更字段配置表
export const fetchChangeField = (params = {}) => {
  const url = `/sada/v1/${SrmUtil.getTenantId()}/rel-table-records/scux_srm_starbucks_change_record/page`;
  let newParams = {
    ...params,
    page: 0,
    size: 1000,
  };
  return http.post(url, newParams);
};

// 配置表-星巴克合同变更记录历史表
export const getChangeContent = (pcHeaderId) => {
  const url = `/sada/v1/${SrmUtil.getTenantId()}/rel-table-records/scux_srm_starbucks_contract_change_record/page`;
  return http.post(url, { pcHeaderId });
};

// 获取个配置
export const getUICustomizeApi = (codes) => {
  let url = `/hpfm/v1/${SrmUtil.getTenantId()}/ui-customize`;
  return http.post(url, codes);
};

