<template>
  <srm-grid :cols="2">
    <srm-grid-item v-for="(file, index) in fileList" :key="index" v-loading="reqs[file.uid]" style="padding: 5px">
      <srm-flex class="srm-upload-box" direction="column" justify="center" align="center">
        <span style="position: absolute;right: 0;top: 0;" class="srm-icon icon-trash options-icon" @click="delFile(file)"/>

        <em v-if="isImage(file.type)" class="srm-icon icon-img srm-upload-icon" style="color:purple;" @click="showFile(file)" />
        <em v-else class="srm-icon icon-other srm-upload-icon" style="color: gold" @click="showFile(file)" />
        <span class="srm-upload-filename" @click="showFile(file)">
          {{ file.name }}
        </span>
      </srm-flex>
    </srm-grid-item>
    <srm-grid-item v-show="fileList.length < limit" style="padding: 5px" @click.native="handleClick">
      <srm-flex class="srm-upload-box" direction="column" justify="center" align="center">
        <slot/>
        <input ref="input" class="srm-upload-input srm-upload-icon" type="file" :name="name" :multiple="multiple"
               :accept="accept"
               @change="handleChange">
      </srm-flex>
    </srm-grid-item>
  </srm-grid>
</template>

<script>
import ajax from "./ajax";
import { generateId } from "srm-mobile-ui/src/utils/dom";
import { previewFile } from "srm-mobile-ui/src/utils/index";

export default {
  modules: [ "smbl.common" ],
  props: {
    type: String,
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: "file"
    },
    data: Object,
    headers: Object,
    withCredentials: Boolean,
    multiple: Boolean,
    accept: String,
    onStart: {
      type: Function,
      default: () => {
      }
    },
    onProgress: {
      type: Function,
      default: () => {
      }
    },
    onSuccess: {
      type: Function,
      default: () => {
      }
    },
    onError: {
      type: Function,
      default: () => {
      }
    },
    beforeUpload: {
      type: Function,
      default: () => {
      }
    },
    onPreview: {
      type: Function,
      default: function () {
      }
    },
    onRemove: {
      type: Function,
      default: function () {
      }
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    httpRequest: {
      type: Function,
      default: ajax
    },
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function,
      default: function () {
      }
    },
  },
  data() {
    return {
      reqs: {}
    };
  },
  methods: {
    showFile(file) {
      previewFile({
        bucketName: "private-bucket",
        fileUrl: file.url,
        fileName: file.name,
      });
    },
    delFile(file) {
      let that = this;
      this.$dialog({
        content:
          that.$T("smbl.common.message.delAttachmentOrNot").$D(
            "是否删除该附件"
          ) + "？",
        onOk() {
          that.onRemove([ file.url ]);
        },
      });
    },
    isImage(str) {
      return str.indexOf("image") !== -1;
    },
    handleChange(ev) {
      const files = ev.target.files;

      if (!files) {
        return;
      }
      this.uploadFiles(files);
    },
    uploadFiles(files) {
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList);
        return;
      }

      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1);
      }

      if (postFiles.length === 0) {
        return;
      }

      const emitFiles = [];
      postFiles.forEach((rawFile) => {
        rawFile.uid = rawFile.uid || generateId();
        emitFiles.push({
          name: rawFile.name,
          type: rawFile.type,
          uid: rawFile.uid,
        });
        this.onStart(rawFile);
        if (this.autoUpload) {
          this.upload(rawFile);
        }
      });
      this.$emit("change", emitFiles);
    },
    upload(rawFile) {
      this.$refs.input.value = null;

      if (!this.beforeUpload) {
        return this.post(rawFile);
      }

      const before = this.beforeUpload(rawFile);
      if (before && before.then) {
        before.then((processedFile) => {
          const fileType = Object.prototype.toString.call(processedFile);

          if (fileType === "[object File]" || fileType === "[object Blob]") {
            if (fileType === "[object Blob]") {
              // eslint-disable-next-line no-param-reassign
              processedFile = new File([ processedFile ], rawFile.name, {
                type: rawFile.type
              });
            }
            // eslint-disable-next-line no-unused-vars
            for (let p in rawFile) {
              // eslint-disable-next-line no-prototype-builtins
              if (rawFile.hasOwnProperty(p)) {
                processedFile[p] = rawFile[p];
              }
            }
            this.post(processedFile);
          } else {
            this.post(rawFile);
          }
        }, () => {
          this.onRemove(null, rawFile);
        });
      } else if (before !== false) {
        this.post(rawFile);
      } else {
        this.onRemove(null, rawFile);
      }
    },
    abort(file) {
      const { reqs } = this;
      if (file) {
        let uid = file;
        if (file.uid) {
          uid = file.uid;
        }
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) {
            reqs[uid].abort();
          }
          delete reqs[uid];
        });
      }
    },
    post(rawFile) {
      const { uid } = rawFile;
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: (e) => {
          this.onProgress(e, rawFile);
        },
        onSuccess: (res) => {
          this.onSuccess(res, rawFile);
          delete this.reqs[uid];
          this.$forceUpdate();
        },
        onError: (err) => {
          this.$notification.open({
            message: err.message
          });
          this.onError(err, rawFile);
          delete this.reqs[uid];
          this.$forceUpdate();
        }
      };
      const req = this.httpRequest(options);
      this.reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },
    handleClick() {
      if (!this.disabled) {
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.srm-upload-input {
  display none;
}

.srm-grid-item {
  border none !important;
}

.srm-upload-filename {
  font-size 12px;
  margin 5px 5px 0 5px;
  max-width 100%;
  word-break: break-all;
  overflow: hidden;
  white-space nowrap;
  text-overflow ellipsis;
}

.srm-upload-icon {
  font-size 24px;
}

.srm-upload-box {
  height 100%;
  border #cbcbcb dashed 1px;
  border-radius 5px;
}
</style>
