<template>
  <div class="message-wrap">
    <div v-if="record.showTime && record.state !== 1"
         class="message-time">
      {{ formateTime(record.creationDate) }}
    </div>
    <div v-if="record.state === 1"
         class="message-recall">
      <div>{{ recallText }}</div>
      <div v-if="reEdit"
           class="message-recall-edit"
           @click="onEditRecallClick">
        {{ $T("smbl.chat.view.button.editRecall").$D("重新编辑") }}
      </div>
    </div>
    <div v-else
         :class="['message-call', { 'message-call-right': record.float === 'right' }]">
      <div :id="record.msgId"
           class="message-content">
        <div class="user-name">
          <span v-if="record.senderName"
                class="name">{{ record.senderName }}</span>
          <span v-if="record.senderCompanyName"
                class="company">{{ `@${record.senderCompanyName}` }}</span>
        </div>
        <div class="message-box"
             @touchstart="onTouchStart"
             @touchend="onTouchEnd">
          <div v-if="record.msgId === messageMenu.msgId && messageMenu.list.length"
               v-click-outside="closeMenu"
               class="message-menu">
            <div v-for="menu in messageMenu.list"
                 :key="menu.title"
                 class="message-menu-item"
                 @click="onMenuItemClick(menu.click)">
              {{ menu.title }}
            </div>
          </div>
          <img v-if="record.sendStatus === 1"
               class="message-loading fade-and-rotate"
               :src="require('@/assets/message_sending.svg')">
          <img v-else-if="record.sendStatus === 2"
               class="message-loading"
               :src="require('@/assets/message_error.svg')">
          <text-message v-if="record.msgType === MSG_TYPE.TEXT"
                        :record="record" />
          <image-message v-else-if="record.msgType === MSG_TYPE.IMAGE"
                         :record="record" />
          <file-message v-else-if="record.msgType === MSG_TYPE.FILE"
                        :record="record" />
        </div>
        <div v-if="quoteContent"
             class="message-quote">{{ quoteContent }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { JsBridge, SrmUtil } from "srm-mobile-ui";
import { MSG_TYPE } from "@/modules/ChatRoom/store/constant";
import { recallMessageApi } from "@/modules/ChatRoom/api";
import TextMessage from "@/modules/ChatRoom/components/message/TextMessage";
import ImageMessage from "@/modules/ChatRoom/components/message/ImageMessage";
import FileMessage from "@/modules/ChatRoom/components/message/FileMessage";
import { formateTime, getQuoteContent } from "@/modules/ChatRoom/utils/message";

export default {
  modules: ["smbl.chat"],
  name: "MessageWrap",
  components: {
    TextMessage,
    ImageMessage,
    FileMessage,
  },
  props: {
    record: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      MSG_TYPE: MSG_TYPE,
      menuTimer: null,
      menuLock: false,
    };
  },
  computed: {
    ...mapGetters({
      roomInfo: "ChatRoom/getRoomInfo",
      messageMenu: "ChatRoom/getMessageMenu",
      editorVm: "ChatRoom/getEditorVm",
    }),
    // 撤回内容
    recallText() {
      const { senderUserName, float } = this.record;
      if (float === "left") {
        return this.$T("smbl.chat.view.message.otherRecall", [senderUserName]).$D(`发送人 ${senderUserName} 撤回了一条消息`);
      }
      return this.$T("smbl.chat.view.message.selfRecall").$D("你撤回了一条消息");
    },
    // 是否可以重新编辑
    reEdit() {
      const creationDate = new Date(this.record.creationDate?.replace(/-/g, "/")).getTime();
      const currentDate = new Date().getTime();
      return this.record.float === "right" && currentDate - creationDate < 3 * 60 * 1000 && this.record.msgType === MSG_TYPE.TEXT;
    },
    // 引用内容
    quoteContent() {
      const { quoteMsg } = this.record;
      return getQuoteContent(quoteMsg, this.roomInfo);
    },
  },
  mounted() {},
  methods: {
    formateTime,
    // 重新编辑
    onEditRecallClick() {
      const { originMsgContent, msgContent } = this.record;
      this.editorVm?.recallMessage(originMsgContent || msgContent);
    },
    onTouchStart() {
      this.menuLock = true;
      this.menuTimer = setTimeout(() => {
        this.onContextMenu();
      }, 700);
    },
    onTouchEnd() {
      this.menuLock = false;
      clearTimeout(this.menuTimer);
    },
    // 呼出菜单
    onContextMenu() {
      const { creationDate, float, msgType, msgId } = this.record;
      if (!msgId) {
        return;
      }
      const _creationDate = new Date(creationDate?.replace(/-/g, "/")).getTime();
      const _currentDate = new Date().getTime();
      const showRecall = float === "right" && _currentDate - _creationDate < 2 * 60 * 1000;
      const menuList = [];
      if (showRecall) {
        menuList.push({
          title: this.$T("smbl.chat.view.button.revocation").$D("撤回"),
          click: this.recallMessage,
        });
      }
      if (msgType === MSG_TYPE.TEXT) {
        menuList.push({
          title: this.$T("smbl.chat.view.button.copy").$D("复制"),
          click: this.copyMessage,
        });
      }
      menuList.push({
        title: this.$T("smbl.chat.view.button.quote").$D("引用"),
        click: this.quoteMessage,
      });
      if (msgType === MSG_TYPE.FILE) {
        menuList.push({
          title: this.$T("smbl.chat.view.button.download").$D("下载"),
          click: this.downloadFile,
        });
      }
      this.$store.commit("ChatRoom/setMessageMenu", { msgId, list: menuList });
    },
    // 撤回消息
    recallMessage() {
      const { roomId, currentUser } = this.roomInfo;
      const { companyId } = currentUser;
      const { msgId } = this.record;
      if (msgId) {
        recallMessageApi({ roomId, companyId, msgId });
      }
    },
    // 复制
    copyMessage() {
      const { msgContent } = this.record;
      this.$copyText(msgContent);
    },
    // 引用
    quoteMessage() {
      const { msgId } = this.record;
      if (msgId) {
        this.$store.commit("ChatRoom/setQuoteMsgId", msgId);
        this.editorVm?.focusEditor();
      }
    },
    // 下载
    downloadFile() {
      const { file } = this.record;
      const { downloadUrl } = file;
      if (!downloadUrl) {
        return;
      }
      if (window.HandBridge) {
        JsBridge.downloadFile(downloadUrl);
      } else {
        SrmUtil.downloadFile(downloadUrl);
      }
    },
    onMenuItemClick(callback) {
      callback?.();
      this.closeMenu();
    },
    closeMenu() {
      if (this.menuLock) {
        return;
      }
      this.$store.commit("ChatRoom/setMessageMenu", { msgId: "", list: [] });
    },
  },
};
</script>

