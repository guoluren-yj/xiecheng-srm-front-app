import { http, SrmUtil } from "srm-mobile-ui";

// 获取详情信息
export const getPrDetailApi = (prHeaderId) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-request/${prHeaderId}`;
  let params = {
    customizeUnitCode:
      "SPRM.PURCHASE_PLAFORM_QUERY.PURCHASEORGINFO,SPRM.PURCHASE_PLAFORM_QUERY.BASE_HEADER,SPRM.PURCHASE_PLAFORM_QUERY.BILLINGINFO,SPRM.PURCHASE_PLAFORM_QUERY.DELIVERYINFO,SPRM.PURCHASE_PLAFORM_QUERY.ATTACHMENT",
  };
  return http.get(url, { params });
};

// 获取操作记录
export const getActionsRecordApi = (prHeaderId) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/${prHeaderId}/actions/all`;
  return http.get(url);
};

// 获取审批记录
export const getApproveRecordApi = (prHeaderId) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/pr-approval-history/record?prHeaderId=${prHeaderId}`;
  return http.get(url);
};

// 查看定制品属性
export const getAttributeApi = (params) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/custom-attribute`;
  return http.get(url, { params });
};

// 获取物料分类
export const getCategoryApi = (id, params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-categories/categories/${id}`;
  return http.get(url, { params });
};

// 新增
export const createApi = (params) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/overall`;
  return http.post(url, params);
};

// 编辑
export const updateApi = (params) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests?customizeUnitCode=SPRM.PURCHASE_PLAFORM_CREATE.BASE_HEADER%2CSPRM.PURCHASE_PLAFORM_CREATE.PURCHASEORGINFO%2CSPRM.PURCHASE_PLAFORM_CREATE.PURCHASELINE%2CSPRM.PURCHASE_PLAFORM_CREATE.ATTACHMENT`;
  return http.put(url, params);
};

// 预算金额校验
export const checkBudgetApi = (params) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/pr-budget/purchase-requests/budget-check`;
  return http.post(url, params);
};

// 提交
export const submitApi = (params) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/singleton-submit?customizeUnitCode=SPRM.PURCHASE_PLAFORM_CREATE.BASE_HEADER%2CSPRM.PURCHASE_PLAFORM_CREATE.PURCHASEORGINFO%2CSPRM.PURCHASE_PLAFORM_CREATE.BILLINGINFO%2CSPRM.PURCHASE_PLAFORM_CREATE.DELIVERYINFO%2CSPRM.PURCHASE_PLAFORM_CREATE.PURCHASELINE`;
  return http.post(url, params);
};

// 币种api
export const getCurrencyCodeApi = () => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/currency?currencyCode=CNY`;
  return http.get(url, { currencyCode: "CNY" });
};

// 取消整单加急
export const cancelRejectApi = (params) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/prHeader/cancel-urgent`;
  return http.post(url, params);
};

export const queryLovData = (params) => {
  let url = `/hpfm/v1/${SrmUtil.getTenantId()}/lovs/data`;
  return http.get(url, { params });
};

// 编辑
export const updateCux3sbio = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/sJMyoCvawj9P3JoEG4BlJO3YJb42Lr5ferSKJ088wwibNic968YQutClnHUG0MSRYK`;
  return http.post(url, params);
};

// 球冠 - 支持申请行编辑
export const updateQurnningApprovalData = (params) => {
  let url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/kmsL5VONTC598IwCJXXEujaPPt04Qg1hZYDDGibOqwCjdqCkAJWibqPYvjW0FZRMich`;
  return http.post(url, params);
};
