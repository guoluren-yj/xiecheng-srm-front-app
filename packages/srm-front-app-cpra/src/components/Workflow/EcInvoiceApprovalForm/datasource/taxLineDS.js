/*
 * @Description: 电商发票工作流税务发票行信息 DataSet
 * @Date: 2022年7月4日20:41:02
 * @Author: <xingya.li@going-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
 */

import { $T, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

export default (invoiceHeaderId) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "invoiceCode",
      fieldType: "TEXT",
      fieldName: $T("sfin.invoiceBill.model.invoiceBill.taxInvoiceCode").$D("发票代码"),
    },
    {
      fieldCode: "invoiceNumber",
      fieldType: "TEXT",
      fieldName: $T("sfin.invoiceBill.model.invoiceBill.invoiceNumber").$D("发票号码"),
    },
    {
      fieldCode: "totalAmount",
      fieldType: "TEXT",
      fieldName: $T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "taxAmount",
      fieldType: "TEXT",
      fieldName: $T("sfin.invoiceBill.model.invoiceBill.taxAmount").$D("税额"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "taxIncludedAmount",
      fieldType: "TEXT",
      fieldName: $T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "noDepositInvoiceTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sfin.inputInvoice.model.taxType").$D("发票类型"),
    },
  ],
  transport: {
    read: {
      url: `/sfin/v1/${tenantId}/tax-invoice-lines/list/${invoiceHeaderId}?asyncCountFlag=DEFAULT`,
      method: "GET",
    },
  },
});