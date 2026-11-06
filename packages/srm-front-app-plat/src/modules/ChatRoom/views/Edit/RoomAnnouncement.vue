<template>
  <div class="announcement">
    <base-header :title="title">
      <div slot="left"
           @click="onBackClick">
        {{ $T("smbl.app.model.default.Cancel").$D("取消") }}
      </div>
      <div v-if="roomInfo.purchaseFlag"
           slot="right"
           :class="['publish-btn', {'disabled': !publishFlag}]"
           @click="onPublishClick">
        {{ $T("smbl.common.button.issue").$D("发布") }}
      </div>
    </base-header>
    <div class="content">
      <srm-textarea-field v-if="roomInfo.purchaseFlag"
                          v-model="areaValue"
                          :show-icon="false"
                          :height="200"
                          :placeholder="$T('smbl.chat.view.placeholder.groupNotice').$D('请输入公告内容~')"
                          :max-length="500" />
      <div v-else
           class="readonly">{{ areaValue }}</div>
    </div>
    <cust-dialog v-model="showDialog"
                 :content="$T('smbl.chat.view.dialog.groupNotice').$D('你已经修改了公告内容，如果退出，修改的内容将不会生效。')"
                 @onConfirm="onDialogConfirm" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import BaseHeader from "@/modules/ChatRoom/components/BaseHeader";
import CustDialog from "@/modules/ChatRoom/components/form/CustDialog";
import { updateRoomAnnouncementApi } from "@/modules/ChatRoom/api";

export default {
  name: "RoomAnnouncementEdit",
  modules: ["smbl.chat", "smbl.app", "smbl.common"],
  components: {
    BaseHeader,
    CustDialog,
  },
  data() {
    return {
      areaValue: "",
      isCreating: false,
      loading: false,
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      roomInfo: "ChatRoom/getRoomInfo",
      announcement: "ChatRoom/getAnnouncement",
    }),
    title() {
      return this.isCreating
        ? this.$T("smbl.chat.view.title.createNotice").$D("新建群公告")
        : this.$T("smbl.chat.view.title.modifyNotice").$D("修改群公告");
    },
    publishFlag() {
      return this.loading || (this.isCreating && this.areaValue) || (!this.isCreating && this.areaValue !== this.announcement);
    },
  },
  watch: {
    announcement(value) {
      this.areaValue = value;
    },
  },
  mounted() {
    if (this.announcement) {
      this.areaValue = this.announcement;
    } else {
      this.isCreating = true;
    }
  },
  methods: {
    async onPublishClick() {
      if (!this.publishFlag) {
        return;
      }
      this.loading = true;
      const { roomId, currentUser } = this.roomInfo;
      const { companyId } = currentUser;
      const result = await updateRoomAnnouncementApi({
        msgContent: this.areaValue,
        roomId,
        senderCompanyId: companyId,
      });
      if (result.failed) {
        this.loading = false;
        return;
      }
      this.$store.commit("ChatRoom/setAnnouncement", result.msgContent);
      this.onDialogConfirm();
    },
    onBackClick() {
      if (this.publishFlag) {
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
.announcement {
  height: 100vh;
  width: 100vw;
  color: #333;
  background-color: #F6F6F6;
  font-weight: 400;
  display: flex;
  flex-direction: column;

  .publish-btn {
    color: #276EF1;

    &.disabled {
      color: #AFAFAF;
    }
  }

  .content {
    padding: 12px 20px;
    margin-top: 12px;
    overflow: auto;

    .readonly {
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 24px;
    }
  }
}
</style>
