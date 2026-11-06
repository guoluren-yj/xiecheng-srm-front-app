<template>
  <div class="supplier-container">
    <hips-nav-bar slot="header" :have-border="false" class="supplier-header">
      <div slot="center" class="supplier-center">{{ $T("hipspfm.common.message.select").$D("选择") }}{{ title }}</div>
      <div slot="right" class="cancel" @click="showOrderSatusPop">
        <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt="">
      </div>
    </hips-nav-bar>
    <div class="scroll-wrap">
      <hips-scroll
        ref="scroll"
        :data="[statusArr]">
        <hips-checkbox-group
          v-if="statusArr.length"
          v-model="orderStatusValue"
          class="supplier-list"
          :data="[statusArr]"
          :checkbox-border="false"
          max="1"
          min="1">
          <hips-checkbox
            v-for="(item,index) in statusArr"
            :key="index"
            :option="{value: item}">
            <i style="fontSize: 16px;">{{ item.meaning }}</i>
          </hips-checkbox>
        </hips-checkbox-group>
      </hips-scroll>
    </div>
    <div class="supplier-confirm" @click="confirmStatus">
      <span>{{ $T("hipspfm.common.button.confirm").$D("确认") }}</span>
    </div>
  </div>
</template>

<script>
import
{
  View,
  Popup,
  NavBar,
  Scroll,
  Checkbox,
  CheckboxGroup,
} from "hips";
export default {
  modules: [ "hipspfm.common" ],
  name: "SelectOrderStatus",
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  props: [
    "title",
    "showOrderSatusPop",
    "statusArr",
    "clearFlag",
    "default"
  ],
  data() {
    return {
      orderStatusValue: [], //订单状态选中的值
    };
  },
  watch: {
    clearFlag() {
      if (this.clearFlag) {
        this.orderStatusValue = [];
      }
    }
  },
  mounted() {
    if (this.default) {
      this.orderStatusValue = [ this.statusArr[0] ];
    }
  },
  methods: {
		  //确认状态选择
    confirmStatus() {
      this.$emit("GetOrderStatus", this.orderStatusValue);
      this.showOrderSatusPop();
    },
  }
};
</script>

<style lang="stylus" scoped>
.supplier-container {
  position relative
  height 100%
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
  .supplier-search {
    height: 32px;
    background:var(--color-bg-default);
    >>> .hips-input__input-value input{
      font-size: 16px;
      background: #F6F9FD;
      padding: 5px 0px;
    }
    >>> .hips-search__input {
      margin: 6px 20px;
    }
  }
  .scroll-wrap{
    height: calc(100% - 26vw);
  }
  .supplier-list {
    margin-top: 8px;
    font-size: 16px;
    .supplier-code {
      font-size: 12px;
      color:var(--color-font-default-b);
      margin-left: 8px;
    }
  }
  .supplier-confirm {
    width: 100%;
    height: 49px;
    line-height: 49px;
    background:var(--color-bg-default);
    text-align: center;
    font-size: 18px;
    color: var(--color-other-default-b);
    z-index: 1000;
    position absolute;
    bottom: 0;
  }
}
</style>
