/*
 * @Description: 费用结算工作流-工程计量 DataSet
 * @Date: 2022-04-27 09:58:06
 * @Author: JSS <shangshang.jing@gong-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
 */

import { $T, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

export default (headId) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  queryParameter: { headId },
  fields: [
    {
      fieldCode: "receiptNum",
      fieldName: $T("scux.contractorAssessKpi.created.model.receiptNum").$D("单据编号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "measureNatureName",
      fieldName: $T("scux.contractorAssessKpi.created.model.measureNatureName").$D("计量性质"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "examineMoney",
      fieldName: $T("scux.contractorAssessKpi.created.model.examineMoney").$D("PM审批金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "appliedMoney",
      fieldName: $T("scux.contractorAssessKpi.created.model.appliedMoney").$D("PM申请金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "deductMoney",
      fieldName: $T("scux.contractorAssessKpi.created.model.deductMoney").$D("合同扣款金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "occupyMoney",
      fieldName: $T("scux.contractorAssessKpi.created.model.occupyMoney").$D("已占用金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "thisOccupyMoney",
      fieldName: $T("scux.contractorAssessKpi.created.model.thisOccupyMoney").$D("本次占用金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "measureStartTime",
      fieldName: $T("scux.contractorAssessKpi.created.model.measureStartTime").$D("计量开始时间"),
      fieldType: "DATE_PICKER",
      editor: false,
    },
    {
      fieldCode: "countSum",
      fieldName: $T("scux.contractorAssessKpi.created.model.countSum").$D("引用数量"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "measureEndTime",
      fieldName: $T("scux.contractorAssessKpi.created.model.measureEndTime").$D("计量结束时间"),
      fieldType: "DATE_PICKER",
      editor: false,
    },
    {
      fieldCode: "contractNum",
      fieldName: $T("scux.contractorAssessKpi.created.model.contractNum").$D("合同编码"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "pmsDate",
      fieldName: $T("scux.contractorAssessKpi.created.model.pmsDate").$D("单据日期"),
      fieldType: "DATE_PICKER",
      editor: false,
    },
    {
      fieldCode: "comments",
      fieldName: $T("scux.contractorAssessKpi.created.model.comments").$D("备注"),
      fieldType: "TEXT",
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${tenantId}/yxCostInvoice/detail/engineering`,
      method: "GET",
    },
  },
});