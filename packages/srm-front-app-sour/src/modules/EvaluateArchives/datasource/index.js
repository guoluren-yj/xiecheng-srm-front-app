import { $T, SrmUtil } from "srm-mobile-ui";

function evalListDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SSLM.ARCHIVE_FILLING_HEADER.FILTER",
      pageEntryPoint: "CUSTOMER_OWNED",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "evalNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.fileCode").$D("档案编码"),
      },
      {
        fieldCode: "evalStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.status").$D("档案状态"),
      },
      {
        fieldCode: "evalName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.describe").$D("档案描述"),
      },
      {
        fieldCode: "evalTplName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.template").$D("考评模板"),
      },
      {
        fieldCode: "kpiMethod",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.kpiMethod").$D("考评方式"),
      },
      {
        fieldCode: "evalCycleMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.cycle").$D("考评周期"),
      },
      {
        fieldCode: "evalDateFrom",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.date.after").$D("考评日期从"),
        render: (val) => val && val.substring(0, 10)
      },
      {
        fieldCode: "evalDateTo",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.date.before").$D("考评日期至"),
        render: (val) => val && val.substring(0, 10)
      },
      {
        fieldCode: "evalDimensionMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.dimension").$D("考评维度"),
      },
      {
        fieldCode: "evalDimensionValueMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.evaluation.dimensionValue").$D("维度值"),
      },
      {
        fieldCode: "processUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.charger").$D("考评负责人"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.create.time").$D("建档时间"),
      },
      {
        fieldCode: "evalRuleRemark",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.rule").$D("考评规则说明"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.evaluationRemark").$D("考评备注说明"),
      },
      {
        fieldCode: "totalAttachment",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.appraisalAttachment").$D("考评附件"),
      },
    ],
    fastQueryField: {
      fieldCode: "evalName",
      fieldType: "TEXT",
      fieldName: $T("sslm.common.model.archive.describe").$D("档案描述"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "evalNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.fileCode").$D("档案编码"),
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("sslm.common.view.company.name").$D("公司"),
        lovCode: "HPFM.COMPANY",
      },
      {
        fieldCode: "evalCycle",
        fieldType: "SELECT",
        fieldName: $T("sslm.common.model.archive.evaluation.cycle").$D("考评周期"),
        lovCode: "SSLM.KPI_EVAL_CYCLE",
      },
      {
        fieldCode: "creationDateFrom",
        fieldType: "DATE_PICKER",
        fieldName: $T("sslm.common.model.archive.filingDateFrom").$D("建档日期从"),
      },
      {
        fieldCode: "creationDateTo",
        fieldType: "DATE_PICKER",
        fieldName: $T("sslm.common.model.archive.filingDateTo").$D("建档日期至"),
      },
      {
        fieldCode: "evalTplCode",
        fieldType: "LOV",
        fieldName: $T("sslm.common.model.archive.evaluation.evalTplName").$D("考评模板"),
        lovCode: "SSLM.KPI_EVAL_CODE",
        options: {
          valueField: "evalTplCode",
        }
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-headers/evaluating",
        method: "get",
      },
    },
  };
}

export default evalListDS;
