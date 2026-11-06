import { $T, SrmUtil } from "srm-mobile-ui";
// 获取列表个性化编码
function getCustomizeCode(type) {
  switch (type) {
    case "underApproval":
      return "SMBL.ORDER_WORKBENCH.UNDERAPPROVAL.LIST";
    case "toBeReleased":
      return "SMBL.ORDER_WORKBENCH.TOBERELEASED.LIST";
    case "feedbackUnderReview":
      return "SMBL.ORDER_WORKBENCH.FEEDBACKUNDERREVIEW.LIST";
    case "all":
      return "SMBL.ORDER_WORKBENCH.ALL.LIST";
    default:
      return "";
  }
}

// 获取筛选器编码
function getFilterCode(type) {
  let codeMap = {
    underApproval: "SMBL.ORDER_WORKBENCH.UNDERAPPROVAL.SEARCH",
    toBeReleased: "SMBL.ORDER_WORKBENCH.TOBEREKEASED.SEARCH",
    feedbackUnderReview: "SMBL.ORDER_WORKBENCH.FEEDBACKUNDERREVIEW.SEARCH",
    all: "SMBL.ORDER_WORKBENCH.ALL.SEARCH",
  };
  return codeMap[type];
}

// 拼接查询个性化参数
const getQueryCuzCode = (type) =>
  [getCustomizeCode(type), getFilterCode(type)].toString();

// 查询传参
const getQueryParameter = (type) => ({
  poWorkbenchFlag: 1,
  customizeUnitCode: getQueryCuzCode(type),
  customizeOrderField: "creationDate:desc", // 默认排序规则，可自定义更改
});

const getVal = (val) => (typeof val === "string" && val.length ? val : null);

// 处理筛选参数
const beforeQuery = (ds, params) => {
  const { tempKey } = params;
  if (tempKey) {
    const [supplierId, supplierCompanyId] = tempKey.split("-");
    params["supplierId"] = getVal(supplierId);
    params["supplierCompanyId"] = getVal(supplierCompanyId);
  }
};

// 待审批
function underApprovalDs(type) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    filterCustomizeCode: getFilterCode(type),
    queryParameter: getQueryParameter(type),
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fastQueryField: {
      fieldCode: "multiPoNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.model.common.orderNum").$D("订单编号"),
    },
    events: {
      beforeQuery,
    },
    transport: {
      read: {
        method: "get",
        url: "/spuc/v1/{tenantId}/po-header/approving",
      },
    },
  };
}

// 待提交
function toBeReleasedDs(type) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    filterCustomizeCode: getFilterCode(type),
    queryParameter: getQueryParameter(type),
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fastQueryField: {
      fieldCode: "multiPoNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.model.common.orderNum").$D("订单编号"),
    },
    events: {
      beforeQuery,
    },
    transport: {
      read: {
        method: "get",
        url: "/spuc/v1/{tenantId}/po-header/publishing",
      },
    },
  };
}

// 待反馈审核
function feedbackUnderReviewDs(type) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    filterCustomizeCode: getFilterCode(type),
    queryParameter: getQueryParameter(type),
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fastQueryField: {
      fieldCode: "multiPoNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.model.common.orderNum").$D("订单编号"),
    },
    events: {
      beforeQuery,
    },
    transport: {
      read: {
        method: "get",
        url: "/spuc/v1/{tenantId}/po-header/delivery-query",
      },
    },
  };
}

// 全部
function allDs(type) {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    filterCustomizeCode: getFilterCode(type),
    queryParameter: getQueryParameter(type),
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fastQueryField: {
      fieldCode: "multiPoNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.model.common.orderNum").$D("订单编号"),
    },
    events: {
      beforeQuery,
    },
    transport: {
      read: {
        method: "get",
        url: "/spuc/v1/{tenantId}/po-header/purchaser",
      },
    },
  };
}

export {
  allDs,
  toBeReleasedDs,
  underApprovalDs,
  getCustomizeCode,
  feedbackUnderReviewDs,
};
