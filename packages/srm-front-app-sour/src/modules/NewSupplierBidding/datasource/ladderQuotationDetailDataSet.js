import { $T } from "srm-mobile-ui";
export default function ladderQuotationDS(type, quotationLineId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    forceValidate:true,
    data: [],
    queryParameter: {
    },
    fields:[
      {
        fieldName:$T("ssrc.supplierQuotation.model.supQuo.unitPrice").$D("单价"),
        fieldCode: "currentLadderPrice",
        validate:(val) => {
          if (!val) {
            return false;
          }
        }
      }
    ],
    transport: {
      read: {
        url: type ? `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/${quotationLineId}/ladder-inquiry` : `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/${quotationLineId}/ladder-quotation`,
        method: "get",
      },
    },
  };
}
