/*
 * @Description: 费用结算工作流-发票明细 DataSet
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
      fieldCode: "invoiceName",
      fieldName: $T("scux.contractorAssessKpi.created.model.invoiceCode").$D("发票类型"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "displayLineNum",
      fieldName: $T("scux.contractorAssessKpi.model.contractorAssessKpi.lineNum").$D("行号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "openInvoiceDate",
      fieldName: $T("scux.contractorAssessKpi.created.model.openInvoiceDate").$D("开票日期"),
      fieldType: "DATE_PICKER",
      editor: false,
    },
    {
      fieldCode: "taxTicketCode",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxTicketCode").$D("税票代码"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "taxTicketNum",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxTicketNum").$D("税票号码"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "amount",
      fieldName: $T("scux.contractorAssessKpi.created.model.amount").$D("不含税金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "taxAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxAmount").$D("税额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "taxAmountSum",
      fieldName: $T("scux.contractorAssessKpi.created.model.taxAmountSum").$D("税价合计"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${tenantId}/yxCostInvoice/detail/invoice`,
      method: "GET",
    },
  },
});