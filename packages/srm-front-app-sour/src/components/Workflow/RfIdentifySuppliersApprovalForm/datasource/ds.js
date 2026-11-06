// 基本信息
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

// 基本信息
function basicDs ({ rfHeaderId, customizeUnitCode = "", } = {}) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rf/${rfHeaderId}`,
        method: "get",
      },
    },
  };
}

// 供应商信息
function supplierDs ({ rfHeaderId, customizeUnitCode = "", } = {}) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode,
      page: 0,
      size: 10000,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rf/check/${rfHeaderId}/supplier`,
        method: "get",
      },
    },
  };
}

// 报价明细信息
function quotationDs ({ rfHeaderId, customizeUnitCode = "", } = {}) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    pageSize: 5,
    queryParameter: {
      customizeUnitCode,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rf/quotation/${rfHeaderId}/check/lines`,
        method: "get",
      },
    },
  };
}

// 附件信息
function attachmentDs (attachmentUUID) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      attachmentUUID: attachmentUUID,
      bucketName: "private-bucket",
      directory: "ssrc-rfi-rfiheader",
      tenantId: window.localStorage.getItem("tenantId")
    },
    transport: {
      read: {
        url: `/hfle/v1/${window.localStorage.getItem("organizationId")}/files/${attachmentUUID}/file`,
        method: "get",
      },
    },
  };
}

// 阶梯报价信息
function ladderDs ({ quotationLineId, customizeUnitCode = "" } = {}) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      quotationLineId,
      page: 0,
      size: 10000,
      customizeUnitCode,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${window.localStorage.getItem("organizationId")}/rf-ladder-quotations/${quotationLineId}`,
        method: "get",
      },
    },
  };
}

export {
  basicDs,
  supplierDs,
  quotationDs,
  attachmentDs,
  commonDs,
  ladderDs,
};
