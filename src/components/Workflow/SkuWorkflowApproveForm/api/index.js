import { http, SrmUtil } from "srm-mobile-ui";

/**
 * 查询工作流审批商品信息
 */
export const fetchInfoWorkflowApprove = (params) => http.get(`smpc/v1/${SrmUtil.getTenantId()}/skus/spu-detail-approve/${params.skuTemporaryId}`, {
  params: {
    workflowQueryFlag: 1,
    ...params,
  },
});

/**
 * 查询分类下规格属性
 */
export const fetchTypeSpecs = (categoryId) => http.get(`smpc/v1/${SrmUtil.getTenantId()}/skus/query-category-attrs/${categoryId}`, {
  params: { enabledFlag: 1 },
});
