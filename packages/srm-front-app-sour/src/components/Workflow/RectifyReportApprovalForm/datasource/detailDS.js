import { SrmUtil } from "srm-mobile-ui";
import { getPcUnitCodeMap, getStateKeyMap } from "../utils";

const tenantId = SrmUtil.getTenantId();

export const headerDS = (problemHeaderId) => {
  const pcUnitCodeMap = getPcUnitCodeMap();
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    forceValidate: true,
    fields: [],
    queryParameter: {
      customizeUnitCode: [
        pcUnitCodeMap.basicInfo,
        pcUnitCodeMap.problemDesc,
        pcUnitCodeMap.congratulation,
        pcUnitCodeMap.effectTrack,
        pcUnitCodeMap.otherInfo,
        pcUnitCodeMap.customFormA,
        pcUnitCodeMap.customFormB,
        pcUnitCodeMap.customFormC,
      ].filter(Boolean).join(),
      menuEntryPoint: "CUSTOMER_OWNED",
    },
    transport: {
      read: {
        url: `/sqam/v1/${tenantId}/problem-headers/${problemHeaderId}/detail`,
        method: "get",
      },
    },
  };
};

export const relatedQIReportDS = (problemHeaderId) => ({
  autoQuery: false,
  enableQuery: false,
  pageSize: 5,
  fields: [],
  queryParameter: {
    customizeUnitCode: getPcUnitCodeMap().relatedQIReport,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/header-associates/${problemHeaderId}/assocaite`,
      method: "get",
    },
  },
});

export const relatedPurOrderDS = (problemHeaderId) => ({
  autoQuery: false,
  enableQuery: false,
  pageSize: 5,
  fields: [],
  queryParameter: {
    customizeUnitCode: getPcUnitCodeMap().relatedPurOrder,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-relation-pos/${problemHeaderId}/query`,
      method: "get",
    },
  },
});

export const relatedQCDocDS = (problemHeaderId) => ({
  paging: false,
  pageSize: 0,
  autoQuery: false,
  enableQuery: false,
  fields: [],
  queryParameter: {
    customizeUnitCode: getPcUnitCodeMap().relatedQCDoc,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-inspections/${problemHeaderId}`,
      method: "get",
    },
  }
});

export const relatedQCAffairDS = () => ({
  autoQuery: false,
  enableQuery: false,
  pageSize: 5,
  fields: [],
  queryParameter: {
    withOutAuthFlag: 1,
    customizeUnitCode: getPcUnitCodeMap().relatedQCAffair,
  },
  transport: {
    read: {
      url: `/spuc/v1/${tenantId}/sinv/rcv/trx/workbench/trx/finish/line`,
      method: "get",
    },
  },
});

export const siteVisitResultDS = () => ({
  editable: false,
  autoQuery: false,
  enableQuery: false,
  fields: [],
  transport: {
    read: {
      url: `/sslm/v1/${tenantId}/site-eval-headers/result/evaluating`,
      method: "get",
    },
  }
});

export const appraisalReportDS = () => ({
  editable: false,
  autoQuery: false,
  enableQuery: false,
  fields: [],
  transport: {
    read: {
      url: `/sslm/v1/${tenantId}/site-eval-headers/eval-report-header`,
      method: "get",
    },
  }
});

export const supEvaluationFileDS = (problemHeaderId) => ({
  editable: false,
  autoQuery: false,
  enableQuery: false,
  fields: [],
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/problem-headers/associate/kipEvalHeader/${problemHeaderId}`,
      method: "get",
    },
  }
});

export const groupMemberDS = (problemHeaderId) => ({
  autoQuery: true,
  enableQuery: false,
  pageSize: 5,
  fields: [],
  queryParameter: {
    customizeUnitCode: getPcUnitCodeMap().groupMember,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-teams/${problemHeaderId}`,
      method: "get",
    },
  }
});

export const continueProvideDS = (problemHeaderId) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [],
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap().continueProvide,
    stateKey: getStateKeyMap().continueProvide,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-supply-actions`,
      method: "get",
    },
  }
});

export const shortMeatureDS = (problemHeaderId) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [],
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap().shortMeature,
    stateKey: getStateKeyMap().shortMeature,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-produce-actions`,
      method: "get",
    },
  }
});

export const reasonAnalyzeDS = (problemHeaderId) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [],
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap().reasonAnalyze,
    stateKey: getStateKeyMap().reasonAnalyze,
  },
  transport : {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-root-causes`,
      method: "get",
    },
  }
});
export const correctMeatureDS = (problemHeaderId) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [],
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap().correctMeature,
    stateKey: getStateKeyMap().correctMeature,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-pca-actions`,
      method: "get",
    },
  }
});
export const applyItemDS = (problemHeaderId) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [],
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap().applyItem,
    stateKey: getStateKeyMap().applyItem,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-applicable-items`,
      method: "get",
    },
  },
});
export const standardDS = (problemHeaderId) => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [],
  queryParameter: {
    tenantId,
    edProblemHeaderId: problemHeaderId,
    customizeUnitCode: getPcUnitCodeMap().standard,
    stateKey: getStateKeyMap().standard,
  },
  transport: {
    read: {
      url: `/sqam/v1/${tenantId}/ed-problem-relevant-standards`,
      method: "get",
    },
  },
});
export const congratulationDS = () => ({
  autoQuery: false,
  fields: [],
});

export const otherInfoDS = () => ({
  autoQuery: false,
  enableQuery: false,
  selection: Infinity,
  fields: [],
  queryParameter: {
    customizeUnitCode: getPcUnitCodeMap().otherInfo,
  },
});