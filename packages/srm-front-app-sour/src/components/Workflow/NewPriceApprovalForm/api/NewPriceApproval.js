import { http } from "srm-mobile-ui";

const storage = window.localStorage;
//获取相关价格的id
export const getDimensionId = (templateCode) => {
  let params = {
    shieldDimCodes: "priceLibraryStatus",
    relevantPriceFlag:"0",
    templateCode:templateCode,
  };

  return http.post(`/spc/v1/${storage.getItem("organizationId")}/price-lib-tmpl-dims/tableHeaderList`, params);
};
//获取适用范围列表
export const getViewScopeList = (priceLibId) => {
  let params = {
    priceLibId:priceLibId
  };

  return http.get(`/spc/v1/${storage.getItem("organizationId")}/price-lib-req-scopes`, { params });
};
//获取公司业务实体库存组织
export const getScopeDetailListApi = (priceLibId, dimensionCode) => {
  let params = {
    dimensionCode: dimensionCode,
    priceLibId:priceLibId
  };

  return http.get(`/spc/v1/${storage.getItem("organizationId")}/price-lib-req-scope-lns`, { params });
};
//获取状态
export const getRequestStatus = (lovCode) => {
  let params = {
    lovCode: lovCode
  };

  return http.get(`/hpfm/v1/${storage.getItem("organizationId")}/lovs/data`, { params });
};
// 获取价格库审批头数据
export const getNewPriceHeadDetail = (requestId, templateCode) => {
  let params = {
    customizeUnitCode: "SSRC.PRICE_LIB_NEW.REQ_APPRO",
    requestId:requestId,
    templateCode:templateCode
  };

  return http.get(`/spc/v1/${storage.getItem("organizationId")}/price-lib-reqs/detail`, { params });
};

// 获取价格库审批行数据
export const getNewPriceLineDetail = (requestId, templateCode) => {
  let params = {
    requestId: requestId,
    templateCode:templateCode,
    page: 0,
    size: 1000,
  };

  return http.get(`/spc/v1/${storage.getItem("organizationId")}/price-lib-req-mains`, { params });
};
// 获取阶梯报价数据
export const getLaddersDetail = (priceLibId) => {
  let params = {
    priceLibId: priceLibId,
    page: 0,
    size: 1000,
  };

  return http.get(`/spc/v1/${localStorage.getItem("organizationId")}/price-lib-req-ladders`, { params });
};
