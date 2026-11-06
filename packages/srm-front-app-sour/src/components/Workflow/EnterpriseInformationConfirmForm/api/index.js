import { SrmUtil, http } from "srm-mobile-ui";

/**
 * 对比供应商信息
 * @param type
 * @param parameters
 * @returns {any}
 */
export const compareSupplierInfo = (type, parameters = {}) => {
  const { changeReqId, companyId, partnerTenantId, customizeUnitCode } = parameters;
  return http.get(`/sslm/v1/${SrmUtil.getTenantId()}${type}`, {
    params: {
      changeReqId,
      companyId,
      partnerTenantId,
      dataSource: 1,
      customizeUnitCode,
      customizeTenantId:partnerTenantId,
    }
  });
};

/**
 * 对比调查表信息
 * @param type 页签类型
 * @param parameters
 */
export const compareInvestigateInfo = (type, parameters = {}) => {
  const { changeReqId, partnerTenantId } = parameters;
  return http.get(`/sslm/v1/${SrmUtil.getTenantId()}/enterprise-change/detail/investigate-${type}`, {
    params: {
      changeReqId,
      partnerTenantId,
    }
  });
};

/**
 * 获取调查表配置
 * @param changeReqId
 * @param parameters
 */
export const getInvestigateConfig = (parameters = {}) => {
  const { changeReqId, partnerTenantId } = parameters;
  return http.get(`/sslm/v1/${SrmUtil.getTenantId()}/firm-change-investigate-confighs/${changeReqId}`, {
    params: {
      partnerTenantId,
    }
  });
};
