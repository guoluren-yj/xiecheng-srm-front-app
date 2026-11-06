<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="emoji">
    <div v-for="emoji in emojisKeys"
         :key="emoji"
         class="emoji-item"
         @click="$emit('emojiClick', emoji)">
      <p v-html="emojis[emoji]" />
    </div>
  </div>
</template>
<script>
import { emojis, emojisKeys } from "@/modules/ChatRoom/utils/message";

export default {
  modules: ["smbl.chat"],
  name: "Emoji",
  props: {},
  data() {
    return {
      emojis,
      emojisKeys,
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="stylus" scoped>
.emoji {
  width: 100%;
  margin: 16px 8px 0 8px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;

  .emoji-item {
    width: calc((100% / 7));
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    /deep/.emoji-img {
      height: 24px;
      width: 24px;
    }

    /deep/.emoji-img-wrap {
      position: relative;
      height: 30px;
      width: 30px;

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
