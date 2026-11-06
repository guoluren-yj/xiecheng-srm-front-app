<template>
  <section
    v-loading="showLoading"
    :class="[ isTab ? 'file-list file-list-tab' : 'file-list' ]">
    <hips-scroll
      v-if="list.length"
      ref="wrapssper"
      :data="[list]"
      class="file-list-content">
      <div v-for="(item, index) in list" :key="index" class="file-list-item" @click="handlePreview(item)">
        <div class="left-img">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="'#'+buildSrc(item)"/>
          </svg>
        </div>
        <div class="right-content">
          <div class="right-content-top">
            <div class="fileInfo">
              <li>{{ item.fileName || item.attachmentDesc }}</li>
              <li>
                <span>{{ item.creationDate.slice(0, 10) }}</span>
                <span>{{ (item.fileSize || item.attachmentSize) | fileSizeFilter }}</span>
                <span v-if="canPreView(item)" class="pre-info">{{
                  $T("hipspfm.common.message.canPreview").$D("可预览")
                }}</span>
              </li>
            </div>
            <div class="options">
              <span class="srm-icon icon-download options-icon"
                    @click.stop="downloadlFileHandler(item.fileUrl, item.bucketName)"/>
              <span v-if="canDelete" class="srm-icon icon-trash options-icon"
                    @click.stop="delFileHandler(item.fileUrl)"/>
            </div>
          </div>

          <div v-if="item.remark" class="content-remark" @click.stop>
            <div class="remark-info">{{ $T("hipspfm.common.message.remark").$D("备注") }}：{{ item.remark }}</div>
          </div>
        </div>
      </div>
    </hips-scroll>
    <!-- platform-9045 直接传多语言 key，由 NoContent 组件内部统一翻译；传译文会被组件当作 key 二次翻译，英文环境落到中文兜底 -->
    <no-content
      v-else
      img-src="NoFile@1x.png"
      title="hipspfm.common.message.noAttachment"/>
  </section>
</template>

<script>
import { http, SrmUtil } from "srm-mobile-ui";
import { Scroll } from "hips";
import { downloadFile } from "srm-mobile-ui/src/utils/jsBridge";
import NoContent from "@/components/NoContent";

