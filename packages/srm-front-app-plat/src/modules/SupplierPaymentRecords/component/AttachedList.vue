<!-- eslint-disable rulesdir/no_hips -->
<!-- show-back -->
<template>
  <srm-popup
    height="100%"
    :visible="value"
    :show-close="true"
    :title="title"
    @onClose="closeFilePop">
    <section class="mainInfo">
      <div v-if="list.length" ref="content" class="content">
        <div v-for="(item,index) in list" :key="index" >
          <div class="listItems" @click="handlePreview(item)">
            <img class="left-img" :src="buildSrc(item)" alt="">
            <div class="right-content">
              <div class="fileInfo">
                <li>{{ item.fileName }}</li>
                <li>
                  <span>{{ item.creationDate.slice(0,10) }}</span>
                  <span>{{ item.fileSize|fileSizeFilter }}</span>
                  <!-- <span v-if="canPreView(item)" class="pre-info">{{ $T("hipspfm.common.message.canPreview").$D("可预览") }}</span> -->
                </li>
              </div>
              <div v-if="isCanDelete" class="options">
                <div @click="downloadlFileHandler(item.downLoadUrl)">
                  <img class="image-gray-default" src="@/assets/icon_editor_download_enabled@3x.png" alt >
                </div>
                <div @click="delFileHandler(item.fileUrl)">
                  <img class="image-gray-default" src="@/assets/icon_editor_deleted_normal@3x.png" alt >
                </div>
              </div>
              <div v-else class="option">
                <div @click="downloadlFileHandler(item.downLoadUrl)">
                  <img class="image-gray-default" src="@/assets/icon_editor_download_enabled@3x.png" alt >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="noContent">
        <div>
          <img src="@/assets/NoFile@1x.png" alt >
          <p>{{ $T("hipspfm.common.message.noAttachment").$D("暂无附件") }}</p>
        </div>
      </div>
    </section>
  </srm-popup>
</template>

<script>
import { http } from "srm-mobile-ui";
import { Icon, NavBar, Scroll } from "hips";
// import { downloadFile } from "srm-mobile-ui/src/utils/jsBridge";

