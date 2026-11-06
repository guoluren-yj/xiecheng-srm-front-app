/*
 * @Description: 付款申请工作流行 DataSet
 * @Date: 2022-04-26 14:47:31
 * @Author: JSS <shangshang.jing@gong-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
 */

import { $T, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

export default (paymentHeaderId) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.itemCode").$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldName: $T("scux.contractorAssessKpi.created.model.itemName").$D("物料名称"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "specifications",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.specifications").$D("规则型号"),
    },
    {
      fieldCode: "itemProperties",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.itemProperties").$D("材质"),
    },
    {
      fieldCode: "uomName",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.uomName").$D("单位名称"),
    },
    {
      fieldCode: "quantity",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.contractorAssessKpi.created.model.quantity").$D("数量"),
      editor: false,
    },
    {
      fieldCode: "unitPrice",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.contractorAssessKpi.created.model.unitPrice").$D("含税单价"),
      editor: false,
    },
    {
      fieldCode: "taxRate",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxRate").$D("税率"),
      editor: false,
    },
    {
      fieldCode: "taxIncludedLineAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxIncludedLineAmount").$D("含税总金额"),
      editor: false,
    },
    {
      fieldCode: "paymentTaxAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.contractorAssessKpi.created.model.paymentTaxAmount").$D("申请付款金额（含税）"),
      editor: false,
    },
    {
      fieldCode: "planProjectName",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.planProjectLov").$D("资金计划项目"),
    },
    {
      fieldCode: "sourceDocNum",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.InvoiceNo").$D("发票结算单号"),
    },
    {
      fieldCode: "lineNum",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.lineNum").$D("单据行号"),
    },
    {
      fieldCode: "num",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.num").$D("订单行号"),
    },
    {
      fieldCode: "sourceDocNum",
      fieldType: "TEXT",
      fieldName: $T("scux.contractorAssessKpi.created.model.sourceDocNum").$D("合同编号"),
    },
    {
      fieldCode: "trxDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("scux.contractorAssessKpi.created.model.trxDate").$D("入库日期"),
      editor: false,
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/yx-payment-lines/${tenantId}/${paymentHeaderId}/lines`,
      method: "GET",
    },
  },
});