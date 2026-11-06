/*
 * @Description: 付款申请工作流头 DataSet
 * @Date: 2022-04-26 14:47:31
 * @Author: JSS <shangshang.jing@gong-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
 */

import { $T, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

export default (paymentHeaderId) => ({
  autoQuery: true,
  fields: [
    {
      fieldCode: "documentTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.documentType").$D(
        "付款类型"
      ),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.paymentCompany").$D(
        "付款公司"
      ),
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.ouName").$D("业务实体"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.supplierCompanyName").$D(
        "供应商名称"
      ),
    },
    {
      fieldCode: "initalPaymentAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.initalPaymentAmount").$D(
        "付款金额"
      ),
      editor: false,
    },
    {
      fieldCode: "paymentTypeName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.paymentTypeName").$D(
        "结算方式"
      ),
    },
    {
      fieldCode: "attributeLongtext1",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.paymentRemark").$D(
        "付款备注"
      ),
    },
    {
      fieldCode: "remark",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.remark").$D("供应商说明"),
    },
    {
      fieldCode: "paymentProportion",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.paymentProportion").$D(
        "付款比例(%)"
      ),
      editor: false,
    },
    {
      fieldCode: "taxIncludedAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.payableAmountWithTax").$D(
        "含税应付总金额"
      ),
      editor: false,
    },
    {
      fieldCode: "supplierBalance",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.supplierBalance").$D(
        "供应商余额"
      ),
      editor: false,
    },
    {
      fieldCode: "errorMsg",
      fieldType: "TEXT",
    },
    {
      fieldCode: "planSummaryNum",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.planSummaryNum").$D(
        "资金计划单号"
      ),
    },
    {
      fieldCode: "bankAccountName",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.bankAccountName").$D(
        "收款方名称"
      ),
    },
    {
      fieldCode: "bankAccountNum",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.bankAccountNum").$D(
        "收款账号"
      ),
    },
    {
      fieldCode: "bankAccountRemarks",
      fieldType: "TEXT",
      fieldName: $T("scux.settlement.created.model.bankAccountRemarks").$D(
        "收款银行备注"
      ),
    },
    {
      fieldCode: "totalClaimAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("scux.settlement.created.model.totalClaimAmount").$D(
        "扣款金额"
      ),
      editor: false,
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/yx-payment-headers/${tenantId}/query-header/${paymentHeaderId}`,
      method: "GET",
      transformResponse: (data) => ({ ...data.response, errorMsg: $T("scux.settlement.view.title.obtaining.balance").$D("获取余额中...") }),
    },
  },
});
