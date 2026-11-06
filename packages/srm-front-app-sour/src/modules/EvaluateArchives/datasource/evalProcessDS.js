import { $T, SrmUtil } from "srm-mobile-ui";

function evalProcessDS(evalDtlId = 0) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    pathParameter: {
      evalDtlId,
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "paramDescription",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evalDocManage.paramName").$D("参数名称"),
      },
      {
        fieldCode: "paramValue",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.evalDocManage.calculatedValue").$D("计算值"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/kpi-eval-processs/{evalDtlId}",
        method: "get",
      },
    },
  };
}

export default evalProcessDS;
