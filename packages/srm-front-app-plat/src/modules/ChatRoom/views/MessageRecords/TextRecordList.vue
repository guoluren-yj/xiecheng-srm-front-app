<template>
  <div class="text-record-wrap">
    <base-header :title="roomInfo.roomName"
                 show-back />
    <div class="text-record-list"
         @scroll="onScrollBottom">
      <div v-for="record in textRecordList"
           :key="record.msg"
           class="text-record-list-item">
        <record-item class="text-record-content"
                     :record="record" />
      </div>
      <div v-if="bottomText"
           class="loading-text">
        {{ bottomText }}
      </div>
      <p v-if="loadingState === 3 && !textRecordList.length"
         class="text-record-empty">
        <span>{{ $T("smbl.chat.view.search.noResult.left").$D("未查询到") }}</span>
        <span>{{ `“${searchTextValue}”` }}</span>
        <span>{{ $T("smbl.chat.view.search.noResult.right").$D("相关结果") }}</span>
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { MSG_TYPE } from "@/modules/ChatRoom/store/constant";
import { getChatRoomHistoryMessagesApi } from "@/modules/ChatRoom/api";
import { judgeMessageRecords } from "@/modules/ChatRoom/utils/message";
import { dateFormat } from "@/modules/ChatRoom/utils/common";
import BaseHeader from "@/modules/ChatRoom/components/BaseHeader";
import RecordItem from "@/modules/ChatRoom/components/message/RecordItem";

export default {
  name: "TextRecordList",
  modules: ["smbl.chat"],
  components: {
    BaseHeader,
    RecordItem,
  },
  data() {
    return {
      MSG_TYPE,
      pageSize: 20,
      textRecordList: [],
      loadingState: 1, // 1 - 加载更多, 2 - 加载中, 3 - 没有更多消息
    };
  },
  computed: {
    ...mapGetters({
      roomInfo: "ChatRoom/getRoomInfo",
      searchTextValue: "ChatRoom/getSearchTextValue",
    }),
    bottomText() {
      return this.loadingState === 2 ? this.$T("smbl.chat.view.message.loading").$D("加载中...") : "";
    },
  },
  mounted() {
    this.getTextRecords();
  },
  methods: {
    dateFormat,
    async getTextRecords(more = false) {
      const { roomId, currentUser } = this.roomInfo;
      const { companyId } = currentUser;
      const params = {
        roomId,
        companyId,
        size: this.pageSize,
        msgContent: this.searchTextValue,
      };
      // 如果是获取更多消息，添加msgId
      if (more) {
        params.msgId = this.textRecordList[this.textRecordList.length - 1]?.msgId;
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
        this.textRecordList = this.textRecordList.concat(newResult);
      } else {
        this.textRecordList = newResult;
      }
    },
    onScrollBottom(event) {
      if (this.loadingState !== 1) {
        return;
      }
      const dom = event.target;
      if (dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 10) {
        this.getTextRecords(true);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.text-record-wrap {
  height: 100vh;
  width: 100vw;
  color: #333;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  background-color: #F6F6F6;

  .text-record-list {
    position: relative;
    flex: 1;
    overflow: auto;

    .text-record-list-item {
      font-size: 12px;
      color: #AFAFAF;

      &:not(:last-child) {
        .text-record-content {
          border-bottom: 1px solid #F6F6F6;
        }
      }
    }

    .text-record-empty {
      position: absolute;
      left: 50%;
      top: 30%;
      transform: translateX(-50%);
      font-size: 14px;
      line-height: 18px;
      color: #757575;
      width: 80%;
      text-align: center;

      > span:nth-child(2) {
        color: #276ef1;
        word-break: break-all;
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