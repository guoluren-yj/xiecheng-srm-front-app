// 行列表
import { SrmUtil } from "srm-mobile-ui";

function purchaseRequisitionLineDS(prHeaderId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SRPM.PURCHAE_REQUISITION_QUERY.DETAIL.SRM_LINE",
      workFlowFlag: 1,
    },
    fields: [],
    transport: {
      read: {
        url: `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/${prHeaderId}/lines`,
        method: "get",
      },
    },
  };
}

export { purchaseRequisitionLineDS };
