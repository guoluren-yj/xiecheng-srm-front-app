import { SrmUtil } from "srm-mobile-ui";
function supplierQuotaionDs(rfxHeaderId, type) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      rfxHeaderId,
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/scux/v1/${SrmUtil.getTenantId()}/aixuexi-all-line/${rfxHeaderId}`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        if (type === "select") {
          let dataTmp = [ ...data ];
          dataTmp = dataTmp.filter((item) => item.suggestedFlag);
          return dataTmp;
        }
      }
    }
  };
}
export default supplierQuotaionDs;
