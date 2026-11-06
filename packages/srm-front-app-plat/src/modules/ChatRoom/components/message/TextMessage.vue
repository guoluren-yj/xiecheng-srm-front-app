<!-- eslint-disable vue/no-v-html -->
<template>
  <div :class="['text-message', { 'text-message-right': record.float === 'right' }]">
    <div v-if="atText"
         class="text-message-at">
      {{ `@${atText}` }}
    </div>
    <p v-html="text" />
  </div>
</template>
<script>
import { textReplaceEmoji, textReplaceLink } from "@/modules/ChatRoom/utils/message";

export default {
  modules: [],
  name: "TextMessage",
  props: {
    record: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  computed: {
    // at内容
    atText() {
      return this.record.receiverHide ? "" : this.record.receiverNames?.join?.(",");
    },
    text() {
      const { msgContent } = this.record;
      return textReplaceEmoji(textReplaceLink(msgContent));
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="stylus" scoped>
.text-message {
  padding: 10px 12px;
  background-color: #fff;
  border-radius: 3px 12px 12px 12px;
  color: #757575;
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
  font-size: 16px;
  max-width: 260px;
  box-sizing: border-box;
  line-height: 24px;

  &.text-message-right {
    background: #276EF1;
    border-radius: 12px 3px 12px 12px;
    color: #fff;

    /deep/.link-text {
      color: #eee;
    }
  }

  .text-message-at {
    margin-right: 10px;
  }

  > p {
    display: flex;
    align-items: center;
    white-space: pre-wrap;
    word-break: break-word;

    /deep/.link-text {
      color: #0A70F2;
    }

    /deep/.emoji-img-wrap {
      position: relative;
      height: 24px;
      width: 24px;

      > .emoji-img {
        height: 100%;
        width: 100%;
      }

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
      }
    }
  }
}
</style>
