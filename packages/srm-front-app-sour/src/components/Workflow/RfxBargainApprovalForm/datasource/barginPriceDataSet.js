import { SrmUtil } from "srm-mobile-ui";

function barginPriceDataSet(rfxHeaderId, rfxHeaderSnapId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 5,
    paging: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SMBL.WORKFLOW.FRX_BARGAIN.BARGAIN_LINE_INFO_NEW,SMBL.WORKFLOW.FRX_BARGAIN.BARGAIN_LINE_DETAIL_NEW",
      flag:0,
      isApproval:"Approval",
      orderType:"itemCategoryName",
      rfxHeaderId:rfxHeaderId,
      rfxHeaderSnapId:rfxHeaderSnapId,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/snap/bargain`,
        method: "get",
      },
    },
    events: {
    },
  };
}

export default barginPriceDataSet;