import { SrmUtil, http } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";

/**
 * 获取登记信息
 */
export const getRegisterInfoApi = (params = {}) => {
  const { changeReqId } = params;
  const url = `spfm/v1/${SrmUtil.getTenantId()}/com-basic-req/after/${changeReqId}`;
  return http.get(url, { params });
};

/**
 * 获取到调查表配置信息
 * @param investigateTemplateId 调查表模板id
 */
export const getInvestigateConfigPreview = (params = {}) => {
  const { investigateTemplateId, investgHeaderId } = params;
  const payload = {
    investgHeaderId
  };
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/investigate-confighs-preview/${investigateTemplateId}`;
  return http.get(url, { payload });
};

/**
 * 查询页签配置
 * @param changeReqId 单据主键id
 */
export const queryTabDataConfig = (params = {}) => {
  const { changeReqId, ...others } = params;
  const url = `/spfm/v1/${SrmUtil.getTenantId()}/strategy-cf-headers/customer/${changeReqId}/all-detail`;
  return http.get(url, { others });
};

// 查询邀请信息
export const queryInviteInfo = (params = {}) => {
  const { changeReqId, ...others } = params;
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/firm-entering-parents/${changeReqId}`;
  return http.get(url, { params: others });
};

// 查询调查表配置
export const queryFilterInvestigationTemplate = (params) => {
  const { investigateTemplateId, ...others } = params;
  const url = `${SRM_SSLM}/v1/${SrmUtil.getTenantId()}/investigate-confighs-preview-new/${investigateTemplateId}`;
  return http.get(url, { params: others });
};

// 查询智能审核相关数据
export const fetchAiApproveData = (params) => http.get(`${SRM_SSLM}/v1/${SrmUtil.getTenantId()}/ai-approve-resultss/getAiApproveResultsIdData`, {
  params,
});

// 查询智能预审返回的状态
export const fetchApproveStatus = (params) => http.get(`${SRM_SSLM}/v1/${SrmUtil.getTenantId()}/ai-approve-resultss/getApproveStatus`, {
  params,
});
