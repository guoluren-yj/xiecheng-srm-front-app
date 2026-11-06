/*
 * @Date: 2023-01-31 09:49:37
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { SrmUtil, $T } from "srm-mobile-ui";

function rectifyDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldName: $T("sqam.common.model.qualityRectification.status").$D("状态"),
        fieldCode: "problemStatusMeaning",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
        fieldCode: "problemNum",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.fieldName").$D("整改报告标题"),
        fieldCode: "problemTitle",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.rectifyTypeCodeMeaning").$D("整改单类型"),
        fieldCode: "rectifyTypeCodeMeaning",
      },
      {
        fieldName: $T("sqam.common.view.common.relatedRectification").$D("关联整改报告"),
        fieldCode: "associateProblemNums",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.validateResults").$D("验证结果"),
        fieldCode: "validateResultFlagMeaning",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.issue").$D("问题类型"),
        fieldCode: "problemTypeCodeMeaning",
      },
      {
        fieldName: $T("entity.supplier.code").$D("供应商编码"),
        fieldCode: "supplierNum",
      },
      {
        fieldName: $T("entity.supplier.fieldCode").$D("供应商名称"),
        fieldCode: "supplierName",
      },
      {
        fieldName: $T("entity.company.tag").$D("公司"),
        fieldCode: "companyName",
      },
      {
        fieldName: $T("entity.organization.class.inventory").$D("库存组织"),
        fieldCode: "invOrganizationName",
      },
      {
        fieldName: $T("entity.item.code").$D("物料编码"),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("entity.item.fieldCode").$D("物料名称"),
        fieldCode: "itemName",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.significance").$D("重视度"),
        fieldCode: "problemImportanceCodeMeaning",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.urgency").$D("紧急度"),
        fieldCode: "problemUrgencyCodeMeaning",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.dataSource").$D("创建方式"),
        fieldCode: "sourceCodeMeaning",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.sourceNum").$D("来源单据编号"),
        fieldCode: "sourceNum",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.claimFormNum").$D("关联索赔单号"),
        fieldCode: "claimFormNum",
      },
      {
        fieldName: $T("entity.roles.creator").$D("创建人"),
        fieldCode: "createdName",
      },
      {
        fieldName: $T("hzero.common.date.creation").$D("创建日期"),
        fieldCode: "creationDate",
      },
      {
        fieldName: $T("hzero.common.date.release").$D("发布日期"),
        fieldCode: "publishedDate",
      },
      {
        fieldName: $T("sqam.common.model.qualityRectification.publishedName").$D("发布人"),
        fieldCode: "publishedName",
      },
    ],
    transport: {
      read: {
        url: "/sqam/v1/{tenantId}/problem-headers",
        method: "get",
      },
    },
  };
}

function rectifyReportDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldName:  $T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
        fieldCode: "problemNum",
      },
      {
        fieldName:  $T("sqam.common.model.qualityRectification.title").$D("整改报告标题"),
        fieldCode: "problemTitle",
      },
      {
        fieldName:  $T("entity.roles.creator").$D("创建人"),
        fieldCode: "createdName",
      },
    ],
    transport: {
      read:{
        url: "/sqam/v1/{tenantId}/header-associates/{problemHeaderId}/assocaite/Deliver",
        method: "get",
      },
    },
  };
}

export { rectifyDS, rectifyReportDS };