<template>
  <div style="height: 100vh">
    <!-- <nav-head
      dark
      class="nav-header"
      :title="$T('smpc.product.view.receiveSkuDetail').$D('领用商品详情')"
      show-close
      @goBack="goBack"
      @goClose="goClose"/> -->
    <srm-flex class="item-info">
      <srm-flex-item class="left-image">
        <common-image :width="46" :height="46" :src="getPrimaryImagePath()" />
      </srm-flex-item>
      <srm-flex-item flex="2">
        <div
          v-for="item in itemColumns"
          :key="item.label"
          class="head-item"
          :class="item.isMain ? 'head-main-item' : ''">
          <span class="label">{{ item.label }}：</span>
          <span class="value">{{ item.value || '-' }}</span>
        </div>
      </srm-flex-item>
    </srm-flex>
    <srm-scroll-tab>
      <!-- 基本信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('baseInfo')">
        <div class="base-info">
          <srm-list
            :scrollable="false"
            :data-set="baseInfoDs"
            :columns="getBaseColumns"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 商品图片 -->
      <srm-scroll-tab-item
        v-if="skuImageMaintainList.length > 0"
        :label="getLanguageDefine('skuImage')">
        <div class="image-list">
          <common-image
            v-for="item in skuImageMaintainList"
            :key="item.mediaId"
            :src="item.largeImagePath || item.mediaPath"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 商品属性 领用商品只有基本属性和规格属性 -->
      <srm-scroll-tab-item
        v-if="Object.keys(attrData).length > 0"
        :label="getLanguageDefine('skuAttr')">
        <div class="attr-info">
          <div v-if="Object.keys(attrData).length > 24" class="detail-tag" />
          <srm-list
            :scrollable="false"
            :data-set="attrDs"
            :columns="getListAttrColumns"
            @itemClick="viewAttrDetail"/>
          <!-- <div class="divider" /> -->
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 底部按钮 -->
    <srm-bottom-handler style="height:74px" :btn-arr="getButtons" type="action-sheet" />
    <!-- 弹窗 -->
    <!-- 属性详情 -->
    <srm-popup
      :visible.sync="visiblePopup"
      position="right"
      :show-header="false"
      height="100%">
      <nav-head
        :title="$T('smpc.product.view.attrSkuDetail').$D('商品属性详情')"
        show-close
        @goBack="() => (visiblePopup = false)"
        @goClose="() => (visiblePopup = false)"/>
      <customize-detail
        :need-padding="true"
        :data-source="attrData"
        :columns="attrColumns"
        code=""/>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
