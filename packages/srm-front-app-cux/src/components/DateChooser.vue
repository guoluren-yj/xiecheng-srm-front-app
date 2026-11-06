<template>
  <div/>
</template>
<script>
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common" ],
  name: "DateChooser",
  props: {
    "value": {
      type: Boolean,
      default: false,
    },
    selectType: {
      type: String,
      default: "single"
      // 选择方式: single - 单选,start-end - 起始
    },
    title: {
      type: String,
      default: null,
    }
  },
  data() {
    return {};
  },
  watch: {
    value(val) {
      if (val) {
        this.$datePicker({ selectType: this.selectType, valueFormat: SrmUtil.getDefaultDateFormat() }, (start, end) => {
          if (this.selectType === "single") {
            this.$emit("submitDate", start);
          } else {
            this.$emit("submitDate", [ start, end ]);
          }
        });
      }
    },
  },
};

</script>
