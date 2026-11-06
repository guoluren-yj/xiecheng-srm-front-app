<template>
  <div v-click-outside="onOutSide"
       class="me-editor">
    <div v-if="roomInfo.purchaseFlag"
         class="send-to"
         @click="onSendToClick">
      <span>
        {{ `${$T("smbl.chat.view.message.sendTo").$D("发送给")}：${sendToName}` }}
      </span>
      <span class="srm-icon icon-chevron-down" />
    </div>
    <div class="input-wrap">
      <div class="icon-wrap">
        <img :src="require('@/assets/icon_sentiment_satisfied.svg')"
             alt=""
             @click="onEmojiClick">
      </div>
      <div class="input-box">
        <div id="meEditorInput"
             ref="textarea"
             class="textarea-input"
             contenteditable="true"
             @input="onTextareaInput"
             @focus="onTextareaFocus" />
        <div v-if="quoteContent"
             class="input-quote"
             @click="onQuoteClick">
          <span>{{ quoteContent }}</span>
          <span class="srm-icon icon-x"
                @click.stop="onQuoteClearClick" />
        </div>
      </div>
      <div :class="['icon-wrap', { editing: sendTextValue }]">
        <srm-button v-if="sendTextValue"
                    rect
                    @click="onSendClick">
          {{ $T("smbl.chat.view.button.send").$D("发送") }}
        </srm-button>
        <img v-else
             :src="require('@/assets/icon_control_point.svg')"
             alt=""
             @click="onMoreClick">
      </div>
    </div>
    <div :class="['more-wrap', { ['more-wrap--show']: moreFlag }]">
      <div class="more-block"
           @click="onUploadImageClick">
        <img :src="require('@/assets/icon_camera.svg')"
             alt="">
        <span>{{ $T("smbl.chat.view.button.sendImage").$D("发送照片") }}</span>
      </div>
      <div class="more-block"
           @click="onUploadFileClick">
        <img :src="require('@/assets/icon_folder.svg')"
             alt="">
        <span>{{ $T("smbl.chat.view.button.sendFile").$D("发送文件") }}</span>
      </div>
    </div>
    <div :class="['emoji-wrap', { ['emoji-wrap--show']: emojiFlag }]">
      <emoji @emojiClick="onInnerEmojiClick" />
    </div>
    <input ref="fileUpload"
           class="file-upload"
           type="file"
           @change="(event) => upload(event, MSG_TYPE.FILE)">
    <input ref="imageUpload"
           class="file-upload"
           type="file"
           accept="image/*"
           @change="(event) => upload(event, MSG_TYPE.IMAGE)">
    <srm-popup :visible.sync="visible"
               :show-header="false"
               :close-by-drag="false"
               rounded
               class="send-to-popup"
               @onClose="onPopupClose">
      <span class="srm-icon close-btn icon-x"
            @click="onPopupClose" />
      <srm-tab ref="sendToTab"
               class="send-tab-wrap"
               no-all
               @changeTab="onSendToTabChange">
        <srm-tab-pane :label="$T('smbl.chat.view.tab.tenant').$D('选择租户')"
                      :prop-key="SEND_TO_TYPE.TENANT" />
        <srm-tab-pane :label="$T('smbl.chat.view.tab.user').$D('选择人员')"
                      :prop-key="SEND_TO_TYPE.USER" />
      </srm-tab>
      <div class="send-to-list">
        <div v-for="item in sendToListMap[tabKey.cache]"
             :key="item.id"
             :class="['send-to-item', { active: item.id === activeSendToId.cache }]"
             @click="onSendToItemClick(item)">
          {{ item.displayName }}
          <span class="srm-icon icon-check" />
        </div>
      </div>
      <div class="send-to-btn">
        <srm-button fill
                    size="large"
                    full-width
                    type="primary"
                    @click="onSendToConfirm">
          {{ $T("smbl.common.button.sure").$D("确定") }}
        </srm-button>
      </div>
    </srm-popup>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import uuid from "uuid";
import { MSG_TYPE, SEND_TO_TYPE } from "@/modules/ChatRoom/store/constant";
import { sendMessageApi, uploadFileApi } from "@/modules/ChatRoom/api";
import { getImageSize, dateFormat, to } from "@/modules/ChatRoom/utils/common";
import { getQuoteContent } from "@/modules/ChatRoom/utils/message";
import Emoji from "@/modules/ChatRoom/components/Emoji";

