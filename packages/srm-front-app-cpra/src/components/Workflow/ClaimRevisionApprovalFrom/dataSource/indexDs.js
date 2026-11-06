import { SrmUtil } from "srm-mobile-ui";

function claimLineDS(id) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    pageSize: 5,
    transport: {
      read: {
        url: `/sqam/v1/${SrmUtil.getTenantId()}/claim-form-lines/approval/detail/${id}`,
        method: "get",
      },
    },
  };
}

export {
  claimLineDS
};