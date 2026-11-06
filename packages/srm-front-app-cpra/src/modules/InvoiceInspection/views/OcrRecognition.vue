<!--eslint-disable-->
<template>
  <hips-view>
    <div class="content">
      <section v-if="noImg">
        <img class="image-blue-default" src="@/assets/InvoiceInspection/icon_invoice_ocrRecognition@3x.png" alt >
        <hips-uploader
          v-model="uploadFiles0"
          :mime-types="mimeTypes"
          max-length="1"
          :max-size="maxSizes"
          :upload-config="uploadConfig()"
          @over-max-size="uploadOverSize"
          @auto-upload-result="uploadSuccess"/>
        <div
          class="option-upload">
          {{ $T("hipspfm.invoiceInspection.view.message.uploadInovice").$D("上传发票") }}
        </div>
        <div class="option-message">
          <div>{{ $T("sfin.invoiceBill.verify.acceptMultipleUploadLimit", [size]).$D("支持jpg、png、单个附件不超过{size}M") }}</div>
          <div>{{ $T("hipspfm.invoiceInspection.validation.message.onlyUploadOne").$D("每次仅支持上传一张") }}</div>
        </div>
      </section>
      <div v-else class="imgnation">
        <img :src="imgUrl" alt >
      </div>
    </div>
    <div class="supplier-confirm">
      <span
        v-show="!noImg"
        @click="reupload">{{ $T("hipspfm.invoiceInspection.view.message.reUpload").$D("重新上传") }}</span>
      <span
        v-show="!noImg"
        @click="importInvoice">{{ $T("sfin.invoiceBill.view.button.invoiceBill.ocrDistinguish").$D("OCR识别") }}</span>
    </div>
  </hips-view>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import { isEmpty } from "lodash";
import { ocrImportApi, getOcrConfig } from "../api/index";
import { View, NavBar, Uploader } from "hips";
export default {
  modules: [ "hipspfm.invoiceInspection", "hipspfm.common", "sfin.invoiceBill", "hzero.common" ],
  name: "OcrRecognition",
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Uploader.name]: Uploader
  },
  data() {
    return {
      uploadFiles0: [],
      mimeTypes: [ "image/*" ],
      noImg: true,
      imgUrl: "",
      saveImgUrl: "",
      size: 3,
      maxSize: 10 * 1024 * 1024,
    };
  },
  watch: {
    uploadFiles0(nVal) {
      if (nVal.length) {
        this.$loading.show({
          text: this.$T("hipspfm.invoiceInspection.view.message.uploading").$D(
            "上传中"
          )
        });
        setTimeout(() => this.$loading.hide(), 15000);
      }
    }
  },
  mounted() {
    this.getOcrSizeConfig();
  },
  methods: {
    // 获取配置
    getOcrSizeConfig() {
      getOcrConfig().then((res) => {
        if (res && !res.failed) {
          const { ocrFileSize, ocrTransSize } = res;
          this.size = ocrTransSize || 3;
          this.maxSize = (ocrFileSize || 10) * 1024 * 1024;
        }
      });
    },
    //上传文件
    uploadConfig() {
      let temp = {
        action: `${SrmUtil.getApiBaseUrl()}/hfle/v1/${window.localStorage.getItem("organizationId")}/files/multipart`,
        headers: {
          Authorization: `bearer ${window.localStorage.getItem("user-token")}`,
          ContentType: "multipart/form-data"
        },
        formData: new FormData(),
        methods: "post",
        fileKey: "file"
      };
      temp.formData.append("bucketName", SrmUtil.getDefaultBucketName());
      temp.formData.append("directory", "finance-invoice");
      temp.formData.append(
        "fileName",
        this.uploadFiles0[0] && this.uploadFiles0[0].name
      );
      return temp;
    },
    uploadOverSize() {
      this.$notification.open({
        message: this.$T("hzero.common.upload.error.size", [ this.size ]).$D("上传文件大小不能超过: {fileSize} MB"),
      });
    },
    //自动上传返回结果
    uploadSuccess(val) {
      if (val.status === "done") {
        this.$loading.hide();
        this.noImg = false;
        this.saveImgUrl = val.uploadRes.data;
        this.imgUrl = this.buildImgUrl(val.uploadRes.data, SrmUtil.getDefaultBucketName());
      }
    },
    // 生成下载地址方式
    // buildImgUrl(fileUrl,bucketName) {
    //   const baseUrl = process.env.VUE_APP_BASE_URL;
    //   const downApi = `/hfle/v1/${window.localStorage.organizationId}/files/download`;
    //   const access_token = window.localStorage.getItem("user-token");
    //   const url = encodeURIComponent(fileUrl);
    //   return `${baseUrl + downApi}?access_token=${access_token}&bucketName=${bucketName}&url=${url}`;
    // },
    //重新上传
    reupload() {
      this.noImg = true;
      this.imgUrl = "";
    },
    //识别发票
    importInvoice() {
      this.$loading.show({
        text: this.$T(
          "hipspfm.invoiceInspection.view.message.handlerInvoiceCode"
        ).$D("识别中")
      });
      ocrImportApi([ this.saveImgUrl ]).then((res) => {
        this.$loading.hide();
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            class: "notification",
            duration: 3
          });
        } else if (!isEmpty(res)) {
          const errorMsg = Object.values(res).map((item) => item?.desc || "").join();
          this.$notification.open({
            message: errorMsg,
            class: "notification",
            duration: 3
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            class: "notification",
            duration: 3
          });
          this.$router.push({ name: "InvoiceExceptionList" });
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../../style/mixin.styl'
.header {
  font-size: 18px;
  line-height: 26px;
  color:var(--color-font-default);
  font-weight: bold;
}

.content {
  height: 500px;
  padding: 60px 20px 0px 20px;

  section {
    border-radius: 8px;
    box-shadow: 0px 0px 12px 0 rgba(27, 30, 43, 0.05);
    text-align: center;
    height: 200px;
     bg_url(img_ocrbg)

    background-size: 100%;

    img {
      height: 32px;
      width: 32px;
      position: absolute;
      top: 108px;
      left: 172px;
    }

    div {
      font-size: 12px;
      line-height: 20px;
      color:var(--color-font-default-b);
    }

    &:last-child {
      padding-bottom: 56px;
    }

    .option-upload {
      font-size: 14px;
      color:var(--color-font-default-c);
    }

    .option-message {
      height: 34px;
    }

    >>> .hips-group {
      opacity: 0;
      top: 60px !important;
    }

    >>> .hips-uploader__add-grid {
      width: 330px !important;
    }

    >>> .hips-col--8 {
      width: 24.86% !important;
    }
  }

  .imgnation {
    text-align: center;
    box-shadow: 0px 0px 12px 0 rgba(27, 30, 43, 0.05);

    img {
      height: 200px;
      width: 335px;
      border-radius: 8px;
    }
  }
}

.supplier-confirm {
  width: 100%;
  text-align: center;
  font-size: 18px;
  line-height: 49px;
  color: var(--color-other-default-b);
  position: fixed;
  bottom: 0;

  span {
    display: block;
    width: 100%;

    &:nth-child(1) {
      font-size: 14px;
      height: 49px;
    }

    &:nth-child(2) {
      background:var(--color-bg-default);
      box-shadow: 0 -2px 12px 0 rgba(27, 30, 43, 0.05);
      height: calc(49px + constant(safe-area-inset-bottom));
      height: calc(49px + env(safe-area-inset-bottom));
      font-weight: bold;
    }
  }
}
</style>
