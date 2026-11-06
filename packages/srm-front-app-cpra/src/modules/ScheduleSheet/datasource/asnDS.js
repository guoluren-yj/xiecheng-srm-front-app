import { SrmUtil, $T } from "srm-mobile-ui";

function asnDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "asnNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.slNum").$D("送货单号"),
      },
      {
        fieldCode: "displayAsnLineNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.lineNum").$D("行号"),
      },
      {
        fieldCode: "shipQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("sodr.common.model.common.fyNum").$D("发运数量"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.uomCode").$D("单位"),
      },
      {
        fieldCode: "shipDate",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.fhDate").$D("发货日期"),
      },
      {
        fieldCode: "asnStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.status").$D("状态"),
      },
    ],
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/plans/query/relationAsnDetail/{poLineLocationId}",
        method: "get",
      },
    },
  };
}

export default asnDS;
