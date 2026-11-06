import { SrmUtil } from "srm-mobile-ui";
function productDetailDs(applyHeaderId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      applyHeaderId,
      customizeUnitCode: "SMPC.SHELF_APPLY.LINE.SEARCH_BAR",
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/smpc/v1/${SrmUtil.getTenantId()}/sku-shelve-apply-lines`,
        method: "get",
      },
      create: {
        url: `/smpc/v1/${SrmUtil.getTenantId()}/sku-shelve-apply-lines`,
        method: "post",
      },
      update: {
        url: `/smpc/v1/${SrmUtil.getTenantId()}/sku-shelve-apply-lines`,
        method: "put",
      },
      destroy: {
        url: `/smpc/v1/${SrmUtil.getTenantId()}/sku-shelve-apply-lines`,
        method: "delete",
      },
    },
  };
}

export default productDetailDs;
