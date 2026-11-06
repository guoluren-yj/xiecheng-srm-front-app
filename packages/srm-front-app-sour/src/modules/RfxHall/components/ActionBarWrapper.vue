<template>
  <span v-if="!!code">
    <action-bar :data="allData" direction="vertical" />
  </span>
</template>

<script>

import { currentActionCode } from "../components/currentActionCode";

/**
 * 智能应用需求，将当前功能作为卡片发送到企业微信或其他第三方聊天平台
 * */
export default {
  name: "ActionBarWrapper",
  props: {
    record: {
      type: Object || null,
      default: null,
    },
  },
  data() {
    return {
      allData: {
        cardInfo: {
          cardCode: "",
          data: {},
        },
      },
      code: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const record = this.record || {};
      const code = currentActionCode(record);

      this.code = code;
      const { ouCode, } = record || {};

      this.allData = {
        cardInfo: {
          cardCode: code,
          data: {
            ...record,
            unreadCount: 0,
            ouName: ouCode,
          },
        },
      };
    },
  },
};
</script>

