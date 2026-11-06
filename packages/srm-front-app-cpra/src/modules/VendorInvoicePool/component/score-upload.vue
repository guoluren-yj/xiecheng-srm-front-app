<template>
  <upload
    list-type="picture-card"
    :action="uploadUrl"
    :multiple="true"
    :file-list="fileList"
    :headers="headers"
    :data="formData"
    :before-upload="beforeUpload"
    :limit="999"
    :on-success="onSuccess"
    :on-remove="onRemove"
    @change="handleChange">
    <div style="background: #FFFFFF;border-radius: 4px;display: flex;flex-direction: column;align-items: center;">
      <em class="srm-icon icon-plus"/>
      <span style="font-size: 16px;color: #AFAFAF;margin-top:10px">
        {{ $T("hmde.common.button.addUrl").$D("添加文件") }}
      </span>
    </div>
  </upload>
</template>

<script>
// import Upload from "srm-mobile-ui/packages/srm-upload/upload";

import Upload from "./upload";
import { SrmUtil } from "srm-mobile-ui";
import { http } from "srm-mobile-ui";
export default {
  modules: [ "smbl.common", "hmde.common", "hipspfm.common" ],
  name: "ScoreUpload",
  components: {
    Upload,
  },
  props: {
    attachmentUuid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      uploadUrl: `${SrmUtil.getApiBaseUrl()}/hfle/v1/${window.localStorage.getItem("organizationId")}/files/attachment/multipart`,
      fileList: [],
      headers: { "Authorization": `bearer ${window.localStorage.getItem("user-token")}` },
      formData: {
        "bucketName": "private-bucket",
        "fileName": "",
        "attachmentUUID": ""
      }
    };
  },
  async mounted() {
    if (this.attachmentUuid) {
      this.formData.attachmentUUID = this.attachmentUuid;
      this.fileList = [];
      let res = await this.getFileApi(this.attachmentUuid);
      res.map((item) => {
        this.fileList.push({
          name: item.fileName,
          type: item.fileType,
          uid: item.fileId,
        });
      });
    }
  },
  methods: {
    beforeUpload(file) {
      this.formData.fileName = file.name;
    },
    // eslint-disable-next-line no-unused-vars
    handleChange(files) {
      Array.prototype.push.apply(this.fileList, files);
      this.$forceUpdate();
    },
    onSuccess(rsp, file) {
      let f = this.fileList.find((res) => res.uid === file.uid);
      if (f) {
        f.url = rsp;
      }
      this.fileList = [ ...this.fileList ];
    },
    // 获取附件api
    getFileApi(attachmentUuid) {
      const url = `/hfle/v1/${window.localStorage.organizationId}/files/${attachmentUuid}/file?attachmentUUID=${attachmentUuid}&bucketName=${this.formData.bucketName}`;
      return http.get(url);
    },
    // 删除文件
    onRemove(params) {
      this.$loading.show();
      this.deleteFileApi(this.attachmentUuid, params).finally(() => {
        this.$loading.hide();
        let index = this.fileList.findIndex((res) => res.url === params[0]);
        this.$notification.open({
          message: this.$T("hipspfm.common.message.deleteSuccess").$D("删除成功"),
          duration: 3000,
        });
        this.fileList.splice(index, 1);
      });
    },
    //删除附件api
    deleteFileApi(attachmentUuid, params) {
      const url = `/hfle/v1/${window.localStorage.organizationId}/files/delete-by-uuidurl?attachmentUUID=${attachmentUuid}&bucketName=${this.formData.bucketName}`;
      return http.post(url, params);
    },
  }
};
</script>