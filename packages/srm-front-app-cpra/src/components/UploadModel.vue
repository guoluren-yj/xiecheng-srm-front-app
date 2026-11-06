<template>
  <srm-popup
    :visible="value"
    position="right"
    height="100%"
    width="100%"
    show-back
    :title="$T('hipspfm.common.message.uploadAttanchment').$D('附件上传')"
    @onClose="$emit('input',false)">
    <div class="uploadWrap">
      <srm-attachment
        ref="srmAttachment"
        :attachment-uuid="attachmentUuid"
        display-type="list"
        :bucket-name="bucketName"
        @fileUpload="handleChange"/>
    </div>
  </srm-popup>
</template>

<script>

export default {
  modules: [ "hipspfm.common" ],
  name: "UploadModel",
  props: {
    attachmentUuid: {
      type: String,
      default: ""
    },
    bucketName: {
      type: String,
      default: "private-bucket"
    },
    value: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      uploadPopup: true,
      fileList: [],
    };
  },
  watch: {
    value(val) {
      if (!val) {
        this.fileList = [];
      }
    },
  },
  methods: {
    handleChange(file) {
      this.fileList.push(file);
    },
  }
};
</script>

<style lang="stylus" scoped>

.right-button {

  img {
    height: 24px;
    width: 24px;
  }
}

.uploadWrap{
  padding: 10px 18px;
}

.header{
  font-size: 18px;
  font-weight: bold;
  line-height: 26px;
}

>>>.srm-attachment {
  width auto;
  background transparent;
}
</style>
