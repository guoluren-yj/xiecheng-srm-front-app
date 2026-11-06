/*
 * @Date: 2024-08-12 19:27:42
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";

import { SRM_SSLM } from "@/utils/utils";
import { renderStatus } from "@/components/utils/render";

const organizationId = SrmUtil.getTenantId();

// 升降级ds
export const getRelegationDs = () => ({
  editable: false,
  enableQuery: false,
  pageSize: 5,
  fields: [
    {
      fieldName: $T("hzero.common.status").$D("状态"),
      fieldCode: "processStatusMeaning",
    },
    {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.orderNum").$D("单据编号"),
      fieldCode: "documentNumber",
    },
    {
      fieldCode: "fromStageDescription",
      fieldName: $T("sslm.common.view.sourceStage").$D("起始阶段"),
    },
    {
      fieldCode: "toStageDescription",
      fieldName: $T("sslm.common.view.targetStage").$D("目标阶段"),
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${organizationId}/life-cycle-reqss/eval-manage/query/{evalLineId}`,
      method: "GET",
    },
  },
});
// 升降级columns
export const getRelegationColumns = () => [
  {
    fieldCode: "documentNumber",
    fieldType: "EMPTY",
    formRow: 10,
    render: (val, item) => <SrmListHeader showOpenTag={false}>
      <span>{val || "-"}</span>
      <span slot="right"> {renderStatus(item.processStatus, item.processStatusMeaning)}</span>
    </SrmListHeader>,
  },
  {
    fieldCode: "fromStageDescription",
    formRow: 20,
    formCol:1,
  },
  {
    fieldCode: "toStageDescription",
    formRow: 20,
    formCol:2,
  },
];

// 质量整改ds
export const getRectificationDs = () => ({
  editable: false,
  enableQuery: false,
  pageSize: 5,
  fields: [
    {
      fieldName: $T("hzero.common.status").$D("状态"),
      fieldCode: "problemStatusMeaning",
    },
    {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.orderNum").$D("单据编号"),
      fieldCode: "problemNum",
    },
    {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.problemTitle").$D("整改报告标题"),
      fieldCode: "problemTitle",
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${organizationId}/site_eval_external_orders/eval-manage/{evalHeaderId}/{supplierId}`,
      method: "GET",
    },
  },
});
// 质量整改columns
export const getRectificationColumns = (_this) => [
  {
    fieldCode: "problemTitle",
    fieldType: "EMPTY",
    render: (val, item) => <SrmListHeader showOpenTag={false}>
      <span>{val || "-"}</span>
      <span slot="right"> {renderStatus(item.problemStatus, item.problemStatusMeaning)}</span>
    </SrmListHeader>,
  },
  {
    fieldCode: "problemNum",
    render: (val, data) =>
      <span style="color: var(--color-other-default-b);"
        on-click={(n) => {
          n.stopPropagation();
          _this.toReformDetail(data);
        }}>
        {val}
      </span>,
  },
];
