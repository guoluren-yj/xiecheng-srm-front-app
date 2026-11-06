import { http } from "srm-mobile-ui";

export const getDataApi = (batchId, sourceFrom) => {
  let url = `/${sourceFrom === "CATA" ? "smpc" : "smec"}/v1/${localStorage.getItem("organizationId")}/sku-approve-batchs/batch-detail/${batchId}`;
  return http.get(url);
};

export const getECSkuDetailApi = (skuId) => {
  let url = `/smec/v1/${localStorage.getItem("organizationId")}/pur-skus/preview-info/${skuId}`;
  return http.post(url, null, { params: { customizeUnitCode: "SMBL.WORKFLOW.EC_SKU_UNSHELF.BASE_INFO,SMBL.WORKFLOW.EC_SKU_UNSHELF.PRICE_INFO,SMBL.WORKFLOW.EC_SKU_UNSHELF.ITEM_INFO" } });
};

export const getCataSkuDetailApi = (skuId) => {
  let url = `/smpc/v1/${localStorage.getItem("organizationId")}/skus/sku-preview/${skuId}`;
  return http.get(url, { params: { customizeUnitCode: "SMBL.WORKFLOW.CATA_SKU_UNSHELF.BASE_INFO,SMBL.WORKFLOW.CATA_SKU_UNSHELF.PRICE_INFO,SMBL.WORKFLOW.CATA_SKU_UNSHELF.ITEM_INFO" } });
};
