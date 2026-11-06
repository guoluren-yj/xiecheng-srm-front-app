function lineInfoIndexDs(rfxHeaderId, editFlag) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: editFlag,
    editFlag,
    // enableSelect: false,
    enableSelect: (record) => {
      const bargingFlag = record.dataSet.toData().some((item) => item.bargainFlag === 1) ? 1 : 0;
      return bargingFlag ? Boolean(!((record.data.quotationLineStatus !== "BARGAINED" &&
        !record.data.continuousQuotationFlag)) ||
        record.data.bargainStatus === "BARGAINING_ONLINE" && record.data.bargainFlag === 0 ||
        record.data.eliminateRoundNumber || record.data.abandonedFlag) : Boolean(!(!record.data.continuousQuotationFlag && record.data.quotationLineStatus === "SUBMITTED" || record.data.abandonedFlag ||
          record.data.eliminateRoundNumber));
    },
    enableQuery: false,
    data: [],
    fields: [],
    forceValidate: true,
    queryParameter: {
      customizeUnitCode: "SSRC.SUPPLIER_QUOTATION.LINE,SSRC.SUPPLIER_QUOTATION.LINE_FORM,SMBL.SUPPLIER_QUOTATION.TAB_SCROLL_LINE,SMBL.SUPPLIER_QUOTATION.BARGAIN_MATERIAL_DETIAL_NEW",
    },
    transport: {
      read: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/quotation/${rfxHeaderId}/lines`,
        method: "get",
      },
      create: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/quotation/${rfxHeaderId}/lines`,
        method: "post",
      },
      update: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/quotation/${rfxHeaderId}/lines`,
        method: "put",
      },
      destroy: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/quotation/${rfxHeaderId}/lines`,
        method: "delete",
      },
    },
  };
}

export default lineInfoIndexDs;