export default {
  modules: [ "hipspfm.common", "spfm.supplierInvoic" ],
  name: "AttachedList",
  components: {
    [Icon.name]: Icon,
    [Scroll.name]: Scroll,
    [NavBar.name]: NavBar,
  },
  filters: {
    sliceFileName(value) {
      if (value.length > 15) {
        return value.slice(0, 15) + "@.";
      }
      return value;
    },
    fileSizeFilter(value) {
      const count = (value / 1024).toFixed(2);

      if (count < 1000) {
        return count + "KB";
      }
      return (value / (1024 * 1024)).toFixed(2) + "MB";

    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    isCanDelete: {
      type: Boolean,
      default: false
    },
    // 1是单文件类型，2是tab
    numType: {
      type: Number,
      default: 2,
    },
    value: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      previewVisible: false,
      iconImgUrl: {
        jpg: require("@/assets/icon_accessorylist_image_normal@3x.png"),
        png: require("@/assets/icon_accessorylist_image_normal@3x.png"),
        gif: require("@/assets/icon_accessorylist_image_normal@3x.png"),
        jpeg: require("@/assets/icon_accessorylist_image_normal@3x.png"),
        pdf: require("@/assets/icon_accessorylist_pdf_normal@3x.png"),
        ppt: require("@/assets/icon_accessorylist_ppt_normal@3x.png"),
        doc: require("@/assets/icon_accessorylist_word_normal@3x.png"),
        docx: require("@/assets/icon_accessorylist_word_normal@3x.png"),
        zip: require("@/assets/icon_accessorylist_zip_normal@3x.png"),
        xlsx: require("@/assets/icon_accessorylist_excel_normal@3x.png"),
        file: require("@/assets/icon_accessorylist_otherwork_normal@3x.png")
      },
      checkedFileArr: [],
      isCheckAll: false,
      previewImg: "",
      contentLenArr:[],
      title: this.$T("spfm.supplierInvoic.view.title.attachmentDetail").$D("附件详情"),
    };
  },
  computed: {
    buildSrc() {
      return (item) => {
        const src = this.iconImgUrl[item.fileName.split(".").reverse()[0]];

        return src ? src : this.iconImgUrl["file"];
      };
    },
    canPreView() {
      return function(item) {
        return [ "jpg", "png", "gif", "jpeg", "docx", "xlsx", "pdf", "doc", "xls", "txt" ].includes(item.fileName.split(".").reverse()[0].toLowerCase());
      };
    }
  },
  methods: {
    // 关闭附件弹窗
    closeFilePop() {
      this.$emit("input", false);
    },
    async getPdfFile(bucketName, fileUrl) {
      const url = `/hfle/v1/${window.localStorage.organizationId}/file-preview/by-url?&bucketName=${bucketName}&url=${encodeURIComponent(fileUrl)}`;

      return await http.get(url, { responseType:"arraybuffer" });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      const fileType = file.fileName.split(".").reverse()[0].toLowerCase();

      if ([ "jpg", "png", "gif", "jpeg" ].includes(fileType)) {
        this.previewImg = this.buildImgUrl(file.fileUrl, file.bucketName);
        this.$previewImage([ this.previewImg ], { showClose: true });
      } else if ([ "docx", "pdf", "doc", "txt" ].includes(fileType)) {
        // 方式一: 通过pdfh5插件
        try {
          this.$loading.show();
          const preUrl = await this.getPdfFile(file.bucketName, file.fileUrl);

          this.$loading.hide();
          this.$previewFile({ preUrl });

        } catch (e) {
          this.$loading.hide();
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
    downloadlFileHandler(fileUrl) {
      this.$downloadFileCus(fileUrl);
    },
    downloadlFile(fileUrl, bucketName) {
      const downloadUrl = this.buildImgUrl(fileUrl, bucketName);

      let iframe = document.createElement("iframe");

      iframe.style.display = "none";
      iframe.style.height = 0;
      iframe.src = downloadUrl;
      document.body.appendChild(iframe);
      setTimeout(() => iframe.remove(), 100000);
    },
    delFileHandler(fileUrl) {
      const that = this;

      this.$dialog({
        content: this.$T("hipspfm.common.message.delAttachmentOrNot").$D("是否删除该附件") + "？",
        onOk() {
          that.delFileFn([ fileUrl ]);
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
>>> .hips-thinline--top-bottom:after{
  border: none !important;
}
>>> .bscroll-indicator{
  display: none;
}
.mainInfo {
  font-family: PingFangSC-Regular;
  overflow: hidden;
  // padding-bottom: 10.667vw;
  height: calc(100vh - 120px);
  padding 0 15px;

  .content {
    height 100%;
    >>> .hips-thinline{
      padding-left: 0;
    }
    .listItems {
      display: flex;
      align-items: center;
      .left-img {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        margin-right: 12px;
      }
      .right-content {
        width: 100%;
        display: flex;
        padding: 14px 20px 14px 0px;
        border-bottom:1px solid var(--color-border-default);
        .fileInfo {
          flex: 1;
          li {
            font-size: 16px;
            color:var(--color-font-default);
            line-height: 24px;
            word-break:break-word;
            &:last-child{
              height: 20px;
              line-height: 20px;
            }
            span {
              font-size: 12px;
              color:var(--color-font-default-b);
              line-height: 18px;
              margin-right: 16px;
              &:nth-of-type(2){
                margin-right: 12px;
              }
            }
            .pre-info{
                font-family: PingFangSC-Medium;
                font-size: 10px;
                color: var(--color-other-default-b);
                line-height: 18px;
                height: 20px;
                margin-right: 0;
                background:var(--color-bg-default-c);
                border-radius: 2px;
                padding: 1px 4px;
                display: inline-block;
            }
          }
        }
      }

    }
    .options {
      width: 48px;
      display: flex;
      margin-left: 14px;
      div {
        height: 48px;
        display: flex;
        align-items: center;
        img {
          height 20px;
          width 20px;
          &:first-child{
            margin-right: 8px;
          }
        }
      }
    }
    .option {
      width: 20px;
      display: flex;
      margin-left: 12px;
      div {
        height: 48px;
        display: flex;
        align-items: center;
        img {
          height 20px;
          width 20px;
        }
      }
    }
  }
}

.noContent {
  display: flex;
  justify-content: center;
  height: calc(100vh - 120px);
  padding:0 20px 0 0;

  div {
    margin-top: 70px;
    img {
      width: 240px;
      height: 240px;
      padding 30px;
    }

    p {
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-font-default-e);
      letter-spacing: 0;
    }
  }
}
</style>
