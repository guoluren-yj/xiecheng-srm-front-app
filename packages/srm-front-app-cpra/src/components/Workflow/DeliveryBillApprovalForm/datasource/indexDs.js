import { SrmUtil } from "srm-mobile-ui";

const commonDs = () => ({
  autoQuery: false,
  selection: Infinity,
  pageSize: 10,
  editable: false,
  enableQuery: false,
  showTotalCount: true,
});

// 送货单行信息 - 不分页
const lineDs = () => ({
  autoQuery: false,
  selection: Infinity,
  pageSize: 10000,
  editable: false,
  editFlag: false,
  enableQuery: false,
  queryParameter: {
    customizeUnitCode: "SINV.DELIVERY_APPROVED_DETAIL.BASIC",
    quaryType: "Approve",
  },
  pathParameter: {
    tenantId: SrmUtil.getTenantId(),
    asnHeaderId: null,
  },
  transport: {
    read: {
      url: "/spuc/v1/{tenantId}/asn-header/{asnHeaderId}/page-lines",
      method: "get",
    },
  },
});

export {
  commonDs,
  lineDs
};