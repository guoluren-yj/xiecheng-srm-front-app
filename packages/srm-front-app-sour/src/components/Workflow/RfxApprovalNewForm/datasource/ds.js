function sectionDs () {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function sectionItemDs (id) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    pageSize: 5,
    showTotalCount: false,
    queryParameter: {
      // customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.ITEM_LINE",
      customizeUnitCode: "SMBL.WORKFLOW.RFX_APPROVAL_NEW.RFXITEMLINES"
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/items?rfxHeaderId=${id}`,
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
    selection: Infinity,
    queryParameter: {
      pageSize: 5,
      showTotalCount: false,
    },
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
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function scoreIndicDs () {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function indicsInfoDs () {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function technologyIndicDs () {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function businessIndicDs () {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function itemDs (hid, projectLineSectionId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/items/${hid}${projectLineSectionId ? `/${projectLineSectionId}` : ""}`,
        method: "get",
      },
    },
  };
}

function allocatedExpertDs (params) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      ...params
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/evaluate-indic-assigns`,
        method: "get",
      },
    },
  };
}

function allocatedItemDs (params) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      ...params
    },
    transport: {
      read: {
        // url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/evaluate-indic-assigns`,
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/item-sup-assign/items`,
        method: "get",
      },
    },
  };
}

function scoringElementDs (id) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/prequal/${id}/score-indic`,
        method: "get",
      },
    },
  };
}

// 评分要素细项
function scoringElementDetailDs (params) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      ...params,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/score-indicate`,
        method: "get",
      },
    },
  };
}

export {
  sectionDs,
  sectionItemDs,
  supplierInfoDs,
  expertInfoDs,
  scoreIndicDs,
  indicsInfoDs,
  technologyIndicDs,
  businessIndicDs,
  itemDs,
  allocatedExpertDs,
  allocatedItemDs,
  scoringElementDs,
  scoringElementDetailDs
};
