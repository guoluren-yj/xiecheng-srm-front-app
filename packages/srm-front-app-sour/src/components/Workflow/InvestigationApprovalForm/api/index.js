/*
 * @Date: 2022-08-09 15:11:10
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2024, Hand
 */
import { SrmUtil, http } from "srm-mobile-ui";

/**
 * 获取调查表详情信息
 * @param investgHeaderId 调查表头id
 */
export const getInvestigateDetail = (investgHeaderId) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/investigate/${investgHeaderId}`;
  const params = { customizeUnitCode: "SSLM.INVESTIGATION_APPROVAL_DETAIL.HEADER,SSLM.INVESTIGATION_WORKBENCH_DETAIL.HEADER" };
  return http.get(url, { params });
};

/**
 * 获取到调查表配置信息
 * @param investigateTemplateId 调查表模板id
 */
export const getInvestigateConfigPreview = (investigateTemplateId) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/investigate-confighs-preview/${investigateTemplateId}`;
  return http.get(url);
};

/**
 * 获取调查表操作记录
 * @param {*} params
 * @returns
 */
export const getInvestgProcessApi = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/investg-process-recs`;
  return http.get(url, { params });
};

/**
 * 调查表拒绝
 * @param {*} params
 * @returns
 */
export const investgRejectApi = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/investigate/reject`;
  return http.post(url, params);
};

/**
 * 调查表同意
 * @param {*} params
 * @returns
 */
export const investgApproveApi = (investgHeaderId, params) => {
  const customizeUnitCode = "SSLM.INVESTIGATION_APPROVAL_DETAIL.HEADER";
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/investigate/approve/${investgHeaderId}?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

/**
 * 调查表邀约拒绝
 * @param {*} params
 * @returns
 */
export const investgInviteRejectApi = (params) => {
  const url = `/sslm/v1/${SrmUtil.getTenantId()}/investigate/invite-reject`;
  return http.post(url, params);
};

// 获取调查表查询接口路径
export const getInvestgListApi = (configName) => {
  switch (configName) {
  case "sslmInvestgReserve1":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve1s`;
  case "sslmInvestgReserve2":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve2s`;
  case "sslmInvestgReserve3":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve3s`;
  case "sslmInvestgReserve4":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve4s`;
  case "sslmInvestgReserve5":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve5s`;
  case "sslmInvestgReserve6":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve6s`;
  case "sslmInvestgReserve7":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve7s`;
  case "sslmInvestgReserve8":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve8s`;
  case "sslmInvestgReserve9":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve9s`;
  case "sslmInvestgReserve10":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve10s`;
  case "sslmInvestgReserve11":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve11s`;
  case "sslmInvestgReserve12":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve12s`;
  case "sslmInvestgReserve13":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve13s`;
  case "sslmInvestgReserve14":
    return `/sslm/v1/${SrmUtil.getTenantId()}/investg-reserve14s`;
  default:
    break;
  }
};