<template>
  <div ref="srmDropdownRef" class="srm-dropdown">
    <span v-if="isPopup" :class="['srm-dropdown-button',{
      'srm-dropdown-button-active': dropdownVisible,
      'srm-dropdown-button-modified': mValue
    }]" @click.stop="showDropDown">
      <span class="srm-dropdown-button-text" :style="{maxWidth: showArrow ? '80%' : '100%'}">{{ mText }}</span>
      <em v-if="showArrow" class="srm-icon icon-caret-down"/>
    </span>
    <srm-tooltip v-else v-model="dropdownVisible" :visible-arrow="false" :disabled="disabled">
      <srm-button v-if="text" type="info" :class="['srm-dropdown-button-tooltip',{
        'srm-dropdown-button-active': dropdownVisible,
        'srm-dropdown-button-modified': mValue
      }]">
        <div class="srm-dropdown-button-box">
          <span class="srm-dropdown-button-text">{{ mText }}</span>
          <span v-if="showArrow" class="srm-icon icon-caret-down"/>
        </div>
      </srm-button>
      <slot v-else name="button"/>
      <slot slot="content"/>
    </srm-tooltip>
    <srm-popup v-if="isPopup" :visible.sync="dropdownVisible" position="free" :top="dropdownPopupTop"
               :show-header="false"
               width="100%">
      <slot/>
    </srm-popup>
  </div>
</template>

<script>

export default {
  name: "SrmDropdownBox",
  provide() {
    return {
      srmDropdown: this,
    };
  },
  props: {
    value: {
      type: String | Number | Boolean,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "popup",
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dropdownVisible: this.visible,
      dropdownPopupTop: 0,
      children: new Set(),
      // mText: this.text,
      mValue: this.value,
      isPopup: this.type === "popup",
      selectText: "",
    };
  },
  computed: {
    mText() {
      return this.selectText || this.text;
    },
  },
  watch: {
    visible(val) {
      this.dropdownVisible = val;
    },
    dropdownVisible(val) {
      this.dropdownPopupTop = this.$refs.srmDropdownRef?.getBoundingClientRect().top + this.$el.clientHeight;
      this.$emit("update:visible", val);
    }
  },
  mounted() {
    this.dropdownPopupTop = this.$refs.srmDropdownRef?.getBoundingClientRect().top + this.$el.clientHeight;
  },
  beforeDestroy() {
    this.children.clear();
  },
  methods: {
    showDropDown() {
      if (this.disabled) {
        return;
      }
      this.dropdownVisible = true;
    },
    close() {
      this.dropdownVisible = false;
    },
    register(child) {
      this.children.add(child);
    },
    select(value, text, selectChild) {
      this.selectText = text;
      // this.$emit("update:text", text);
      this.children.forEach((child) => {
        child.unSelect();
      });
      if (selectChild) {
        selectChild.active = true;
      }
      this.mValue = value;
      this.$emit("input", value);
      this.$emit("select", value);
      this.dropdownVisible = false;
    }
  }
}
;
</script>

<style lang="stylus" scoped>

.srm-dropdown {
  height 44px;
  display flex;
  align-items center;
  justify-content center;
  flex 1;
}

.srm-dropdown-button {
  box-sizing content-box;
  font-size: 14px;
  color var(--font-color-default);
  text-align: center;
  line-height: 20px;
  display flex;
  justify-content center;
  width: 100%;

  .srm-icon {
    display inline-block;
    transition transform .3s ease;
    color var(--font-color-second);
  }
}

.srm-dropdown-button-tooltip {
  box-sizing border-box;
  font-size: 14px;
  color var(--font-color-default);
  text-align: center;
  display:table-cell;
  vertical-align:middle;
  height 36px;
  width 86px;
  border-radius 18px;
  background var(--background-color-empty-second);

  .srm-icon {
    display inline-block;
    transition transform .3s ease;
    color var(--font-color-default);
  }
}

.srm-dropdown-button-text {
  display inline-block;
  word-break: break-all;
  overflow: hidden;
  white-space nowrap;
  text-overflow ellipsis;
  font-weight normal;
  max-width 50px;
  height 18px;
  line-height 18px;
}

.srm-dropdown-button-box {
  display flex;
  align-items center;
  justify-content space-around;
  border-radius 5px;
}

.srm-dropdown-button-active {
  color var(--font-color-default);
  font-weight bold;

  .srm-dropdown-button-text {
    font-weight bold;
  }

  .srm-icon {
    color var(--font-color-primary);
    transform: rotateZ(180deg);
  }
}

.srm-dropdown-button-modified {
  color var(--font-color-default);
  font-weight bold;

  .srm-dropdown-button-text {
  }

  .srm-icon {
    color var(--font-color-primary);
  }
}

</style>
