/*
 * @Description: 电商发票工作流发票行信息 DataSet
 * @Date: 2022年7月4日19:21:50
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
      fieldCode: "invoiceLineNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.invoiceLineNum").$D("发票行号"),
    },
    {
      fieldCode: "ecProductNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.ecProductNum").$D("商品编码"),
    },
    {
      fieldCode: "ecProductName",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.ecProductName").$D("商品名称"),
    },
    {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T("entity.item.code").$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("entity.item.name").$D("物料名称"),
    },
    {
      fieldCode: "specificationsAndModel",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.specificationsAndModel").$D("规格型号"),
    },
    {
      fieldCode: "uom",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.unit").$D("单位"),
    },
    {
      fieldCode: "quantity",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.quantity").$D("本次开票数量"),
    },
    {
      fieldCode: "netPriceMeaning",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.netPrices").$D("不含税单价"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "netAmountMeaning",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.netAmount").$D("不含税金额"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "taxRate",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.taxRate").$D("税率"),
    },
    {
      fieldCode: "taxAmountMeaning",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.taxAmount").$D("税额"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "taxIncludedPriceMeaning",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.taxIncludedPrices").$D("含税单价"),
      render: (val) => SrmUtil.getNumberLocalized(val),
    },
    {
      fieldCode: "ecPoNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.ecPoNum").$D("父订单号"),
    },
    {
      fieldCode: "ecPoSubNum",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.ecPoSubNum").$D("子订单号"),
    },
    {
      fieldCode: "deliverTime",
      fieldType: "TEXT",
      fieldName: $T("sfin.payableInvoice.model.payableInvoice.deliverTime").$D("妥投时间"),
    },
  ],
  transport: {
    read: {
      url: `/sfin/v1/${tenantId}/invoice-line/pay/${invoiceHeaderId}?customizeUnitCode=SFIN.INVOICE_SUMMARY_DETAIL.EC_INVOICE_LINE`,
      method: "GET",
    },
  },
});