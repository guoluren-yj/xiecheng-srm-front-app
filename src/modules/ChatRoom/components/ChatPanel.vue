<template>
  <div ref="chatPanelRef"
       class="chat-panel">
    <div ref="panelRef"
         :class="['message-list', { 'message-list-padding': roomInfo.purchaseFlag }]"
         @scroll="onScrollTop">
      <div v-if="!roomInfo.muteState"
           class="message-mute">
        {{ $T('smbl.chat.view.message.shutupTip').$D('采购方已开启禁言') }}
      </div>
      <div v-for="item in message"
           :key="item.msgId || item.msgUuid"
           class="message-item">
        <message-wrap :record="item" />
      </div>
      <div v-if="loadingState !== 1"
           class="message-top">
        {{ topText }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { isChildInParentView } from "@/modules/ChatRoom/utils/common";
import { getChatRoomMessagesApi } from "@/modules/ChatRoom/api";
import MessageWrap from "@/modules/ChatRoom/components/message/MessageWrap";

export default {
  modules: ["smbl.chat"],
  name: "ChatPanel",
  components: {
    MessageWrap,
  },
  data() {
    return {
      pageSize: 20,
      loadingState: 1, // 1 - 加载更多, 2 - 加载中, 3 - 没有更多消息
    };
  },
  computed: {
    ...mapGetters({
      roomInfo: "ChatRoom/getRoomInfo",
      originMessage: "ChatRoom/getOriginMessage",
      message: "ChatRoom/message",
    }),
    topText() {
      const textMap = {
        2: this.$T("smbl.chat.view.message.loading").$D("加载中..."),
        3: this.$T("smbl.chat.view.message.noMoreMsg").$D("没有更多消息"),
      };
      return textMap[this.loadingState] || "";
    },
  },
  activated() {
    this.initData();
  },
  mounted() {
    this.initData();
  },
  deactivated() {
    this.$store.commit("ChatRoom/setPanelVm", null);
  },
  methods: {
    initData() {
      this.$refs.chatPanelRef?.addEventListener("contextmenu", (e) => e.preventDefault());
      this.getMessage();
      this.$store.commit("ChatRoom/setPanelVm", this);
    },
    async getMessage(more) {
      const { roomId, currentUser } = this.roomInfo;
      const params = {
        roomId,
        companyId: currentUser?.companyId,
        size: this.pageSize,
      };
      // 如果是获取更多消息，添加msgId
      if (more) {
        params.msgId = this.message[this.message.length - 1]?.msgId;
      }
      this.loadingState = 2;
      const message = await getChatRoomMessagesApi(params);
      if (message.failed) {
        return;
      }
      let newMessage = more ? this.originMessage.concat(message) : message;
      // 没有更多历史消息了
      if (message.length < this.pageSize) {
        this.loadingState = 3;
      } else {
        this.loadingState = 1;
      }
      this.$store.commit("ChatRoom/setOriginMessage", newMessage);
    },
    onScrollTop(event) {
      this.clearMenuList();
      if (this.loadingState !== 1) {
        return;
      }
      const dom = event.target;
      if (dom.scrollHeight + dom.scrollTop <= dom.clientHeight + 10) {
        this.getMessage(true);
      }
    },
    // 清除菜单列表
    clearMenuList() {
      const menuDom = document.getElementsByClassName("message-menu");
      if (menuDom.length && !isChildInParentView(this.$refs.chatPanelRef, menuDom[0])) {
        this.$store.commit("ChatRoom/setMessageMenu", { msgId: "", list: [] });
      }
    },
    // 将聊天面板置底
    toPanelBottom() {
      this.$nextTick(() => {
        this.$refs.panelRef.scrollTop = this.$refs.panelRef.scrollHeight - this.$refs.panelRef.clientHeight;
      });
    },
    // 如果需要，将聊天面板置底
    toPanelBottomIfNeed() {
      if (this.$refs.panelRef.scrollTop + 100 > 0) {
        this.toPanelBottom();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.chat-panel {
  flex: 1;
  font-weight: 400;
  overflow: hidden;
  color: #afafaf;
  font-size: 12px;

  .message-list {
    max-height: 100%;
    display: flex;
    flex-direction: column-reverse;
    overflow: auto;
    padding-bottom: 20px;

    &.message-list-padding {
      padding-bottom: 60px;
    }

    .message-mute {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      line-height: 20px;
      text-align: center;
    }

    .message-mute, .message-item, .message-top {
      padding-top: 20px;
    }

    .message-top {
      line-height: 20px;
      text-align: center;
    }
  }
}
</style>
