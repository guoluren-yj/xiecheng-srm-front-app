/*
 * @Date: 2024-06-24 10:27:32
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";

// 可供、不可供渲染
export const supplyRender = (value) =>
  <SrmTag type={value ? "success" : "danger"}>
    {value ? $T("sslm.common.item.supply").$D("可供") : $T("sslm.common.item.notSupply").$D("不可供")}
  </SrmTag>;

// 启用、禁用渲染
export const enableRender = (value) =>
  <SrmTag type={value ? "success" : "danger"}>
    {value ? $T("hipspfm.common.status.enabledFlag.enable").$D("启用") : $T("hipspfm.common.status.enabledFlag.disable").$D("禁用")}
  </SrmTag>;

// 主账户渲染
export const masterRender = (value) =>
  value ?
    <SrmTag type="success">
      {$T("sslm.common.view.bankMaster").$D("主账户")}
    </SrmTag> : null;

// 默认联系人渲染
export const defaultContactRender = (value) =>
  value ?
    <SrmTag type="success">
      {$T("sslm.common.view.defaultContact").$D("默认")}
    </SrmTag> : null;

// 绿色状态集合
const greenStatus = [
  "PUBLISHED",
  "ICA_SUBMITTED",
  "PCA_SUBMITTED",
  "COMPLETED",
  "VALIDATED",
  "SUBMITTED",
  "RELEASED",
  "APPROVED",
  "SCORED",
  "CANCEL FINISH APPROVAL REJECT"
];

// 红色状态集合
const redStatus = [
  "ICA_REJECTED",
  "PCA_REJECTED",
  "REJECTED",
  "PUBULISH APPROVAE REJECT",
];

// 灰色状态集合
const grayStatus = [
  "CANCELLED",
  "DELETED",
  "CANCEL",
  "OBSOLETED",
];

// 获取Tag组件color
export function getTagColor(status) {
  const type = greenStatus.includes(status) ?
    "success" : // 绿色
    redStatus.includes(status) ?
      "danger" : // 红色
      grayStatus.includes(status) ?
        "info" : // 灰色
        "warn"; // 橙色
  return type;
}

// 状态标签渲染
export const renderStatus = (value, label) =>
  <SrmTag type={getTagColor(value)}>
    {label}
  </SrmTag>;
