import { SrmUtil, $T } from "srm-mobile-ui";

function headerData(skuTemporaryId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      skuTemporaryId,
    },
    fields: [
      // 商品组信息
      {
        fieldName: $T("scux.SducksProductsForm.model.initImgUrl").$D("图片"),
        fieldCode: "initImgUrl",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.spuName.new").$D(
          "商品组名称",
        ),
        fieldCode: "spuName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.spuCode").$D("图片编码"),
        fieldCode: "spuCode",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.categoryNamePath").$D(
          "平台分类",
        ),
        fieldCode: "categoryNamePath",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.catalogName").$D(
          "商城目录",
        ),
        fieldCode: "catalogName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.supplierCompanyName").$D(
          "供应商",
        ),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.companyName").$D("采购方"),
        fieldCode: "companyName",
      },
      // 商品详情
      {
        fieldName: $T("scux.SducksProductsForm.model.skuName.new").$D(
          "商品名称",
        ),
        fieldCode: "skuName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.purSkuStatusMeaning").$D(
          "流程状态",
        ),
        fieldCode: "purSkuStatusMeaning",
      },
      {
        fieldCode: "labelName",
        fieldName: $T("scux.SducksProductsForm.model.labelName").$D("商品标签"),
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.skuTitle").$D("图片标题"),
        fieldCode: "skuTitle",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.skuCode").$D("商品编码"),
        fieldCode: "skuCode",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.thirdSkuCode").$D(
          "第三方商品编码",
        ),
        fieldCode: "thirdSkuCode",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.marketPrice").$D("市场价"),
        fieldCode: "marketPrice",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.skuStock").$D("商品库存"),
        fieldCode: "skuStock",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.itemName").$D("物料名称"),
        fieldCode: "itemName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.itemCategoryName").$D(
          "品类名称",
        ),
        fieldCode: "itemCategoryName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.customFlag").$D("定制品"),
        fieldCode: "customFlag",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.introductions").$D(
          "商品描述",
        ),
        fieldCode: "introduction",
      },
      // 商品属性 - 基本属性
      {
        fieldName: $T("scux.SducksProductsForm.model.brandName").$D("品牌"),
        fieldCode: "brandName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.model").$D("型号"),
        fieldCode: "model",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.packingList").$D(
          "包装规格（清单）",
        ),
        fieldCode: "packingList",
      },
      // 商品属性 - 规格属性 - 销售属性【动态获取】
      // 售后服务
      {
        fieldName: $T("scux.SducksProductsForm.model.returnSpecial").$D("退货"),
        fieldCode: "returnSpecial",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.changeSpecial").$D("换货"),
        fieldCode: "changeSpecial",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.qualityDuration").$D(
          "质保",
        ),
        fieldCode: "qualityDuration",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.instruction").$D(
          "特殊售后说明",
        ),
        fieldCode: "instruction",
      },
      // 第三方信息
      {
        fieldName: $T("scux.SducksProductsForm.model.supplierItemCode").$D(
          "供应商物料号",
        ),
        fieldCode: "supplierItemCode",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.supplierItemName").$D(
          "供应商物料名称",
        ),
        fieldCode: "supplierItemName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.manufacturerItemCode").$D(
          "制造商物料号",
        ),
        fieldCode: "manufacturerItemCode",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.manufacturerItemName").$D(
          "制造商物料名称",
        ),
        fieldCode: "manufacturerItemName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.manufacturerInfo").$D(
          "制造商名称",
        ),
        fieldCode: "manufacturerInfo",
      },
      // 物料信息
      {
        fieldName: $T("scux.SducksProductsForm.model.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.itemName").$D("物料名称"),
        fieldCode: "itemName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.itemCategoryCode").$D(
          "品类编码",
        ),
        fieldCode: "itemCategoryCode",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.itemCategoryName").$D(
          "品类名称",
        ),
        fieldCode: "itemCategoryName",
      },
    ],
    transport: {
      read: {
        url: `/smpc/v1/${SrmUtil.getTenantId()}/skus/spu-detail-approve/{skuTemporaryId}`,
        method: "get",
        transformResponse: ({ response }) => {
          let newResponse = {};
          if (response) {
            const {
              skuList = [],
              spuAttrExtendList = [],
              ...otherParams
            } = response;
            const {
              skuName,
              skuCode,
              supplierItemCode,
              supplierItemName,
              manufacturerItemCode,
              manufacturerItemName,
              manufacturerInfo,
              purSkuStatusMeaning,
              afterSale,
              skuAttrList,
              brandName,
              model,
              packingList,
              labels,
              thirdSkuCode,
              introduction,
              marketPrice,
              skuImageList,
              itemCode,
              itemName,
              itemCategoryCode,
              itemCategoryName,
            } = skuList[0] || {};
            console.log("model", model);
            const {
              returnDesc,
              returnSpecial,
              returnDuration,
              changeDesc,
              changeSpecial,
              qualityDesc,
              qualityDuration,
              afterSaleSpecial,
              instruction,
              changeDuration,
            } = afterSale || {};
            // 重构动态列字段值
            let newFields = {};
            skuAttrList?.forEach((item) => {
              newFields = {
                ...newFields,
                [item.attrId]: item.description || item.attrValueName,
              };
            });
            // 动态处理销售属性字段
            let sailesFields = {};
            spuAttrExtendList?.forEach((item) => {
              sailesFields = {
                ...sailesFields,
                [item.attrType]: item.attrValue,
              };
            });
            newResponse = {
              ...otherParams,
              ...sailesFields,
              ...newFields,
              skuName,
              skuCode,
              purSkuStatusMeaning,
              returnDesc,
              returnSpecial,
              changeDesc,
              changeSpecial,
              qualityDesc,
              qualityDuration,
              afterSaleSpecial,
              instruction,
              changeDuration,
              returnDuration,
              supplierItemCode,
              supplierItemName,
              manufacturerItemCode,
              manufacturerItemName,
              manufacturerInfo,
              skuList,
              packingList,
              labels,
              thirdSkuCode,
              introduction,
              marketPrice,
              spuAttrExtendList,
              skuImageList, // 图片
              itemCode,
              itemName,
              itemCategoryCode,
              itemCategoryName,
              brandName,
              model,
            };
          }
          return newResponse;
        },
      },
    },
  };
}

