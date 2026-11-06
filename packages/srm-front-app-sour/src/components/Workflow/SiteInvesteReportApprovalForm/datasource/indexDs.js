
import { SrmUtil } from "srm-mobile-ui";

function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function baseDs(params) {
  const { evalHeaderId } = params || {};
  return {
    selection: Infinity,
    pageSize: 10,
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SSLM_SITEINVESTIGATE_FILLING_DETAIL.BASICINFO"
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

function scorePeopleDataSet(params) {
  const { evalHeaderId, submitUserId } = params || {};
  return {
    selection: Infinity,
    pageSize: 10,
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      submitUserId: submitUserId,
      customizeUnitCode: "SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCORER_INFO"
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-resp-headers/get-resp-header/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

function scoreDataSet(params) {
  const { evalHeaderId, submitUserId } = params || {};
  return {
    selection: Infinity,
    pageSize: 10,
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      code: "COMPLETED",
      completeFlag: 0,
      submitUserId: submitUserId,
      customizeUnitCode: "SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCOREINFO,SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCORE_FILTER"
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-lines/${evalHeaderId}/evaluating`,
        method: "get",
      },
    },
  };
}

function inspectTeamDataSet(params) {
  const { evalHeaderId } = params || {};
  return {
    selection: Infinity,
    pageSize: 10,
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SSLM_SITEINVESTIGATEREPORT.INSPECTTEAM"
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-groups/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

function materialCategoryDataSet(params) {
  const { evalHeaderId } = params || {};
  return {
    selection: Infinity,
    pageSize: 10,
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SSLM_SITEINVESTIGATE_FILLING_DETAIL.CATEGORY"
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-item-cates/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

function attachmentDataSet(params) {
  const { evalHeaderId, uploadUserId } = params || {};
  return {
    selection: Infinity,
    pageSize: 10,
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO",
      uploadUserId: uploadUserId,
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-att-lns/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  baseDs,
  scorePeopleDataSet,
  scoreDataSet,
  inspectTeamDataSet,
  materialCategoryDataSet,
  attachmentDataSet,
};
