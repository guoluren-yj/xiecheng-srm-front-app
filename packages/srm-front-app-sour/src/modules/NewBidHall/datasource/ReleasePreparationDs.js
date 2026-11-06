function sectionItemDs (documentType, id) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode: documentType === "BID" ? "SMBL.NEW_BID_HALL.RP.SECTIONITEM.BID" : "SMBL.NEW_BID_HALL.RP.SECTIONITEM.RFX",
    },
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/${id}/items`,
        method: "get",
      },
    },
  };
}

function supplierInfoDs (id) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.SUPPLIER.LINE",
    },
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/${id}/suppliers`,
        method: "get",
      },
    },
  };
}

function expertInfoDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    transport: {
    },
  };
}

function scoreIndicDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    transport: {
    },
  };
}

function indicsInfoDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    transport: {
    },
  };
}

function technologyIndicDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    transport: {
    },
  };
}

function businessIndicDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    transport: {
    },
  };
}

function expertAllocationDs (params) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {
      organizationId: window.localStorage.getItem("organizationId"),
      customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.SCORE.EXPERT_ASSIGN",
      ...params
    },
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/evaluate-indic-assigns`,
        method: "get",
      },
    },
  };
}

function scoringElementShowDs (params) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {
      ...params
    },
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/score-indicate`,
        method: "get",
      },
    },
  };
}

function filterMaterialDs (params) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {
      organizationId: window.localStorage.getItem("organizationId"),
      ...params
    },
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/item-sup-assign/items`,
        method: "get",
      },
    },
  };
}

function ladderQuotationDs (id) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {
    },
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/${id}/ladder-inquiry`,
        method: "get",
      },
    },
  };
}

function quotationDetailDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    transport: {
    },
  };
}

export {
  sectionItemDs,
  supplierInfoDs,
  expertInfoDs,
  scoreIndicDs,
  indicsInfoDs,
  technologyIndicDs,
  businessIndicDs,
  expertAllocationDs,
  scoringElementShowDs,
  filterMaterialDs,
  ladderQuotationDs,
  quotationDetailDs
};