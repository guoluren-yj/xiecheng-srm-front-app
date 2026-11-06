// 通用ds
function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

// 基础信息
function basisDs (sourceProjectId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode:"SSRC.PROJECT_SETUP_DETAIL.BASEINFOS",
      page: 0,
      size: 10,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/${sourceProjectId}`,
        method: "get",
      },
    },
  };
}

// 供应商信息
function supplierDs (sourceProjectId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode:"SSRC.PROJECT_SETUP_DETAIL.LINE_SUPPLIER",
      page: 0,
      size: 10000,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/${sourceProjectId}/suppliers`,
        method: "get",
      },
    },
  };
}

// 项目阶段
function planDs (sourceProjectId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode:"SSRC.PROJECT_SETUP_DETAIL.LINE_PLAN",
      page: 0,
      size: 10000,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/${sourceProjectId}/plans`,
        method: "get",
      },
    },
  };
}

// 标段/包信息
function sectionDs (sourceProjectId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      page: 0,
      size: 10000,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/project-line-sections/${sourceProjectId}`,
        method: "get",
      },
    },
  };
}

// 标段/包-物料信息
function sectionItemDs (sourceProjectId, projectLineSectionId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    pageSize: 10,
    paging: true,
    showTotalCount: true,
    hasMore: true,
    queryParameter: {
      tenantId: window.localStorage.getItem("tenantId"),
      projectLineSectionId: projectLineSectionId,
      // page: 0,
      // size: 10,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/${sourceProjectId}/items`,
        method: "get",
      },
    },
  };
}

// 物料信息
function itemDs (sourceProjectId) {
  return {
    autoQuery: true,
    selection: 0,
    paging: true,
    pageSize: 10,
    editable: false,
    hasMore: true,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode:"SSRC.PROJECT_SETUP_DETAIL.LINE_ITEM",
      // page: 0,
      // size: 10,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/${sourceProjectId}/items`,
        method: "get",
      },
    },
  };
}

// 报价明细信息
function quotaionDetailDs (sourceProjectId, itemCategoryId, itemId, quotationTemplateId, projectLineItemId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      itemCategoryId:itemCategoryId,
      itemId:itemId,
      quotationTemplateId:quotationTemplateId,
      rfxLineItemId:projectLineItemId,
      sourceFrom:"PROJECT",
      page: 0,
      size: 10000,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rfx/${sourceProjectId}/quotationTemplate/view`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  basisDs,
  supplierDs,
  planDs,
  sectionDs,
  sectionItemDs,
  quotaionDetailDs,
  itemDs
};
