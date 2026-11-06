
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
function basisDs ({ sourceProjectId, customizeUnitCode }) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    paging: false,
    queryParameter: {
      customizeUnitCode,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/project/close/detail/${sourceProjectId}`,
        method: "get",
      },
    },
  };
}

// 关联单据
function relatedDocumentDs ({ sourceProjectId, customizeUnitCode }) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    paging: true,
    pageSize: 5,
    hasMore: true,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/project/close/relation/document/${sourceProjectId}`,
        method: "get",
      },
    },
  };
}

// 物料信息 || 标段物料信息
function itemDs ({ sourceProjectId, customizeUnitCode, projectLineSectionId }) {
  return {
    autoQuery: false,
    paging: true,
    pageSize: 5,
    editable: false,
    hasMore: true,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode,
      projectLineSectionId,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/${sourceProjectId}/items`,
        method: "get",
      },
    },
  };
}

// 标段/包信息
function sectionDs ({ sourceProjectId, customizeUnitCode }) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    paging: true,
    pageSize: 5,
    hasMore: true,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/project-line-sections/${sourceProjectId}`,
        method: "get",
      },
    },
  };
}

function itemDetailDs () {
  return {
    autoQuery: false,
    editable: false,
    hasMore: false,
    enableQuery: false,
  };
}

// 对供应商要求
function supplierLineTableDS({ sourceProjectId, customizeUnitCode }) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    paging: true,
    pageSize: 5,
    hasMore: true,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/${sourceProjectId}/suppliers`,
        method: "GET",
      },
    },
  };
}

// 项目计划
function planLineTableDS({ sourceProjectId, customizeUnitCode }) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    paging: true,
    pageSize: 5,
    hasMore: true,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/source-projects/${sourceProjectId}/plans`,
        method: "GET",
      },
    },
  };
}

export {
  commonDs,
  basisDs,
  relatedDocumentDs,
  itemDs,
  sectionDs,
  itemDetailDs,
  supplierLineTableDS,
  planLineTableDS,
};
