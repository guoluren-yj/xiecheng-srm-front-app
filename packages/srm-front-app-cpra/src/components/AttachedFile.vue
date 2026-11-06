<template>
  <srm-popup width="100%" :visible="value" position="right" :show-close="false" show-back :title="$T(title).$D(title)" @onClose="closeFilePop">
    <div slot="right" class="right-button">
      <span v-if="canUpload" class="srm-icon icon-upload" @click="uploadFlag=true"/>
    </div>
    <div class="filePop">
      <srm-file-list :list="list" :can-delete="canDelete" :del-file-fn="deleteFile" />

      <!-- 上传弹窗 -->
      <upload-model v-if="typeof(attachmentUuid)==='string'" v-model="uploadFlag" :attachment-uuid="attachmentUuid" :bucket-name="bucketName" />
    </div>
  </srm-popup>
</template>
<script>
import { View, Popup, NavBar } from "hips";
import SrmFileList from "./SrmFileList";
import UploadModel from "./UploadModel";
import { http } from "srm-mobile-ui";
import { queryStr } from "@/utils";

export default {
  modules: [ "hipspfm.common" ],
  name: "AttachedFile",
  components: {
    SrmFileList,
    UploadModel,
    [View.name]: View,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    attachmentUuid: {
      type: String | Array,
      default: ""
    },
    canUpload: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: false
    },
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
    }
  },
  data() {
    return {
      list: [],
      uploadFlag: false,
      attachmentNumber: 0, // 附件数量
    };
  },
  watch: {
    attachmentUuid: {
      handler(nVal, oVal) {
        if (nVal !== oVal && nVal) {
          this.getFileList();
        }
      },
      immediate: true
    },
    uploadFlag(value) {
      if (!value) {
        this.getFileList();
      }
    }
  },
  methods: {
    // 获取附件api
    getAttachedFile(attachmentUuid) {
      const { bucketName, queryParams } = this;
      const url = `/hfle/v1/${window.localStorage.organizationId}/files/${attachmentUuid}/file?attachmentUUID=${attachmentUuid}&bucketName=${bucketName}&${queryStr(
        queryParams
      )}`;

      return http.get(url);
    },
    //删除附件api
    deleteFileApi(attachmentUuid, params) {
      const { bucketName, queryParams } = this;
      const url = `/hfle/v1/${window.localStorage.organizationId}/files/delete-by-uuidurl?attachmentUUID=${attachmentUuid}&bucketName=${bucketName}&${queryStr(
        queryParams
      )}`;

      return http.post(url, params);
    },
    // 获取采购方附件
    async getFileList() {
      // console.log(1,this.attachmentUuid)
      if (typeof this.attachmentUuid === "string") {
        this.list = await this.getAttachedFile(this.attachmentUuid);
      } else {
        this.list = this.attachmentUuid;
      }
      this.attachmentNumber = this.list.length;
    },
    // 删除文件
    deleteFile(params) {
      this.deleteFileApi(this.attachmentUuid, params).finally(() => {
        this.$hips.toast({ message: this.$T("hipspfm.common.message.deleteSuccess").$D("删除成功"), duration: 1000 });
        this.getFileList();
      });
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
.right-button {
  display flex;
  align-items center;
  color:var(--color-font-default);
}

.fileWrap {
  padding: 9px 0 9px 20px;
}

.header {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color:var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: bold;
}
</style>
