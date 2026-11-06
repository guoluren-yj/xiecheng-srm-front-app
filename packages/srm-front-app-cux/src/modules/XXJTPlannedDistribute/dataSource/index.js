import { SrmUtil, $T } from "srm-mobile-ui";

function bidInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    fastQueryField: {
      fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.biddingNum").$D("招标计划单号"),
      fieldCode: "biddingNum",
      fieldType: "TEXT",
    },
    fields: [
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.ouName").$D("项目公司"),
        fieldCode: "ouName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.subjectName").$D("项目名称"),
        fieldCode: "subjectName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.budgetAmout").$D("预算金额(万元)"),
        fieldCode: "budgetAmout",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.unitCodeMeaning").$D("招标部门"),
        fieldType: "TEXT",
        fieldCode: "unitCodeMeaning",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.employeeName").$D("招标经理"),
        fieldType: "TEXT",
        fieldCode: "employeeName",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.biddingPlanTime").$D("计划开标时间"),
        fieldCode: "biddingPlanTime",
        fieldType: "TEXT",
      },
    ],
    queryFields: [
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.ouId").$D("项目公司"),
        fieldCode: "ouId",
        fieldType: "LOV",
        lovCode: "SCUX.SPFM.USER_AUTH.OU_CODE",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.subjectName").$D("项目名称"),
        fieldCode: "subjectName",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/3MHQPwE9BbIOOSKb93UDXuNiaOJbkGhS3AyC9zgD9OG7Yr6sAIsTSWqr6RXiaf8997?type=planDistribution`,
        method: "get",
      },
    },
  };
}

function headerDs() {
  return {
    autoQuery: false,
    fields: [
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.biddingNum").$D("招标计划单号"),
        fieldCode: "biddingNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.ouName").$D("项目公司"),
        fieldCode: "ouName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.subjectName").$D("项目名称"),
        fieldCode: "subjectName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.biddStatus").$D("状态"),
        fieldCode: "biddStatusMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.sectorMeaning").$D("所属板块"),
        fieldCode: "sectorMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.opeOrInfMeaning").$D("运营/基建"),
        fieldCode: "opeOrInfMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.bidCatMeaning").$D("招议标方式"),
        fieldCode: "bidCatMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.targetTypeMeaning").$D("招标类型"),
        fieldCode: "targetTypeMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.biddingPlanTime").$D("计划开标时间"),
        fieldCode: "biddingPlanTime",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.budgetAmout").$D("预算金额(万元)"),
        fieldCode: "budgetAmout",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.budgetSourceMeaning").$D("预算金额来源"),
        fieldCode: "budgetSourceMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.createdByMeaning").$D("创建人"),
        fieldCode: "createdByMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.projectManager").$D("经办人"),
        fieldCode: "projectManager",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.bidPlaceMeaning").$D("招标地点"),
        fieldCode: "bidPlaceMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.planMonth").$D("计划月份"),
        fieldCode: "planMonth",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.planTypeMeaning").$D("计划类型"),
        fieldCode: "planTypeMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.displayPrNumsMeaning").$D("关联采购申请"),
        fieldCode: "displayPrNumsMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.remark").$D("备注"),
        fieldCode: "remark",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.unitCodeMeaning").$D("招标部门"),
        fieldType: "TEXT",
        fieldCode: "unitCodeMeaning",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.employeeName").$D("招标经理"),
        fieldType: "TEXT",
        fieldCode: "employeeName",
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.reviewComments").$D("审批意见"),
        fieldCode: "reviewComments",
        fieldType: "TEXT",
      },
      {
        fieldCode: "operatingrecord",
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.record").$D("操作记录"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/3MHQPwE9BbIOOSKb93UDXuNiaOJbkGhS3AyC9zgD9OG7Yr6sAIsTSWqr6RXiaf8997?type=planDistribution`,
        method: "get",
      },
    },
  };
}

function distributeDs() {
  return {
    autoQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.unitIdLov").$D("招标部门"),
        fieldCode: "unitIdLov",
        lovCode: "SCUX.XXJT.BID_DEPARTMENT",
        fieldType: "LOV",
        options: {
          valueField: "unitCode",
          displayField: "unitName",
          subDisplayField: "unitCodeMeaning",
        },
        required: true,
      },
      {
        fieldName: $T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.employeeIdLov").$D("招标经理"),
        fieldCode: "employeeIdLov",
        lovCode: "SCUX.XXJT.BID_MANAGER",
        fieldType: "LOV",
        required: true,
      },
    ],
  };
}

export { bidInfoDs, headerDs, distributeDs };
