/*
 * @Description: 费用结算工作流-网上发票 DataSet
 * @Date: 2022-04-28 00:52:53
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
      fieldCode: "itemCode",
      fieldName: $T("scux.contractorAssessKpi.created.model.itemCode").$D("物料编码"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "itemName",
      fieldName: $T("scux.contractorAssessKpi.created.model.itemName").$D("物料名称"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "specifications",
      fieldName: $T("scux.contractorAssessKpi.created.model.specifications").$D("规格型号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "uomName",
      fieldName: $T("scux.contractorAssessKpi.created.model.uomName").$D("开票单位"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "thisQuantity",
      fieldName: $T("scux.contractorAssessKpi.created.model.thisQuantity").$D("本次开票数量"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "thisUnitPrice",
      fieldName: $T("scux.contractorAssessKpi.created.model.thisUnitPrice").$D("本次开票不含税单价"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "taxincludedUnitAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxincludedUnitAmount").$D("本次开票不含税行金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "taxincludedUnitPrice",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxincludedUnitPrice").$D("含税单价"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "thisTaxAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.thisTaxAmount").$D("本次开票税额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "thisInvoiceLinePrice",
      fieldName: $T("scux.contractorAssessKpi.created.model.thisInvoiceLinePrice").$D("本次含税开票行金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "taxRate",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxRate").$D("税率"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "pcNum",
      fieldName: $T("scux.contractorAssessKpi.created.model.pcNum").$D("合同编号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "displayLineNum",
      fieldName: $T("scux.contractorAssessKpi.model.contractorAssessKpi.constractLine").$D("合同行"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "currencyName",
      fieldName: $T("scux.contractorAssessKpi.created.model.currencyName").$D("币种"),
      fieldType: "TEXT",
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${tenantId}/yxCostInvoice/detail/line`,
      method: "GET",
    },
  },
});