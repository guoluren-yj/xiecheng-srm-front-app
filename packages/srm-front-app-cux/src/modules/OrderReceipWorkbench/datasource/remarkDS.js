import { $T } from "srm-mobile-ui";

function remarkDS() {
  return {
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    fields: [
      {
        fieldCode: "cancelRemark",
        fieldType: "TEXT_AREA",
        required: true,
        fieldName: $T("scux.acceptBench.model.view.cancelReason").$D("取消原因"),
      },
    ],
  };

}

export { remarkDS };
