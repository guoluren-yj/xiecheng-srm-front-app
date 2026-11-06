import { SrmUtil, $T } from "srm-mobile-ui";

function listDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    // table表单显示的字段
    fields: [
      {
        fieldCode: "evalName",
        fieldName: $T("scux.evaluation.model.evaluation.fileName").$D("档案名称"),
      },
      {
        fieldCode: "lineNum",
        fieldName: $T("scux.evaluation.model.evaluation.lineNum").$D("行号"),
      },
      {
        fieldCode: "lineScore",
        fieldName: $T("scux.myModoList.model.score").$D("得分"),
      },
      {
        fieldCode: "evalDimensionMeaning",
        fieldName: $T("scux.evaluation.model.evaluation.difficultyCheck").$D("考评维度"),
      },
      {
        fieldCode:"checkTypeMeaning",
        fieldName: $T("scux.evaluation.model.evaluation.checkType").$D("考评类型"),
      },
      {
        fieldCode: "evalCycleMeaning",
        fieldName: $T("scux.supplierEvaluationReport.model.evalCycleMeaning").$D("考评周期"),
      },
      {
        fieldCode: "contractName",
        fieldName: $T("scux.evaluation.model.evaluation.contractName").$D("合同名称"),
      },
      {
        fieldCode: "evalDateFrom",
        fieldName: $T("scux.evaluation.model.evalDateFrom").$D("考评日期从"),
      },
      {
        fieldCode: "evalDateTo",
        fieldName: $T("scux.evaluation.model.evalDateTo").$D("考评日期至"),
      },
    ],
    transport: {
      read: {
        url:`/scux/v1/${SrmUtil.getTenantId()}/hygy-perform-evaluation-lines/getLinelist/{headerId}`,
        method: "get",
      },
    },
  };
}

export default listDS;
