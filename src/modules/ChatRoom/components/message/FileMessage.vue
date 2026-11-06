<template>
  <div :class="['file-message', { 'file-message-right': record.float === 'right' }]">
    <div class="file-message-inner"
         @click="onFileClick">
      <div class="file-info">
        <span>{{ record.fileName }}</span>
        <span>{{ fileSize }}</span>
      </div>
      <img class="file-icon"
           :src="fileIcon">
    </div>
    <div v-if="atText"
         class="message-at">
      {{ `发送给 ${atText}` }}
    </div>
  </div>
</template>
<script>
import { SrmUtil } from "srm-mobile-ui";
import { calculateFileSize, getFileIcon } from "@/modules/ChatRoom/utils/message";

export default {
  modules: [],
  name: "FileMessage",
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
    fileSize() {
      return calculateFileSize(this.record.fileSize);
    },
    fileIcon() {
      const { fileName } = this.record;
      return getFileIcon(fileName);
    },
  },
  mounted() {},
  methods: {
    onFileClick() {
      if (this.record.file) {
        SrmUtil.previewFile(this.record.file);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.file-message {
  display: flex;
  flex-direction: column;

  &.file-message-right {
    align-items: flex-end;

    .file-message-inner {
      border-radius: 12px 3px 12px 12px;
    }
  }

  .file-message-inner {
    display: flex;
    padding: 12px 14px;
    background-color: #fff;
    border-radius: 3px 12px 12px 12px;
    color: #757575;
    font-size: 16px;
    width: 260px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;

    .file-info {
      display: flex;
      flex-direction: column;
      padding-right: 10px;
      line-height: 24px;

      > span:first-child {
        margin-bottom: 6px;
        white-space: pre-wrap;
        word-break: break-all;
      }

      > span:last-child {
        font-size: 12px;
        color: #868d9c;
      }
    }

    .file-icon {
      height: 40px;
      width: 40px;
      border-radius: 4px;
    }
  }

  .message-at {
    margin-top: 4px;
    font-size: 12px;
    line-height: 22px;
  }
}
</style>
