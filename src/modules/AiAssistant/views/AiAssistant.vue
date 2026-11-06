<!-- eslint-disable operator-linebreak -->
<template>
  <div />
</template>
<script>
import { getCustomerConfig } from "../api";

export default {
  name: "AiAssistant",
  data() {
    return {};
  },
  mounted() {
    // 目前只支持en cn
    this.loadCustomer();
  },
  methods: {
    async loadCustomer() {
      try {
        this.$loading.show();
        const res = await getCustomerConfig();
        console.log("aiAssistant res :", res);
        if (res && Array.isArray(res) && res.length) {
          const urls = res.filter((item) => item.serviceCode === "NLP");
          if (urls && urls.length) {
            const url = urls[0]?.url ?? "";
            window.location.replace(url);
            window.reload();
          }
        }

      } catch (e) {
        console.info("aiAssistant error:", e);
      } finally {
        this.$loading.hide();
      }
    },
  },
};
</script>

<style lang="stylus" scoped></style>
