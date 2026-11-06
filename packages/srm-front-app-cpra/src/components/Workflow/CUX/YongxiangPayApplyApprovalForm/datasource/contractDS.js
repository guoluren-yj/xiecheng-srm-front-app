/*
 * @Description: 付款明细工作流-关联合同阶段
 * @Date: 2022-04-27 09:57:01
 * @Author: JSS <shangshang.jing@gong-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
 */

import { $T, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

export default (paymentHeaderId, prePaymentType) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  queryParameter: { paymentHeaderId, prePaymentType },
  fields: [
    {
      fieldCode: "stageCode",
      fieldName: $T("scux.contractorAssessKpi.created.model.stageCode").$D("阶段编码"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "stageName",
      fieldName: $T("scux.contractorAssessKpi.created.model.stageName").$D("阶段名称"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "sourceDocNum",
      fieldName: $T("scux.contractorAssessKpi.created.model.sourceDocNum").$D("合同编号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "currencyCode",
      fieldName: $T("scux.contractorAssessKpi.created.model.currencyCode").$D("币种"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "payRatio",
      fieldName: $T("scux.contractorAssessKpi.created.model.payRatio").$D("百分比"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "taxIncludedAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxIncludedAmount").$D("计划付款金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "expectPaymentDate",
      fieldName: $T("scux.contractorAssessKpi.created.model.expectPaymentDate").$D("计划付款日期"),
      fieldType: "DATE_PICKER",
      editor: false,
    },
    {
      fieldCode: "occupiedAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.occupiedAmount").$D("占用金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "pcStageTotalOccupiedAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.pcStageTotalOccupiedAmount").$D("累计占用金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "payedAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.payedAmount").$D("已付款金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "pcStageTotalPayedAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.pcStageTotalPayedAmount").$D("累计付款金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "stageRemainAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.stageRemainAmount").$D("阶段余额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/yx-payment-con-lines/${tenantId}/${paymentHeaderId}/po-pc-con-lines`,
      method: "GET",
    },
  },
});