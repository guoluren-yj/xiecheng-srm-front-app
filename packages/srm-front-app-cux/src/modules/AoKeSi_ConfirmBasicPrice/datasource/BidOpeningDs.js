
function bidOpeningDs (id) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.OPEN_BID_DETAIL_TABLE",
      rfxRole: "OPENED_BY",
    },
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/members/${id}`,
        method: "get",
      },
    },
  };
}

export {
  bidOpeningDs,
};