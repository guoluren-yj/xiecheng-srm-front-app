/*
 * @Date: 2023-01-31 17:57:26
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */

// 绩效管理状态
export const evaluationStatusMap = {
  SYSTEM_COMPLETE: "success",
  MANUAL_COMPLETE: "success",
  FINAL_COLLECTED:"success",
  PUBLISHED:"success",
  SUPPLIER_CONFIRMED:"success",
  MANUAL_EVALUATING_COMPLETE:"success",
  SYSTEM_FAIL: "danger",
  REJECTED: "danger",
  DISCARDED:"info",
};

// 询价单状态
export const inquiryStatusMap = {
  RELEASE_REJECTED: "danger",
  LACK_QUOTED:"danger",
  OPENED: "success",
  PRE_EVALUATION_PENDING_REJECT: "danger",
  CHECK_REJECTED:"danger",
  FINISHED:"success",
  PAUSED:"info",
  CLOSED:"info",
  CANCELED:"info"
};

// 整改单状态
export const rectifyStatusMap = {
  PUBLISHED: "success",
  COMPLETED:"success",
  ICA_REJECTED:"danger",
  PCA_REJECTED:"danger",
  CANCELLED:"info",
  "CANCEL FINISH APPROVAL REJECT":"danger",
  "PUBULISH APPROVAE REJECT":"danger",
  DELETED:"info",
};

// 物料认证状态
export const materialStatusMap = {
  APPROVED:"success",
  AUTHENTICATION_APPROVED:"success",
  REJECTED:"danger",
  AUTHENTICATION_REJECTED:"danger",
  CANCEL:"info",
  EARLY_TERMINATION:"success",
  FINAL_AUTHENTICATION_COMPLETE:"success",
};