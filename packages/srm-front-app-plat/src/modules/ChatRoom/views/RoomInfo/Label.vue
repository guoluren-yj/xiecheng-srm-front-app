<template>
  <div class="label">
    <base-header :title="$T('smbl.chat.view.groupInfo').$D('群信息')"
                 show-back />
    <div class="detail-block">
      <div>{{ $T('smbl.chat.view.groupAvatar').$D('群头像') }}</div>
      <i class="detail-block-avatar">{{ roomInfo.roomName.slice(0,1) }}</i>
      <span class="srm-icon icon-chevron-right"
            style="opacity:0;" />
    </div>
    <div class="detail-block"
         @click="onRoomNameClick">
      <div>{{ $T('smbl.chat.view.groupName').$D('群名称') }}</div>
      <span class="room-name">{{ roomInfo.roomName }}</span>
      <span class="srm-icon icon-chevron-right" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import BaseHeader from "@/modules/ChatRoom/components/BaseHeader";

export default {
  name: "RoomLabel",
  modules: ["smbl.chat"],
  components: {
    BaseHeader,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      roomInfo: "ChatRoom/getRoomInfo",
    }),
    avatarUrl() {
      const { roomIcon } = this.roomInfo;
      if (roomIcon) {
        return roomIcon;
      }
      return require("@/assets/default_avatar.jpg");
    },
  },
  mounted() {},
  methods: {
    onRoomNameClick() {
      this.$router.push({ name: "RoomName" });
    },
  },
};
</script>

<style lang="stylus" scoped>
.label {
  height: 100vh;
  width: 100vw;
  color: #333;
  font-weight: 400;
  background-color: #F6F6F6;

  .detail-block {
    display: flex;
    align-items: center;
    position: relative;
    background-color: #fff;
    width: 100vw;
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

    > div {
      flex: 1;
      line-height: 24px;
      font-size: 16px;
    }

    > i {
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
    }

    .room-name {
      font-size: 14px;
      max-width: 185px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon-chevron-right {
      font-size: 14px;
      margin-left: 10px;
      color: #AFAFAF;
    }
  }
}
</style>
