import { SrmUtil } from "srm-mobile-ui";

export const allSignList = [
  "ESIGN",
  "FDD",
  "QYS",
  "ESIGN_SAAS",
  "FDD_SAAS",
  "QYS_SAAS",
];

export function headerFormDS({ pcHeaderId } = {}) {
  return {
    autoQuery: false,
    editable: false,
    paging: true,
    enableQuery: false,
    queryParameter: {
      customizeUnitCode: "SPCM.WORKSPACE_DETAIL.HEADER.READONLY",
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

export function lineInfoDS({ pcHeaderId } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    pageSize: 5,
    queryParameter: {
      customizeUnitCode: "SPCM.WORKSPACE_DETAIL.SUBJECT.READONLY"
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

export function stageInfoDS({ pcHeaderId } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    pageSize: 5,
    queryParameter: {
      customizeUnitCode: "SPCM.WORKSPACE_DETAIL.STAGE.READONLY"
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

export function partnerInfoDS({ pcHeaderId } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    queryParameter: {
      customizeUnitCode: "SPCM.WORKSPACE_DETAIL.PARTNER.READONLY"
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

export function termInfoDS({ pcHeaderId } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    pageSize: 5,
    queryParameter: {
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

export function tableExtendInfoDS({ pcHeaderId } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    pageSize: 5,
    queryParameter: {
      customizeUnitCode: "SPCM.WORKSPACE_DETAIL.TABLEEXTEND",
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