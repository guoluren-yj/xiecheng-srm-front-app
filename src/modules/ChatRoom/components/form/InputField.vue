<template>
  <srm-input-field v-bind="$attrs"
                   :value="value"
                   @input="onInput">
    <div slot="left"
         class="search-icon">
      <span class="srm-icon icon-search" />
    </div>
  </srm-input-field>
</template>
<script>
export default {
  name: "InputField",
  modules: ["smbl.chat"],
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onInput(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style lang="stylus" scoped>
.search-icon {
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0 4px;

  .icon-search {
    font-size: 18px;
    color: #AFAFAF;
  }
}
</style>
