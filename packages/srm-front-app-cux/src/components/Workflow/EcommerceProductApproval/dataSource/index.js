import { $T, SrmUtil } from "srm-mobile-ui";

function basicInfo({ batchId }) {
  return {
    fields: [
      { name: "batchNum", label: $T("smpc.import.model.batchNum").$D("批次号") },
      { name: "createdByName", label: $T("smpc.product.view.createByName").$D("创建人") },
      { name: "creationDate", label: $T("hzero.common.creationDate").$D("创建时间") },
    ],
    transport: {
      read: {
        url: `/smec/v1/${SrmUtil.getTenantId()}/sku-batch-approves/batch-detail/${batchId}?customizeUnitCode=SMPC.WORKFLOW.EC_SKU_SHELF_APPROVE.BASIC_INFO`,
        method: "get",
      },
    },
  };
}

function businessInfo({ batchId }) {
  return {
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    fields: [
      {
        name: "imagePath",
        label: $T("smpc.product.view.skuImage").$D("商品图片"),
      },
      { name: "skuCode", label: $T("smpc.product.view.skuCode").$D("商品编码") },
      { name: "skuName", label: $T("smpc.product.view.skuName").$D("商品名称") },
      {
        name: "categoryNamePath",
        label: $T("smpc.product.view.platformCategory").$D("平台分类"),
      },
      {
        name: "supplierCompanyName",
        label: $T("smpc.product.view.supplier").$D("供应商"),
      },
      {
        name: "catalogName",
        label: $T("smpc.product.model.catalog").$D("目录"),
      },
      { name: "taxPrice", label: $T("sagm.common.view.price.tax").$D("单价(含税)") },
      { name: "tax", label: $T("smpc.product.model.tax").$D("税率") },
      { name: "currencyName", label: $T("smpc.product.model.currency").$D("币种") },
      { name: "options", width: 160, label: $T("hzero.common.action").$D("操作") },
    ],
    transport: {
      read: {
        url: `/smpc/v1/${SrmUtil.getTenantId()}/pur-skus/ec-list/?batchId=${batchId}&customizeUnitCode=SMPC.WORKFLOW.EC_SKU_SHELF_APPROVE.LIST_EC_ALL,SMPC.WORKFLOW.EC_SKU_SHELF_APPROVE.SEARCH_BAR`,
        method: "get",
      }
    },
  };
}

export { basicInfo, businessInfo };
