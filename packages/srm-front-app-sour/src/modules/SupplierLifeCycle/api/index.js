/**
 * 与 【供应商生命周期】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

//供应商生命周期列表查询
export const getSupplierLifeCycleListApi = (params) => {
  const url = `sslm/v1/${storage.getItem("organizationId")}/supplier-pool?page=${params.page}&size=${params.size}`;
  delete params.page;
  delete params.size;
  return http.post(url, params);
};

//生命周期阶段查询
export const getNavApi = () => {
  const url = `sslm/v1/${storage.getItem("organizationId")}/life-cycles/stages?organizationId=${storage.getItem("organizationId")}`;
  return http.get(url);
};

//供应商分类lov查询
export const getSupplierClassApi = (params) => {
  const url = `sslm/v1/${storage.getItem("organizationId")}/supplier-category-assign`;
  return http.get(url, { params });
};

//公司lov查询
export const getCompanyApi = (params) => {
  const url = `spfm/v1/${storage.getItem("organizationId")}/user-authority-data/company`;
  return http.get(url, { params });
};

// 供应商明细查询(供应商明细接口替换为 getSuppliersApi，此接口废弃 by:2022/6/1)
export const getSupplierApi = (companyId) => {
  const url = `/spfm/v1/companies?companyId=${companyId}`;
  return http.get(url);
};
// 供应商明细查询
export const getSuppliersApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/suppliers`;
  return http.get(url, { params });
};
// 获取生民周期行信息
export const getLifeCycleListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle-Admission`;
  return http.get(url, { params });
};
// 获取供应商分类行信息
export const getSupplierClassificationListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-category-assign`;
  return http.get(url, { params });
};
// 获取供货能力清单行信息
export const getSupplyCapacityListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supply-ability-lines/query`;
  return http.get(url, { params });
};
// 获取供应商考评结果行信息
export const getSupplierEvaluationResultsApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/eval-headers/result/purchase`;
  return http.get(url, { params });
};
// 获取供应商考评结果详情信息
export const getSupplierEvaluationResultsDetailApi = (evalHeaderId, params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/eval-headers/result/${evalHeaderId}`;
  return http.get(url, { params });
};

// 获取地址行信息
export const getAddressListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-detail/address`;
  return http.get(url, { params });
};
// 获取银行账户行信息
export const getBankAccountListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-detail/bank-account`;
  return http.get(url, { params });
};
// 获取联系人行信息
export const getContactListApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-detail/contacts`;
  return http.get(url, { params });
};
// 获取历史版本信息
export const getVersionHistoryApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/version-history/info`;
  return http.get(url, { params });
};
// 集团级时获取公司id
export const getCompanyIdApi = (params) => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data`;
  return http.get(url, { params });
};

// 查询其他信息
export const fetchOtherInfo = (params) => http.get(`/sslm/v1/${storage.getItem("organizationId")}/supplier-others/getSupplierOther`, { params });

// 查询调查表模板
export async function fetchQuestionnaireTmpl(params) {
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/template-modules`, { params });
}

// 查询采购财务头信息
export async function fetchPurchaseHeader(params) {
  return http.get(`/sslm/v1/${storage.getItem("organizationId")}/supplier-sync/selectSync`, { params });
}

// 查询供应商标签
export async function fetchTagsDataApi(params) {
  return http.get(`/marmot/v1/${storage.getItem("organizationId")}/marmot-api/lU77dbwUEddYHLIicQQnafiaSRDudWC44y9W55kSDvAuE`, { params });
}
