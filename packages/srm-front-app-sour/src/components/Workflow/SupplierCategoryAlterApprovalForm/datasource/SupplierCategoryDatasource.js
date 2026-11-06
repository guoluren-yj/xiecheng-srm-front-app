import { SrmUtil } from "srm-mobile-ui";

function supplierCategoryDatasource(categoryAlterId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    paging: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: { customizeUnitCode: "SSLM.SUPPLIER_CATEGORY_ALTER_DETAIL.HEADER,SSLM.SUPPLIER_CATEGORY_ALTER_DETAIL.CATEGORY_TABLE,SSLM.SUPPLIER_CATEGORY_ALTER_DETAIL.ATTACHMENT_TABLE" },
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/supplier-category-alter/${categoryAlterId}`,
        method: "get",
      },
    },
    events: {
    },
  };
}

export default supplierCategoryDatasource;