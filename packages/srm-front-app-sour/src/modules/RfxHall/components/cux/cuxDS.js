import { $T } from "srm-mobile-ui";

function shanyingSupplierTableDS() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    fields:[
      {
        fieldName: $T("ssrc.common.supplierNum").$D("供应商编码"),
        fieldCode:"supplierCompanyNum",
      },
      {
        fieldName: $T("ssrc.common.supplierName").$D("供应商名称"),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("sscux.ssrc.shanying.view.quotationHeaderStatus").$D("供应商头状态"),
        fieldCode: "supplierStatus",
      },
    ],
  };
}

export { shanyingSupplierTableDS };
