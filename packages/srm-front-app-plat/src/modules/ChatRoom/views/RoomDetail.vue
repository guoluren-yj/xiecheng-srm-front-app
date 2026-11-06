<template>
  <div class="room-detail">
    <base-header :title="$T('smbl.app.model.default.Setting').$D('设置')"
                 show-back />
    <div class="detail-block label"
         @click="onRoomLabelClick">
      <i class="room-avatar" >{{ roomInfo.roomName.slice(0,1) }}</i>
      <div class="room-name clamp-text">
        {{ roomInfo.roomName }}
      </div>
      <span class="srm-icon icon-chevron-right" />
    </div>
    <div class="detail-block member"
         @click="onRoomMemberClick">
      <div class="top-info">
        <div>{{ $T("smbl.chat.model.room.groupMember").$D("群成员") }}</div>
        <span>{{ `${memberInfo.members.length}${$T("smbl.chat.model.person").$D("人")}` }}</span>
        <span class="srm-icon icon-chevron-right" />
      </div>
    </div>
    <div class="detail-block announcement"
         @click="onRoomAnnouncementClick">
      <div class="top-info">
        <div>{{ $T("smbl.chat.model.room.groupNotice").$D("群公告") }}</div>
        <span class="srm-icon icon-chevron-right" />
      </div>
      <div class="content clamp-text">{{ announcement || $T("smbl.chat.model.room.noSetting").$D("未设置") }}</div>
    </div>
    <div class="detail-block record"
         @click="onRecordSearchClick">
      <div class="top-info">
        <div>{{ $T("smbl.chat.model.search.chatRecords").$D("聊天记录") }}</div>
        <span>{{ $T("smbl.chat.model.search.imageAndFile").$D("图片、文件等") }}</span>
        <span class="srm-icon icon-chevron-right" />
      </div>
    </div>
    <div v-if="config.init"
         class="detail-block config-list">
      <div class="config-item">
        <span>{{ $T("smbl.app.model.message.Top").$D("置顶") }}</span>
        <srm-switch :value="config.topFlag"
                    @input="onTopFlagChange" />
      </div>
      <div v-if="roomInfo.purchaseFlag"
           class="config-item">
        <span>{{ $T("smbl.chat.model.message.mute").$D("群内禁言") }}</span>
        <srm-switch :value="!config.muteState"
                    @input="onMuteStateChange" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import BaseHeader from "@/modules/ChatRoom/components/BaseHeader";
import { topChatRoomApi, cancelTopChatRoomApi, muteChatRoomApi, cancelMuteChatRoomApi } from "@/modules/ChatRoom/api";

export default {
  name: "RoomDetail",
  modules: ["smbl.chat", "smbl.app"],
  components: {
    BaseHeader,
  },
  data() {
    return {
      config: {
        init: false,
        topFlag: false,
        muteState: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      roomInfo: "ChatRoom/getRoomInfo",
      announcement: "ChatRoom/getAnnouncement",
      memberInfo: "ChatRoom/memberInfo",
    }),
    avatarUrl() {
      const { roomIcon } = this.roomInfo;
      return roomIcon || require("@/assets/default_avatar.jpg");
    },
  },
  watch: {
    roomInfo: {
      deep: true,
      handler() {
        this.init();
      },
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { topFlag, muteState } = this.roomInfo;
      this.config = {
        init: true,
        topFlag,
        muteState,
      };
    },
    onRoomLabelClick() {
      this.$router.push({ name: "RoomLabel" });
    },
    onRoomMemberClick() {
      this.$router.push({ name: "RoomMember" });
    },
    onRoomAnnouncementClick() {
      this.$router.push({ name: "RoomAnnouncement" });
    },
    onRecordSearchClick() {
      this.$router.push({ name: "RecordSearch" });
    },
    async onTopFlagChange(flag) {
      const { roomId, currentUser } = this.roomInfo;
      const { roomMemberId } = currentUser;
      let api = flag ? topChatRoomApi : cancelTopChatRoomApi;
      await api({ roomId, roomMemberId });
      this.$store.commit("ChatRoom/setRoomInfo", {
        ...this.roomInfo,
        topFlag: flag,
      });
    },
    async onMuteStateChange(flag) {
      const { roomId } = this.roomInfo;
      let api = flag ? muteChatRoomApi : cancelMuteChatRoomApi;
      await api({ roomId });
      this.$store.commit("ChatRoom/setRoomInfo", {
        ...this.roomInfo,
        muteState: !flag,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.room-detail {
  height: 100vh;
  width: 100vw;
  background-color: #F6F6F6;
  color: #333;
  overflow-y: auto;

  .detail-block {
    display: flex;
    background-color: #fff;
    width: 100vw;
    margin-top: 8px;
    padding: 12px 20px;

    .top-info {
      display: flex;
      align-items: center;
      width: 100%;

      > div {
        flex: 1;
        line-height: 24px;
        font-weight: 400;
        font-size: 16px;
      }

      > span {
        color: #AFAFAF;
        font-size: 14px;
      }

      .icon-chevron-right {
        font-size: 14px;
        margin-left: 10px;
        color: #AFAFAF;
      }
    }
  }

  .clamp-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
  }

  .label {
    align-items: center;
    height: 76px;
    padding: 0 20px;
    margin-top: 0px;

    .room-avatar {
      display: inline-block;
      height: 48px;
      width: 48px;
      border-radius: 50%;
      background-color: #9CA7BD;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 18px;
      font-weight: 500;
      line-height: 0;
      margin-right: 12px;
    }

    .room-name {
      flex: 1;
      -webkit-line-clamp: 2;
      max-height: 44px;
      line-height: 22px;
    }

    .icon-chevron-right {
      font-size: 14px;
      margin-left: 50px;
      color: #AFAFAF;
    }
  }

  .member {
    flex-direction: column;
    background-color: #fff;
  }

  .announcement {
    flex-direction: column;

    .content {
      width: 100%;
      margin-top: 12px;
      font-size: 14px;
      -webkit-line-clamp: 4;
      max-height: 110px;
      line-height: 22px;
      white-space: pre;
    }
  }

  .record {
    flex-direction: column;
  }

  .config-list {
    padding: 0;
    flex-direction: column;

    .config-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 20px;
        right: 20px;
        bottom: 0;
        height: 1px;
        background: #F6F6F6;
      }
    }
  }
}
</style>