export default {
  modules: [ "hipspfm.common" ],
  name: "Attachment",
  components: {
    NoContent,
    [Scroll.name]: Scroll,
  },
  filters: {
    fileSizeFilter(value) {
      const count = (value / 1024).toFixed(2);

      if (count < 1000) {
        return count + "KB";
      }
      return (value / (1024 * 1024)).toFixed(2) + "MB";
    },
  },
  props: {
    delFileFn: {
      type: Function,
    },
    list: {
      type: Array,
      default: () => [],
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    // 是否是tab类型
    isTab: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      previewVisible: false,
      iconNameMap: {
        jpg: "icon-img",
        png: "icon-img",
        gif: "icon-img",
        jpeg: "icon-img",
        pdf: "icon-pdf",
        ppt: "icon-ppt",
        doc: "icon-word",
        docx: "icon-word",
        zip: "icon-zip",
        xlsx: "icon-exc",
        file: "icon-other",
      },
      checkedFileArr: [],
      isCheckAll: false,
      previewImg: "",
      contentLenArr: [],
      showLoading: false,
    };
  },
  computed: {
    buildSrc() {
      return (item) => {
        const fileName = item.fileName || item.attachmentDesc;
        const src = this.iconNameMap[fileName.split(".").reverse()[0]];

        return src ? src : this.iconNameMap["file"];
      };
    },
    canPreView() {
      return function (item) {
        const fileName = item.fileName || item.attachmentDesc;

        return [
          "jpg",
          "png",
          "gif",
          "jpeg",
          "docx",
          "xlsx",
          "pdf",
          "doc",
          "xls",
          "txt",
        ].includes(
          fileName
            .split(".")
            .reverse()[0]
            .toLowerCase()
        );
      };
    },
  },
  methods: {
    async getPdfFile(bucketName, fileUrl) {
      const url = `/hfle/v1/${
        window.localStorage.organizationId
      }/file-preview/by-url?&bucketName=${bucketName}&url=${encodeURIComponent(
        fileUrl
      )}`;

      return await http.get(url, { responseType: "arraybuffer" });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      const fileName = file.fileName || file.attachmentDesc;
      const fileType = fileName
        .split(".")
        .reverse()[0]
        .toLowerCase();

      if ([ "jpg", "png", "gif", "jpeg" ].includes(fileType)) {
        this.previewImg = this.buildImgUrl(file.fileUrl || file.attachmentUrl, file.bucketName || SrmUtil.getDefaultBucketName());
        this.$previewImage([ this.previewImg ], { showClose: true });
      } else if ([ "docx", "pdf", "doc", "txt" ].includes(fileType)) {
        // 方式一: 通过pdfh5插件
        try {
          this.showLoading = true;
          const preUrl = await this.getPdfFile(file.bucketName, file.fileUrl);

          this.showLoading = false;
          this.$previewFile({ preUrl });
        } catch (e) {
          this.showLoading = false;
        }
      } else if ([ "xlsx", "xls" ].includes(fileType)) {
        // 方式二：通过xdoc/微软
        // const xurl = "https://view.xdocin.com/xdoc?_xdoc=";
        const xurl = "https://view.officeapps.live.com/op/view.aspx?src=";
        const downloadUrl = this.buildImgUrl(file.fileUrl, file.bucketName);
        const preUrl = xurl + encodeURIComponent(downloadUrl);

        this.$previewFile({ preUrl });
      }
    },
    downloadlFileHandler(fileUrl, bucketName) {
      try {
        const downloadUrl = this.buildImgUrl(fileUrl, bucketName);

        downloadFile(downloadUrl);
      } catch (e) {
        const loadUrl = this.buildImgUrl(fileUrl, bucketName);

        this.$router.push({
          path: `downLoad?downLoadUrl=${encodeURIComponent(loadUrl)}`,
        });
      }
    },
    delFileHandler(fileUrl) {
      const that = this;

      this.$dialog({
        content:
          this.$T("hipspfm.common.message.delAttachmentOrNot").$D(
            "是否删除该附件"
          ) + "？",
        onOk() {
          that.delFileFn([ fileUrl ]);
        },
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .hips-thinline--top-bottom:after {
  border: none !important;
}

>>> .bscroll-indicator {
  display: none;
}

.content-remark {
  margin-top: 8px;
  background: var(--color-bg-default-b);
  border-radius: 2px;
  word-break: break-all;
  word-wrap: break-word;
  padding: 4px 8px;

  .remark-info {
    font-size: 12px;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.file-list {
  overflow: hidden;
  height: calc(100vh - 46px);
  font-family: PingFangSC-Regular;
  background: #F0F2F5;

  &.file-list-tab {
    // padding-left: 15px;
    height: calc(100vh - 90px);
  }

  .file-list-content {
    height 100%;

    >>> .hips-thinline {
      padding-left: 0;
    }

    .file-list-item {
      display: flex;
      padding-left: 15px;
      align-items: center;
      background #fff;

      .left-img {
        flex: none;
        width: 40px;
        height: 40px;
        font-size: 40px;
        margin-right: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #ccc;
      }

      .right-content {
        width: 100%;
        padding: 18px 15px 18px 0px;
        border-bottom: 1px solid var(--color-border-default);

        .right-content-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }

        .fileInfo {
          flex: 1;

          li {
            font-size: 16px;
            line-height: 22px;
            word-break: break-word;
            color: var(--color-font-default);

            &:last-child {
              height: 16px;
              line-height: 16px;
            }

            span {
              font-size: 12px;
              line-height: 16px;
              margin-right: 16px;
              color: var(--color-font-default-b);

              &:nth-of-type(2) {
                margin-right: 12px;
              }
            }

            .pre-info {
              height: 20px;
              font-size: 10px;
              margin-right: 0;
              padding: 1px 4px;
              line-height: 18px;
              border-radius: 2px;
              display: inline-block;
              font-family: PingFangSC-Medium;
              color: var(--color-other-default-b);
              background: var(--color-bg-default-c);
            }
          }
        }
      }

    }

    .options {
      flex: none;
      display: flex;
      margin-left: 16px;
      align-items: center;

      .options-icon {
        color: #AFAFAF;
        font-size: 18px;

        &:nth-child(2) {
          margin-left: 16px;
        }
      }
    }
  }
}

</style>
