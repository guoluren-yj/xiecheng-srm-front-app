/*
 * @Description: 电商发票工作流头信息 DataSet
 * @Date: 2022年7月4日17:15:22
 * @Author: <xingya.li@going-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
 */

import { $T, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

export default (invoiceHeaderId) => ({
  autoQuery: true,
  fields: [
    {
      fieldCode: "invoiceNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.invoiceNum").$D("SRM发票号"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.invoiceBill.supplierName").$D("供应商"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.company").$D("公司"),
    },
    {
      fieldCode: "purchaseAgentName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.purchaseAgentName").$D("采购员"),
    },
    {
      fieldCode: "drawerSupplierName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.drawerSupplierName").$D("出票方"),
      editor: false,
    },
    {
      fieldCode: "taxIncludedAmountSystem",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.taxIncludedAmountSystem").$D("含税总额(系统)"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "taxIncludedAmount",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.taxIncludedAmount.invoice").$D("发票总额"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "currencyCode",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.currencyCode").$D("币种"),
    },
    {
      fieldCode: "taxAmountSystem",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.taxAmountSystem").$D("税额(系统)"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "taxAmount",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.taxAmount.invoice").$D("发票税额"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "freight",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.freight").$D("运费"),
    },
    {
      fieldCode: "taxTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.taxType").$D("发票类型"),
    },
    {
      fieldCode: "expectInvoiceDate",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.expectInvoiceDate").$D("期望开票日期"),
    },
    {
      fieldCode: "remark",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.remark").$D("备注"),
    },
    {
      fieldCode: "taxRegistrationAddress",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.taxRegistrationAddress").$D("税务登记地址"),
    },
    {
      fieldCode: "taxRegistrationNumber",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.taxRegistrationNumber").$D("税号"),
    },
    {
      fieldCode: "depositBank",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.depositBank").$D("开户行"),
    },
    {
      fieldCode: "bankAccountNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.bankAccountNum").$D("开户行账号"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.invoice.companyName").$D("开票公司名称"),
    },
    {
      fieldCode: "taxRegistrationPhone",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.taxRegistrationPhone").$D("税务登记电话"),
    },
    {
      fieldCode: "contactName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.contactName").$D("收单联系人"),
    },
    {
      fieldCode: "mobile",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.mobile").$D("收单联系电话"),
    },
    {
      fieldCode: "regionName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.regionName").$D("收单方地址"),
    },
    {
      fieldCode: "address",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.address").$D("详细地址"),
    },
  ],
  transport: {
    read: {
      url: `/sfin/v1/${tenantId}/invoice/${invoiceHeaderId}?customizeUnitCode=SFIN.INVOICE_SUMMARY_DETAIL.CENTRALIZED_BASIC,SFIN.INVOICE_EC_UPDATE_DETAIL.BASIC_INFO`,
      method: "GET",
    },
  },
});