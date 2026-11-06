<template>
  <srm-field-wrapper :size="size" :type="mTheme" :bordered="bordered" :rounded="rounded"
                     :disabled="mDisabled"
                     :label="label"
                     :name="name"
                     :data="mValue">
    <slot slot="left" name="left"/>
    <span class="srm-select" @click="showSelect">
      <span v-if="mValue" class="srm-select-value"
            :style="{textAlign: align}">
        <srm-tag-group :tags="mDisplay" :closable="options && options.multiple"
                       @click="(tag) => { removeLovTag(tag) }"/>
      </span>
      <span v-else class="srm-select-placeholder" :style="{textAlign: align}">
        {{ placeholder || mPlaceholder }}
      </span>
    </span>
    <span v-if="!mDisabled" slot="right" class="srm-select-icon">
      <em v-show="mValue && clearButton && !mDisabled" class="srm-icon icon-x" @click="clearValue"/>
      <em v-if="rightIcon" class="srm-icon icon-chevron-right"/>
    </span>

    <srm-select v-model="showSelectPop" :list="list" :m-display="mDisplay" @submitValue="submitValue" />
  </srm-field-wrapper>
</template>
<script>

import SrmSelect from "@/components/SrmSelect";

export default {
  name: "SrmSelectField",
  components: {
    SrmSelect
  },
  provide() {
    return {
      title: this.title,
      displayField: this.displayField,
      valueField: this.valueField,
    };
  },
  props: {
    value: {
      type: String,
    },
    display: {
      type: String,
    },
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    code: {
      type: String,
    },
    theme: {
      type: String,
    },
    selectType: {
      type: String,
      default: "lov"
    },
    size: {
      type: String,
      default: "mid",
    },
    align: {
      type: String,
      default: "left"
    },
    clearButton: {
      type: Boolean,
      default: true,
    },
    rightIcon: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean | Function,
      default: null,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({})
    },
    list: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "",
    },
    valueField: {
      type: String,
      default: "title",
    },
    displayField: {
      type: String,
      default: "title",
    },
  },
  data() {
    return {
      mValue: this.value,
      mDisplay: [],
      selected: [],
      mCode: this.code,
      mPlaceholder: this.placeholder,
      mTheme: this.theme,
      field: this.formField,
      mSelectType: this.selectType,
      mDisabled: this.disabled,
      showSelectPop: false,
      clear: false,
    };
  },
  watch: {
    value(val) {
      this.mValue = val;
    },
    mValue(val) {
      this.error = false;
      if (this.field) {
        this.field.data = val;
      }
      this.$emit("input", val);
      this.$emit("update:display", this.mDisplay.join(","));
      this.$emit("inputChange", val);
    },
    display() {
      if (this.display) {
        this.mDisplay = this.display.split(",");
      }
    }
  },
  mounted() {
    if (this.display) {
      this.mDisplay = this.display.split(",");
    }
    if (this.value) {
      this.mDisplay = this.list.filter((v) => v[this.valueField] === this.value).map((d) => d[this.displayField]);
    }
    this.init();
  },
  beforeUpdate() {
    this.init();
  },
  methods: {
    showSelect() {
      this.clear = !this.mValue;
      this.showSelectPop = true;
    },
    submitValue(value) {
      const { valueField, displayField } = this;

      this.mValue = this.buildField(value, valueField);
      this.mDisplay = value.map((v) => v[displayField]);
    },
    boolFunction(val, value, record) {
      if (typeof val === "function") {
        return val(value, record);
      }
      return Boolean(val);
    },
    init() {
      this.mDisabled = this.boolFunction(this.disabled, this.mValue, this.record);
      if (!this.field && this.name && this.record) {
        const field = this.dataSet.current.getField(this.name);

        this.mDisplay = this.dataSet.current.data[field.displayFieldCode].split(",");
        this.mValue = field.data;
        this.field = field;
        this.mPlaceholder = this.placeholder || field.fieldName;
        if (this.disabled === null) {
          this.mDisabled = this.boolFunction(field.disabled, this.mValue, this.record);
        }
        this.mSelectType = this.selectType || field.selectType;
        this.mCode = this.code || field.lovCode;
      }
      this.mTheme = this.theme || this.formTheme || "empty";
    },
    buildField(valArray, field) {
      let result = "";

      for (let i = 0; i < valArray.length; i++) {
        result += valArray[i][field];
        if (i < valArray.length - 1) {
          result += ",";
        }
      }
      return result;
    },
    clearValue() {
      if (this.mDisabled) {
        return;
      }
      this.mValue = null;
      this.mDisplay = [];
      this.$emit("clear");
    },
    removeLovTag(tag) {
      if (this.mDisabled) {
        return;
      }
      const index = this.mDisplay.indexOf(tag);

      this.mDisplay.splice(index, 1);
      this.mValue = this.removeSplit(this.mValue, index);
      this.$emit("delete");
    },
    removeSplit(str, index) {
      let arr = str.split(",");

      arr.splice(index, 1);
      let result = "";

      for (let i = 0; i < arr.length; i++) {
        result += arr[i];
        if (i < arr.length - 1) {
          result += ",";
        }
      }
      return result;
    },
  }
};
</script>

<style scoped lang="stylus">

.srm-select-label {
  margin-right 4px;
}

.srm-select {
  flex 2;
  font-size: 14px;
  line-height 14px;
  border: 0; // 去除未选中状态边框
  outline: none; // 去除选中状态边框
  background-color: #ffffff00; // 透明背景
}

.srm-select-placeholder {
  color: #afafaf;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow hidden;
}

.srm-select-icon {
  .srm-icon {
    font-size: 20px;
  }
}

.srm-select-prefix {
  margin-right 12px;
}

</style>
