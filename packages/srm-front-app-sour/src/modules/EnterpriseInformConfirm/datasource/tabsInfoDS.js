// import { $T } from "srm-mobile-ui";

function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

// 基础信息
function basicInfoDS(changeReqId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    queryParameter: {
      customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM_DETAIL.HEADER",
      changeReqId:changeReqId,
    },
    fastQueryField: {},
    // 查询表单字段
    queryFields: [],
    fields: [],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/enterprise-change/firm-detail`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  basicInfoDS,
};
