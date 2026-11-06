<template>
  <hips-popup
    v-model="value"
    style="height:90%;width:100%;overflow: hidden;"
    position="bottom"
    class="top-boder-radius"
    :overlay-on-click-close="false"
    @click-overlay="closePop">
    <div class="supplier-container">
      <hips-nav-bar slot="header" :have-border="false" class="supplier-header">
        <div
          v-show="slide"
          slot="center"
          class="supplier-center">
          {{ $T("hipspfm.common.message.select").$D("选择") }}{{ $T(title).$D(title) }}
        </div>
        <div slot="right" class="cancel" @click="$emit('input',false)">
          <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt >
        </div>
      </hips-nav-bar>
      <!-- 可滚动 -->
      <div v-show="!slide" ref="hiddenTitle" class="hidden-title">
        <div
          ref="lovTitle"
          class="sub-title">
          {{ $T("hipspfm.common.message.select").$D("选择") }}{{ $T(title).$D(title) }}
        </div>
      </div>
      <div v-if="statusArr.length!=0" class="scroll-wrap">
        <hips-scroll
          ref="scroll"
          :data="[statusArr]"
          :scroll-events="scrollEvents"
          :scroll-options="scrollOption"
          @scroll="onScroll">
          <div class="supplier-list">
            <hips-checkbox-group
              v-if="statusArr.length"
              v-model="orderStatusValue"
              :checkbox-border="false"
              :max="multiple?'Infinity':1">
              <div v-for="(item,index) in statusArr" :key="index">
                <hips-checkbox :option="JSON.stringify(item)">
                  <div class="content-info">
                    <i class="lov-content">{{ item.meaning }}</i>
                  </div>
                </hips-checkbox>
                <div class="content-line"/>
              </div>
            </hips-checkbox-group>
          </div>
        </hips-scroll>
      </div>
      <!-- 可滚动 -->
      <no-content v-else img-src="NoFile@1x.png" />
      <div class="foot-bottom-btn">
        <hips-checkbox v-if="multiple" v-model="flag" :border="false">
          <i
            style="fontSize: 16px;color:var(--color-font-default-b) ">{{ $T("hipspfm.common.message.selectAll").$D("全选") }}</i>
        </hips-checkbox>
        <span v-else class="msg-info">{{ $T("hipspfm.common.validation.single").$D("该选择为单选") }}</span>
        <span
          class="handler-btn"
          @click="confirmStatus">{{ $T("hipspfm.common.validation.confirmSelect").$D("确认选择") }}</span>
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { View, NavBar, Scroll, Checkbox, Popup, CheckboxGroup } from "hips";
import NoContent from "@/components/NoContent";
export default {
  modules: [ "hipspfm.common" ],
  name: "SelectOrderStatus",
  components: {
    NoContent,
    [NavBar.name]: NavBar,
    [View.name]: View,
    [Scroll.name]: Scroll,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  props: {
    statusArr: {
      type: Array,
      default: []
    },
    clearFlag: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    //是否开启多选
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flag: false, //是否全选
      orderStatusValue: [], //订单状态选中的值
      scrollOption: {},
      scrollEvents: [ "scroll" ],
      tempY: 0, // 上一次的滚动Y值
      slide: false
    };
  },
  watch: {
    flag(value) {
      if (value) {
        this.orderStatusValue = this.statusArr.reduce(
          (a, b) => [ ...a, JSON.stringify(b) ],
          []
        );
      } else if (
        this.orderStatusValue.length === this.statusArr.length &&
        !value
      ) {
        this.orderStatusValue = [];
      }
    },
    clearFlag() {
      if (this.clearFlag) {
        this.orderStatusValue = [];
        this.flag = false;
      }
    },
    orderStatusValue(value) {
      if (value.length == this.statusArr.length && value.length) {
        this.flag = true;
      } else {
        this.flag = false;
      }
    }
  },
  mounted() {},
  methods: {
    // 滚动事件
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
    closePop() {
      this.$emit("input", false);
    },
    //确认状态选择
    confirmStatus() {
      console.log(this.orderStatusValue, 5555);
      this.$emit("GetOrderStatus", this.orderStatusValue);
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="stylus" scoped>
.supplier-container {
  position: relative;
  height: 100%;

  .supplier-header {
    height: 48px;

    .supplier-center {
      font-size: 18px;
      line-height: 26px;
      color:var(--color-font-default);
    }

    .cancel {
      color:var(--color-font-default-b);
      margin-right: 22.8px;
    }
  }

  .scroll-wrap {
    height: calc(100% - 26vw);
    overflow: auto;

    .supplier-list {
      padding-bottom: 40px;
      margin-top: 8px;
      font-size: 16px;

      .content-info {
        width: 90%;
      }

      .lov-content {
        font-size: 16px;
        color:var(--color-font-default);
      }

      .content-line {
        height: 1px;
        overflow: hidden;
        background:var(--color-bg-default-b);
        margin-left: 53px;
      }
    }
  }

  >>> .hips-cell {
    padding-left: 10px 20px;
    height: 53px;
  }

  .hips-checkbox__checked--active + .content-info {
    .lov-content, .supplier-code {
      color: var(--color-other-default-b) !important;
    }
  }

  .supplier-confirm {
    width: 100%;
    height: 49px;
    line-height: 49px;
    background:var(--color-bg-default);
    border-top:1px solid var(--color-border-default);
    text-align: center;
    font-size: 18px;
    color: var(--color-other-default-b);
    z-index: 1000;
    position: absolute;
    bottom: 0;
  }
}

.msg-info {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: var(--color-font-default-e);
  letter-spacing: 0;
  line-height: 24px;
  border-right: none;
  padding-left: 20px;
  text-align: left;
  height: auto;
}

.hidden-title {
  overflow-y: hidden;
  max-height: 40px;

  .sub-title {
    position: relative;
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding-left: 20px;
    font-weight: bold;
    font-size: 24px;
    color:var(--color-font-default);
  }
}

.handler-btn {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: var(--color-other-default-b);
  letter-spacing: 0;
  padding-right: 20px;
  line-height: 25px;
  text-align: right;
}
</style>
