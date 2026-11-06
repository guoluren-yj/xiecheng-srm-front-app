<!-- eslint-disable rulesdir/no_hips -->
<template>
  <div class="searchWrap">
    <hips-search
      class="search"
      enter-key
      show-clear-button
      :value="value"
      :placeholder="$T(placeholder).$D(placeholder)"
      :right-button="rightButton"
      :search-icon-position="iconPosition"
      :disabled="disabled"
      @on-right-click="handleRightClick"
      @on-search="handleSearch"
      @on-change="handleInputChanges"/>
  </div>
</template>

<script>
import { Search } from "hips";

export default {
  name: "Searchs",
  components: {
    [Search.name]: Search,
  },
  props: {
    //搜索方法
    handleSearch: {
      type: Function,
      default: () => {},
    },
    //监听输入框值变化的方法
    handleInputChange: {
      type: Function,
      default: () => {},
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 输入提示文字
    placeholder: {
      type: String,
      default: "",
    },
    // 搜索图标的按钮
    iconPosition: {
      type: String,
      default: "left",
    },
    rightButton: {
      type: Object,
      default: () => ({})
    },
    handleRightClick: {
      type: Function,
      default: () => {}
    },
    // 输入框绑定的值
    value: {
      type: String,
      default: "",
    },
    // // 搜索图标左右位置
    // iconPosition: {
    //   type: String,
    //   default: "right",
    // }
  },
  methods: {
    handleInputChanges(val) {
      this.$emit("input", val);
      this.handleInputChange(val);
    },
  },
};
</script>

<style lang="stylus" scoped>
.searchWrap {
  height: 38px;
  width: 80%;
  >>> .hips-search {
    height: 36px;
  }
  >>> .hips-search__right {
    padding-left: 0;
  }
  .search {
    >>> .hips-search__input {
      border-radius: 4px;
      width: 335px;
      background:var(--color-bg-default-b);
    }
    >>> .hips-search__input .hips-input{
      padding-left: 0px
      width: calc(100% - 12vw);
      line-height 36px;
    }
    >>> .hips-input__input-value input {
      padding-left: 12px;
      margin: 5px 0px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      color:var(--color-font-default-b);
    }
    >>>.hips-input {
      height: 36px;
    }
    >>> .hips-input__input-value input::-webkit-input-placeholder {
      font-size: 14px;
      color:var(--color-font-default-b) !important;
    }
  }
}
</style>