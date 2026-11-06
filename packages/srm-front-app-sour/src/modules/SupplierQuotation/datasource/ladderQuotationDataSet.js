import { $T } from "srm-mobile-ui";
export default function ladderQuotationDS(type, quotationLineId, editFlag) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    editable: editFlag,
    editFlag,
    forceValidate:true,
    data: [],
    queryParameter: {
    },
    fields:[
      {
        fieldName:$T("ssrc.supplierQuotation.model.supQuo.unitPrice").$D("单价"),
        fieldCode: "currentLadderPrice",
        required:true,
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
      submit: {
        url: type ? `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/${quotationLineId}/ladder-inquiry` : `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/${quotationLineId}/ladder-quotation`,
        method: "post",
      },
      create: {
        url: type ? `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/${quotationLineId}/ladder-inquiry` : `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/${quotationLineId}/ladder-quotation`,
        method: "post",
      },
      update: {
        url: type ? `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/${quotationLineId}/ladder-inquiry` : `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/${quotationLineId}/ladder-quotation`,
        method: "put",
      },
      destroy: {
        url: type ? `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/${quotationLineId}/ladder-inquiry` : `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/${quotationLineId}/ladder-quotation`,
        method: "delete",
      },
    },
  };
}
