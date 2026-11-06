
import { SrmUtil } from "srm-mobile-ui";

function scoreDetailDs() {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {},
    queryFields: [],
  };
}

function scoreSumDs() {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {},
    queryFields: [],
  };
}

function scoreVendorDs(id) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {},
    transport: {
      read: {
        url: `sslm/v1/${SrmUtil.getTenantId()}/eval-headers/eval-suppliers-dis/${id}`,
        method: "get",
      },
    },
  };
}

function scorerDs(id) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {},
    transport: {
      read: {
        url: `sslm/v1/${SrmUtil.getTenantId()}/eval-dtl-resps/${id}`,
        method: "get",
      },
    },
  };
}

function evaluationStatusDs(id) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {},
    transport: {
      read: {
        url: `sslm/v1/${SrmUtil.getTenantId()}/eval-dtl-resps/${id}`,
        method: "get",
      },
    },
  };
}

function sumScoreDs(id) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {},
    transport: {
      read: {
        url: `sslm/v1/${SrmUtil.getTenantId()}/eval-dtls/${id}`,
        method: "get",
      },
    },
  };
}

function orderDs() {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {},
  };
}

function qectificationDocDs(id, params) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      ...params
    },
    transport: {
      read: {
        url: `sslm/v1/${SrmUtil.getTenantId()}/site_eval_external_orders/${id}`,
        method: "get",
      },
    },
  };
}

function categoryAndItemDs() {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {},
  };
}

function attachDs(id) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {},
    transport: {
      read: {
        url: `sslm/v1/${SrmUtil.getTenantId()}/kpi-eval-header-atts?evalHeaderId=${id}`,
        method: "get",
      },
    },
  };
}

function complaintDs(evalHeaderId, evalLineIDS) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
    },
    bodyParameter: {
      evalLineIDS:evalLineIDS
    },
    transport: {
      read: {
        url: `sslm/v1/${SrmUtil.getTenantId()}/eval-line/appeal/${evalHeaderId}`,
        method: "POST",
      },
    },
  };
}

export { scoreDetailDs, scoreSumDs, scoreVendorDs, scorerDs, evaluationStatusDs, sumScoreDs, orderDs, qectificationDocDs, categoryAndItemDs, attachDs, complaintDs };
