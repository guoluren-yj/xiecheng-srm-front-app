<template>
  <div class="srm-textarea">
    <textarea
      :id="id"
      :name="name"
      :cols="cols"
      :rows="rows"
      :value="value"
      :disabled="disabled"
      @input="change"/>
  </div>
</template>

<script>
export default {
  name: "SrmTextarea",
  props: {
    value: {
      type: String,
    },
    name: {
      type: String,
      default: "",
    },
    id: {
      type: String | Number,
    },
    cols: {
      type: String | Number,
    },
    rows: {
      type: String | Number,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    change(e) {
      this.$emit("input", e.target.value);
      console.log(e.target.value, 432222333);
    },
  },
};
</script>

<style lang="stylus" scoped>
.srm-textarea {
  > textarea {
    border: 0; // 去除未选中状态边框
    outline: none; // 去除选中状态边框
    background-color: rgba(0, 0, 0, 0); // 透明背景
    font-size: 14px;
    width: 100%;
    height: 100%;
    padding: 12px;
    color: #1f1f1f;
    resize: none;
    line-height: 20px;
  }

  textarea:disabled, textarea[disabled] {
    -webkit-opacity: 0.22;
    opacity: 0.22;
    color: var(--color-font-default) !important;
  }
}
</style>
