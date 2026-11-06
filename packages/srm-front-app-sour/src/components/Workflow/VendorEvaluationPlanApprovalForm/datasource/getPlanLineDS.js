/*
 * @Date: 2024-08-28 14:31:32
 * @Author: CDJ
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";
const organizationId = SrmUtil.getTenantId();

export const getPlanLineDS = ({ evalPlanHeaderId } = {}) => ({
  selection: Infinity,
  pageSize: 5,
  autoQuery: true,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "lineNumber",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.lineNumber").$D("行号"),
    },
    {
      fieldCode: "evalStatusMeaning",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.lineStatus").$D("行状态"),
    },
    {
      fieldCode: "executeStatusMeaning",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.executeStatus").$D("计划执行状态"),
    },
    {
      fieldCode: "progressStatusMeaning",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.assessmentProgress").$D("评估进度"),
    },
    {
      fieldCode: "finalScore",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.evaluationScore").$D("评估得分"),
    },
    {
      fieldCode: "resultsFlagMeaning",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.evaluationResult").$D("评估结果"),
    },
    {
      fieldCode: "grade",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.grade").$D("评估等级"),
    },
    {
      fieldCode: "approveDate",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.assessmentCompletionDate").$D("评估完成时间"),
    },
    {
      fieldCode: "ouName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.ouName").$D("业务实体"),
    },
    {
      fieldCode: "invOrganizationName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.invOrganization").$D("库存组织"),
    },
    {
      fieldCode: "inventoryName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.inventory").$D("库房"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierName").$D("供应商"),
    },
    {
      fieldCode: "supplierCompanyNum",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierCompanyNum").$D("平台供应商编码"),
    },
    {
      fieldCode: "supplierNum",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.erpSupplierNum").$D("erp供应商编码"),
    },
    {
      fieldCode: "supplierCategoryName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierClassification").$D("供应商分类"),
    },
    {
      fieldCode: "categoryCode",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.categoryCode").$D("品类编码"),
    },
    {
      fieldCode: "categoryName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.categoryName").$D("品类名称"),
    },
    {
      fieldCode: "itemCode",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.itemCode").$D("物料编码"),
    },
    {
      fieldCode: "itemName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.itemName").$D("物料名称"),
    },
    {
      fieldCode: "strategyName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.evalPlanStrategyId").$D("评估策略"),
    },
    {
      fieldCode: "investigationTypeMeaning",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.form.label.investigationType").$D("考察方式"),
    },
    {
      fieldCode: "evalPrincipalName",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.evalPrincipal").$D("评估负责人"),
    },
    {
      fieldCode: "planMonth",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.planMonth").$D("计划评估起始月份"),
    },
    {
      fieldCode: "planDateFrom",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.planDateFrom").$D("计划评估日期从"),
    },
    {
      fieldCode: "planDateTo",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.planDateTo").$D("计划评估日期至"),
    },
    {
      fieldCode: "supplierContacts",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierContacts").$D("供应商联系人"),
    },
    {
      fieldCode: "mobilephoneField",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierTelephone")
        .$D("供应商联系电话"),
    },
    {
      fieldCode: "email",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierEmail")
        .$D("供应商联系邮箱"),
    },
    {
      fieldCode: "supplierAddress",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.supplierAddress").$D("供应商注册地址"),
    },
    {
      fieldCode: "evalRemark",
      fieldName: $T("sslm.vendorEvaluationPlanDetail.table.column.label.evalRemark").$D("评估说明"),
    },
  ],
  transport: {
    read: {
      url: `/sslm/v1/${organizationId}/eval-plan-lines/${evalPlanHeaderId}`,
      method: "GET",
      params:{ customizeUnitCode:"SSLM.SUP_PLAN_WORKBENCH_DETAIL.DETAIL_TABLE" }
    },
  },
})
;
