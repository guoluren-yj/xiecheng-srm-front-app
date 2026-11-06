<template>
  <div class="record-item"
       @click="onFileClick()">
    <div class="record-item-top">
      <span :class="{['me-record']: renderRecord.float === 'right'}">{{ renderRecord.name }}</span>
      <span>{{ renderRecord.time }}</span>
    </div>
    <div v-if="renderRecord.msgType === MSG_TYPE.FILE"
         class="record-item-info">
      <img :src="renderRecord.fileIcon"
           alt="">
      <div class="record-item-detail">
        <div>{{ renderRecord.fileName }}</div>
        <span>{{ renderRecord.fileSize }}</span>
      </div>
    </div>
    <div v-if="renderRecord.msgType === MSG_TYPE.TEXT"
         class="text-record-item-info">
      <span>{{ renderRecord.msgContent }}</span>
    </div>
  </div>
</template>
<script>
import { SrmUtil } from "srm-mobile-ui";
import { MSG_TYPE } from "@/modules/ChatRoom/store/constant";
import { calculateFileSize, getFileIcon } from "@/modules/ChatRoom/utils/message";
import { dateFormat } from "@/modules/ChatRoom/utils/common";

export default {
  name: "RecordItem",
  modules: ["smbl.chat"],
  components: {},
  props: {
    record: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      MSG_TYPE,
    };
  },
  computed: {
    renderRecord() {
      const { creationDate, senderUserName, fileName, fileSize } = this.record;
      return {
        ...this.record,
        name: senderUserName,
        time: dateFormat(new Date(creationDate), "YYYY-MM-dd"),
        fileSize: calculateFileSize(fileSize),
        fileIcon: getFileIcon(fileName),
      };
    },
  },
  mounted() {},
  methods: {
    onFileClick() {
      if (this.renderRecord.file) {
        SrmUtil.previewFile(this.renderRecord.file);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~srm-mobile-ui/src/style/var.styl';

.record-item {
  font-size: 12px;
  color: #AFAFAF;
  background-color: #fff;
  padding: 12px 20px;
  font-weight: 400;

  .record-item-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    > span:first-child {
      color: #333;

      &.me-record {
        color: $srm-theme-color-primary;
      }
    }
  }

  .record-item-info {
    display: flex;
    overflow: hidden;

    > img {
      height: 42px;
      width: 42px;
      border-radius: 4px;
      margin-right: 12px;
    }

    .record-item-detail {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;

      > div {
        line-height: 24px;
        font-size: 16px;
        color: #333333;
        white-space: pre-wrap;
        word-break: break-all;
      }

      > span {
        line-height: 16px;
      }
    }
  }

  .text-record-item-info {
    font-size: 14px;
    line-height: 22px;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
