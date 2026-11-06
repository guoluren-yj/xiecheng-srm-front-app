<template>
  <div class="chat-room">
    <template v-if="init">
      <base-header :title="roomInfo.roomName"
                   show-back
                   disable-back
                   @backClick="onBackClick">
        <div slot="right"
             class="srm-icon icon-dots"
             :style="{ fontSize: '24px', fontWeight: 400 }"
             @click="onDetailClick" />
      </base-header>
      <chat-panel />
      <me-editor v-if="showEditor" />
    </template>
  </div>
</template>
<script>
import uuid from "uuid";
import { JsBridge } from "srm-mobile-ui";
import { mapGetters } from "vuex";
import BaseHeader from "@/modules/ChatRoom/components/BaseHeader";
import ChatPanel from "@/modules/ChatRoom/components/ChatPanel";
import MeEditor from "@/modules/ChatRoom/components/MeEditor";
import { getUserChatRoomInfoApi, getRoomAnnouncementApi } from "@/modules/ChatRoom/api";
import manager from "@/modules/ChatRoom/utils/socket";
import { getRequestParameters } from "../../../utils";
import Interval from "../utils/interval";

export default {
  name: "ChatRoom",
  modules: ["smbl.chat", "smbl.chatHub", "smbl.workFlow"],
  components: {
    BaseHeader,
    ChatPanel,
    MeEditor,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      init: "ChatRoom/getInit",
      id: "ChatRoom/getId",
      socket: "ChatRoom/getSocket",
      roomInfo: "ChatRoom/getRoomInfo",
      originMessage: "ChatRoom/getOriginMessage",
      message: "ChatRoom/message",
      panelVm: "ChatRoom/getPanelVm",
    }),
    showEditor() {
      const { state, muteState, purchaseFlag } = this.roomInfo;
      return !(state === "CLOSE" || (muteState === 0 && !purchaseFlag));
    },
  },
  activated() {},
  deactivated() {},
  async mounted() {
    this.loadSocket();
    this.registerSocketListener();
    this.loadRoomInfo();
    Interval.add(() => {
      this.$store.commit("ChatRoom/setOriginMessage", this.originMessage.slice());
    }).start();
  },
  destroyed() {
    manager.destroySocket(this.id);
    Interval.destory();
  },
  methods: {
    // 加载socket
    loadSocket() {
      const id = uuid();
      const socket = manager.createSocket(id);
      this.$store.commit("ChatRoom/setId", id);
      this.$store.commit("ChatRoom/setSocket", socket);
    },
    // 加载房间信息入口
    loadRoomInfo() {
      this.socket.waitSocketConnectFinish(this.id, () => {
        this.getRoomInfo();
      });
    },
    // 获取房间信息
    async getRoomInfo() {
      const { userRoomMemberId, roomId } = getRequestParameters(location.href);
      if (!userRoomMemberId || !roomId) {
        return;
      }
      this.$loading.show();
      const result = await getUserChatRoomInfoApi({ roomMemberId: userRoomMemberId, roomId });
      this.socket?.send({
        key: "roomInMsgHandler",
        message: {
          roomMemberId: result.currentUser?.roomMemberId,
        },
      });
      this.$store.commit("ChatRoom/setRoomInfo", result);
      this.$store.commit("ChatRoom/setInit", true);
      this.$loading.hide();
      this.getRoomAnnouncement();
    },
    // 获取群公告
    async getRoomAnnouncement() {
      const { currentUser = {}, roomId = "" } = this.roomInfo;
      const { companyId } = currentUser;
      const result = await getRoomAnnouncementApi({
        roomId,
        companyId,
      });
      this.$store.commit("ChatRoom/setAnnouncement", result?.msgContent || "");
    },
    //判断是否是本房间消息
    checkRoomId(msg) {
      const { roomId } = msg;
      return roomId && msg.roomId === this.roomInfo.roomId;
    },
    // 注册socket监听事件
    registerSocketListener() {
      // 接收消息
      this.socket.registerMessageListener(this.id, "NEW_MSG", (msg) => {
        if (this.checkRoomId(msg)) {
          this.getNewMessage(msg);
        }
      });
      // 聊天室名字修改
      this.socket.registerMessageListener(this.id, "RENAME_ROOM", (msg) => {
        if (this.checkRoomId(msg)) {
          this.roomNameChanged(msg);
        }
      });
      // 聊天室公告修改
      this.socket.registerMessageListener(this.id, "ANNOUNCEMENT", (msg) => {
        if (this.checkRoomId(msg)) {
          this.announcementChanged(msg);
        }
      });
      // 聊天室成员变更
      this.socket.registerMessageListener(this.id, "MEMBER_CHANGE", (msg) => {
        if (this.checkRoomId(msg)) {
          this.refreshRoomInfo();
        }
      });
      // 撤回消息
      this.socket.registerMessageListener(this.id, "RECALL_MSG", (msg) => {
        if (this.checkRoomId(msg)) {
          this.updateRecallMessage(msg);
        }
      });
      // 聊天室开启禁言
      this.socket.registerMessageListener(this.id, "MUTE", (msg) => {
        if (this.checkRoomId(msg)) {
          this.muteStateChange(0);
        }
      });
      // 聊天室解除禁言
      this.socket.registerMessageListener(this.id, "UNMUTE", (msg) => {
        if (this.checkRoomId(msg)) {
          this.muteStateChange(1);
        }
      });
      // 聊天室开启/关闭状态监听
      this.socket.registerMessageListener(this.id, "ROOM_STATE_CHANGE", (msg) => {
        if (this.checkRoomId(msg)) {
          this.roomStateChange(msg);
        }
      });
    },
    // 接收到消息
    getNewMessage(msg) {
      const newOriginMessage = this.originMessage.slice();
      const msgIndex = newOriginMessage.findIndex((item) => item.msgUuid === msg.msgUuid);
      if (msgIndex !== -1) {
        newOriginMessage.splice(msgIndex, 1, msg);
      } else {
        newOriginMessage.unshift(msg);
      }
      this.$store.commit("ChatRoom/setOriginMessage", newOriginMessage);
      this.panelVm?.toPanelBottomIfNeed();
    },
    // 房间名称修改
    roomNameChanged(roomInfo) {
      const { businessTitle } = roomInfo;
      this.$store.commit("ChatRoom/setRoomInfo", {
        ...this.roomInfo,
        roomName: businessTitle,
      });
    },
    // 群公告修改
    announcementChanged(msg) {
      const { msgContent } = msg;
      this.$store.commit("ChatRoom/setAnnouncement", msgContent);
    },
    // 更新房间信息
    async refreshRoomInfo() {
      const { roomId, currentUser } = this.roomInfo;
      const { roomMemberId } = currentUser;
      const result = await getUserChatRoomInfoApi({ roomMemberId, roomId });
      this.$store.commit("ChatRoom/setRoomInfo", result);
    },
    // 撤回消息
    updateRecallMessage(msg) {
      const { msgId } = msg;
      const newMessage = this.message.map((item) => {
        let newItem = { ...item };
        if (item.msgId === msgId) {
          newItem.state = 1;
        }
        if (item.quoteMsgId === msgId) {
          newItem = { ...newItem, quoteMsg: { ...newItem.quoteMsg, state: 1 } };
        }
        return newItem;
      });
      this.$store.commit("ChatRoom/setOriginMessage", newMessage);
    },
    // 禁言状态修改
    muteStateChange(state) {
      this.$store.commit("ChatRoom/setRoomInfo", {
        ...this.roomInfo,
        muteState: state,
      });
    },
    // 房间开关状态更新
    roomStateChange(msg) {
      const { state } = msg;
      this.$store.commit("ChatRoom/setRoomInfo", {
        ...this.roomInfo,
        state: state,
      });
    },
    // 右上角详情按钮回调
    onDetailClick() {
      this.$router.push({ name: "RoomDetail" });
    },
    // 左上角退出按钮回调
    onBackClick() {
      if (window.HandBridge) {
        JsBridge.closeWebView();
      } else {
        this.$router.back();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.chat-room {
  height: 100vh;
  width: 100vw;
  background-color: #F6F6F6;
  display: flex;
  flex-direction: column;

  .chat-content {
    flex: 1;
    overflow: auto;
  }
}
</style>
