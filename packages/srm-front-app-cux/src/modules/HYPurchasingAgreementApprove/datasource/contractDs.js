import { $T } from "srm-mobile-ui";

function frameworkContractDs() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    forceValidate:true,
    fields: [
      {
        fieldCode: "pcName",
        fieldName: $T("scux.bidEvaluationReport.view.title.pcName").$D("合同名称"),
      },
      {
        fieldCode: "pcNum",
        fieldName: $T("scux.bidEvaluationReport.view.title.pcNum").$D("合同编号"),
      },
    ],
    transport: {
      read: {
        url:`/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/AicDuMeuEVa9UAksjdicgEapiaOgIxL4riccW6wq0bWt2d8`,
        method: "get",
      },
    },
  };
}

export { frameworkContractDs };