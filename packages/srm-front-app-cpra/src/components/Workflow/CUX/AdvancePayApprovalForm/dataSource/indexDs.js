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

function transactionAmountDs (id) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode: "SSTA.SUPPLY_SETTLE_DETAIL.PRE_TRANSACTIONDETAIL,SSTA.SUPPLY_SETTLE_DETAIL.PRE_TRANSACTION_DETAIL_SEARCH,SMBL.WORKFLOW.ADVANCE_PAY.TRANSACTIONDETAIL"
    },
    transport: {
      read: {
        url: `ssta/v1/${SrmUtil.getTenantId()}/pre-payment-lines/${id}`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  transactionAmountDs,
};
