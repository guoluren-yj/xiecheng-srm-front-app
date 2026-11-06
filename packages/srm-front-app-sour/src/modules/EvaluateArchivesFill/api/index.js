import { http, SrmUtil } from "srm-mobile-ui";

/**
 * 获取模板配置信息
 */
export const getKpiAutoConfigs = (evalTplId) => http.get(`/sslm/v1/${SrmUtil.getTenantId()}/kpi-auto-configs`, { params: { evalTplId } });

/**
 * 获取当前用户部门
 * @return {any}
 */
export const getUserMasterUnit = () => http.get(`/sslm/v1/${SrmUtil.getTenantId()}/sample-send-reqs/getUserAndUserMasterUnit`);

/**
 * 执行评分
 * @return {any}
 */
export const execEvalApi = (evalHeaderId) => http.post(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/${evalHeaderId}/evaluate`, { evalHeaderId });

/**
 * 发起质量整改
 * @return {any}
 */
export const createProblem = (evalHeaderId, lineIds) => http.post(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/${evalHeaderId}/create-problem-headers`, lineIds);

/**
 * 汇总统计
 * @param evalHeaderId
 * @return {any}
 */
export const finalCollect = (evalHeaderId) => http.post(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/${evalHeaderId}/final-collect`, { evalHeaderId });

/**
 * 提交审批
 * @param evalHeaderId
 * @param autoPushVendorFlag
 * @return {any}
 */
export const approvalSubmit = (evalHeaderId, autoPushVendorFlag) => http.post(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/approvalSubmit`, {
  evalHeaderId,
  autoPushVendorFlag
});

/**
 * 发布
 * @param evalHeaderId
 * @return {any}
 */
export const publish = (evalHeaderId) => http.post(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/${evalHeaderId}/publish`, { evalHeaderId });

/**
 * 获取操作记录
 * @param evalHeaderId
 * @return {any}
 */
export const getEvalHistory = (evalHeaderId) => http.get(`/sslm/v1/${SrmUtil.getTenantId()}/kpi-eval-opr-historys`, {
  params: {
    evalHeaderId,
    headerId: evalHeaderId,
    page: 0,
    size: 100,
  }
});

/**
 * 获取供应商品类信息
 * @param evalHeaderId
 * @param supplierId
 * @param categoryName
 * @return {any}
 */
export const getSupplierCategory = (evalHeaderId, supplierId, categoryName) => http.get(`/sslm/v1/${SrmUtil.getTenantId()}/eval-line/category/${evalHeaderId}/${supplierId}`, {
  params: {
    supplierId,
    headerId: evalHeaderId,
    categoryName,
  }
});

/**
 * 获取供应商物料信息
 * @param evalHeaderId
 * @param supplierId
 * @param categoryName
 * @return {any}
 */
export const getSupplierItem = (evalHeaderId, supplierId, itemName) => http.get(`/sslm/v1/${SrmUtil.getTenantId()}/eval-line/item/${evalHeaderId}/${supplierId}`, {
  params: {
    supplierId,
    headerId: evalHeaderId,
    itemName
  }
});

/**
 * 维护指标
 * @param evalHeaderId
 * @param parentIndicatorId
 * @return {any}
 */
export const getIndicatorTree = (evalHeaderId, parentIndicatorId) => http.get(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/tree-not-selected/${evalHeaderId}`, {
  params: {
    page: 0,
    size: 1000,
    parentIndicatorId,
  }
});

/**
 * 维护指标-已选择
 * @param evalHeaderId
 * @param parentIndicatorId
 * @return {any}
 */
export const getIndicatorTreeSelected = (evalHeaderId, parentIndicatorId) => http.get(`/sslm/v1/${SrmUtil.getTenantId()}/eval-headers/tree-selected/${evalHeaderId}`, {
  params: {
    page: 0,
    size: 1000,
    parentIndicatorId,
  }
});

/**
 * 添加指标
 * @param evalHeaderId
 * @param data
 * @return {any}
 */
export const createOrUpdateIndicator = (evalHeaderId, data) => http.post(`/sslm/v1/${SrmUtil.getTenantId()}/eval-line/createOrUpdate/${evalHeaderId}`, data);

/**
 * 删除指标
 * @param evalHeaderId
 * @param data
 * @return {any}
 */
export const removeIndicator = (evalHeaderId, data) => http.post(`/sslm/v1/${SrmUtil.getTenantId()}/eval-line/deleteKpiEvalLineByIds/${evalHeaderId}`, data);

/**
 * 放弃评分
 * @param evalHeaderId
 * @param kpiEvalDetailLineDTOS
 * @param unKpiEvalDetailLineDTOS
 * @param selectAllFlag
 * @return {any}
 */
export const batchAbandon = (evalHeaderId, kpiEvalDetailLineDTOS, unKpiEvalDetailLineDTOS = [], selectAllFlag = 0) => http.post(`/sslm/v1/${SrmUtil.getTenantId()}/eval-dtl-resps/${evalHeaderId}/batch-abandon`, {
  kpiEvalDetailLineDTOS,
  unKpiEvalDetailLineDTOS,
  selectAllFlag,
  tenantId: SrmUtil.getTenantId(),
});

/**
 * 获取集团维度默认值
 * @return {any}
 */
export const getDefaultGroup = () => http.get(`/hpfm/v1/lovs/sql/data?lovCode=SSLM.KPI_EVAL_DIM_GROUP&page=0&size=10&tenantId=${SrmUtil.getTenantId()}`);
