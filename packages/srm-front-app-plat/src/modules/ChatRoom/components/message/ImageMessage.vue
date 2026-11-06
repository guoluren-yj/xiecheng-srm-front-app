<template>
  <div :class="['image-message', { 'image-message-right': record.float === 'right' }]">
    <div class="image-message-inner"
         :style="size">
      <load-image :src="record.file?.downloadUrl"
                  :preview-file="record.file" />
    </div>
    <div v-if="atText"
         class="message-at">
      {{ `发送给 ${atText}` }}
    </div>
  </div>
</template>
<script>
import LoadImage from "@/modules/ChatRoom/components/LoadImage";

export default {
  modules: [],
  name: "ImageMessage",
  components: {
    LoadImage,
  },
  props: {
    record: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loadState: "loading",
    };
  },
  computed: {
    // at内容
    atText() {
      return this.record.receiverHide ? "" : this.record.receiverNames?.join?.(",");
    },
    size() {
      const { imageWidth, imageHeight } = this.record;
      let width = imageWidth;
      let height = imageHeight;
      if (imageWidth > 160) {
        height = (160 / imageWidth) * imageHeight;
        width = 160;
      }
      return { width: `${width}px`, height: `${height}px` };
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="stylus" scoped>
.image-message {
  display: flex;
  flex-direction: column;

  &.image-message-right {
    align-items: flex-end;

    .image-message-inner {
      border-radius: 12px 3px 12px 12px;
    }
  }

  .image-message-inner {
    position: relative;
    border-radius: 3px 12px 12px 12px;
    overflow: hidden;
  }

  .message-at {
    margin-top: 4px;
    font-size: 12px;
    line-height: 22px;
  }
}
</style>
