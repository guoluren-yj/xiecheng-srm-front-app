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
import { escapeHtml, textReplaceEmoji, textReplaceLink } from "@/modules/ChatRoom/utils/message";

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
      // platform-9076 安全整改（poc35）：本组件用 v-html 渲染，必须先把原文当纯文本转义，
      // 再对转义后的文本做表情 / 链接替换（生成我方信任的 HTML 片段）。
      // ★ 顺序不可颠倒：若先替换再转义，自己生成的 <a>/<img> 会被转义成字面量，表情与链接整体失效。
      return textReplaceEmoji(textReplaceLink(escapeHtml(msgContent)));
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
