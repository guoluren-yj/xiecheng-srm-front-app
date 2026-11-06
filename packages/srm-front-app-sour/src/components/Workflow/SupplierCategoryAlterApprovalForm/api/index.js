import { http, SrmUtil } from "srm-mobile-ui";

export const getSupplierCategoryInfoApi = (categoryAlterId) => {
  let url = `/sslm/v1/${SrmUtil.getTenantId()}/supplier-category-alter/${categoryAlterId}`;
  let params = {
    "customizeUnitCode": "SSLM.SUPPLIER_CATEGORY_ALTER_DETAIL.HEADER,SSLM.SUPPLIER_CATEGORY_ALTER_DETAIL.CATEGORY_TABLE,SSLM.SUPPLIER_CATEGORY_ALTER_DETAIL.ATTACHMENT_TABLE",
    "page": 0,
    "size": 10,
  };
  return http.get(url, { params });
};
