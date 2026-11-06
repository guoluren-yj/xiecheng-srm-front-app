import { http, SrmUtil } from "srm-mobile-ui";

export const getBudgetDetailApi = (budgetHeaderId) => {
  let url = `/sbdm/v1/${SrmUtil.getTenantId()}/budget-header/detail/${budgetHeaderId}`;
  let params = {};
  return http.get(url, { params });
};

export const getBudgetTemplate = (budgetTemplateCode) => {
  let url = `/sbdm/v1/${SrmUtil.getTenantId()}/budget-template/item-fields/${budgetTemplateCode}`;
  let params = {};
  return http.get(url, { params });
};

// /sbdm/v1/30/budget-line/edit-action/2606

export const getBudgetAdjustData = (budgetLineId) => {
  let url = `/sbdm/v1/${SrmUtil.getTenantId()}/budget-line/edit-action/${budgetLineId}`;
  let params = {};
  return http.get(url, { params });
};



export const getBudgetAmount = (budgetLineId, othersParams) => {
  let url = `/sbdm/v1/${SrmUtil.getTenantId()}/budget-line/amount/${budgetLineId}`;
  let params = { ...othersParams, budgetLineId };
  return http.get(url, { params });
};

