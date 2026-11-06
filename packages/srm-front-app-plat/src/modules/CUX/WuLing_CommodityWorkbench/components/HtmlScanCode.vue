<template>
  <div v-if="value" class="qrcode-scanner">
    <div class="scan-back">
      <span class="srm-icon icon-x" @click="closeModal" />
    </div>
    <div id="qr-code-full-region" />
    <!-- <div v-if="html5Qrcode" class="qrcode-scanner-img" @click="uploadImg">
      图片上传
    </div> -->
  </div>
</template>

<script>
import { Html5Qrcode } from "html5-qrcode";
export default {
  name: "HtmlScanCode",
  props: {
    // 默认隐藏
    value: {
      type: Boolean,
      default: false,
    },
    qrbox: {
      type: Number,
      default: 250,
    },
    // 没10ms 扫一次
    fps: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      html5Qrcode: null,
      cameraId: null,
    };
  },
  watch: {
    value(val) {
      if (!val) {
        this.stop();
      } else {
        this.$nextTick(() => {
          this.init();
        });
      }
    },
  },
  mounted() {},
  beforeDestroy() {
    this.stop();
  },
  methods: {
    async init() {
      try {
        this.startScan();
      } catch (error) {
        this.toastError(error);
        setTimeout(() => {
          // 初始化失败关闭弹窗
          this.$emit("onScanFail");
        }, 2000);
      }
    },
    // 启动扫描
    async startScan() {
      // await this.getCameras();
      this.html5Qrcode = new Html5Qrcode("qr-code-full-region");
      this.html5Qrcode.start(
        {
          facingMode: "environment", // 使用后置摄像头（通常是主摄像头），用于扫描二维码。
        },
        // this.cameraId,
        {
          fps: this.fps,
          qrbox: this.qrbox,
          aspectRatio: 1,
        },
        this.onScanSuccess
        // (err) => {
        //   console.log("err", err);
        // }
      );
    },
    // 获取摄像头参数
    async getCameras() {
      if (!this.cameraId) {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          if (devices.length > 1) {
            // 设置后视
            this.cameraId = devices[1].id;
          } else {
            this.cameraId = devices[0].id;
          }
        }
      }
      return this.cameraId;
    },
    // 成功回调
    onScanSuccess(decodedText, decodedResult) {
      this.$emit("onScanSuccess", decodedText, decodedResult);
      this.stop();
    },
    // 上传文件
    uploadImg() {
      // try {
      //   uni.chooseImage({
      //     count: 1,
      //     sourceType: ["album"],
      //     success: (tempFilePaths = {}) => {
      //       const [file] = tempFilePaths?.tempFiles || [];
      //       this.scanFile(file);
      //     },
      //     fail: (err) => {
      //       this.toastError(err);
      //     },
      //   });
      // } catch (error) {
      //   this.toastError(error);
      // }
    },
    // 识别图片
    scanFile(file) {
      if (file) {
        this.stop(); // 需要停止canvas才能执行图片识别
        this.$nextTick(() => {
          this.html5Qrcode
            .scanFileV2(file)
            .then((result = {}) => {
              this.onScanSuccess(result?.decodedText, result);
            })
            .catch(() => {
              this.$notification.open({
                message: "图片识别失败",
                duration: 1,
              });
              this.init();
            });
        });
      }
    },
    // 停止扫描
    stop() {
      if (this.html5Qrcode) {
        const state = this.html5Qrcode.getState(); // 获取当前扫码状态
        if (state !== 1) {
          // 停止后不能继续执行停止
          this.html5Qrcode.stop();
        }
      }
    },
    closeModal() {
      this.stop();
      this.$emit("onScanBack");
    },
    // 报错
    toastError(title) {
      this.$notification.open({
        message: title,
        duration: 1,
      });
    },
  },
};
</script>

<style lang="stylus">
.qrcode-scanner {
  width: 100%;
  height: 100%;
  position: fixed !important;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  background-color: black;

  .scan-back {
    background-color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    span.srm-icon {
    }
  }

  #qr-code-full-region {
    width: 370px;
  }

  #qr-code-full-region:before {
    content: '';
    width: 220px;
    margin: 0 20%;
    height: 1px;
    display: inline-block;
    background-color: #fff;
    opacity: 0.2;
    animation: scan 3s linear infinite;
  }

  @keyframes scan {
    from {
      transform: translateY(0);
    }

    to {
      transform: translateY(200px);
    }
  }

  @keyframes scan {
    from {
      transform: translateY(0);
    }

    to {
      transform: translateY(200px);
    }
  }

  .qrcode-scanner-img {
    position: absolute;
    bottom: 80px;
    right: 30px;
    color: #fff;
  }
}

>>> .srm-popup-header {
  z-index: 999;
}
</style>
