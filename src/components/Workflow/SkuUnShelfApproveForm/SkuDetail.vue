<template>
  <srm-scroll-tab>
    <srm-scroll-tab-item :label="$T('smpc.product.view.baseInfo').$D('基本信息')" code="baseInfo">
      <srm-form :data-set="formDS" :columns="getBasicColumns" :customize-code="getCustomizeCode" />
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('smpc.product.view.priceInfo').$D('价格信息')" code="priceInfo">
      <srm-list :scrollable="false" :data-set="formDS" :columns="getPriceColumns" :customize-code="getPriceCustomizeCode" />
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('smpc.product.view.productAttr').$D('商品属性')" code="skuAttr">
      <srm-form :data-set="attrDS" :columns="getSkuAttrColumns" />
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('smpc.product.model.itemInfo').$D('物料信息')" code="skuItemInfo">
      <srm-form :data-set="formDS" :columns="getSkuItemColumns" :customize-code="getItemCustomizeCode" />
    </srm-scroll-tab-item>

    <srm-popup :visible.sync="descriptionVisible"
               :title="$T('smpc.product.view.title.skuDescription').$D('商品描述')"
               :position="'bottom'"
               :height="'80%'"
               rounded>
      <html-view :html="formData.description" />
    </srm-popup>
  </srm-scroll-tab>
</template>

<script>
import { $T, DataSet } from "srm-mobile-ui";
import Image from "../../Image.vue";
import HtmlView from "@/modules/SkuPreview/components/HtmlView.vue";
import NewSrmListHeader from "../../NewSrmListHeader.vue";
import { getECSkuDetailApi, getCataSkuDetailApi } from "./api";
import colors from "./datasource/colors";
import skuDetailDs from "./datasource/skuDetailDs";
export default {
  modules: ["hzero.common", "smpc.product", "sagm.common", "hipspfm.common", "smpc.workbench"],
  name: "EcSkuShelfApprove",
  components: { HtmlView },
  props: {
    skuId: {
      type: String,
      default: null,
    },
    sourceFrom: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formDS: new DataSet(skuDetailDs()),
      attrDS: new DataSet({ editable: false, enableQuery:false, }),
      descriptionVisible: false,
      attrList: [],
      formData: {},
    };
  },
  computed: {
    // 基本信息个性化编码
    getCustomizeCode() {
      return this.sourceFrom === "CATA" ? "SMBL.WORKFLOW.CATA_SKU_UNSHELF.BASE_INFO" : "SMBL.WORKFLOW.EC_SKU_UNSHELF.BASE_INFO";
    },
    // 价格信息个性化编码
    getPriceCustomizeCode() {
      return this.sourceFrom === "CATA" ? "SMBL.WORKFLOW.CATA_SKU_UNSHELF.PRICE_INFO" : "SMBL.WORKFLOW.EC_SKU_UNSHELF.PRICE_INFO";
    },
    // 物料信息个性化编码
    getItemCustomizeCode() {
      return this.sourceFrom === "CATA" ? "SMBL.WORKFLOW.CATA_SKU_UNSHELF.ITEM_INFO" : "SMBL.WORKFLOW.EC_SKU_UNSHELF.ITEM_INFO";
    },
    // 基本信息
    getBasicColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, record) => <NewSrmListHeader show-open-tag={false}>
            {record.skuName ? record.skuName : "-"}
          </NewSrmListHeader>,
        },
        {
          fieldCode: "imagePath",
          fieldName: $T("smpc.product.view.skuImage").$D("商品图片"),
          formRow: 10,
          render: (val) => <Image src={val} width={40} height={40}/>,
        },
        {
          fieldCode: "skuCode",
          fieldName: $T("smpc.product.view.skuCode").$D("商品编码"),
          formRow: 10,
        },
        {
          fieldCode: "supplierCompanyName",
          fieldName: $T("smpc.product.model.supplier").$D("供应商"),
          formRow: 20,
        },
        {
          fieldCode: "categoryName",
          fieldName: $T("sagm.common.model.plateformCategory").$D("平台分类"),
          formRow: 30,
        },
        {
          fieldCode: "catalogName",
          fieldName: $T("smpc.product.model.productCatalog").$D("商品目录"),
          formRow: 40,
        },
        {
          fieldCode: "introductions",
          fieldName: $T("smpc.product.view.title.skuDescription").$D("商品描述"),
          formRow: 50,
          render: (val, record) => <SrmButton onClick={() => this.handlePop(record)} plain rect style={{ fontSize: "14px" }}>{this.$T("hipspfm.common.button.view").$D("查看")}</SrmButton>,
        },
        {
          fieldCode: "labels",
          fieldName: $T("smpc.product.view.skuLabel").$D("商品标签"),
          formRow: 60,
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
            </div>,
        },
      ];
    },
    // 价格信息
    getPriceColumns() {
      return [
        {
          fieldCode: "agreementTaxedPrice",
          formRow: 10,
        },
        {
          fieldCode: "agreementPrice",
          formRow: 20,
        },
        {
          fieldCode: "marketPrice",
          formRow: 30,
          render: (val, record) => record?.skuPreviewInfoDTO?.platPrice,
        },
        {
          fieldCode: "uomName",
          formRow: 30,
        },
        {
          fieldCode: "tax",
          formRow: 40,
        },
        {
          fieldCode: "currencyName",
          formRow: 40,
        },
      ];
    },
    // 商品属性
    getSkuAttrColumns() {
      return this.attrList.map((attr, index) => {
        const { attrCode, attrName } = attr;
        return {
          fieldCode: attrCode || attrName,
          fieldName: attrName,
          formRow: (index + 1) * 10,
        };
      });
    },
    // 物料信息
    getSkuItemColumns() {
      return [
        {
          fieldCode: "itemCode",
          formRow: 10,
        },
        {
          fieldCode: "itemName",
          formRow: 20,
        },
        {
          fieldCode: "itemCategoryCode",
          formRow: 30,
        },
        {
          fieldCode: "itemCategoryName",
          formRow: 40,
        },
      ];
    },
  },
  mounted() {
    const api = this.sourceFrom === "CATA" ? getCataSkuDetailApi : getECSkuDetailApi;
    api(this.skuId).then((res) => {
      if (res) {
        this.formData = res;
        this.formDS.create({
          ...res?.skuSalesInfos?.[0],
          ...res,
        });
        const { skuAttrList, skuAttrExtendList } = res;
        this.attrList = [...skuAttrList || [], ...skuAttrExtendList || []];
        const attrData = {};
        this.attrList.forEach((attr) => {
          const { attrCode, attrName, attrValueName, attrValue, description } = attr || {};
          attrData[attrCode || attrName] = attrValueName || description || attrValue;
        });
        this.attrDS.create(attrData);
      }
    });
  },
  methods: {
    handlePop() {
      this.descriptionVisible = true;
    },
  },
};
</script>