<style lang="stylus" scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  80% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn2 {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.message-wrap {
  font-weight: 400;
  font-size: 12px;
  color: #afafaf;

  .fade-and-rotate {
    animation: fadeIn 1s linear 0s forwards, rotate 2s linear 0s infinite;
  }

  .message-time {
    text-align: center;
    margin-bottom: 20px;
  }

  .message-recall {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    line-height: 20px;
    text-align: center;

    .message-recall-edit {
      margin-left: 8px;
      color: #276ef1;
    }
  }

  .message-call {
    display: flex;

    &.message-call-right {
      flex-direction: row-reverse;

      .message-content {
        align-items: flex-end;
        margin-right: 15px;

        .message-box {
          flex-direction: row;
        }
      }
    }

    .message-content {
      display: flex;
      flex-direction: column;
      margin-left: 15px;

      .user-name {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        line-height: 18px;
        font-size: 12px;

        .name {
          white-space: nowrap;
          margin-right: 8px;
          line-height: 18px;
        }

        .company {
          white-space: pre-wrap;
          word-break: break-word;
          color: #FFC043;
          line-height: 16px;
          font-weight: 500;
        }
      }

      .message-box {
        position: relative;
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-end;
        align-items: flex-end;
        width: fit-content;

        .message-menu {
          position: absolute;
          top: -4px;
          background-color: #000;
          transform: translateY(-100%);
          border-radius: 4px;
          animation: fadeIn2 0.1s linear;
          z-index: 999999;

          .message-menu-item {
            color: #fff;
            font-size: 14;
            padding: 12px 24px;
            white-space: nowrap;

            &:not(:last-child) {
              border-bottom: 1px solid rgba(255, 255, 255, 0.4);
            }
          }
        }

        .message-loading {
          padding: 0 10px;
          height: 22px;
          width: 34px;
        }
      }

      .message-quote {
        margin-top: 7px;
        padding: 4px 12px;
        font-size: 12px;
        line-height: 18px;
        color: #999;
        background-color: #E7E7E7;
        border-radius: 6px;
        white-space: nowrap;
        max-width: 260px;
        width: fit-content;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }
}
</style>
