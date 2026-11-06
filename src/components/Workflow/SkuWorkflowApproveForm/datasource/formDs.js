import { $T } from "srm-mobile-ui";

function commonDs() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    fields: [],
  };
}

function formDs() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    fields: [
      // 基本信息头部
      {
        fieldCode: "skuName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.skuName").$D("商品名称"),
      },
      {
        fieldCode: "skuCode",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.skuCode").$D("商品编码"),
      },
      {
        fieldCode: "sourceFrom",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.sourceFrom").$D("商品来源"),
      },
      {
        fieldCode: "customFlag",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.customSku").$D("定制品"),
      },
      {
        fieldCode: "publisher",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.publisher").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.creationDate").$D("创建时间"),
      },
      // 基础信息
      {
        fieldCode: "skuTitle",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.skuTitle").$D("副标题"),
      },
      {
        fieldCode: "primaryImagePath",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.skuImage").$D("主图"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.model.supplier").$D("供应商"),
      },
      {
        fieldCode: "categoryNamePath",
        fieldType: "TEXT",
        fieldName: $T("sagm.common.model.plateformCategory").$D("平台分类"),
      },
      {
        fieldCode: "catalogName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.model.productCatalog").$D("商城目录"),
      },
      {
        fieldCode: "labels",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.skuLabel").$D("商品标签"),
      },
      {
        fieldCode: "introductions",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.title.skuDescription").$D("商品描述"),
      },
      {
        fieldCode: "customFlag",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.customSku").$D("定制品信息"),
      },
      // 价格信息
      {
        fieldCode: "skuPriceStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.skuPriceStatus").$D("状态"),
      },
      {
        fieldCode: "agreementTaxedPrice",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("smpc.product.model.taxAgreementPrice").$D("协议价格(含税)"),
      },
      {
        fieldCode: "agreementPrice",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("smpc.product.model.noTaxPlatPrice").$D("协议价格(不含税)"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.uom").$D("单位"),
      },
      {
        fieldCode: "tax",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("smpc.product.model.tax").$D("税率"),
      },
      {
        fieldCode: "currencyName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.model.currency").$D("币种"),
      },
      {
        fieldCode: "priceBatchQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("smpc.product.view.priceBatchQuantity").$D("价格批量"),
      },
      {
        fieldCode: "priceTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.priceType").$D("价格类型"),
      },
      {
        fieldCode: "priceHiddenFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.priceHidden").$D("隐藏价格"),
      },
      {
        fieldCode: "freeShippingFlag",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.freightRule").$D("运费规则"),
      },
      {
        fieldCode: "shippingRuleName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.shippingRuleName").$D("运费规则名称"),
      },
      {
        fieldCode: "installName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.installExpense").$D("安装费"),
      },
      {
        fieldCode: "orderQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("smpc.product.view.orderQuantity").$D("起订量"),
      },
      {
        fieldCode: "minPackageQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("smpc.product.view.minPackageQuantity").$D("最小包装量"),
      },
      {
        fieldCode: "skuSalesRegions",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.postRegion").$D("送货区域"),
      },
      {
        fieldCode: "skuSalesUnits",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.buyOrganizations").$D("采买组织"),
      },
      {
        fieldCode: "priceSourceFromNum",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.contractNum").$D("合同号"),
      },
      {
        fieldCode: "priceSourceFromLnNum",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.contractLnNum").$D("合同行号"),
      },
      {
        fieldCode: "priceLibNumber",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.proceLinNum").$D("引用价格库编码"),
      },
      {
        fieldCode: "deliveryDay",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("smpc.product.model.deliveryDay").$D("供货周期(天)"),
      },
      {
        fieldCode: "guaranteeDay",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("smpc.product.view.guaranteeDayC").$D("质保期(天)"),
      },
      {
        fieldCode: "remarkMeaning",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.remark").$D("备注"),
      },
      // 商品属性
      {
        fieldCode: "brandName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.brand").$D("品牌"),
      },
      {
        fieldCode: "model",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.model").$D("型号"),
      },
      {
        fieldCode: "packingList",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.packingList").$D("包装规格（清单）"),
      },
      // 物料信息
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.model.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.model.itemName").$D("物料名称"),
      },
      {
        fieldCode: "itemCategoryCode",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.itemCategoryCode").$D("品类编码"),
      },
      {
        fieldCode: "itemCategoryName",
        fieldType: "TEXT",
        fieldName: $T("smpc.product.view.itemCategoryName").$D("品类名称"),
      },
    ],
  };
}

export { commonDs, formDs };
