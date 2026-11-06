import { SrmUtil, $T } from "srm-mobile-ui";

const prefix = "scux.contractorAssessKpi.created";

function lineInfoDs(planSummaryId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    // queryParameter: {
    //   ...params
    // },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "serialNumber",
        fieldType: "TEXT",
        fieldName: $T(`${prefix}.model.serialNumber`).$D("序号"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T(`${prefix}.model.companyName`).$D("公司"),
      },
      {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: $T(`${prefix}.model.ouName`).$D("业务实体"),
      },
      {
        fieldCode: "unitName",
        fieldType: "TEXT",
        fieldName: $T(`${prefix}.model.unitName`).$D("部门"),
      },
      {
        fieldCode: "tenDaysPlanMeaning",
        fieldType: "TEXT",
        fieldName: $T(`${prefix}.model.tenDaysPlan`).$D("旬计划"),
      },
      {
        fieldCode: "settlementModeMeaning",
        fieldType: "TEXT",
        fieldName: $T(`${prefix}.model.settlementMode`).$D("结算方式"),
      },
      {
        fieldCode: "categoryNameMeaning",
        fieldType: "TEXT",
        fieldName: $T(`${prefix}.model.categoryName`).$D("类别名称"),
      },
      {
        fieldCode: "planAmount",
        fieldType: "TEXT",
        fieldName: $T(`${prefix}.model.planAmount`).$D("计划金额"),
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/yx-capital-plan-sum/line-detail-list/${planSummaryId}`,
        method: "get",
      },
    },
  };
}

function lineDetailDs(sumDetailId, queryFields) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: true,
    queryFields,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "planApplyNum",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.planApplyNum`).$D("资金单号"),
      },
      {
        fieldCode: "serialNumber",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.serialNumber`).$D("行号"),
      },
      {
        fieldCode: "capitalMonth",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.capitalMonth`).$D("月份"),
      },
      {
        fieldCode: "tenDaysPlanMeaning",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.tenDaysPlan`).$D("旬计划"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.companyName`).$D("公司"),
      },
      {
        fieldCode: "purchaseOrganizationName",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.purchaseOrganizationName`).$D(
        //   "采购组织"
        // ),
      },
      {
        fieldCode: "createUnitName",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.createUnitName`).$D("创建部门"),
      },
      {
        fieldCode: "planAmount",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.planAmount`).$D("计划金额"),
      },
      {
        fieldCode: "settlementModeMeaning",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.settlementMode`).$D("结算方式"),
      },
      {
        fieldCode: "categoryNameMeaning",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.categoryName`).$D("类别名称"),
      },
      {
        fieldCode: "createPerson",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.createPerson`).$D("创建人"),
      },
      {
        fieldCode: "sourceModeMeaning",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.sourceMode`).$D("来源方式"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.creationDate`).$D("创建日期"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        // fieldName: $T(`${prefix}.model.remark`).$D("说明"),
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/yx-capital-plan-sum/sum-review-apply/${sumDetailId}`,
        method: "get",
      },
    },
  };
}

function lineReviewDs(applyDetailId, queryFields) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: true,
    queryFields,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "settleNum",
      },
      {
        fieldCode: "pcNum",
      },
      {
        fieldCode: "documentTypeMeaning",
      },
      {
        fieldCode: "paymentTypeName",
      },
      {
        fieldCode: "initalPaymentAmount",
      },
      {
        fieldCode: "companyName",
      },
      {
        fieldCode: "ouName",
      },
      {
        fieldCode: "supplierCompanyName",
      },
      {
        fieldCode: "unitName",
      },
      {
        fieldCode: "agentName",
      },
      {
        fieldCode: "createName",
      },
      {
        fieldCode: "creationDate",
      },
      {
        fieldCode: "comments",
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/yx-capital-plan-sum/apply-review-payment/${applyDetailId}`,
        method: "get",
      },
    },
  };
}

export { lineInfoDs, lineDetailDs, lineReviewDs };
