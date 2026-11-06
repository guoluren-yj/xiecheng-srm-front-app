<template>
  <srm-popup height="100%" :visible="value" position="top" :show-close="false" show-back :title="$T(title).$D(title)" @onClose="closeFilePop">
    <div slot="right" class="right-button">
      <span v-if="fileArr.length && !fileArr[active].readOnly" class="srm-icon icon-upload" @click="uploadFlag=true"/>
    </div>
    <div class="filePop">
      <srm-tab no-all @changeTab="onChangeTab">
        <srm-tab-pane v-for="(item,index) in fileArr" :key="index" :label="item.title">
          <!-- <Attachment :list="getFile(index)" :del-file-fn="deleteFile(item.attachmentUuid)" :is-can-delete="!item.readOnly" /> -->
          <srm-file-list :is-tab="true" :list="getFile(index)" :del-file-fn="deleteFile(item.attachmentUuid)" :can-delete="!item.readOnly" />
        </srm-tab-pane>
      </srm-tab>
      <!-- 上传组件 -->
      <upload-model
        v-model="uploadFlag"
        :attachment-uuid="uploadattachmentUuid"
        :bucket-name="bucketName"/>
    </div>
  </srm-popup>
</template>
<script>
import { View, NavBar, Icon, Tabs, Tab, Popup } from "hips";
import Attachment from "./Attachment";
import SrmFileList from "./SrmFileList";
import UploadModel from "./UploadModel";
import { http } from "srm-mobile-ui";
import { queryStr } from "@/utils";

export default {
  modules: [ "hipspfm.common" ],
  name: "AttachedFiles",
  components: {
    SrmFileList,
    Attachment,
    UploadModel,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Icon.name]: Icon,
    [View.name]: View,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    bucketName: {
      type: String,
      default: "private-bucket"
    },
    queryParams: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: "hipspfm.common.message.title.viewAttachment"
    },
    value: {
      type: Boolean,
      default: false
    },
    fileArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active: 0,
      uploadFlag: false,
      fileListArr: [],
      attachmentNumber: 0,
    };
  },
  computed: {
    getFile() {
      return (index) => this.fileListArr[index];
    },
    uploadattachmentUuid() {
      return this.fileArr[this.active] && this.fileArr[this.active].attachmentUuid;
    }
  },
  watch: {
    uploadFlag(value) {
      if (!value) {
        this.getFileList();
      }
    },
    value(val) {
      if (val) {
        this.getFileList();
      }
    }
  },
  methods: {
    onChangeTab(param) {
      this.active = param.activeKey;
    },
    // 获取附件api
    getFileApi(attachmentUUID) {
      const { bucketName, queryParams } = this;
      const url = `/hfle/v1/${window.localStorage.organizationId}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}&${queryStr(
        queryParams
      )}`;

      return http.get(url);
    },
    //删除附件api
    deleteFileApi(attachmentUUID, params) {
      const { bucketName, queryParams } = this;
      const url = `/hfle/v1/${window.localStorage.organizationId}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}&${queryStr(
        queryParams
      )}`;

      return http.post(url, params);
    },
    // 获取附件
    async getFileList() {
      const fileRequestArr = this.fileArr.map((item) => this.getFileApi(item.attachmentUuid));

      Promise.all(fileRequestArr).then((res = []) => {
        this.fileListArr = res; this.attachmentNumber = res.reduce((a, b) => a + b.length, 0);
      });
    },
    // 删除文件
    deleteFile(attachmentUuid) {
      return (params) => {
        this.deleteFileApi(attachmentUuid, params).finally(() => {
          this.$hips.toast({ message: this.$T("hipspfm.common.message.deleteSuccess").$D("删除成功"), duration: 1000 });
          this.getFileList();
        });
      };
    },
    // 关闭附件弹窗
    closeFilePop() {
      this.$emit("input", false);
      this.$emit("attachmentNumber", this.attachmentNumber);
    }
  }
};
</script>
<style lang="stylus" scoped>
>>> .hips-tab__panel {
  padding-right: 0 !important;
}
.header {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color:var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: bold;
}

.right-button {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color:var(--color-font-default);
}
>>> .hips-tabs__wrapper--scrollable .hips-tabs__wrapper-nav{
  overflow-x:auto;
}
>>> .hips-tab{
  padding:0 15px;
}
>>> .hips-tab{
  min-width:auto;
}
</style>
