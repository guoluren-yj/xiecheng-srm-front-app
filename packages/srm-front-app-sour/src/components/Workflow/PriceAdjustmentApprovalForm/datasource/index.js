import { SrmUtil } from "srm-mobile-ui";

// 调价单基础信息
export function basicInfoDS(priceAdjustmentHeaderId) {
  return {
    autoQuery: true,
    paging: true,
    pageSize: 5,
    editable: false,
    enableQuery:false,
    showTotalCount: true,
    fields: [],
    queryParameter: {
      customizeUnitCode: "SPC.PRICEADJUSTMENTWORKBENCH.DETAIL.HEADER_FORM",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      priceAdjustmentHeaderId,
    },
    transport: {
      read: {
        url: "/spc/v1/{tenantId}/price-adjustment/{priceAdjustmentHeaderId}/detail",
        method: "get",
      },
    },
  };
}

// 调价单明细数据源
export function lineInfoDS(priceAdjustmentHeaderId) {
  return {
    autoQuery: true,
    paging: true,
    pageSize: 5,
    editable: false,
    enableQuery:false,
    showTotalCount: true,
    fields: [],
    queryParameter: {
      customizeUnitCode: "SPC.PRICEADJUSTMENTWORKBENCH.DETAIL.LINE_EDIT_TABLE",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      priceAdjustmentHeaderId,
    },
    transport: {
      read: {
        url: "spc/v1/{tenantId}/price-adjustment/{priceAdjustmentHeaderId}/line/page",
        method: "get",
      },
    },
  };
}

export function ladderQuotationDS() {
  return {
    autoQuery: false,
    pageSize: 5,
    editable: false,
    showTotalCount: true,
    enableQuery:false,
    fields: [],
  };
}

