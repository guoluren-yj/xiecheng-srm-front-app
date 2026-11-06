
import { http } from "srm-mobile-ui";

const storage = window.localStorage;
// 获取供应商账户信息
const getSupplyAccountInfoApi = (accountId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/jala-sup-accounts/${accountId}`;

  return http.get(url);
};
//获取供应商所有数据
const getSuppliersListApi = (supplierCompanyId, companyId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/suppliers?supplierCompanyId=${supplierCompanyId}&companyId=${companyId}`;

  return http.get(url);
};
//获取联系人列表
const getContactListApi = (partnerCompanyId, partnerTenantId, companyId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-detail/contacts?tenantId=${storage.getItem("tenantId")}&companyId=${companyId}&partnerTenantId=${partnerTenantId}&partnerCompanyId=${partnerCompanyId}`;

  return http.get(url);
};
//获取账户资料列表
const getAccountListApi = (partnerCompanyId, partnerTenantId, companyId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-detail/bank-account?tenantId=${storage.getItem("tenantId")}&companyId=${companyId}&partnerTenantId=${partnerTenantId}&partnerCompanyId=${partnerCompanyId}`;

  return http.get(url);
};
//获取模板模块数据
const getTemplateModulesApi = (partnerCompanyId, partnerTenantId, companyId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/template-modules?companyId=${companyId}&partnerCompanyId=${partnerCompanyId}&partnerTenantId=${partnerTenantId}&tenantId=${storage.getItem("tenantId")}`;

  return http.get(url);
};
//获取基本信息调查数据
const getInvestigateBasicsApi = (investgHeaderId, supplierBasicId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/investigate-basics?investgHeaderId=${investgHeaderId}&supplierBasicId=${supplierBasicId}&tenantId=${storage.getItem("tenantId")}`;

  return http.get(url);
};
//获取考察报告数据
const getFeedBackReportsApi = (supplierCompanyId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/site-eval-headers/result/evaluating?supplierCompanyId=${supplierCompanyId}`;

  return http.get(url);
};
//获取基本信息里的公司名字
const getCompanyNamesApi = () => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data?lovCode=HPFM.OU&tenantId=${storage.getItem("tenantId")}`;

  return http.get(url);
};

export {
  getSupplyAccountInfoApi,
  getSuppliersListApi,
  getContactListApi,
  getAccountListApi,
  getTemplateModulesApi,
  getInvestigateBasicsApi,
  getFeedBackReportsApi,
  getCompanyNamesApi
};