function lineInfoDs() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [
      {
        fieldName: $T("scux.SducksProductsForm.model.skuPriceStatusMeaning").$D(
          "状态",
        ),
        fieldCode: "skuPriceStatusMeaning",
      },
      {
        fieldName: $T(
          "scux.SducksProductsForm.model.shelfErrorMessageMeaning",
        ).$D("失败原因"),
        fieldCode: "shelfErrorMessageMeaning",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.uomLov").$D("单位"),
        fieldCode: "uomName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.taxLov").$D("税率"),
        fieldCode: "tax",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.currencyLov").$D("币种"),
        fieldCode: "currencyName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.agreementTaxedPrice").$D(
          "协议价格(含税)",
        ),
        fieldCode: "agreementTaxedPrice",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.agreementPrice").$D(
          "协议价格(不含税)",
        ),
        fieldCode: "agreementPrice",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.priceBatchQuantity").$D(
          "价格批量",
        ),
        fieldCode: "priceBatchQuantity",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.priceType").$D("价格类型"),
        fieldCode: "priceTypeMeaning",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.skuSalesLadders").$D(
          "阶梯价格",
        ),
        fieldCode: "skuSalesLadders",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.priceHiddenFlag").$D(
          "是否隐藏价格",
        ),
        fieldCode: "priceHiddenFlagMeaning",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.validDateFrom").$D(
          "有效期从",
        ),
        fieldCode: "validDateFrom",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.validDateTo").$D(
          "有效期至",
        ),
        fieldCode: "validDateTo",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.freightLov").$D(
          "运费规则",
        ),
        fieldCode: "freightLov",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.installLov").$D("安装费"),
        fieldCode: "postageName",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.orderQuantity").$D(
          "起订量",
        ),
        fieldCode: "orderQuantity",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.minPackageQuantity").$D(
          "最小包装量",
        ),
        fieldCode: "minPackageQuantity",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.skuSalesRegions").$D(
          "送货区域",
        ),
        fieldCode: "skuSalesRegions",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.skuSalesUnits").$D(
          "可采买组织",
        ),
        fieldCode: "skuSalesUnits",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.priceLibNumber").$D(
          "引用价格库编码",
        ),
        fieldCode: "priceLibNumber",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.deliveryDay").$D(
          "供货周期(天)",
        ),
        fieldCode: "deliveryDay",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.guaranteeDay").$D(
          "质保期（天）",
        ),
        fieldCode: "guaranteeDay",
      },
      {
        fieldName: $T("scux.SducksProductsForm.model.remarkMeaning").$D("备注"),
        fieldCode: "remarkMeaning",
      },
    ],
  };
}

export { headerData, lineInfoDs };
