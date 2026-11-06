import { http } from "srm-mobile-ui";

export const getDataApi = (skuId) => {
  let url = `/smec/v1/${localStorage.getItem("organizationId")}/pur-skus/preview-info/${skuId}`;
  return http.post(url, null, {
    params: {
      customizeUnitCode: "SMBL.WORKFLOW.EC_SKU_SHELF_APPROVE.BASE_INFO",
    },
  });
};
