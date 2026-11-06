import { SrmUtil } from "srm-mobile-ui";

// 基础信息
function headerDS() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    paging: false,
  };
}

// 关联单据
function relatedQuestionDS({ clarifyId, customizeUnitCode }) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    paging: true,
    pageSize: 5,
    hasMore: true,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode,
      clarifyId,
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "/ssrc/v1/{tenantId}/clarify/refer-issue",
        method: "GET",
      },
    },
  };
}

export {
  headerDS,
  relatedQuestionDS,
};