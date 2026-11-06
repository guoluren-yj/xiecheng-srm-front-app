<template>
  <div class="file-record-wrap">
    <base-header :title="$T('smbl.chat.view.button.fileMessageTab').$D('文件')"
                 show-back />
    <div class="file-record-list"
         @scroll="onScrollBottom">
      <div v-for="record in renderFileList"
           :key="record.time"
           class="file-record-list-item">
        <div class="file-record-list-item-time">{{ record.time }}</div>
        <record-item v-for="item in record.list"
                     :key="item.msgId"
                     class="file-record-content"
                     :record="item" />
      </div>
      <div v-if="bottomText"
           class="loading-text">
        {{ bottomText }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { MSG_TYPE } from "@/modules/ChatRoom/store/constant";
import { getChatRoomHistoryMessagesApi } from "@/modules/ChatRoom/api";
import { judgeMessageRecords } from "@/modules/ChatRoom/utils/message";
import { getDateGroup } from "@/modules/ChatRoom/utils/common";
import BaseHeader from "@/modules/ChatRoom/components/BaseHeader";
import RecordItem from "@/modules/ChatRoom/components/message/RecordItem";

export default {
  name: "FileRecordList",
  modules: ["smbl.chat"],
  components: {
    BaseHeader,
    RecordItem,
  },
  data() {
    return {
      pageSize: 20,
      fileRecordList: [],
      loadingState: 1, // 1 - 加载更多, 2 - 加载中, 3 - 没有更多消息
    };
  },
  computed: {
    ...mapGetters({
      roomInfo: "ChatRoom/getRoomInfo",
    }),
    renderFileList() {
      const result = [];
      this.fileRecordList.forEach((record) => {
        const { creationDate } = record;
        const group = getDateGroup(creationDate);
        if (result.length && result[result.length - 1].time === group) {
          result[result.length - 1].list.push(record);
        } else {
          result.push({ time: group, list: [record] });
        }
      });
      return result;
    },
    bottomText() {
      return this.loadingState === 2 ? this.$T("smbl.chat.view.message.loading").$D("加载中...") : "";
    },
  },
  mounted() {
    this.getFileRecords();
  },
  methods: {
    async getFileRecords(more = false) {
      const { roomId, currentUser } = this.roomInfo;
      const { companyId } = currentUser;
      const params = {
        roomId,
        companyId,
        size: this.pageSize,
        msgType: MSG_TYPE.FILE,
      };
      // 如果是获取更多消息，添加msgId
      if (more) {
        params.msgId = this.fileRecordList[this.fileRecordList.length - 1]?.msgId;
      }
      this.loadingState = 2;
      const result = await getChatRoomHistoryMessagesApi(params);
      if (result.failed) {
        return;
      }
      let newResult = judgeMessageRecords(result, this.roomInfo);
      // 没有更多历史消息了
      if (result.length < this.pageSize) {
        this.loadingState = 3;
      } else {
        this.loadingState = 1;
      }
      if (more) {
        this.fileRecordList = this.fileRecordList.concat(newResult);
      } else {
        this.fileRecordList = newResult;
      }
    },
    onScrollBottom(event) {
      if (this.loadingState !== 1) {
        return;
      }
      const dom = event.target;
      if (dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 10) {
        this.getFileRecords(true);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.file-record-wrap {
  height: 100vh;
  width: 100vw;
  color: #333;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  background-color: #F6F6F6;

  .file-record-list {
    flex: 1;
    overflow: auto;

    .file-record-list-item {
      margin-top: 18px;
      font-size: 12px;
      color: #AFAFAF;

      .file-record-list-item-time {
        padding-left: 20px;
        margin-bottom: 6px;
      }

      .file-record-content:not(:last-child) {
        border-bottom: 1px solid #F6F6F6;
      }
    }

    .loading-text {
      text-align: center;
      font-size: 12px;
      padding: 10px 0;
      color: #333;
    }
  }
}
</style>
