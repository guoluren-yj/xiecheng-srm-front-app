import { $T, SrmUtil } from "srm-mobile-ui";
import { getKpiAutoConfigs } from "../api";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";
const valueSet = {};
SrmUtil.getValueSetBatch({
  kpiCycle: "SSLM.KPI_EVAL_CYCLE",
  kpiDimension: "SSLM.KPI_EVAL_DIMENSION",
}, valueSet);

const lovMap = {
  GROUP: "SSLM.KPI_EVAL_DIM_GROUP",
  COMPANY: "SSLM.KPI_EVAL_DIM_COMPANY",
  PU: "SSLM.KPI_EVAL_DIM_PURORG",
  IU: "SSLM.KPI_EVAL_DIM_INVORG",
};

const getEvalEndDate = (evalDateFrom, evalCycle) => {
  switch (evalCycle) {
  case "MONTH":
    return moment(evalDateFrom, dateFormat).add(1, "M").subtract(1, "days").format(dateFormat);
  case "QUARTER":
    return moment(evalDateFrom, dateFormat).add(3, "M").subtract(1, "days").format(dateFormat);
  case "HALF-YEAR":
    return moment(evalDateFrom, dateFormat).add(6, "M").subtract(1, "days").format(dateFormat);
  case "YEAR":
    return moment(evalDateFrom, dateFormat).add(12, "M").subtract(1, "days").format(dateFormat);
  default:
    return evalDateFrom;
  }
};

function manageDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SSLM.EVALUATION_DOC_MANAGE_LIST.FILTER,SSLM.EVALUATION_DOC_MANAGE_LIST.LIST",
      tenantId: SrmUtil.getTenantId(),
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
        fieldType: "INPUT",
        fieldName: $T("sslm.common.model.archive.describe").$D("档案描述"),
        editor: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
        required: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
      },
      {
        fieldCode: "evalTplName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.template").$D("考评模板"),
      },
      {
        fieldCode: "evalTplId",
        fieldType: "LOV",
        fieldName: $T("sslm.common.model.evaluation.template").$D("考评模板"),
        lovCode: "SSLM.KPI_EVAL_TPL",
        displayField: "evalTplName",
        options: {
          subDisplayField: "evalTplCode",
          queryParams: {
            evalFlag: 1
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("evalDimensionMeaning", valueSet.kpiDimension[val[0].evalDimension]);
              ds.current.setField("evalDimension", val[0].evalDimension);
              ds.current.setField("evalDimensionValueMeaning", val[0].evalDimensionValueMeaning);
              ds.current.setField("evalDimensionValue", val[0].evalDimensionValue);
              ds.current.setField("trxLineFlag", val[0].trxLineFlag);
              const evalDimension = val[0].evalDimension;
              const lovCode = lovMap[evalDimension];
              const evalDimensionValue = ds.current.getField("evalDimensionValue");
              evalDimensionValue.lovCode = lovCode;
              evalDimensionValue.addLovParam("evalTplId", val[0].evalTplId);
              getKpiAutoConfigs(val[0].evalTplId).then((res) => {
                ds.current.setField("evalName", res.evalName || ds.current.get("evalName"));
                ds.current.setField("evalCycle", res.evalCycle);
                ds.current.setField("evalCycleMeaning", valueSet.kpiCycle[res.evalCycle]);
                ds.current.setField("evalDateFrom", res.evalDateFrom);
                ds.current.setField("evalDateTo", res.evalDateTo);
              });
            }
          },
        },
        editor: (val, item) => !item.evalHeaderId,
        required: (val, item) => !item.evalHeaderId,
      },
      {
        fieldCode: "kpiMethod",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.kpiMethod").$D("考评方式"),
      },
      {
        fieldCode: "evalCycle",
        fieldType: "SELECT",
        fieldName: $T("sslm.common.model.evaluation.cycle").$D("考评周期"),
        displayField: "evalCycleMeaning",
        lovCode: "SSLM.KPI_EVAL_CYCLE",
        editor: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
        required: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
        options: {
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              const evalCycle = val[0].value;
              const evalDateFrom = ds.current.get("evalDateFrom");
              if (!evalDateFrom) {
                return;
              }
              let evalDateTo = getEvalEndDate(evalDateFrom, evalCycle);
              ds.current.setField("evalDateTo", evalDateTo);
            }
          }
        }
      },
      {
        fieldCode: "evalCycleMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.cycle").$D("考评周期"),
      },
      {
        fieldCode: "evalDateFrom",
        fieldType: "DATE_PICKER",
        fieldName: $T("sslm.common.model.evaluation.date.after").$D("考评日期从"),
        editor: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
        required: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
        options: {
          callback: (val, endDate, ds) => {
            const evalCycle = ds.current.get("evalCycle");
            const evalDateFrom = val;
            if (!evalCycle) {
              return;
            }
            let evalDateTo = getEvalEndDate(evalDateFrom, evalCycle);
            ds.current.setField("evalDateTo", evalDateTo);
          },
        }
      },
      {
        fieldCode: "evalDateTo",
        fieldName: $T("sslm.common.model.evaluation.date.before").$D("考评日期至"),
        fieldType: "DATE_PICKER",
        editor: false,
        required: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
      },
      {
        fieldCode: "evalDimensionMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.dimension").$D("考评维度"),
      },
      {
        fieldCode: "evalDimension",
        fieldType: "SELECT",
        displayField: "evalDimensionMeaning",
        fieldName: $T("sslm.common.model.evaluation.dimension").$D("考评维度"),
        lovCode: "SSLM.KPI_EVAL_DIMENSION",
        editor: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
        required: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
        options: {
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              const evalDimension = val[0].value;
              const lovCode = lovMap[evalDimension];
              const evalDimensionValue = ds.current.getField("evalDimensionValue");
              const evalDimensionValueMeaning = ds.current.getField("evalDimensionValueMeaning");
              evalDimensionValue.lovCode = lovCode;
              evalDimensionValue.addLovParam("evalTplId", ds.current.get("evalTplId"));
              if (evalDimension === "GROUP") {
                evalDimensionValueMeaning.setData(ds.current.get("defaultGroup").groupName);
                evalDimensionValue.setData(ds.current.get("defaultGroup").groupId);
              } else {
                evalDimensionValueMeaning.setData(null);
                evalDimensionValue.setData(null);
              }
              if (evalDimension === "COMPANY") {
                evalDimensionValue.options.displayField = "companyName";
                evalDimensionValue.options.subDisplayField = "companyNum";
                const docNum = ds.current.getField("docNum");
                docNum.addLovParam("companyId", evalDimension);
              } else if (evalDimension === "GROUP") {
                evalDimensionValue.options.displayField = "groupName";
                evalDimensionValue.options.subDisplayField = "groupNum";
              } else if ([ "PU", "IU" ].includes(evalDimension)) {
                evalDimensionValue.options.displayField = "organizationName";
                evalDimensionValue.options.subDisplayField = "organizationCode";
              }
            }
          },
          onClear: (ds) => {
            const evalDimensionValue = ds.current.getField("evalDimensionValue");
            const evalDimensionValueMeaning = ds.current.getField("evalDimensionValueMeaning");
            evalDimensionValue.setData(null);
            evalDimensionValueMeaning.setData(null);
          }
        }
      },
      {
        fieldCode: "evalDimensionValue",
        fieldType: "LOV",
        displayField: "evalDimensionValueMeaning",
        fieldName: $T("sslm.common.model.archive.evaluation.dimensionValue").$D("维度值"),
        required: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
        editor: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
      },
      {
        fieldCode: "evalDimensionValueMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.evaluation.dimensionValue").$D("维度值"),
      },
      {
        fieldCode: "processUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.evaluation.charger").$D("系统计算人"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archive.create.time").$D("建档时间"),
      },
      {
        fieldCode: "evalRuleRemark",
        fieldName: $T("sslm.common.model.evaluation.rule").$D("考评规则说明"),
        fieldType: "TEXT_AREA",
        editor: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
      },
      {
        fieldCode: "remark",
        fieldName: $T("sslm.common.model.evaluation.evaluationRemark").$D("考评备注说明"),
        fieldType: "TEXT_AREA",
        editor: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
      },
      {
        fieldCode: "totalAttachment",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evaluation.appraisalAttachment").$D("考评附件"),
      },
      {
        fieldCode: "processUnitId",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evaluationDepart").$D("考评负责人部门"),
        displayField: "processUnitName",
        lovCode: "SPRM.USER_UNIT",
        editor: (val, item) => !item.evalHeaderId || item.evalStatus === "NEW",
        options: {
          subDisplayField: "unitCode",
          displayField: "unitName",
        }
      },
      {
        fieldCode: "autoPushVendorFlageMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.evalDocManage.publishToSupplier").$D("审批后自动发布至供应商"),
        visible: (val, item) => [ "APPROVING", "PUBLISHED", "COMPLETED" ].includes(item.evalStatus),
      },
      {
        fieldCode: "trxLineFlag",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evaluateScope").$D("选择参评供应商范围"),
        render: (val, item) => item.trxLineFlagMeaning,
      },
      {
        fieldCode: "docType",
        fieldType: "SELECT",
        lovCode: "SSLM.EVAL.DOC_TYPE",
        fieldName: $T("sslm.supplierDocManage.model.evalDocManage.docType").$D("单据类型"),
        visible: (val, item) => item.evalTplType === "BDKPI_EVAL",
        options: {
          callback: (val, valueField, displayField, ds) => {
            if (val[0] && val[0][valueField] === "YS") {
              ds.current.getField("docNum").lovCode = "SPUC.RCV_TRX_HEADER";
            } else {
              ds.current.getField("docNum").lovCode = "SPCM.CONTRACT.HEAD.SUBJECT";
            }
          }
        }
      },
      {
        fieldCode: "docNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.evalDocManage.docNum").$D("单据"),
        visible: (val, item) => item.evalTplType === "BDKPI_EVAL",
        options: {
          multiple: true,
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
          }
        }
      },
      {
        fieldCode: "itemCategoryNames",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.supplierProduct").$D("供货品类"),
        visible: (val, item) => Number(item.trxLineFlag) === 4,
      },
      {
        fieldCode: "categoryDescriptions",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.evalDocManage.categoryDescriptions").$D("供应商分类"),
        visible: (val, item) => Number(item.trxLineFlag) === 3,
      },
      {
        fieldCode: "cooperationDays",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.evalDocManage.cooperationDay").$D("合作天数"),
        visible: (val, item) => 2 === Number(item.trxLineFlag),
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
        fieldCode: "evalStatus",
        fieldType: "SELECT",
        lovCode: "SSLM.KPI_EVAL_STATUS",
        fieldName: $T("sslm.common.model.archive.status").$D("档案状态"),
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
        url: "/sslm/v1/{tenantId}/eval-headers",
        method: "get",
      },
      submit: {
        url: "/sslm/v1/{tenantId}/eval-headers",
        method: "post",
      },
      update: {
        url: "/sslm/v1/{tenantId}/eval-headers",
        method: "put",
      },
      destroy: {
        url: "/sslm/v1/{tenantId}/eval-headers/logicDeleteForEval",
        method: "put",
      }
    },
    events: {
      afterQuery: (ds, data) => {
        setTimeout(() => {
          if (!ds.current) {
            return;
          }
          const evalDimension = ds.current.get("evalDimension");
          const lovCode = lovMap[evalDimension];
          const evalDimensionValue = ds.current.getField("evalDimensionValue");
          evalDimensionValue.lovCode = lovCode;
          evalDimensionValue.addLovParam("evalTplId", ds.current.get("evalTplId"));
        }, 0);
        return data;
      },
      beforeDelete: (ds, data) => (data || []).map((e) => e.evalHeaderId),
      beforeSubmit: (ds, data) => data[0],
      beforeUpdate: (ds, data) => data[0],
    }
  };
}

export default manageDS;
