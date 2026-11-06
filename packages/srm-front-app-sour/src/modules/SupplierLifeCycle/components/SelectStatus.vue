<!-- eslint-disable rulesdir/no_hips -->
<template>
  <div class="supplier-container">
    <hips-nav-bar slot="header" :have-border="false" class="supplier-header">
      <div slot="center" class="supplier-center">{{ title }}</div>
      <div slot="right" class="cancel" @click="showOterLovPop">
        <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt="">
      </div>
    </hips-nav-bar>
    <div class="supplier-list">
      <hips-checkbox-group
        v-if="statusArr.length"
        v-model="orderStatusValue"
        :checkbox-border="false"
        max="1">
        <hips-checkbox
          v-for="(item,index) in statusArr"
          :key="index"
          :option="{value: item}">
          <i style="fontSize: 16px;">{{ item.meaning }}</i>
        </hips-checkbox>
      </hips-checkbox-group>
    </div>
    <div class="supplier-confirm" @click="confirmStatus">
      <span>{{ $T('hipspfm.common.button.confirm').$D('确认') }}</span>
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
  Popup,
  Icon,
  Checkbox,
  CheckboxGroup,
} from "hips";
export default {
  modules: [ "hipspfm.common" ],
  name: "SelectStatus",
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Scroll.name]: Scroll,
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  props: [
    "title",
    "showOterLovPop",
    "clearFlag",
  ],
  data() {
    return {
      orderStatusValue: [], //订单状态选中的值
      statusArr: [
        { meaning: this.$T("hipspfm.common.status.yes").$D("是"), value: 1 },
        { meaning: this.$T("hipspfm.common.status.no").$D("否"), value: 0 },
      ],
    };
  },
  watch: {
    clearFlag() {
      if (this.clearFlag) {
        this.orderStatusValue = [];
      }
    }
  },
  methods: {
    //确认状态选择
    confirmStatus() {
      this.$emit("GetOtherLov", this.orderStatusValue);
      this.showOterLovPop();
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
  .supplier-list {
    margin-top: 8px;
    height 420px
    overflow auto
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
