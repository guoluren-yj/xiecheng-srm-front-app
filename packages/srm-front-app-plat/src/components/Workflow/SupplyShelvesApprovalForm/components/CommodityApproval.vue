<template>
  <!-- 商品审批 -->
  <section>
    <srm-scroll-tab>
      <!-- 基本信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="productInfoDataSet"
                  :columns="getColumns('productInfo')"
                  :customize-code="getCodeDefine('productInfo')"/>
        <srm-blank size="mid" theme="fill"/>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="productGroupInfoDataSet"
                  :columns="getColumns('productGroupInfo')"
                  :customize-code="getCodeDefine('productGroupInfo')"/>
      </srm-scroll-tab-item>
      <!-- 价格信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('priceInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="priceInfoDataSet"
                  :columns="getColumns('priceInfo')"
                  :customize-code="getCodeDefine('priceInfo')"/>
      </srm-scroll-tab-item>
      <!-- 商品属性 -->
      <srm-scroll-tab-item :label="getLanguageDefine('productAttr')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="basicAttrDataSet"
                  :columns="getColumns('basicAttr')"
                  :customize-code="getCodeDefine('basicAttr')"/>
        <srm-blank size="mid" theme="fill"/>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="specsAttrDataSet"
                  :columns="getColumns('specsAttr')"
                  :customize-code="getCodeDefine('specsAttr')"/>
        <srm-blank size="mid" theme="fill"/>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="saleAttrDataSet"
                  :columns="getColumns('saleAttr')"
                  :customize-code="getCodeDefine('saleAttr')"/>
      </srm-scroll-tab-item>
      <!-- 售后服务 -->
      <srm-scroll-tab-item :label="getLanguageDefine('afterSaleServices')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="afterSaleServicesDataSet"
                  :columns="getColumns('afterSaleServices')"
                  :customize-code="getCodeDefine('afterSaleServices')"/>
      </srm-scroll-tab-item>
      <!-- 第三方信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('thirdInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="thirdInfoDataSet"
                  :columns="getColumns('thirdInfo')"
                  :customize-code="getCodeDefine('thirdInfo')"/>
      </srm-scroll-tab-item>
      <!-- 商品介绍 -->
      <srm-scroll-tab-item :label="getLanguageDefine('productIntro')">
        <div id="productIntro" class="productIntro"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 弹框 -->
    <srm-popup :visible.sync="visiblePopup"
               :show-header="false"
               height="100%">
      <!-- 定制品 -->
      <div v-if="customSkuPopup">
        <div v-for="(item, index) in popupData" :key="index">
          <ul style="padding: 10px 0px 10px 15px; border-bottom: 1px solid var(--background-color-empty-second);">
            <customize
              :data-source="item"
              :columns="getColumns('customSkuTitle')"
              type="list"
              :need-padding="false"/>
          </ul>
          <ul v-if="item.pricingFlag === 1" style="padding: 10px 0px 10px 15px; border-bottom: 1px solid var(--background-color-empty-second);">
            <customize
              :data-source="item"
              :columns="getColumns('customSkuAttr')"
              type="list"
              :need-padding="false"/>
          </ul>
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="item.customSkuDataSet"
                    :columns="item.pricingFlag === 1 ? getColumns('customSku') : getColumns('customSkuOther')"
                    :customize-code="item.pricingFlag === 1 ? getCodeDefine('customSku') : getCodeDefine('customSkuOther')"/>
          <srm-blank v-if="index !== popupData.length - 1" size="large" theme="fill"/>
        </div>
      </div>
      <!-- 阶梯价格 -->
      <srm-list v-if="ladderPricePopup"
                :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="ladderPriceDataSet"
                :columns="getColumns('ladderPrice')"
                :customize-code="getCodeDefine('ladderPrice')"/>
      <!-- 送货区域 -->
      <srm-list v-if="postRegionPopup"
                :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="postRegionDataSet"
                :columns="getColumns('postRegion')"
                :customize-code="getCodeDefine('postRegion')"/>
      <!-- 采买组织 -->
      <srm-list v-if="skuSalesUnitsPopup"
                :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="skuSalesUnitsDataSet"
                :columns="getColumns('skuSalesUnits')"
                :customize-code="getCodeDefine('skuSalesUnits')"/>
      <!-- 其他弹框 -->
      <customize-detail v-if="otherPopup"
                        :need-padding="true"
                        :data-source="popupData.data"
                        :code="getCodeDefine(popupData.code)"
                        :columns="getColumns(popupData.columns)"/>
    </srm-popup>
  </section>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { commonDs, priceInfoDs } from "../datasource/commodityApprovalDs";
import { getAllProductApi, getProductAttrApi, getCustomSkuApi } from "../api";
import colors from "../datasource/colors";
export default {
  modules: [ "hipspfm.common" ],
  name: "CommodityApproval",
  props: {
    parameters: {
      type: Object,
    }
  },
  data() {
    return {
      // 基本信息
      productInfoDataSet: new DataSet(commonDs()), // 商品信息
      productGroupInfoDataSet: new DataSet(commonDs()), // 商品组信息
      // 价格信息
      priceInfoDataSet: new DataSet(priceInfoDs()),
      // 商品属性
      basicAttrDataSet: new DataSet(commonDs()), // 基本属性
      specsAttrDataSet: new DataSet(commonDs()), // 规格属性
      saleAttrDataSet: new DataSet(commonDs()), // 销售属性
      // 售后服务
      afterSaleServicesDataSet: new DataSet(commonDs()),
      // 第三方信息
      thirdInfoDataSet: new DataSet(commonDs()),
      basicAttrColumns: [
        {
          formRow: 1,
          fieldCode: "brandName",
          fieldName: $T("smpc.product.view.brand").$D("品牌"),
        },
        {
          formRow: 1,
          fieldCode: "model",
          fieldName: $T("smpc.product.view.model").$D("型号"),
        },
        {
          formRow: 2,
          fieldCode: "packingList",
          fieldName: $T("smpc.product.view.packingList").$D("包装规格（清单）"),
        },
      ], // 基本属性字段
      specsAttrColumns: [], // 规格属性字段
      saleAttrColumns: [], // 销售属性字段
      introduction: "", // 商品介绍
      visiblePopup: false,
      // 定制品
      popupData: null,
      customSkuPopup: false,
      // 阶梯价格
      ladderPriceDataSet: new DataSet(commonDs()),
      ladderPricePopup: false,
      // 送货区域
      postRegionDataSet: new DataSet(commonDs()),
      postRegionPopup: false,
      // 采买组织
      skuSalesUnitsDataSet: new DataSet(commonDs()),
      skuSalesUnitsPopup: false,
      // 其他弹框
      otherPopup: false,
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "productInfo":
          return [
            {
              formRow: 1,
              fieldCode: "title",
              fieldType: "EMPTY",
              render: () => <span style="font-size: 12px;color: #333333;">{$T("smpc.product.view.skuInfo").$D("商品信息")}</span>,
            },
            {
              formRow: 2,
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => {
                const approveStatus = item.approveStatus;
                const statusType = {
                  WAITING: "warn",
                };
                return <SrmListHeader showOpenTag={false}>
                  <span>
                    {$T("smpc.product.view.skuCode").$D("商品编码")}： {item.skuCode}
                  </span>
                  <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[approveStatus]}>
                    {item.approveStatusMeaning}
                  </SrmButton>
                </SrmListHeader>;
              }
            },
            {
              formRow: 3,
              fieldCode: "thirdSkuCode",
              fieldName: $T("smpc.product.view.thirdCodeProduct").$D("三方编码"),
            },
            {
              formRow: 3,
              fieldCode: "itemCategoryName",
              fieldName: $T("smpc.product.model.itemCategory").$D("品类"),
            },
            {
              formRow: 4,
              fieldCode: "skuStock",
              fieldName: $T("smpc.product.model.productStock").$D("商品库存"),
              render: (val) => Number(val) > 0 ? val : $T("smpc.product.model.noLimitStock").$D("无限库存"),
            },
            {
              formRow: 4,
              fieldCode: "marketPrice",
              fieldName: $T("smpc.product.model.marketPrice").$D("市场价"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              formRow: 5,
              fieldCode: "itemCode",
              fieldName: $T("smpc.product.model.itemCode").$D("物料编码"),
            },
            {
              formRow: 5,
              fieldCode: "itemName",
              fieldName: $T("smpc.product.model.itemName").$D("物料名称"),
            },
            {
              formRow: 6,
              fieldCode: "productLabel",
              fieldName: $T("smpc.product.view.productLabel").$D("商品标签"),
              render: (val, item) =>
                <div class="sku-labels" style="width: 90%">
                  {
                    item.labels && item.labels.length > 0 && item.labels.map((m) => <p
                      style={{
                        color: colors[m.labelColorCode] ? colors[m.labelColorCode]["label-preview-color"] : "",
                        borderColor: colors[m.labelColorCode] ? colors[m.labelColorCode]["label-preview-border-color"] : "",
                        backgroundColor: colors[m.labelColorCode] ? colors[m.labelColorCode]["label-preview-background-color"] : "",
                      }}
                      class="sku-label word"
                    >
                      {m.labelName}
                    </p>) || "-"
                  }
                </div>
            },
            {
              formRow: 7,
              fieldCode: "customSku",
              fieldName: $T("smpc.product.view.customSku").$D("定制品"),
              render: (val, item) => item.customFlag === 1 ? <span style="color: var(--color-other-default-b);">
                {$T("smpc.product.button.lookCustomSkuInfo").$D("查看定制品信息")}</span> : "-",
              callBack: () => {
                this.openPopup("customSku", {});
              },
            },
          ];
        case "productGroupInfo":
          return [
            {
              formRow: 1,
              fieldCode: "title",
              fieldType: "EMPTY",
              render: () => <span style="font-size: 12px;color: #333333;">{$T("smpc.product.view.title.spuInfo").$D("商品组信息")}</span>,
            },
            {
              formRow: 2,
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader showOpenTag={false}>
                <span>
                  {$T("smpc.product.view.spuCode").$D("商品组编码")}： {item.spuCode}
                </span>
              </SrmListHeader>
            },
            {
              formRow: 3,
              fieldCode: "spuName",
              fieldName: $T("smpc.product.view.spuName").$D("商品组名称"),
            },
            {
              formRow: 4,
              fieldCode: "categoryNamePath",
              fieldName: $T("smpc.product.model.platCategory").$D("平台分类"),
            },
            {
              formRow: 5,
              fieldCode: "catalogName",
              fieldName: $T("smpc.product.model.mallCatalog").$D("商城目录"),
            },
            {
              formRow: 6,
              fieldCode: "supplierCompanyName",
              fieldName: $T("smpc.product.model.supplier").$D("供应商"),
            },
            {
              formRow: 7,
              fieldCode: "companyName",
              fieldName: $T("smpc.product.model.purchaser").$D("采购方"),
            },
          ];
        case "priceInfo":
          return [
            {
              formRow: 1,
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => {
                const skuPriceStatus = item.skuPriceStatus;
                const statusType = {
                  WAITING: "warn",
                  VALID: "success",
                  VALID_ERROR: "info"
                };
                return <SrmListHeader>
                  <span>
                    {$T("smpc.product.view.displayOrderSeq").$D("序号")}: {item.lineNum}
                  </span>
                  <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[skuPriceStatus]}>
                    {item.skuPriceStatusMeaning}
                  </SrmButton>
                </SrmListHeader>;
              }
            },
            {
              fieldCode: "shelfErrorMessageMeaning",
              fieldName: $T("smpc.product.view.shelfErrorMessage").$D("失败原因"),
            },
            {
              fieldCode: "uomName",
              fieldName: $T("smpc.product.view.uom").$D("单位"),
            },
            {
              fieldCode: "tax",
              fieldName: $T("smpc.product.view.taxRate").$D("税率"),
            },
            {
              fieldCode: "currencyName",
              fieldName: $T("smpc.product.view.currency").$D("币种"),
            },
            {
              fieldCode: "agreementTaxedPrice",
              fieldName: $T("smpc.product.view.taxedPrice").$D("单价(含税)"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldCode: "agreementPrice",
              fieldName: $T("smpc.product.view.noTaxedPrice").$D("单价(不含税)"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldCode: "priceTypeMeaning",
              fieldName: $T("smpc.product.view.priceType").$D("价格类型"),
              render: (val, item) => item.priceType === "LADDER_PRICE" ? <span style="color: var(--color-other-default-b);">
                {$T("smpc.product.view.ladderPrice").$D("阶梯价格")}</span> : val || "-",
              callBack: (item) => {
                if (item.priceType === "LADDER_PRICE") {
                  this.openPopup("ladderPrice", item.skuSalesLadders);
                }
              },
            },
            {
              fieldCode: "priceHiddenFlagMeaning",
              fieldName: $T("smpc.product.view.priceHidden").$D("隐藏价格"),
            },
            {
              fieldCode: "shippingRuleName",
              fieldName: $T("smpc.product.view.freightRule").$D("运费规则"),
              render: (val, item) => item.freeShippingFlag === 1 ? `${$T("smpc.product.view.freeShipping").$D("包邮")}` : val
            },
            {
              fieldCode: "skuSalesRegions",
              fieldName: $T("smpc.product.view.postRegion").$D("送货区域"),
              render: (val, item) => item.skuSalesRegions && item.skuSalesRegions.length > 0 ? <span style="color: var(--color-other-default-b);">
                {$T("smpc.product.button.lookPostRegion").$D("查看区域")}</span> : $T("smpc.product.model.allRegion").$D("所有区域"),
              callBack: (item) => {
                if (item.skuSalesRegions && item.skuSalesRegions.length > 0) {
                  this.openPopup("postRegion", item.skuSalesRegions);
                }
              },
            },
            {
              fieldCode: "orderQuantity",
              fieldName: $T("smpc.product.view.orderQuantity").$D("起订量"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldCode: "minPackageQuantity",
              fieldName: $T("smpc.product.view.minPackageQuantity").$D("最小包装量"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldCode: "skuSalesUnits",
              fieldName: $T("smpc.product.view.buyOrganizations").$D("采买组织"),
              render: (val, item) => item.skuSalesUnits && item.skuSalesUnits.length > 0 ? <span style="color: var(--color-other-default-b);">
                {$T("smpc.product.button.lookSkuSalesUnits").$D("查看采买组织")}</span> : $T("smpc.product.model.allOrganizations").$D("所有组织"),
              callBack: (item) => {
                if (item.skuSalesUnits && item.skuSalesUnits.length > 0) {
                  this.openPopup("skuSalesUnits", item.skuSalesUnits);
                }
              },
            },
            {
              fieldCode: "priceLibNumber",
              fieldName: $T("smpc.product.view.proceLinNum").$D("价格库编码"),
            },
            {
              fieldCode: "deliveryDay",
              fieldName: $T("smpc.product.view.deliveryDayC").$D("交货周期(天)"),
            },
            {
              fieldCode: "guaranteeDay",
              fieldName: $T("smpc.product.view.guaranteeDayC").$D("质保期(天)"),
            },
            {
              fieldCode: "validDate",
              fieldName: $T("smpc.product.view.validDate").$D("有效期"),
              render: (val, item) => `${item.validDateFrom || ""} ~ ${item.validDateTo || ""}`
            },
            {
              fieldCode: "remarkMeaning",
              fieldName: $T("smpc.product.view.remark").$D("备注"),
            },
          ];
        case "productInfoDetail":
          return [
            {
              formRow: 2,
              fieldCode: "skuCode",
              fieldName: $T("smpc.product.view.skuCode").$D("商品编码"),
            },
            {
              formRow: 3,
              fieldCode: "thirdSkuCode",
              fieldName: $T("smpc.product.view.thirdCodeProduct").$D("三方编码"),
            },
            {
              formRow: 3,
              fieldCode: "itemCategoryName",
              fieldName: $T("smpc.product.model.itemCategory").$D("品类"),
            },
            {
              formRow: 4,
              fieldCode: "skuStock",
              fieldName: $T("smpc.product.model.productStock").$D("商品库存"),
              render: (val) => Number(val) > 0 ? val : $T("smpc.product.model.noLimitStock").$D("无限库存"),
            },
            {
              formRow: 4,
              fieldCode: "marketPrice",
              fieldName: $T("smpc.product.model.marketPrice").$D("市场价"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              formRow: 5,
              fieldCode: "itemCode",
              fieldName: $T("smpc.product.model.itemCode").$D("物料编码"),
            },
            {
              formRow: 5,
              fieldCode: "itemName",
              fieldName: $T("smpc.product.model.itemName").$D("物料名称"),
            },
            {
              formRow: 6,
              fieldCode: "productLabel",
              fieldName: $T("smpc.product.view.productLabel").$D("商品标签"),
              render: (val, item) =>
                <div class="sku-labels" style="flex-wrap: wrap;">
                  {
                    item.labels && item.labels.length > 0 && item.labels.map((m) => <p
                      style={{
                        color: colors[m.labelColorCode] ? colors[m.labelColorCode]["label-preview-color"] : "",
                        borderColor: colors[m.labelColorCode] ? colors[m.labelColorCode]["label-preview-border-color"] : "",
                        backgroundColor: colors[m.labelColorCode] ? colors[m.labelColorCode]["label-preview-background-color"] : "",
                      }}
                      class="sku-label word-detail"
                    >
                      {m.labelName}
                    </p>) || "-"
                  }
                </div>
            },
            {
              formRow: 7,
              fieldCode: "customSku",
              fieldName: $T("smpc.product.view.customSku").$D("定制品"),
              render: (val, item) => item.customFlag === 1 ? <span style="color: var(--color-other-default-b);">
                {$T("smpc.product.button.lookCustomSkuInfo").$D("查看定制品信息")}</span> : "-",
              callBack: () => {
                this.openPopup("customSku", {});
              },
            },
          ];
        case "productGroupInfoDetail":
          return [
            {
              formRow: 2,
              fieldCode: "spuCode",
              fieldName: $T("smpc.product.view.spuCode").$D("商品组编码"),
            },
            {
              formRow: 3,
              fieldCode: "spuName",
              fieldName: $T("smpc.product.view.spuName").$D("商品组名称"),
            },
            {
              formRow: 4,
              fieldCode: "categoryNamePath",
              fieldName: $T("smpc.product.model.platCategory").$D("平台分类"),
            },
            {
              formRow: 5,
              fieldCode: "catalogName",
              fieldName: $T("smpc.product.model.mallCatalog").$D("商城目录"),
            },
            {
              formRow: 6,
              fieldCode: "supplierCompanyName",
              fieldName: $T("smpc.product.model.supplier").$D("供应商"),
            },
            {
              formRow: 7,
              fieldCode: "companyName",
              fieldName: $T("smpc.product.model.purchaser").$D("采购方"),
            },
          ];
        case "priceInfoDetail":
          return [
            {
              formRow: 1,
              fieldCode: "lineNum",
              fieldName: $T("smpc.product.view.displayOrderSeq").$D("序号"),
            },
            {
              formRow: 2,
              fieldCode: "shelfErrorMessageMeaning",
              fieldName: $T("smpc.product.view.shelfErrorMessage").$D("失败原因"),
            },
            {
              formRow: 2,
              fieldCode: "uomName",
              fieldName: $T("smpc.product.view.uom").$D("单位"),
            },
            {
              formRow: 3,
              fieldCode: "tax",
              fieldName: $T("smpc.product.view.taxRate").$D("税率"),
            },
            {
              formRow: 3,
              fieldCode: "currencyName",
              fieldName: $T("smpc.product.view.currency").$D("币种"),
            },
            {
              formRow: 4,
              fieldCode: "agreementTaxedPrice",
              fieldName: $T("smpc.product.view.taxedPrice").$D("单价(含税)"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              formRow: 4,
              fieldCode: "agreementPrice",
              fieldName: $T("smpc.product.view.noTaxedPrice").$D("单价(不含税)"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              formRow: 5,
              fieldCode: "priceTypeMeaning",
              fieldName: $T("smpc.product.view.priceType").$D("价格类型"),
              render: (val, item) => item.priceType === "LADDER_PRICE" ? <span style="color: var(--color-other-default-b);">
                {$T("smpc.product.view.ladderPrice").$D("阶梯价格")}</span> : val || "-",
              callBack: (item) => {
                if (item.priceType === "LADDER_PRICE") {
                  this.openPopup("ladderPrice", item.skuSalesLadders);
                }
              },
            },
            {
              formRow: 5,
              fieldCode: "priceHiddenFlagMeaning",
              fieldName: $T("smpc.product.view.priceHidden").$D("隐藏价格"),
            },
            {
              formRow: 6,
              fieldCode: "shippingRuleName",
              fieldName: $T("smpc.product.view.freightRule").$D("运费规则"),
              render: (val, item) => item.freeShippingFlag === 1 ? `${$T("smpc.product.view.freeShipping").$D("包邮")}` : val
            },
            {
              formRow: 6,
              fieldCode: "skuSalesRegions",
              fieldName: $T("smpc.product.view.postRegion").$D("送货区域"),
              render: (val, item) => item.skuSalesRegions && item.skuSalesRegions.length > 0 ? <span style="color: var(--color-other-default-b);">
                {$T("smpc.product.button.lookPostRegion").$D("查看区域")}</span> : $T("smpc.product.model.allRegion").$D("所有区域"),
              callBack: (item) => {
                if (item.skuSalesRegions && item.skuSalesRegions.length > 0) {
                  this.openPopup("postRegion", item.skuSalesRegions);
                }
              },
            },
            {
              formRow: 7,
              fieldCode: "orderQuantity",
              fieldName: $T("smpc.product.view.orderQuantity").$D("起订量"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              formRow: 7,
              fieldCode: "minPackageQuantity",
              fieldName: $T("smpc.product.view.minPackageQuantity").$D("最小包装量"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              formRow: 8,
              fieldCode: "skuSalesUnits",
              fieldName: $T("smpc.product.view.buyOrganizations").$D("采买组织"),
              render: (val, item) => item.skuSalesUnits && item.skuSalesUnits.length > 0 ? <span style="color: var(--color-other-default-b);">
                {$T("smpc.product.button.lookSkuSalesUnits").$D("查看采买组织")}</span> : $T("smpc.product.model.allOrganizations").$D("所有组织"),
              callBack: (item) => {
                if (item.skuSalesUnits && item.skuSalesUnits.length > 0) {
                  this.openPopup("skuSalesUnits", item.skuSalesUnits);
                }
              },
            },
            {
              formRow: 8,
              fieldCode: "priceLibNumber",
              fieldName: $T("smpc.product.view.proceLinNum").$D("价格库编码"),
            },
            {
              formRow: 9,
              fieldCode: "deliveryDay",
              fieldName: $T("smpc.product.view.deliveryDayC").$D("交货周期(天)"),
            },
            {
              formRow: 9,
              fieldCode: "guaranteeDay",
              fieldName: $T("smpc.product.view.guaranteeDayC").$D("质保期(天)"),
            },
            {
              formRow: 10,
              fieldCode: "validDate",
              fieldName: $T("smpc.product.view.validDate").$D("有效期"),
              render: (val, item) => `${item.validDateFrom || ""} ~ ${item.validDateTo || ""}`
            },
            {
              formRow: 11,
              fieldCode: "remarkMeaning",
              fieldName: $T("smpc.product.view.remark").$D("备注"),
            },
          ];
        case "basicAttr":
          if (this.basicAttrColumns.length === 0) {
            return [
              {
                formRow: 1,
                fieldCode: "title",
                fieldType: "EMPTY",
                render: () => <span style="font-size: 12px;color: #333333;font-weight: 500;font-family: Alibaba-PuHuiTi-M;">
                  {$T("smpc.product.view.baseInfoAttr").$D("基本属性")}
                </span>,
              },
              {
                formRow: 2,
                fieldCode: "noContent",
                fieldType: "EMPTY",
                render: () => <span style="color: #757575;">
                  {$T("smpc.product.view.noAttrF").$D("暂无属性")}
                </span>,
              },
            ];
          }
          return [
            {
              formRow: 0,
              fieldCode: "title",
              fieldType: "EMPTY",
              render: () => <span style="font-size: 12px;color: #333333;font-weight: 500;font-family: Alibaba-PuHuiTi-M;">
                {$T("smpc.product.view.baseInfoAttr").$D("基本属性")}
              </span>,
            },
            ...this.basicAttrColumns
          ];
        case "specsAttr":
          if (this.specsAttrColumns.length === 0) {
            return [
              {
                formRow: 1,
                fieldCode: "title",
                fieldType: "EMPTY",
                render: () => <span style="font-size: 12px;color: #333333;font-weight: 500;font-family: Alibaba-PuHuiTi-M;">
                  {$T("smpc.product.view.specAttr").$D("规格属性")}
                </span>,
              },
              {
                formRow: 2,
                fieldCode: "noContent",
                fieldType: "EMPTY",
                render: () => <span style="color: #757575;">
                  {$T("smpc.product.view.noAttrF").$D("暂无属性")}
                </span>,
              },
            ];
          }
          return [
            {
              formRow: 1,
              fieldCode: "title",
              fieldType: "EMPTY",
              render: () => <span style="font-size: 12px;color: #333333;font-weight: 500;font-family: Alibaba-PuHuiTi-M;">
                {$T("smpc.product.view.specAttr").$D("规格属性")}
              </span>,
            },
            ...this.specsAttrColumns
          ];
        case "saleAttr":
          if (this.saleAttrColumns.length === 0) {
            return [
              {
                formRow: 1,
                fieldCode: "title",
                fieldType: "EMPTY",
                render: () => <span style="font-size: 12px;color: #333333;font-weight: 500;font-family: Alibaba-PuHuiTi-M;">
                  {$T("smpc.product.view.saleAttr").$D("销售属性")}
                </span>,
              },
              {
                formRow: 2,
                fieldCode: "noContent",
                fieldType: "EMPTY",
                render: () => <span style="color: #757575;">
                  {$T("smpc.product.view.noAttrF").$D("暂无属性")}
                </span>,
              },
            ];
          }
          return [
            {
              formRow: 1,
              fieldCode: "title",
              fieldType: "EMPTY",
              render: () => <span style="font-size: 12px;color: #333333;font-weight: 500;font-family: Alibaba-PuHuiTi-M;">
                {$T("smpc.product.view.saleAttr").$D("销售属性")}
              </span>,
            },
            ...this.saleAttrColumns
          ];
        case "afterSaleServices":
          return [
            {
              formRow: 1,
              fieldCode: "returnSpecial",
              fieldName: $T("smpc.product.view.refunds").$D("退货"),
              render: (val, item) => {
                if (val === 1) {
                  return <span>{$T("smpc.product.view.noRefunds").$D("特殊商品，一经签收不予退货")}</span>;
                } else if (val === 2) {
                  return <span>{$T("smpc.product.view.noLimitRefunds").$D("该商品支持不限次数退货")}</span>;
                }
                return <span>{$T("smpc.product.view.returnDuration", [ item.returnDuration ]).$D("确认收货后{returnDuration}日内出现质量问题可申请退货")}</span>;
              }
            },
            {
              formRow: 2,
              fieldCode: "changeSpecial",
              fieldName: $T("smpc.product.view.exchange").$D("换货"),
              render: (val, item) => {
                if (val === 1) {
                  return <span>{$T("smpc.product.view.noExchange").$D("特殊商品，一经签收不予换货")}</span>;
                } else if (val === 2) {
                  return <span>{$T("smpc.product.view.noLimitExchange").$D("该商品支持不限次数换货")}</span>;
                }
                return <span>{$T("smpc.product.view.changeDuration", [ item.changeDuration ]).$D("确认收货后{changeDuration}日内出现质量问题可申请换货")}</span>;
              }
            },
            {
              formRow: 3,
              fieldCode: "qualityDuration",
              fieldName: $T("smpc.product.view.warranty").$D("质保"),
              render: (val) => $T("smpc.product.view.qualityDuration", [ val ]).$D("质保限期{name}个月")
            },
            {
              formRow: 4,
              fieldCode: "instruction",
              fieldName: $T("smpc.product.view.specialAfs").$D("特殊售后说明"),
            },
          ];
        case "thirdInfo":
          return [
            {
              formRow: 1,
              fieldCode: "supplierItemCode",
              fieldName: $T("smpc.product.model.supplierItemCode").$D("供应商物料号"),
            },
            {
              formRow: 2,
              fieldCode: "supplierItemName",
              fieldName: $T("smpc.product.model.supplierItemName").$D("供应商物料名称"),
            },
            {
              formRow: 3,
              fieldCode: "manufacturerInfo",
              fieldName: $T("smpc.product.model.manufacturerName").$D("制造商名称"),
            },
            {
              formRow: 4,
              fieldCode: "manufacturerItemCode",
              fieldName: $T("smpc.product.model.manufacturerItemCode").$D("制造商物料号"),
            },
            {
              formRow: 5,
              fieldCode: "manufacturerItemName",
              fieldName: $T("smpc.product.model.manufacturerItemName").$D("制造商物料名称"),
            },
          ];
        case "customSkuTitle":
          return [
            {
              formRow: 1,
              fieldCode: "attrGroupName",
              fieldType: "EMPTY",
              render: (val) => <span style="font-size: 12px;color: #333333;font-weight: 500;font-family: Alibaba-PuHuiTi-M;">
                {val}
              </span>,
            },
          ];
        case "customSkuAttr":
          return [
            {
              formRow: 1,
              fieldCode: "saleUnitTypeMeaning",
              fieldName: $T("smpc.product.model.oldSaleUomTypes").$D("原销售单位类型"),
            },
            {
              formRow: 2,
              fieldCode: "shipper",
              fieldName: $T("smpc.product.view.forwardUom").$D("辅助单位"),
            },
          ];
        case "customSku":
          return [
            {
              formRow: 1,
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>
                  {$T("smpc.product.view.name").$D("名称")}： {item.componentName}
                </span>
              </SrmListHeader>
            },
            {
              formRow: 2,
              fieldCode: "orderSeq",
              fieldName: $T("smpc.product.view.sort").$D("排序"),
              render: (val) => val === 0 ? "0" : val,
            },
            {
              formRow: 2,
              fieldCode: "componentTypeMeaning",
              fieldName: $T("smpc.product.view.componentType").$D("组件类型"),
            },
            {
              formRow: 3,
              fieldCode: "unitCoefficient",
              fieldName: $T("smpc.product.view.uomFactor").$D("单位系数"),
            },
            {
              formRow: 3,
              fieldCode: "requiredFlag",
              fieldName: $T("smpc.product.view.ynRequired").$D("是否必填"),
              render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
            },
          ];
        case "customSkuOther":
          return [
            {
              formRow: 1,
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>
                  {$T("smpc.product.view.name").$D("名称")}： {item.componentName}
                </span>
              </SrmListHeader>
            },
            {
              formRow: 2,
              fieldCode: "orderSeq",
              fieldName: $T("smpc.product.view.sort").$D("排序"),
              render: (val) => val === 0 ? "0" : val,
            },
            {
              formRow: 2,
              fieldCode: "componentTypeMeaning",
              fieldName: $T("smpc.product.view.componentType").$D("组件类型"),
            },
            {
              formRow: 3,
              fieldCode: "inputMethodMeaning",
              fieldName: $T("smpc.product.model.inputMethod").$D("录入方式"),
            },
            {
              formRow: 3,
              fieldCode: "customAttrValueName",
              fieldName: $T("smpc.product.view.valueOrCode").$D("值/值集"),
            },
            {
              formRow: 4,
              fieldCode: "remark",
              fieldName: $T("smpc.product.view.examples").$D("示例说明"),
            },
          ];
        case "ladderPrice":
          return [
            {
              formRow: 1,
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>
                  {$T("smpc.product.view.count").$D("数量")}： {item.ladderFrom || ""} ～ {item.ladderTo || ""}
                </span>
              </SrmListHeader>
            },
            {
              formRow: 2,
              fieldCode: "unitPrice",
              fieldName: $T("smpc.product.model.noTaxPrice").$D("未税单价"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              formRow: 2,
              fieldCode: "taxPrice",
              fieldName: $T("smpc.product.model.taxPrice").$D("含税单价"),
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
          ];
        case "postRegion":
          return [
            {
              formRow: 1,
              fieldCode: "regionCode",
              fieldType: "EMPTY",
              render: (val) => <srm-flex>
                <span style="font-weight: 600;">{ $T("smpc.product.view.regionCode").$D("区域编码")}: {val}</span>
              </srm-flex>
            },
            {
              formRow: 2,
              fieldCode: "regionName",
              fieldName: $T("smpc.product.view.regionName").$D("区域名称"),
            },
          ];
        case "skuSalesUnits":
          return [
            {
              formRow: 1,
              fieldCode: "unitCode",
              fieldType: "EMPTY",
              render: (val) => <srm-flex>
                <span style="font-weight: 600;">{$T("smpc.product.view.unitCode").$D("组织编码")}: {val}</span>
              </srm-flex>
            },
            {
              formRow: 2,
              fieldCode: "unitName",
              fieldName: $T("smpc.product.view.unitName").$D("组织名称"),
            },
          ];
        default:
          break;
        }
      };
    }
  },
  mounted() {
    // 调用接口
    if (this.parameters.spuId) {
      this.$loading.show();
      // 商品信息和商品组信息
      getAllProductApi(this.parameters.spuId, {
        customizeUnitCode: "SMPC.WORKBENCH_PUR.BASE_INFO_READ,SMPC.WORKBENCH_PUR.BASE_INFO_COMPARE,SMPC.WORKBENCH_PUR.SKU_INFO_READ,SMPC.WORKBENCH_PUR.SKU_INFO_COMPARE,SMPC.WORKBENCH_SUP.BASE_INFO_READ,SMPC.WORKBENCH_SUP.BASE_INFO_COMPARE,SMPC.WORKBENCH_SUP.SKU_INFO_READ,SMPC.WORKBENCH_SUP.SKU_INFO_COMPARE",
        skuTemporaryId: this.parameters.skuTemporaryId,
        spuId: this.parameters.spuId,
        supFlag: 0
      }).then((res) => {
        // 根据spuId到当前商品信息
        let data = res.skuList && res.skuList.length === 1 ? res.skuList[0] : res.skuList.find((val) => val.skuId === this.parameters.skuId);
        // 把数据传给父组件
        this.$emit("setData", data);
        console.log("setData", data);
        this.introduction = data.introduction;
        document.getElementById("productIntro").innerHTML = this.introduction;
        this.productInfoDataSet.setData([ { ...data, customFlag: res.customFlag } ]);
        this.thirdInfoDataSet.setData([ { ...data } ]);
        this.productGroupInfoDataSet.setData([ { ...res } ]);
        // 价格信息增加序号
        data.skuSalesInfos.forEach((element, index) => {
          element["lineNum"] = index + 1;
        });
        this.priceInfoDataSet.setData(data.skuSalesInfos || []);
        this.afterSaleServicesDataSet.setData([ { ...data.afterSale } ]);
        // 商品属性
        getProductAttrApi(res.categoryId, {
          categoryId: res.categoryId,
          enabledFlag: 1,
        }).then((item) => {
          let obj = {
            saleAttrVal: {},
            saleAttrValFlag: false,
            basicAttrVal: {
              brandName: data.brandName || "",
              model: data.model || "",
              packingList: data.packingList || "",
            },
            basicAttrValFlag: true,
            specsAttrVal: {},
            specsAttrValFlag: false,
          };
          let commonAttr = [];
          // 默认字段
          if (data.skuAttrList && data.skuAttrList.length > 0) {
            commonAttr = [ ...data.skuAttrList ];
          }
          // 自定义字段
          if (data.skuAttrExtendList && data.skuAttrExtendList.length > 0) {
            data.skuAttrExtendList.map((val) => {
              val["attributeCode"] = val.attrExtendId;
              val["attributeName"] = val.attrName;
              // 销售属性
              if (val.attrType === 1) {
                obj.saleAttrValFlag = true;
                obj.saleAttrVal[val.attributeCode] = val.attrValue;
              }
              // 基本属性
              if (val.attrType === 2) {
                obj.basicAttrValFlag = true;
                obj.basicAttrVal[val.attributeCode] = val.attrValue;
              }
              // 规格属性
              if (val.attrType === 3) {
                obj.specsAttrValFlag = true;
                obj.specsAttrVal[val.attributeCode] = val.attrValue;
              }
              this.setColumns(val.attrType, val);
            });
          }
          item && item.length > 0 && item.map((val) => {
            let attr = commonAttr.find((c) => c.attrId === val.attrId);
            if (val.operationType !== 0 || attr) {
              if (attr) {
                // 销售属性
                if (attr.attrType === 1) {
                  obj.saleAttrValFlag = true;
                  obj.saleAttrVal[attr.attributeCode] = this.uniqueValue(attr.attributeCode, attr.attrValueName || attr.description);
                }
                // 基本属性
                if (attr.attrType === 2) {
                  obj.basicAttrValFlag = true;
                  obj.basicAttrVal[attr.attributeCode] = this.uniqueValue(attr.attributeCode, attr.attrValueName || attr.description);
                }
                // 规格属性
                if (attr.attrType === 3) {
                  obj.specsAttrValFlag = true;
                  obj.specsAttrVal[attr.attributeCode] = this.uniqueValue(attr.attributeCode, attr.attrValueName || attr.description);
                }
                this.setColumns(attr.attrType, val);
              } else {
                this.setColumns(val.operationType, val);
              }
            }
          });
          this.basicAttrDataSet.setData(obj.basicAttrValFlag ? [ obj.basicAttrVal ] : [ {} ]);
          this.specsAttrDataSet.setData(obj.specsAttrValFlag ? [ obj.specsAttrVal ] : [ {} ]);
          this.saleAttrDataSet.setData(obj.saleAttrValFlag ? [ obj.saleAttrVal ] : [ {} ]);
          this.$loading.hide();
        }).catch(() => {
          this.$loading.hide();
        });
      }).catch(() => {
        this.$loading.hide();
      });
    }
  },
  methods: {
    // 特殊字段值处理
    uniqueValue(code, value) {
      switch (code) {
      case "000000000008": // 税率
        return value ? `${value}%` : "";
      case "000000000006": // 重量
        return value ? value.split(",").join("") : "";
      case "000000000007": // 包装尺寸
        return value ? `${value.split(",").join(" x ")} mm` : "";
      default:
        return value;
      }
    },
    // 动态生成商品属性的字段
    setColumns(type, val) {
      let formRow = 0;
      switch (type) {
      case 1:
        if (this.saleAttrColumns.length === 0) {
          formRow = 2;
        } else if (this.saleAttrColumns.length % 2 > 0) {
          formRow = this.saleAttrColumns[this.saleAttrColumns.length - 1].formRow;
        } else if (this.saleAttrColumns.length % 2 === 0) {
          formRow = this.saleAttrColumns[this.saleAttrColumns.length - 1].formRow + 1;
        }
        this.saleAttrColumns.push({
          formRow: formRow,
          fieldCode: val.attributeCode,
          fieldName: val.attributeName
        });
        break;
      case 2:
        if (this.basicAttrColumns.length === 0) {
          formRow = 2;
        } else if (this.basicAttrColumns.length % 2 > 0) {
          formRow = this.basicAttrColumns[this.basicAttrColumns.length - 1].formRow;
        } else if (this.basicAttrColumns.length % 2 === 0) {
          formRow = this.basicAttrColumns[this.basicAttrColumns.length - 1].formRow + 1;
        }
        this.basicAttrColumns.push({
          formRow: formRow,
          fieldCode: val.attributeCode,
          fieldName: val.attributeName
        });
        break;
      case 3:
        if (this.specsAttrColumns.length === 0) {
          formRow = 2;
        } else if (this.specsAttrColumns.length % 2 > 0) {
          formRow = this.specsAttrColumns[this.specsAttrColumns.length - 1].formRow;
        } else if (this.specsAttrColumns.length % 2 === 0) {
          formRow = this.specsAttrColumns[this.specsAttrColumns.length - 1].formRow + 1;
        }
        this.specsAttrColumns.push({
          formRow: formRow,
          fieldCode: val.attributeCode,
          fieldName: val.attributeName
        });
        break;
      default:
        break;
      }
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "basicInfo": $T("smpc.product.view.baseInfo").$D("基本信息"),
        "priceInfo": $T("smpc.product.view.priceInfo").$D("价格信息"),
        "productAttr": $T("smpc.product.view.productAttr").$D("商品属性"),
        "afterSaleServices": $T("smpc.product.view.afterSaleServices").$D("售后服务"),
        "thirdInfo": $T("smpc.product.view.thirdInfo").$D("第三方信息"),
        "productIntro": $T("smpc.product.view.productIntro").$D("商品介绍"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCodeDefine(key) {
      const codeList = {
        "productInfo": "SMBL.WORKFLOW.SUPPLIER_SHELVES_BASIC_INFO_PRODUCT_INFO",
        "productGroupInfo": "SMBL.WORKFLOW.SUPPLIER_SHELVES_BASIC_INFO_PRODUCT_GROUPP",
        "priceInfo": "SMBL.WORKFLOW.SUPPLIER_SHELEVES_PRODUCT_PRICE_INFO",
        "afterSaleServices": "SMBL.WORKFLOW.SUPPLIER_SHELEVES_AFTERSALE_SERVICE",
        "thirdInfo": "SMBL.WORKFLOW.SUPPLIER_SHELEVES_PRODUCT_THIRD_INFO",
      };
      return codeList[key] || key;
    },
    // 弹框
    openPopup(name, item) {
      this.customSkuPopup = false;
      this.ladderPricePopup = false;
      this.postRegionPopup = false;
      this.skuSalesUnitsPopup = false;
      this.otherPopup = false;
      this.popupData = null;
      switch (name) {
      // 定制品
      case "customSku":
        this.$loading.show();
        getCustomSkuApi(this.parameters.spuId).then((res) => {
          let priceData = [];
          let data = [];
          res.map((val) => {
            val["customSkuDataSet"] = new DataSet(commonDs());
            val["customSkuDataSet"].setData(val.customDetailList);
            if (val.pricingFlag === 1) {
              priceData.push(val);
            } else {
              data.push(val);
            }
          });
          this.popupData = [ ...priceData, ...data ];
          this.visiblePopup = true;
          this.customSkuPopup = true;
          this.$loading.hide();
        });
        break;
      // 阶梯价格
      case "ladderPrice":
        this.ladderPriceDataSet.setData(item);
        setTimeout(() => {
          this.visiblePopup = true;
          this.ladderPricePopup = true;
        }, 0);
        break;
      // 送货区域
      case "postRegion":
        this.postRegionDataSet.setData(item);
        setTimeout(() => {
          this.visiblePopup = true;
          this.postRegionPopup = true;
        }, 0);
        break;
      // 采买组织
      case "skuSalesUnits":
        this.skuSalesUnitsDataSet.setData(item);
        setTimeout(() => {
          this.visiblePopup = true;
          this.skuSalesUnitsPopup = true;
        }, 0);
        break;
      default:
        this.popupData = {
          data: item,
          columns: `${name}Detail`,
          code: `${name}Detail`,
        };
        setTimeout(() => {
          this.visiblePopup = true;
          this.otherPopup = true;
        }, 0);
        break;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.productIntro {
  padding: 16px 15px;
  >>> img {
    width: 100% !important;
    height: auto;
  }
}
.sku-labels {
  display: flex;
  flex-wrap: nowrap;
  margin-top: -6px;
  .sku-label {
    border-radius: 2px;
    cursor: pointer;
    padding: 0 5px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    border: 1px solid;
    margin-right: 5px;
    margin-top: 6px;
  }
}
 .word {
    max-width: 100px;
    overflow-x: hidden;
    min-width: 40px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .word-detail {
    min-width: 30px;
    max-width: 100px;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
  }
</style>