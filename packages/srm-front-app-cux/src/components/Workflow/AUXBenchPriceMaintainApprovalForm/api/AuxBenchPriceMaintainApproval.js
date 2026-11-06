import { http, SrmUtil } from "srm-mobile-ui";

// 获取表单
export const getDetailBase = (planId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/benchmark/${planId}`;
  return http.get(url, {
    params: {},
  });
};

// 获取行数据
export const getDetailLine = (planId) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/benchmark/lines/${planId}`;

  return http.get(url, { params: { asyncCountFlag: "DEFAULT" } });
};

// 审批同意
export const toApprovalSave = (params) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/lY3cfnKJSybZyez4B3caOoTVMMMtJVUl4dZLKxR14Zg`;
  return http.put(url, params);
};