// import NavHead from "../components/NavHead.vue";
// import ImageMaintain from "./ImageMaintain.vue";
import { commonDs } from "../store/ds";
import { fetchSkuDetail } from "../api/index";
import CommonImage from "../components/Image.vue";
export default {
  modules: ["smpc.product", "hzero.common"],
  name: "WorkbenchList",
  components: { CommonImage },
  data() {
    return {
      baseInfoDs: new DataSet(commonDs()),
      attrDs: new DataSet(commonDs()),
      noImg: require("@/assets/empty.svg"),
      skuInfo: {},
      attrData: {},
      skuImageMaintainList: [], // 维护的所有图片
      attrColumns: [],
      skuImages: [],
      visiblePopup: false,
      imagePopVisible: false,
      dragging: null,
      maintainBtnDisabled: true,
    };
  },
  computed: {
    getBaseColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "skuCode",
          fieldType: "TEXT",
          fieldName: $T("smpc.product.view.skuCode").$D("商品编码"),
          render: (val) => <span class="main">{val}</span>,
        },
        {
          formRow: 2,
          fieldCode: "skuName",
          fieldType: "TEXT",
          fieldName: $T("smpc.product.view.skuName").$D("商品名称"),
        },
        {
          formRow: 3,
          fieldCode: "categoryCode",
          fieldType: "TEXT",
          fieldName: $T("smpc.product.model.itemCategoryCode").$D("品类编码"),
        },
        {
          formRow: 4,
          fieldCode: "itemCategoryName",
          fieldType: "TEXT",
          fieldName: $T("smpc.product.model.itemCategoryName").$D("品类名称"),
        },
      ];
    },
    itemColumns() {
      return [
        {
          label: $T("smpc.product.model.itemName").$D("物料名称"),
          value: this.skuInfo.itemName,
          isMain: true,
        },
        {
          label: $T("smpc.product.model.itemCode").$D("物料编码"),
          value: this.skuInfo.itemCode,
        },
      ];
    },
    // 列表最多显示12行， 多余属性详情查看
    getListAttrColumns() {
      return this.attrColumns.slice(0, 24);
    },
    getButtons() {
      return [
        {
          text: $T("smpc.product.model.maintainSkuImage").$D("维护商品图片"),
          type: "primary",
          fill: true,
          disabled: this.maintainBtnDisabled,
          handler: () => {
            this.openSkuImagePop();
          },
        },
      ];
    },
    getMaintainButtons() {
      return [
        {
          text: $T("smpc.product.model.maintainSkuImage").$D("维护商品图片"),
          type: "primary",
          fill: true,
          handler: () => {
            this.openSkuImagePop();
          },
        },
      ];
    },
  },
  mounted() {
    const { spuId, skuId } = this.$route.query;
    this.$loading.show();
    fetchSkuDetail({ spuId, skuId })
      .then((res = {}) => {
        const info = res.skuList[0] || {};
        this.skuInfo = info;
        // console.log("res", info);
        const {
          skuAttrList = [],
          skuAttrExtendList = [],
          skuImageList = [],
        } = res.skuList[0] || {};
        this.baseInfoDs.setData([info]);
        //  mediaType 图片-0/视频-1/URL-2
        this.skuImageMaintainList = this.getSortList(
          (skuImageList || []).filter((f) => f.mediaType !== 1)
        ); // // 主图在第一个位置
        const baseAttrs = [
          // {
          //   attrName: $T("smpc.product.view.brand").$D("品牌"),
          //   attrValue: info.brandName,
          // },
          // {
          //   attrName: $T("smpc.product.view.model").$D("型号"),
          //   attrValue: info.model,
          // },
          {
            attrCode: "3",
            attrName: $T("smpc.product.view.packingList").$D(
              "包装规格（清单）"
            ),
            attrValue: info.packingList,
            filter: !info.packingList,
          },
        ].filter((f) => f.filter !== true);
        const attrs = baseAttrs
          .concat([...skuAttrList || [], ...skuAttrExtendList || []])
          .map((m) => this.getAttrFields(m));
        const attrData = {};
        attrs.forEach((attr) => {
          attrData[attr.attrCode] = attr.attrValue;
        });
        this.attrData = attrData;
        this.attrDs.setData([attrData]);
        // 转换字段
        this.attrColumns = Array.from(attrs, (item, index) => ({
          // 每行两列
          formRow: index % 2 !== 0 ? index : index + 1,
          fieldCode: item.attrCode,
          fieldName: item.attrName,
        }));
        this.$loading.hide();
        this.maintainBtnDisabled = false;
      })
      .catch(() => {
        this.$loading.hide();
      });
  },
  methods: {
    getLanguageDefine(key) {
      const lang = {
        baseInfo: $T("smpc.product.view.baseInfo").$D("基本信息"),
        skuImage: $T("smpc.product.view.skuImage").$D("商品图片"),
        skuAttr: $T("smpc.product.view.productAttr").$D("商品属性"),
        maintainSkuImage: $T("smpc.product.model.maintainSkuImage").$D(
          "维护商品图片"
        ),
        uploadImage: $T("smpc.product.button.uploadImage").$D("上传图片"),
        // sure: $T("hzero.common.button.ok").$D("确定"),
      };
      return lang[key];
    },
    // 后端字段转换前端统一字段
    getAttrFields(attr) {
      if (attr.attrExtendId) {
        return {
          ...attr,
          attrCode: attr.attrExtendId,
        };
      }
      if (attr.attrCode === "3") {
        return attr;
      }
      return {
        ...attr,
        attrValue: attr.attrValueName || attr.description,
      };
    },
    getSortList(list) {
      const _list = list.sort((a, b) => a - b);
      return [
        ..._list.filter((f) => f.primaryFlag), // 主图在第一个位置
        ..._list.filter((f) => !f.primaryFlag),
      ];
    },
    viewAttrDetail() {
      if (Object.keys(this.attrData).length > 24) {
        this.visiblePopup = true;
      }
    },
    openSkuImagePop() {
      const { spuId, skuId } = this.$route.query;
      this.$router.push({
        name: "UploadImage",
        query: {
          spuId,
          skuId,
        },
        params: {
          dataList: this.skuImageMaintainList,
        },
      });
    },
    getPrimaryImagePath() {
      const { largeImagePath, mediaPath } = this.skuInfo || {};
      return largeImagePath || mediaPath;
    },
  },
};
</script>

<style scoped lang='stylus'>
.nav-header {
  background-color: #276EF1 !important;
}

>>>.srm-scroll-content>.srm-scroll-tab-item:last-child {
  margin-bottom: 74px;
}

.item-info {
  padding: 24px 15px 16px;
  background-color: #276EF1;

  .left-image {
    margin-right: 12px;

    > img {
      border-radius: 4px;
    }
  }

  .head-item {
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    font-weight: 400;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    &:not(:last-child) {
      margin-bottom: 4px;
    }

    .label {
      white-space: nowrap;
    }

    .value {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }

    &.head-main-item {
      line-height: 22px;
      font-weight: 500;
    }
  }
}

.base-info {
  >>> div.srm-field-wrapper:has(.main) {
    font-weight: 600;
  }
}

.image-list {
  padding: 16px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px;

  img {
    width: 100px;
    height: 100px;
    display: inline-block;
    border-radius: 8px;
  }
}

.attr-info {
  position: relative;

  .detail-tag {
    background: var(--color-primary);
    content: '';
    width: 7px;
    height: 10px;
    position: absolute;
    top: 21px;
    z-index: 999;
  }
}

// .divider {
//   height: 16px;
//   background-color: var(--background-color-empty-tab-title);
// }
</style>
