/*
 * @Description: 费用结算工作流-发票头信息 DataSet
 * @Date: 2022-04-26 14:47:31
 * @Author: JSS <shangshang.jing@gong-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
 */

import { $T, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

export default (headId, attributeVarchar12) => ({
  autoQuery: true,
  queryParameter: { headId },
  fields: [
    {
      fieldCode: "settle",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.settle").$D("结算单据号"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.companyName").$D("公司"),
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.ouName").$D("业务实体"),
    },
    {
      fieldCode: "supplierName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.supplierName").$D("供应商名称"),
    },
    {
      fieldCode: "realName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.realName").$D("创建人"),
    },
    {
      fieldCode: "taxIncludeAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.taxIncludeAmount").$D("含税金额(系统)"),
      editor: false,
    },
    {
      fieldCode: "taxAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.taxAmount").$D("税额(系统)"),
      editor: false,
    },
    {
      fieldCode: "uuidNum",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.uuidNum").$D("附件张数"),
      editor: false,
    },
    {
      fieldCode: "invoiceAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.invoiceAmount").$D("发票总额"),
      editor: false,
    },
    {
      fieldCode: "invoiceTaxAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.invoiceTaxAmount").$D("发票税额"),
      editor: false,
    },
    {
      fieldCode: "businessName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.businessNameLov").$D("业务大类"),
    },
    {
      fieldCode: "measurementPropertiesName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.measurementPropertiesCode").$D("工程计量性质"),
      visible: attributeVarchar12 === "1",
    },
    {
      fieldCode: "appliedAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.appliedAmount").$D("工程计量申请金额"),
      editor: false,
      visible: attributeVarchar12 === "1",
    },
    {
      fieldCode: "approvalAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.approvalAmount").$D("工程计量审批金额"),
      editor: false,
      visible: attributeVarchar12 === "1",
    },
    {
      fieldCode: "remake",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.remake").$D("业务说明"),
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${tenantId}/yxCostInvoice/detail/head`,
      method: "GET",
    },
  },
});