<template>
  <div class="room-name">
    <base-header :title="$T('smbl.chat.view.title.renameRoom').$D('修改群名称')"
                 show-back
                 disable-back
                 @backClick="onBackClick">
      <div v-if="roomInfo.purchaseFlag"
           slot="right"
           :class="['save-btn', {'disabled': !saveFlag}]"
           @click="onSaveClick">
        {{ $T("smbl.common.button.update").$D("保存") }}
      </div>
    </base-header>
    <div class="content">
      <srm-textarea-field v-if="roomInfo.purchaseFlag"
                          v-model="areaValue"
                          :show-icon="false"
                          :height="200"
                          :placeholder="$T('smbl.chat.view.placeholder.roomName').$D('请输入群名称')"
                          :max-length="500" />
      <div v-else
           class="readonly">{{ areaValue }}</div>
    </div>
    <cust-dialog v-model="showDialog"
                 :content="$T('smbl.chat.view.dialog.roomName').$D('你已经修改了群名称，如果退出，修改的内容将不会生效。')"
                 @onConfirm="onDialogConfirm" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import BaseHeader from "@/modules/ChatRoom/components/BaseHeader";
import CustDialog from "@/modules/ChatRoom/components/form/CustDialog";
import { updateChatRoomNameApi } from "@/modules/ChatRoom/api";

export default {
  name: "RoomNameEdit",
  modules: ["smbl.chat", "smbl.common"],
  components: {
    BaseHeader,
    CustDialog,
  },
  data() {
    return {
      areaValue: "",
      loading: false,
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      roomInfo: "ChatRoom/getRoomInfo",
    }),
    saveFlag() {
      const { roomName } = this.roomInfo;
      return this.loading || (this.areaValue && this.areaValue !== roomName);
    },
  },
  watch: {
    roomInfo: {
      deep: true,
      handler() {
        const { roomName } = this.roomInfo;
        this.areaValue = roomName;
      },
    },
  },
  mounted() {
    const { roomName } = this.roomInfo;
    this.areaValue = roomName;
  },
  methods: {
    async onSaveClick() {
      if (!this.saveFlag) {
        return;
      }
      this.loading = true;
      const { roomId, currentUser } = this.roomInfo;
      const { companyId } = currentUser;
      const result = await updateChatRoomNameApi({
        businessTitle: this.areaValue,
        roomId,
        companyId: companyId,
      });
      if (result.failed) {
        this.loading = false;
        return;
      }
      this.$store.commit("ChatRoom/setRoomInfo", {
        ...this.roomInfo,
        roomName: this.areaValue,
      });
      this.onDialogConfirm();
    },
    onBackClick() {
      if (this.saveFlag) {
        this.showDialog = true;
      } else {
        this.$router.back();
      }
    },
    onDialogConfirm() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>
.room-name {
  height: 100vh;
  width: 100vw;
  color: #333;
  background-color: #F6F6F6;
  font-weight: 400;

  .save-btn {
    color: #276EF1;

    &.disabled {
      color: #AFAFAF;
    }
  }

  .content {
    margin-top: 12px;
    background-color: #fff;
    padding: 12px 20px;

    .readonly {
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 24px;
    }
  }
}
</style>
