function lineInfoIndexDs(quotationHeaderId, editFlag, rfxHeaderId = '', switchUrl = '', supplierCompanyId = '') {
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
      rfxHeaderId,
      quotationHeaderId,
      supplierCompanyId,
    },
    transport: {
      read: {
        url: Number(switchUrl) === 2 ? `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/tender/${rfxHeaderId}/items` : `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/${rfxHeaderId}/items`,
        method: "get",
      },
    },
  };
}

export default lineInfoIndexDs;
