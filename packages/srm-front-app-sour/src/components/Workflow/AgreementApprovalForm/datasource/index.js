import { SrmUtil } from "srm-mobile-ui";

export const allSignList = [
  "ESIGN",
  "FDD",
  "QYS",
  "ESIGN_SAAS",
  "FDD_SAAS",
  "QYS_SAAS",
];

export function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

export function headerFormDS({ pcHeaderId, isNewCust } = {}) {
  return {
    autoQuery: false,
    editable: false,
    paging: true,
    enableQuery: false,
    forceValidate: true,
    queryParameter: {
      customizeUnitCode: isNewCust ? "SPCM.WORKSPACE_DETAIL.HEADER" : "SPCM.PURCHASE_CONTRACT_MAINTAIN.DETAIL",
    },
    fields: [],
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract/${pcHeaderId}`,
        method: "get",
      },
    },
  };
}

export function lineInfoDS({ pcHeaderId, isNewCust } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    forceValidate: true,
    pageSize: 5,
    queryParameter: {
      customizeUnitCode: isNewCust ? "SPCM.WORKSPACE_DETAIL.SUBJECT" : "SPCM.PURCHASE_CONTRACT_MAINTAIN.SUBJECT"
    },
    fields: [],
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract/${pcHeaderId}/pc-subject/page`,
        method: "get",
      },
    },
  };
}

export function stageInfoDS({ pcHeaderId, isNewCust } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    forceValidate: true,
    pageSize: 5,
    queryParameter: {
      customizeUnitCode: isNewCust ? "SPCM.WORKSPACE_DETAIL.STAGE.READONLY" : "SPCM.PURCHASE_CONTRACT_MAINTAIN.STAGE.READONLY"
    },
    fields: [],
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract/${pcHeaderId}/stage/page`,
        method: "get",
      },
    },
  };
}

export function partnerInfoDS({ pcHeaderId, isNewCust } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    forceValidate: true,
    queryParameter: {
      customizeUnitCode: isNewCust ? "SPCM.WORKSPACE_DETAIL.PARTNER.READONLY" : "SPCM.PURCHASE_CONTRACT_MAINTAIN.PARTNER.READONLY"
    },
    fields: [],
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract/${pcHeaderId}/pc-partner/list`,
        method: "get",
      },
    },
  };
}

export function termInfoDS({ pcHeaderId, isNewCust } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    forceValidate: true,
    pageSize: 5,
    queryParameter: isNewCust && {
      customizeUnitCode: "SPCM.WORKSPACE_DETAIL.BUSINESSTERMS"
    },
    fields: [],
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract/${pcHeaderId}/pc-term/page`,
        method: "get",
      },
    },
  };
}

export function tableExtendInfoDS({ pcHeaderId, isNewCust } = {}) {
  const queryObj = isNewCust ? { customizeUnitCode: "SPCM.WORKSPACE_DETAIL.TABLEEXTEND" } : {};
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    pageSize: 5,
    queryParameter: {
      ...queryObj,
      pcSourceId: pcHeaderId,
    },
    fields: [],
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/pc-table-extends/page/list`,
        method: "get",
      },
    },
  };
}