export default {
  modules: ["smbl.chat", "smbl.common"],
  name: "MeEditor",
  components: {
    Emoji,
  },
  data() {
    return {
      MSG_TYPE,
      SEND_TO_TYPE,
      moreFlag: false,
      emojiFlag: false,
      visible: false,
      tabKey: {
        cache: SEND_TO_TYPE.USER,
        current: SEND_TO_TYPE.USER,
      },
      activeSendToId: {
        cache: SEND_TO_TYPE.ALL,
        current: SEND_TO_TYPE.ALL,
        cacheDisplayName: "",
        displayName: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      panelVm: "ChatRoom/getPanelVm",
      roomInfo: "ChatRoom/getRoomInfo",
      sendTextValue: "ChatRoom/getSendTextValue",
      originMessage: "ChatRoom/getOriginMessage",
      message: "ChatRoom/message",
      quoteMsgId: "ChatRoom/getQuoteMsgId",
    }),
    sendToListMap() {
      const { suppliers } = this.roomInfo;
      const tenantList = [];
      const userList = [{ displayName: this.$T("smbl.chat.model.sendTo.allUsers").$D("全员"), id: SEND_TO_TYPE.ALL }];
      suppliers?.forEach((supplier) => {
        tenantList.push({ ...supplier, atName: supplier.displayName });
        supplier.members?.forEach((member) => {
          userList.push({ ...member, atName: `${supplier.displayName}_${member.displayName}` });
        });
      });
      return { [SEND_TO_TYPE.TENANT]: tenantList, [SEND_TO_TYPE.USER]: userList };
    },
    sendToName() {
      const list = this.sendToListMap[this.tabKey.current];
      const current = list.find((item) => item.id === this.activeSendToId.current);
      return current?.displayName || "";
    },
    quoteContent() {
      const quoteMessage = this.message.find((message) => message.msgId === this.quoteMsgId);
      return getQuoteContent(quoteMessage, this.roomInfo);
    },
  },
  mounted() {
    this.$store.commit("ChatRoom/setEditorVm", this);
    this.$nextTick(() => {
      this.$refs.sendToTab?.changeNavTab(1);
    });
  },
  deactivated() {
    this.$store.commit("ChatRoom/setEditorVm", null);
  },
  methods: {
    // 让光标保持在最后
    keepCursorAtEnd() {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(this.$refs.textarea);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    },
    // 跳转引用
    onQuoteClick() {
      // 点击引用消息
      const msgDom = document.getElementById(this.quoteMsgId);
      if (msgDom) {
        msgDom.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    // 删除引用
    onQuoteClearClick() {
      this.$store.commit("ChatRoom/setQuoteMsgId", "");
    },
    // 选择发送人
    onSendToClick() {
      this.visible = true;
    },
    onPopupClose() {
      this.visible = false;
      this.activeSendToId.cache = this.activeSendToId.current;
    },
    // 发送人tab变化
    onSendToTabChange(tab) {
      this.tabKey.cache = tab.propKey;
    },
    // 发送人选择
    onSendToItemClick(item) {
      this.activeSendToId.cache = item.id;
      this.activeSendToId.cacheDisplayName = item.atName;
    },
    // 确认发送人选择
    onSendToConfirm() {
      this.tabKey.current = this.tabKey.cache;
      this.activeSendToId.current = this.activeSendToId.cache;
      this.activeSendToId.displayName = this.activeSendToId.cacheDisplayName;
      this.visible = false;
    },
    // 点击编辑框外部
    onOutSide() {
      this.moreFlag = false;
      this.emojiFlag = false;
      this.$refs.textarea?.blur();
    },
    // 输入框输入
    onTextareaInput(value) {
      this.$store.commit("ChatRoom/setSendTextValue", value.target.innerText);
    },
    // 输入框聚焦
    onTextareaFocus() {
      this.emojiFlag = false;
      this.moreFlag = false;
      this.panelVm?.toPanelBottom();
    },
    // 更多
    onMoreClick() {
      this.$refs.textarea?.blur();
      if (!this.moreFlag) {
        this.panelVm?.toPanelBottom();
      }
      this.emojiFlag = false;
      this.moreFlag = !this.moreFlag;
    },
    // 表情
    onEmojiClick() {
      if (!this.emojiFlag) {
        this.panelVm?.toPanelBottom();
      }
      this.emojiFlag = !this.emojiFlag;
      this.moreFlag = false;
    },
    // 具体表情
    onInnerEmojiClick(emoji) {
      this.emojiFlag = true;
      this.$refs.textarea.innerText = this.sendTextValue + emoji;
      this.$store.commit("ChatRoom/setSendTextValue", this.sendTextValue + emoji);
    },
    // 上传照片
    onUploadImageClick() {
      this.$refs.imageUpload.click();
    },
    // 上传文件
    onUploadFileClick() {
      this.$refs.fileUpload.click();
    },
    // 发送
    onSendClick() {
      if (!this.emojiFlag) {
        this.$refs.textarea?.focus();
      }
      this.onSendTextMessage();
    },
    focusEditor() {
      setTimeout(() => {
        this.$refs.textarea?.focus();
        this.keepCursorAtEnd();
      }, 100);
    },
    // 重新编辑
    recallMessage(msgContent) {
      this.$store.commit("ChatRoom/setSendTextValue", msgContent);
      this.$refs.textarea.innerText = msgContent;
      this.focusEditor();
    },
    // 模拟发送
    mockSendMessage(msg) {
      const lastMessage = this.message.find((message) => message.float === "right");
      const extra = {};
      if (lastMessage) {
        extra.senderName = lastMessage.senderName;
        extra.senderCompanyName = lastMessage.senderCompanyName;
        extra.senderRoomMemberId = lastMessage.senderRoomMemberId;
        extra.senderRoomTenantId = lastMessage.senderRoomTenantId;
        extra.senderUserName = lastMessage.senderUserName;
      }
      this.$store.commit("ChatRoom/setOriginMessage", [{ ...msg, ...extra }, ...this.originMessage]);
    },
    // 更新消息失败状态
    updateMessageState(msg, status) {
      const newOriginMessage = this.originMessage.map((item) => {
        if (item.msgUuid === msg.msgUuid) {
          return { ...item, sendStatus: status };
        }
        return item;
      });
      this.$store.commit("ChatRoom/setOriginMessage", newOriginMessage);
    },
    // 获取模拟消息体
    getMockMessage(extra) {
      const { roomId, currentUser } = this.roomInfo;
      const { companyId } = currentUser;
      const { msgType } = extra;
      const msgUuid = uuid();
      const isAll = this.activeSendToId.current === SEND_TO_TYPE.ALL;
      const quoteMessage = this.message.find((message) => message.msgId === this.quoteMsgId);
      const messageParams = {
        hitType: isAll ? SEND_TO_TYPE.ALL : this.tabKey.current,
        roomId,
        senderCompanyId: companyId,
        msgUuid,
        ...extra,
      };
      if (this.activeSendToId.current !== SEND_TO_TYPE.ALL) {
        messageParams.receivers = [this.activeSendToId.current];
        messageParams.receiverNames = [this.activeSendToId.displayName];
      }
      if (quoteMessage && msgType === MSG_TYPE.TEXT) {
        messageParams.quoteMsgId = quoteMessage.msgId;
        messageParams.quoteMsg = quoteMessage;
        this.onQuoteClearClick();
      }
      const mockMessage = {
        ...messageParams,
        sendStatus: 1,
        creationDate: dateFormat(new Date(), "YYYY-MM-dd HH:mm:ss"),
      };
      return mockMessage;
    },
    // 发送文本消息
    async onSendTextMessage() {
      const mockMessage = this.getMockMessage({ msgType: MSG_TYPE.TEXT, msgContent: this.sendTextValue });
      this.$store.commit("ChatRoom/setSendTextValue", "");
      this.$refs.textarea.innerText = "";
      this.mockSendMessage(mockMessage);
      this.panelVm?.toPanelBottom();
      const [error, result] = await to(sendMessageApi(mockMessage));
      // 更新消息失败状态
      if (error || result.failed) {
        this.updateMessageState(mockMessage, 2);
      } else {
        this.updateMessageState(result, 0);
      }
    },
    // 发送附件
    async upload(event, type) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const [error, url] = await to(uploadFileApi(file));
      if (error || url?.failed) {
        return;
      }
      if (type === MSG_TYPE.IMAGE || /\.(gif|jpg|jpeg|png|webp|GIF|JPG|PNG|WEBP)$/.test(file.name)) {
        getImageSize(file, (size) => {
          const mockMessage = this.getMockMessage({
            msgType: MSG_TYPE.IMAGE,
            imageWidth: size.width,
            imageHeight: size.height,
            imageUrl: url,
          });
          sendMessageApi(mockMessage);
        });
      } else if (type === MSG_TYPE.FILE) {
        const mockMessage = this.getMockMessage({
          msgType: MSG_TYPE.FILE,
          fileUrl: url,
          fileName: file.name,
          fileSize: file.size,
        });
        sendMessageApi(mockMessage);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.me-editor {
  background-color: #F7F8FA;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  color: #333333;
  font-weight: 400;
  padding: 8px 0;
  position: relative;

  .send-to {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    font-size: 14px;
    padding: 0 12px;
    height: 40px;
    top: -10px;
    left: 15px;
    transform: translateY(-100%);
    max-width: calc(100vw - 30px);
    overflow: hidden;

    > span:first-child {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 4px;
    }
  }

  .input-wrap {
    display: flex;
    align-items: flex-end;

    .icon-wrap {
      height: 38px;
      width: 52px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: width 0.1s linear;

      &.editing {
        width: 80px;
      }

      > img {
        height: 26px;
        width: 26px;
      }
    }

    .input-box {
      flex: 1;

      .textarea-input {
        min-height: 38px;
        max-height: 200px;
        line-height: 24px;
        padding: 7px 12px;
        background-color: #fff;
        border-radius: 6px;
        white-space: pre-wrap;
        word-break: break-all;
        overflow: auto;
      }

      .input-quote {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 12px;
        font-size: 14px;
        margin: 8px 0 6px 0;
        min-height: 26px;
        line-height: 18px;
        background-color: #E7E7E7;
        border-radius: 6px;
        white-space: pre-wrap;
        word-break: break-all;
        color: #999;

        > span:first-child {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        > .srm-icon {
          color: #fff;
          font-size: 10px;
          border-radius: 50%;
          padding: 2px;
          background-color: #aaa;
          line-height: 10px;
        }
      }
    }
  }

  .more-wrap, .emoji-wrap {
    height: 0;
    overflow: hidden;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    transition: height 0.1s linear;
    background-color: #F7F8FA;

    &.more-wrap--show {
      height: 90px;
    }

    &.emoji-wrap--show {
      height: 240px;
    }

    .more-block {
      display: flex;
      flex-direction: column;
      width: 105px;
      height: 60px;
      box-sizing: border-box;
      background-color: #fff;
      margin: 15px 0 0px 15px;
      border-radius: 4px;
      padding: 12px;

      > img {
        height: 16px;
        width: 16px;
      }

      > span {
        font-size: 12px;
        line-height: 16px;
        margin-top: 4px;
      }
    }
  }

  .file-upload {
    display: none;
  }
}

.send-to-popup {
  /deep/.srm-popup-content {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .close-btn {
      position: absolute;
      color: #AFAFAF;
      right: 20px;
      top: 16px;
      font-size: 20px;
      z-index: 9999;
    }

    .send-to-list {
      flex: 1;
      overflow: auto;

      .send-to-item {
        display: flex;
        font-size: 16px;
        color: #757575;
        padding: 12px;
        margin: 0 15px;
        border-bottom: 1px solid #F6F6F6;
        line-height: 24px;
        font-weight: 400;
        word-break: break-all;
        align-items: center;
        justify-content: space-between;

        .srm-icon {
          opacity: 0;
          color: #276EF1;
          margin-left: 10px;
          font-weight: 600;
        }

        &.active {
          color: #276EF1;
          font-weight: 500;

          .srm-icon {
            opacity: 1;
          }
        }
      }
    }

    .send-to-btn {
      padding: 8px 15px;
    }
  }
}

.send-tab-wrap {
  /deep/.srm-nav-content {
    display: flex !important;
    justify-content: center;
    padding: 0;

    > li {
      font-size: 16px;
      margin: 0;
      color: #757575;

      &:first-child {
        margin-right: 40px;
      }
    }
  }

  /deep/.srm-line-tab-content {
    display: none;
  }
}
</style>
