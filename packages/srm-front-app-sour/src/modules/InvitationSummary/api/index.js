
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

//采购协议业务条款
export const getAgreementProcurementApi = (pcHeaderId, params) => {
  const url = `/spcm/v1/${storage.getItem("organizationId")}/purchase-contract/${pcHeaderId}/pc-term/page`;
  return http.get(url, { params });
};
// 获取邀约汇总列表
export const getInvitationSummaryListApi = ({ page, size, ...params }) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/invites?page=${page}&size=${size}`;
  return http.post(url, params);
};

// 获取邀约类型
export const getSourceTypeApi = () => {
  const url = "/hpfm/v1/lovs/value?lovCode=SPFM.PARTNER_TYPE";
  return http.get(url);
};
// 获取邀约状态
export const getSourceStatusApi = () => {
  const url = "/hpfm/v1/lovs/value?lovCode=SPFM.PARTNER_INVITE_STATUS";
  return http.get(url);
};
// 获取企业邀约汇总详情页信息
export const getInvitesDetailApi = (inviteId) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/invites/${inviteId}`;
  return http.get(url);
};
// 获取企业信息
export const getSupplierApi = (companyId) => {
  const url = `/spfm/v1/companies/latest?companyId=${companyId}`;
  return http.get(url);
};
/*批量获取值集（调查表类型、送货或服务范围、注册资本）*/
export const getValueApi = (params) => {
  const url = "/hpfm/v1/lovs/value/batch";
  return http.get(url, { params });
};

// 拒绝企业邀约汇总
export const getInvitationRejectApi = (params, inviteId) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/reject/${inviteId}`;
  return http.put(url, params);
};
// 同意企业邀约汇总
export const getInvitationApproveApi = (params, inviteId) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/approve/${inviteId}`;
  return http.post(url, params);
};
// 同意企业邀约汇总
export const getInvitationSendCheckApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/send-investigate`;
  return http.post(url, params);
};
// 同意企业邀约汇总(不发送调查表)
export const approveInvitationNoSendCheckApi = (params, inviteId) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/approve-with-supplier-cate/${inviteId}`;
  return http.post(url, params);
};

// 校验供应商分类
export const checkIntroCategoryApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-categorys/check-intro-category?${params}`;

  return http.get(url);
};

// 获取准入品类对应采购员
export const getPurchaserApi = (params) => {
  const url = `/smdm/v1/${storage.getItem("organizationId")}/item-category-purchasers/getPurchaser`;
  return http.post(url, params);
};

