<template>
  <!-- 商品工作台 - 采购方 -->
  <div class="approval-detail-container">
    <div class="approval-detail-scroll-el">
      <!-- 头部信息 -->
      <srm-detail-head
        ref="headInfoHeight"
        :columns="getHeaderColumns()"
        :data-source="data"/>
      <!-- 组件 -->
      <commodity-approval v-if="info.spuId" :parameters="info" @setData="setData"/>
    </div>
  </div>
</template>

<script>
import CommodityApproval from "./components/CommodityApproval";
export default {
  modules: [ "smpc.product", "hipspfm.common" ],
  name: "ProductDetail",
  components: { CommodityApproval },
  props: {
    productData: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      info: {
        type: "Purchaser",
      },
      data: {
        info: {},
      },
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "imagePath",
          fieldType: "EMPTY",
          render: (val) => <img onClick={() => {
            this.previewImage();
          }} src={val} width="70" height="70"/>,
        },
        {
          formRow: 1,
          fieldType: "EMPTY",
          fieldCode: "customizeOne",
          render: (val, item) => <Customize
            class="override-Customize"
            columns={this.getDetailColumns}
            data-source={item}
            type="list"
            need-padding={false}
            code=""/>
        }
      ];
    },
    getDetailColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "skuName",
          fieldType: "EMPTY",
          render: (val) => <span style="color: #ffffff;font-size: 16px;font-weight: 500;">{val}</span>,
        },
        {
          formRow: 2,
          fieldCode: "skuTitle",
          fieldType: "EMPTY",
          render: (val) => <span style="color: #ffffff;font-size: 14px;">{val}</span>,
        }
      ];
    }
  },
  watch:{
    productData:{
      handler(val) {
        this.info["spuId"] = val.spuId;
        this.info["skuId"] = val.skuId;
        this.info["skuTemporaryId"] = val.skuTemporaryId;
        this.$forceUpdate();
      },
      deep:true,
      immediate:true
    }
  },
  mounted() {
  },
  methods: {
    getHeaderColumns() {
      return [
        {
          fieldCode: "info",
          render: (val) => <Customize
            columns={this.getColumns}
            data-source={val}
            type="list"
            need-padding={false}
            code=""/>
        }
      ];
    },
    setData(res) {
      this.data = null;
      // 商品图片
      this.info["imagePath"] = res.mediaPath || require("../../../assets/NoLogo@3x.png");
      // 商品标题
      this.info["skuName"] = res.skuName;
      // 商品副标题
      this.info["skuTitle"] = res.skuTitle;
      // 商品图片视频集合
      this.info["skuImageList"] = res.skuImageList || [];
      this.data = {
        info: this.info
      };
      this.$forceUpdate();
    },
    // 预览图片
    previewImage() {
      let mp4 = [];
      let img = [];
      this.info.skuImageList.map((res) => {
        if (res.mediaType === 1) {
          mp4.push(res.mediaPath);
        } else {
          img.push(res.mediaPath);
        }
      });
      this.$previewImage([ ...mp4, ...img ]);
    },
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-container {
  height 100vh;
  background: #f0f2f5;
}

.approval-detail-scroll-el {
  height 100%;
  overflow-y scroll;
  overflow-x hidden;
}

.override-Customize {
  width: 70vw;
}
</style>
