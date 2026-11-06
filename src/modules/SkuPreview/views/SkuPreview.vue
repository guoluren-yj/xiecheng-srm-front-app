<template>
  <div style="height: 100vh; overflow: hidden auto">
    <nav-head
      :title="$T('smpc.product.view.viewSku').$D('查看商品')"
      @goBack="goBack"
      @goClose="goClose"/>
    <srm-swiper :key="key" auto height="375px" :preload="(skuInfo.skuImageList || []).length" enabled>
      <srm-swiper-item v-for="item in skuInfo.skuImageList" :key="item.mediaId">
        <div class="banner-item-wrap">
          <img v-if="item.mediaType !== 1" :src="item.mediaPath">
          <video ref="previewVideo" width="100%" height="375" controls muted preload="auto">
            <source :src="item.mediaPath" type="video/mp4" >
            {{ $T('smpc.product.view.videoNotSupport').$D('暂不支持视频') }}
          </video>
        </div>
      </srm-swiper-item>
    </srm-swiper>
    <div class="sku-main-info">
      <p class="price-area">
        <span class="sku-big-price">
          {{ $T("smpc.product.view.includeTacPrice").$D("含税：") }}
          <span>￥</span>
          <span style="font-size: 26px">{{ outPara.unitPrice || '-' }}</span>
          <span>/{{ outPara.uom || '-' }}</span>
        </span>
        <span class="sku-small-price">
          {{ $T("smpc.product.view.excludeTacPrice").$D("不含税：") }}
          <span>￥{{ outPara.unTaxedPrice || '-' }}</span>
        </span>
      </p>
      <p class="sku-name">{{ skuInfo.skuName }}</p>
      <p class="sku-sub-title">{{ skuInfo.skuTitle }}</p>
      <div v-if="showLabel" class="sku-tag-wrap">
        <div
          v-for="m in skuInfo.labels"
          :key="m.id"
          class="sku-tag-item"
          :style="getLabelStyle(m)">
          {{ m.labelName }}
        </div>
      </div>
      <div class="sku-spec">
        <div
          v-for="m in skuSpecList"
          :key="m.id"
          class="sku-spec-item"
          :style="getLabelStyle(m)">
          {{ m.saleName }}：
          <div v-for="(i, idx) in m.saleAttr" :key="idx" class="sku-sales">
            <div
              :class="{
                'sku-sale-col': true,
                // 'sku-sale-col-selected': (i.skuIds || []).includes(skuId),
                // 'sku-sale-col-disabled': getSkuIsExit(i.skuIds, m.dim),
              }">
              <span>{{ i.saleValue }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('smpc.product.model.productIntro').$D('商品介绍')">
        <html-view :html="skuInfo.introduction" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('smpc.product.model.inferenceIntro').$D('参考信息')">
        <srm-form
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="inferenceInfoDs"
          :columns="getInferenceColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('smpc.product.model.specifications').$D('规格参数')">
        <div class="sku-attrs">
          <div v-for="(item, idx) in attrList" :key="idx" class="spec-row">
            <div v-for="i in item" :key="i.attrId" class="attr-col">
              <div class="attr-col-wrapper">
                <div class="spec-label">
                  {{ i.attributeName || i.attrName }}:
                </div>
                <div class="spec-value">
                  <overflow-tip
                    :title="i.attrValueName || i.attrValue || i.description"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { fetchSkuInfo, fetchSkus } from "../api/index";
import { inferenceInfoDS } from "../store/ds";
import HtmlView from "../components/HtmlView.vue";
import NavHead from "../components/NavHead";
import OverflowTip from "../components/OverflowTip.vue";
import color from "../store/color";

export default {
  modules: [ "hipspfm.common", "smpc.product" ],
  name: "SkuPreview",
  components: { HtmlView, NavHead, OverflowTip },
  data() {
    return {
      skuId: "",
      key: 0,
      skuInfo: {}, // 商品信息
      skuSpecList: [], // 销售规格
      attrList: [], // 规格参数
      outPara: {}, // 外部传入商品参数
      inferenceInfoDs: new DataSet(inferenceInfoDS()),
    };
  },
  computed: {
    getInferenceColumns() {
      return [
        {
          formRow: 2,
          seq: 10,
          fieldCode: "skuCode",
        },
        {
          formRow: 4,
          seq: 10,
          fieldCode: "thirdSkuCode",
        },
        {
          formRow: 4,
          seq: 20,
          fieldCode: "brandName",
        },
        {
          formRow: 10,
          seq: 10,
          fieldCode: "supplierCompanyName",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "itemCode",
        },
        {
          formRow: 20,
          seq: 30,
          fieldCode: "itemName",
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "categoryCode",
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "categoryName",
        },
        {
          formRow: 32,
          seq: 10,
          fieldCode: "deliveryDay",
          render: (val) => `${val}${$T("smpc.product.view.day").$D("天")}`,
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "refundsInfo",
          render: () => this.getReturnDesc(),
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "exchangeInfo",
          render: () => this.getChangeDesc(),
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "warrantyInfo",
          render: () => this.getQualityDesc(),
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "specialAfs",
          render: () => this.getSpecialDesc(),
        },
      ];
    },
    showLabel() {
      return this.skuInfo?.labels?.length > 0;
    },
  },
  async mounted() {
    this.outPara = this.$route.query;
    const {
      itemCode,
      itemName,
      categoryCode,
      categoryName,
      skuId = "",
      // "__-wxMdvT_QABOxfwErzMvWF3hZQ8d1vXfbPWQ55MhALQA-__"
      // __-zy4VkhBDhNHwZqB3Kd1LNPh0KIYIEYVfx1kpx5j0nAA-__
    } = this.$route.query;
    this.skuId = skuId;
    const res = await fetchSkuInfo(skuId);
    this.skuInfo = res || {};
    this.key += 1;
    // this.$refs.previewVideo?.load();
    this.inferenceInfoDs.create(
      {
        ...res,
        deliveryDay: (res.skuSalesInfos?.[0] || {}).deliveryDay,
        itemCode,
        itemName,
        categoryCode,
        categoryName,
      },
      0
    );
    // 规格信息
    fetchSkus({
      productId: skuId,
    }).then((res1) => {
      this.skuSpecList = res1 || [];
    });
    const { skuAttrList, skuAttrExtendList } = res;
    const attrList = [ ...skuAttrList || [], ...skuAttrExtendList || [] ];
    this.attrList = attrList.reduce((pre, item, idx) => {
      if (idx % 2 !== 0) {
        pre[pre.length - 1].push(item);
      }
      // 偶数
      else {
        pre.push([ item ]);
      }
      return pre;
    }, []);
  },
  methods: {
    getReturnDesc() {
      const {
        returnDesc,
        returnSpecial = 0,
        returnDuration = "",
      } = this.skuInfo.afterSale || {};
      if (returnDesc) {
        return returnDesc;
      }
      return returnSpecial === 2 ?
        $T("smpc.product.view.noLimitRefunds").$D("该商品支持不限次数退货") :
        returnSpecial === 1 ?
          $T("smpc.product.view.noRefunds").$D("特殊商品，一经签收不予退货") :
          returnSpecial === 0 && returnDuration ?
            $T("smpc.product.view.returnDuration", [ returnDuration ]).$D(
              "确认收货后{}日内出现质量问题可申请退货"
            ) :
            "-";
    },
    getChangeDesc() {
      const {
        changeDesc,
        changeSpecial = 0,
        changeDuration = "",
      } = this.skuInfo.afterSale || {};
      if (changeDesc) {
        return changeDesc;
      }
      return changeSpecial === 2 ?
        $T("smpc.product.view.noLimitExchange").$D("该商品支持不限次数换货") :
        changeSpecial === 1 ?
          $T("smpc.product.view.noExchange").$D("特殊商品，一经签收不予换货") :
          changeSpecial === 0 && changeDuration ?
            $T("smpc.product.view.changeDuration", [ changeDuration ]).$D(
              "确认收货后{}日内出现质量问题可申请换货"
            ) :
            "-";
    },
    getQualityDesc() {
      const { qualityDesc, qualityDuration = 0 } = this.skuInfo.afterSale || {};
      if (qualityDesc) {
        return qualityDesc;
      }
      return qualityDuration ?
        $T("smpc.product.view.qualityDuration", [ qualityDuration ]).$D(
          "质保限期{}个月"
        ) :
        "-";
    },
    getSpecialDesc() {
      const { afterSaleSpecial = 0, instruction = "" } =
        this.skuInfo.afterSale || {};
      return afterSaleSpecial ? instruction : "-";
    },
    getLabelStyle(label) {
      return {
        color: color[label.labelColorCode]?.["label-preview-color"],
        borderColor: color[label.labelColorCode]?.["label-preview-color"],
        backgroundColor: "#fff",
      };
    },
    getSkuIsExit(skuIds, dim) {
      if (!skuIds || skuIds.length < 1) {
        return true;
      }
      if (skuIds.includes(this.skuId)) {
        return false;
      }
      const otherDims = this.skuSpecList.filter((f) => f.dim !== dim);
      if (otherDims.length < 1) {
        return false;
      }
      return !otherDims.every((f) => {
        const { saleAttr } = f;
        // 每层维度所选中的属性
        const attr = saleAttr?.find((sale) =>
          sale?.skuIds?.includes(this.skuId)
        );
        return skuIds.some((s) => attr?.skuIds?.includes(s));
      });
    },
    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
  },
};
</script>

<style scoped lang="stylus">
.banner-item-wrap {
  width: 100%;
  height: 375px;

  img {
    width: 100%;
    // height: 375px;
    height: -webkit-fill-available;
    display: inline-block;
    object-fit: contain;
  }
}

.sku-main-info {
  margin-top: 12px;
  margin-bottom: 16px;
  padding: 0 15px;

  &> p {
    margin-bottom: 4px;
  }

  .price-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
      .sku-small-price {
        font-size: 12px;
        color: #757575;
      }
     .sku-big-price {
        font-size: 16px;
        color: #276EF1;
        line-height: 34px;
        font-weight: 600;
    }
  }

  .sku-name {
    font-size: 16px;
    color: #333333;
    line-height: 22px;
  }

  .sku-sub-title {
    color: #AFAFAF;
    font-size: 12px;
  }

  .sku-tag-wrap {
    display: flex;
    margin-top: 8px;

    .sku-tag-item {
      font-size: 10px;
      font-weight: 500;
      border: 1px solid;
      padding: 2px 4px;
        border-radius: 2px;

      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }

  .sku-spec {
    margin-top: 8px;

    .sku-spec-item {
      font-size: 12px;
      color: #AFAFAF;
      display: flex;
      align-items: center;
    }

    .sku-sales {
      // margin-left: 6px;
      display: flex;
      flex-wrap: wrap;
      margin-top: -6px;

      .sku-sale-col {
        border-radius: 2px;
        cursor: pointer;
        height: 20px;
        margin-right: 8px;
        margin-top: 6px;
        // color: #000;
        // border: 1px solid #d9d9d9;
        display: flex;
        align-items: center;

        // > span {
        //   padding: 0 14px;
        // }
      }

      // .sku-sale-col-selected {
      //   border-color: #f44336;
      // }

      .sku-sale-col-disabled {
        background: #eee;
        border-style: dashed;
        cursor: not-allowed;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}

.sku-attrs {
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  padding: 12px 15px 16px 15px;

  .spec-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .attr-col:first-child {
      margin-right: 7px;
    }

    .attr-col {
      width: 100%;
      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      flex: 1;

      .attr-col-wrapper {
        justify-content: start;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        min-height: 20px;
        line-height: 20px;
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
      }

      .spec-label {
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 12px;
      }

      .spec-value {
        text-align: left;
        position: relative;
        flex: 1;
        font-size: 14px;
        line-height: 20px;
        color: var(--font-color-default);
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>