<template>
  <div class="image-record">
    <base-header :title="$T('smbl.chat.view.button.imageMessageTab').$D('图片')"
                 show-back />
    <div class="image-record-list"
         @scroll="onScrollBottom">
      <div v-for="record in renderImageList"
           :key="record.time"
           class="image-record-item">
        <div class="image-record-item-time">{{ record.time }}</div>
        <div class="image-record-image-list">
          <div v-for="item in record.list"
               :key="item.msgId"
               class="image-record-image-item">
            <div class="image-record-image-inner">
              <load-image :src="item.downloadUrl"
                          :preview-file="item.file" />
            </div>
          </div>
        </div>
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
import LoadImage from "@/modules/ChatRoom/components/LoadImage";

export default {
  name: "ImageRecordList",
  modules: ["smbl.chat"],
  components: {
    BaseHeader,
    LoadImage,
  },
  data() {
    return {
      pageSize: 0,
      imageRecordList: [],
      loadingState: 1, // 1 - 加载更多, 2 - 加载中, 3 - 没有更多消息
    };
  },
  computed: {
    ...mapGetters({
      roomInfo: "ChatRoom/getRoomInfo",
    }),
    renderImageList() {
      const result = [];
      this.imageRecordList.forEach((record) => {
        const { creationDate, msgId, file } = record;
        const { downloadUrl } = file;
        const group = getDateGroup(creationDate);
        const imageItem = { downloadUrl, msgId, file };
        if (result.length && result[result.length - 1].time === group) {
          result[result.length - 1].list.push(imageItem);
        } else {
          result.push({ time: group, list: [imageItem] });
        }
      });
      return result;
    },
    bottomText() {
      return this.loadingState === 2 ? this.$T("smbl.chat.view.message.loading").$D("加载中...") : "";
    },
  },
  mounted() {
    this.getPageSize();
    this.getImageRecords();
  },
  methods: {
    getPageSize() {
      const { width, height } = window.screen;
      const _width = width / 4;
      const line = Math.ceil(height / _width);
      this.pageSize = line * 4;
    },
    async getImageRecords(more = false) {
      const { roomId, currentUser } = this.roomInfo;
      const { companyId } = currentUser;
      const params = {
        roomId,
        companyId,
        size: this.pageSize,
        msgType: MSG_TYPE.IMAGE,
      };
      // 如果是获取更多消息，添加msgId
      if (more) {
        params.msgId = this.imageRecordList[this.imageRecordList.length - 1]?.msgId;
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
        this.imageRecordList = this.imageRecordList.concat(newResult);
      } else {
        this.imageRecordList = newResult;
      }
    },
    onScrollBottom(event) {
      if (this.loadingState !== 1) {
        return;
      }
      const dom = event.target;
      if (dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 10) {
        this.getImageRecords(true);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.image-record {
  height: 100vh;
  width: 100vw;
  color: #333;
  font-weight: 400;
  display: flex;
  flex-direction: column;

  .image-record-list {
    flex: 1;
    overflow: auto;

    .image-record-item {
      margin-top: 18px;

      .image-record-item-time {
        font-size: 12px;
        color: #AFAFAF;
        line-height: 16px;
        font-weight: 400;
        padding-left: 20px;
        margin-bottom: 12px;
      }

      .image-record-image-list {
        display: flex;
        flex-wrap: wrap;

        .image-record-image-item {
          position: relative;
          width: 25%;
          box-sizing: border-box;
          padding-top: 25%;

          .image-record-image-inner {
            position: absolute;
            left: 3px;
            top: 3px;
            right: 3px;
            bottom: 3px;
          }
        }
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
