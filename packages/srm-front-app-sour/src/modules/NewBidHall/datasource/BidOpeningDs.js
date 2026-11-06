
function bidOpeningDs (id) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/members/${id}`,
        method: "get",
      },
    },
  };
}

function bidOpeningViewDataSet () {
  const organizationId = window.localStorage.getItem("organizationId");
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${organizationId}/rfx/suppliers/open-quotation-table`,
        method: "post",
      },
    },
  };
}

/**
 * // 外部采购方
 url = `${SRM_SSRC}/v2/${organizationId}/rfx/quotation/header/record/pur-query/quotation-line`;
 * */
function quotationDetailLineDataSet () {
  const organizationId = window.localStorage.getItem("organizationId");
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v2/${organizationId}/rfx/quotation/header/record/pur-query/quotation-line`,
        method: "get",
      },
    },
  };
}

export {
  bidOpeningDs,
  bidOpeningViewDataSet,
  quotationDetailLineDataSet,
};