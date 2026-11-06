/*
 * @Description: 付款明细信息-结算后扣款
 * @Date: 2022-04-27 09:58:06
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
  queryParameter: { paymentHeaderId },
  fields: [
    {
      fieldCode: "formNum",
      fieldName: $T("scux.contractorAssessKpi.created.model.formNum").$D("索赔单号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "itemName",
      fieldName: $T("scux.contractorAssessKpi.created.model.itemName").$D("索赔物料"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "companyName",
      fieldName: $T("scux.contractorAssessKpi.created.model.companyName").$D("公司"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "ouName",
      fieldName: $T("scux.contractorAssessKpi.created.model.ouName").$D("业务实体"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "fieldTypeDesc",
      fieldName: $T("scux.contractorAssessKpi.created.model.fieldTypeDesc").$D("索赔类型"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "dataSourceCode",
      fieldName: $T("scux.contractorAssessKpi.created.model.dataSourceCode").$D("索赔来源"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "dataSourceNum",
      fieldName: $T("scux.contractorAssessKpi.created.model.dataSourceNum").$D("合同号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "supplierName",
      fieldName: $T("scux.contractorAssessKpi.created.model.supplierName").$D("供应商名称"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "taxIncludedLineAmount",
      fieldName: $T("scux.contractorAssessKpi.created.model.deductionAmount").$D("扣款金额"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "occurDate",
      fieldName: $T("scux.contractorAssessKpi.created.model.occurDate").$D("发生日期"),
      fieldType: "DATE_PICKER",
      editor: false,
    },
    {
      fieldCode: "uomName",
      fieldName: $T("scux.contractorAssessKpi.created.model.uomName").$D("单位"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "quantity",
      fieldName: $T("scux.contractorAssessKpi.created.model.quantity").$D("数量"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldCode: "lineRemark",
      fieldName: $T("scux.contractorAssessKpi.created.model.lineRemark").$D("备注"),
      fieldType: "TEXT",
    },
  ],
  transport: {
    read: {
      url: `/scux/v1/${tenantId}/yx-payment-claims`,
      method: "GET",
    },
  },
});