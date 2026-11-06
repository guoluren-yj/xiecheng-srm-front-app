const getCustomizeCode = (type) => {
  if (!type) {
    return "";
  }
  const codeMap = {
    // "basic": "SMBL.WORKFLOW.RFX_COST.DEPOSIT.BASIC_INFO",
    // "form": "SMBL.WORKFLOW.RFX_DEPOSIT.FORM",
    "payRecord": "SMBL.WORKFLOW.RFX_COST.DEPOSIT.PAY_RECORD",
    // "transferOutRecord": "SMBL.WORKFLOW.RFX_DEPOSIT.TRANSFER_OUT_RECORD",
  };
  return codeMap[type];
};

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
  };
}

// 基础信息
function basisDs (depositId) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      depositId,
      asyncCountFlag: "default",
      // customizeUnitCode: getCustomizeCode("basic"),
    },
  };
}

// 基础信息
function depositDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

//  缴费记录
function payRecordDs (depositId) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    pageSize: 5,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      customizeUnitCode: getCustomizeCode("payRecord"),
    },
    transport: {
      read: {
        url: `/ssta/v1/${window.localStorage.getItem("organizationId")}/deposit-pay-records/list/${depositId}`,
        method: "get",
      },
    },
  };
}

//  转出记录
function transferOutRecordDs (depositId) {
  return {
    autoQuery: true,
    paging: true,
    pageSize: 5,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    queryParameter: {
      // customizeUnitCode: getCustomizeCode("transferOutRecord"),
    },
    transport: {
      read: {
        url: `/ssta/v1/${window.localStorage.getItem("organizationId")}/deposit-transfer-records/list/${depositId}`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  basisDs,
  depositDs,
  payRecordDs,
  transferOutRecordDs,
  getCustomizeCode,
};
