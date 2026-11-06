import { $T } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";
function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    // enableQuery: false,
    selection: Infinity,
    enableQuery: true,
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

// 管理ds
function getManageTableDs(tabCode) {
  const lovCodeList = {
    0: "SSLM_EVAL_REPORT_STATUS_PREPARE",
    1: "SSLM_EVAL_REPORT_STATUS_PROGRESSING",
    2: "SSLM_EVAL_REPORT_STATUS_COMPLETE",
    3: "SSLM_EVAL_REPORT_STATUS_BEW",
  };
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    queryParameter: {
      page: 0,
      size: 10,
    },
    fastQueryField: {
      fieldCode: "evalNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldName: $T("hzero.common.status").$D("状态"),
        fieldCode: "reportStatus",
        fieldType: "SELECT",
        lovCode: lovCodeList[tabCode],
        options: {
          displayField: "meaning", // 选择后展示值
          valueField: "value",
        },
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编号"),
        fieldCode: "evalNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalDescription").$D("评估报告描述"),
        fieldCode: "evalDescription",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.realName").$D("创建人"),
        fieldCode: "realName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.creationDate").$D("创建时间"),
        fieldCode: "creationDateFrom",
        endDateFieldCode: "creationDateTo",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.companyName").$D("公司"),
        fieldCode: "companyId",
        fieldType: "LOV",
        lovCode: "SPCM.USER_AUTH.COMPANY",
        displayField: "companyName",
        options: {
          displayField: "companyName", // 选择后展示值
          subDisplayField: "companyNum",
          valueField: "companyId",
        },
      },
      {
        fieldName: $T("sslm.common.model.supplierName").$D("供应商名称"),
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
      },
    ],
    fields: [
    ],
    events: {
    },
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/site-eval-headers/eval-report-header`,
        method: "get",
      },
    },
  };
}

// 评分ds
function getScoreTableDs(type) {
  let apiUrl = "";
  switch (type) {
  // 待评分
  case "waitScore":
    apiUrl = `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-headers/eval-report/evaluating`;
    break;
  // 全部
  case "all":
    apiUrl = `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-headers/all/evaluating`;
    break;
  default:
    break;
  }
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    queryParameter: {
      page: 0,
      size: 10,
    },
    fastQueryField: {
      fieldCode: "multiSelectReqNums",
      fieldType: "TEXT",
      fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldName: $T("hzero.common.status").$D("状态"),
        fieldCode: "reportStatus",
        fieldType: "SELECT",
        lovCode: "SSLM_EVAL_REPORT_STATUS_BEW",
        options: {
          displayField: "meaning", // 选择后展示值
          valueField: "value",
        },
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编号"),
        fieldCode: "multiSelectReqNums",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalDescription").$D("评估报告描述"),
        fieldCode: "evalDescription",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.realName").$D("创建人"),
        fieldCode: "realName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.creationDate").$D("创建时间"),
        fieldCode: "creationDateFrom",
        endDateFieldCode: "creationDateTo",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
      },
      {
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.companyName").$D("公司"),
        fieldCode: "companyId",
        fieldType: "LOV",
        lovCode: "SPCM.USER_AUTH.COMPANY",
        displayField: "companyName",
        options: {
          displayField: "companyName", // 选择后展示值
          subDisplayField: "companyNum",
          valueField: "companyId",
        },
      },
      {
        fieldName: $T("sslm.common.view.supplier.supplierCompany").$D("供应商"),
        fieldCode: "partnerCompanyId",
        fieldType: "LOV",
        lovCode: "SSLM.SITE_SUPPLIER",
        displayField: "partnerCompanyName",
        options: {
          displayField: "partnerCompanyName", // 选择后展示值
          subDisplayField: "partnerCompanyyNum",
          valueField: "partnerCompanyId",
        },
      },
    ],
    fields: [
    ],
    events: {
    },
    transport: {
      read: {
        url: apiUrl,
        method: "get",
      },
    },
  };
}

// 引用评估计划ds
function getEvalPlanDs() {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    queryParameter: {
      page: 0,
      size: 10,
      customizeFilterComparison: "executeStatus:IN",
      "executeStatus_range": "TO_BE_EVALUATED,EVAL_CANCEL",
      evalStatusCustoms: "PUBLISHED",
    },
    fastQueryField: {
      fieldCode: "evalNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编号"),
    },
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/eval-plan-lines`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  getManageTableDs,
  getScoreTableDs,
  getEvalPlanDs,
};
