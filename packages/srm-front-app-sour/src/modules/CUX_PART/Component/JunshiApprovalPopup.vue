<template>
  <ai-tip-section v-if="getTenantNum() === 'SRM-JUNSHI'" :ai-approve-status="approveResult"
                  :ai-review-params="aiResultData" />
</template>

<script>

import AiTipSection from "@/components/AiTipSection/AiTipSection.vue";

export default {
  name: "JunshiAiTipSection",
  modules: [ "ssrc.common", "hipspfm.common" ],
  components: {
    AiTipSection,
  },
  props: {
    approveResult: {
      type: String,
      default: "",
    },
    aiResultData: {
      type: Array,
      default: () => [],
    },
  },
  // data() {
  // },
  async mounted() {
    console.log(121212121, this.approveResult, this.aiResultData);
  },
  methods: {
    getTenantNum() {
      // 协鑫基于标准二开，价格要素（srm-37210）
      return window.localStorage.getItem("tenantNum");
    },
  },
};
</script>

<style></style>