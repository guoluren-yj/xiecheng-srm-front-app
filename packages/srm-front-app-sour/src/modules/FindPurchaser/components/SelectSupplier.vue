<template>
  <div class="supplier-container">
    <hips-nav-bar v-if="searchFlag" slot="header" :have-border="false" class="supplier-header">
      <transition slot="center" name="bounce">
        <div v-if="slide" slot="center" class="supplier-center">{{ $T("hipspfm.common.message.select").$D("选择") }}{{ $T(title).$D(title) }}</div>
      </transition>
      <div slot="right" class="cancel" @click="showSupplierPop">
        <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt="">
      </div>
    </hips-nav-bar>
    <div v-show="!slide&&searchFlag" ref="hiddenTitle" class="hidden-title">
      <div ref="lovTitle" class="sub-title">{{ $T("hipspfm.common.message.select").$D("选择") }}{{ $T(title).$D(title) }}</div>
    </div>
    <div class="supplier-search">
      <div v-show="searchFlag" @click="startSearch">
        <searchs
          v-model="supplierInput"
          :handle-search="handleSearch"
          :icon-position="'left'"
          :handle-input-change="handleInputChange"
          :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')+title+$T('hipspfm.common.message.nameQuery').$D('名称查询')"/>
      </div>
      <div v-show="!searchFlag">
        <searchs
          ref="search"
          v-model="supplierInput"
          icon-positon="left"
          :right-button="rightButton"
          :handle-search="handleSearch"
          :handle-right-click="handleRightClick"
          :handle-input-change="handleInputChange"
          :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')+title+$T('hipspfm.common.message.nameQuery').$D('名称查询')"/>
      </div>
    </div>
    <!-- 可滚动 -->
    <div v-if="supplierArr.length != 0" class="scroll-wrap">
      <hips-scroll
        ref="scrollH"
        :scroll-events="scrollEvents"
        :data="[supplierArr]"
        :scroll-option="scrollOption"
        nest-mode="native"
        @scroll="onScroll">
        <div class="supplier-list">
          <hips-checkbox-group
            v-model="supplierValue"
            :checkbox-border="false">
            <hips-checkbox
              v-for="(item,index) in supplierArr"
              :key="index"
              :option="JSON.stringify(item)">
              <!-- 客户 -->
              <div v-if="item&&item.industryName" class="content-info">
                <i class="lov-content">{{ item.industryName }}</i>
              </div>
              <!-- 默认 -->
              <div v-else>
                <i style="fontSize: 16px;"/>
              </div>
            </hips-checkbox>
            <div class="block"/>
          </hips-checkbox-group>
        </div>
      </hips-scroll>
    </div>
    <no-content
      v-else
      img-src="NoResult@3x.png"/>
    <!-- 底部确认 -->
    <div class="foot-bottom-btn">
      <span class="msg-info">{{ $T("hipspfm.common.validation.multiple").$D("该选择为多选") }}</span>
      <span class="handler-btn" @click="confirmSupplier">{{ $T("hipspfm.common.validation.confirmSelect").$D("确认选择") }}</span>
    </div>
  </div>
</template>

<script>
import
{
  View,
  NavBar,
  Search,
  Scroll,
  Icon,
  Checkbox,
  CheckboxGroup,
} from "hips";
import Searchs from "@/components/Searchs";
import NoContent from "@/components/NoContent";
export default {
  modules: [ "hipspfm.common" ],
  name: "SelectSupplier",
  components: {
    Searchs,
    NoContent,
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  props: {
    "showSupplierPop":{
      type: Function,
    },
    "supplierArr":{
      type: Array,
    },
    "getSupplier": {
      type: Function
    },
    "title": {
      type: String,
      default:"hipspfm.common.message.supplier"
    },
    "clearFlag": {
      type: Boolean,
      default: false,
    },
    "supplierVal":{
      type: Array
    }
  },
  data() {
    return {
      supplierInput: "", //供应商输入
      supplierValue: [], //供应商选中的值
      scrollOption: {
        pullDownRefresh: false,
        pullUpLoad: false,
      },
      scrollEvents: [ "scroll", "scroll-end" ],
      tempY:0, // 上一次的滚动Y值
      slide:false,
      searchFlag: true,
    };
  },
  computed:{
    rightButton() {
      return { text: this.$T("hipspfm.common.button.cancle").$D("取消"),
        color:"var(--color-font-default-b)", };
    }
  },
  watch:{
    clearFlag(nValue) {
      if (nValue) {
        this.supplierValue = [];
      }
    },
    supplierVal() {
      this.supplierValue = this.supplierVal;
    },
  },
  mounted() {
    // console.log(this.$refs)
  },
  methods: {
    //搜索供应商
    handleSearch() {
      this.getSupplier(this.supplierInput);
    },
    //监听供应商改变
    handleInputChange() {
      if (!this.supplierInput.length) {
        this.getSupplier(this.supplierInput);
      }
    },
    onScroll({ x, y }) {
      if (y < 0) {
        this.$refs.lovTitle.style.top = 100 / 667 * y + "vh";
      } else {
        this.$refs.lovTitle.style.top = "0vh";
      }
      this.$refs.hiddenTitle.style.height = 100 / 667 * (38 + y) + "vh";
      if (38 + y <= 0) {
        this.slide = true;
      } else {
        this.slide = false;
      }
    },
    startSearch() {
      this.searchFlag = false;
      this.listData = [];
      setTimeout(() => {
        this.$refs.search.$el.querySelector("input").focus();
      });
    },
    handleRightClick() {
      this.searchFlag = true;
    },
    //确认供应商选择
    confirmSupplier() {
      this.$emit("GetSupplier", this.supplierValue);
      this.showSupplierPop();
    },
  },
};
</script>

<style lang="stylus" scoped>
.supplier-container {
  position relative
  height: 100%;
  overflow hidden
  .supplier-header {
    height: 48px;
    .supplier-center {
      font-size: 18px;
      line-height 26px;
      color:var(--color-font-default);
    }
    .cancel {
      color:var(--color-font-default-b);
      margin-right: 22.8px;
    }
  }

  .scroll-wrap {
    // padding-bottom: 50px;
    height: calc(100% - 26vw);
    .supplier-list {
      margin-top: 8px;
      font-size: 16px;
      .content-info{
        width: 90%;
      }

      .lov-content{
        font-size: 16px;
        color:var(--color-font-default);
      }
      .supplier-code {
        font-size: 12px;
        color:var(--color-font-default-b);
        margin-left: 5px;
      }
    }
  }
}
  >>> .hips-cell{
    padding-left: 20px;
    padding-right: 20px;
    height: 54px;
  }

  .hips-checkbox__checked--active + .content-info{
    .lov-content,.supplier-code{
      color: var(--color-other-default-b) !important;
    }
  }
  .hidden-title{
    overflow-y:hidden;
    max-height:40px;
    .sub-title {
      position:relative;
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding-left: 20px;
      font-weight: bold;
      font-size: 24px;
      color:var(--color-font-default);
    }
  }
   .msg-info {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: var(--color-font-default-e);
    letter-spacing: 0;
    line-height: 24px;
    border-right: none;
    line-height:24px;
    padding-left: 20px;
    text-align: left;
  }

  .handler-btn {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-other-default-b);
    letter-spacing: 0;
    padding-right: 20px;
    line-height:25px;
    text-align: right;
  }
.supplier-search{
  margin-top:6px;
}
.block{
  width:100%;
  height:38px;
}
</style>
