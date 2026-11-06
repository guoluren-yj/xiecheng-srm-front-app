import { SrmUtil } from "srm-mobile-ui";

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

function transactionDetailDs() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    pageSize: 5,
    transport: {
      read: {
        url: `/ssta/v1/${SrmUtil.getTenantId()}/charge-lines`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  transactionDetailDs
};