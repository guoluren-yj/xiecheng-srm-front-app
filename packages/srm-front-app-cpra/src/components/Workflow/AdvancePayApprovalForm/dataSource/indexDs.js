import { SrmUtil } from "srm-mobile-ui";

export const headUnitCodes = [
  "SSTA.PURCHASE_SETTLE_DETAIL.PRE_BASIC_INFO",
  "SSTA.PURCHASE_SETTLE_DETAIL.PRE_PAYMENT_INFO",
  "SSTA.PURCHASE_SETTLE_DETAIL.OTHER_INFO_PRE",
  "SSTA.PURCHASE_SETTLE_DETAIL.PRE_PAYMENT_OTHER_WORKFLOW"
].join();

function commonDs(id) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: { customizeUnitCode: headUnitCodes },
    fields: [],
    transport: {
      read: {
        url: `/ssta/v1/${SrmUtil.getTenantId()}/pre-pay-headers/${id}`,
        method: "get",
      },
    },
  };
}

function transactionAmountDs(id) {
  return {
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    pageSize: 5,
    queryParameter: {
      customizeUnitCode:
        "SSTA.PURCHASE_SETTLE_DETAIL.PRE_TRANSACTIONDETAIL,SSTA.PURCHASE_SETTLE_DETAIL.PRE_TRANSACTION_DETAIL_SEARCH",
    },
    transport: {
      read: {
        url: `ssta/v1/${SrmUtil.getTenantId()}/pre-payment-lines/${id}`,
        method: "get",
      },
    },
  };
}

export { commonDs, transactionAmountDs };
