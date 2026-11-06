<template>
  <div>
    <div class="content">
      <div class="title">
        <span>{{ $T("hipspfm.invoiceInspection.view.message.title.historyInvoiceQuery").$D("历史发票查询") }}</span>
      </div>
      <div class="check-body">
        <div @click="goUnsuccessList">
          <img class="image-red-default" src="@/assets/InvoiceInspection/icon_Invoice_checked_failed@3x.png" alt >
          <span>{{ $T("hipspfm.invoiceInspection.view.message.checkFailed").$D("查验失败") }}</span>
        </div>
        <div @click="goSuccessList">
          <img class="image-blue-default" src="@/assets/InvoiceInspection/icon_Invoice_checked_success@3x.png" alt >
          <span>{{ $T("hipspfm.invoiceInspection.view.message.checkSuccess").$D("查验成功") }}</span>
        </div>
      </div>
      <div class="title">
        <span>{{ $T("hipspfm.invoiceInspection.view.message.addInvoice").$D("新增发票") }}</span>
      </div>
      <div class="add-body">
        <li @click="goScanner">
          <img class="image-blue-default" src="@/assets/InvoiceInspection/icon_invoice_sweep@3x.png" alt >
          <div class="right">
            <div>{{ $T("hipspfm.invoiceInspection.view.message.scanAdd").$D("扫描添加") }}</div>
            <div>{{ $T("hipspfm.invoiceInspection.view.message.scanInvoiceQRCode").$D("扫描发票二维码") }}</div>
          </div>
        </li>
        <li @click="goOcR">
          <img class="image-blue-default" src="@/assets/InvoiceInspection/icon_invoice_ocrRecognition@3x.png" alt >
          <div class="right">
            <div>{{ $T("sfin.invoiceBill.view.button.invoiceBill.ocrDistinguish").$D("OCR识别") }}</div>
            <div>{{ $T("hipspfm.invoiceInspection.view.message.uploadInvoiceOcrDistinguish").$D("上传发票图片识别") }}</div>
          </div>
        </li>
        <li @click="goManualEntry">
          <img class="image-yellow-default" src="@/assets/InvoiceInspection/icon_invoice_manualEntry@3x.png" alt >
          <div class="right">
            <div>{{ $T("hipspfm.invoiceInspection.view.message.manualEntry").$D("手工录入") }}</div>
            <div>{{ $T("hipspfm.invoiceInspection.view.message.view.message.inputInvoiceInfo").$D("手动填写发票信息") }}</div>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import { JsBridge } from "srm-mobile-ui";

import * as dd from "dingtalk-jsapi";
import { scanBridge } from "srm-mobile-ui/src/utils/jsBridge";
import SrmAppCore from "srm-front-app-core";

export default {
  modules: [ "hipspfm.invoiceInspection", "sfin.invoiceBill" ],
  name: "InvoiceInspection",
  components: {
  },
  data() {
    return {};
  },
  methods: {
    // 退出子应用
    goBack() {
      this.$router.back();
    },
    //进入查验异常列表
    goUnsuccessList() {
      this.$router.push({
        name: "InvoiceExceptionList"
      });
    },
    //进入查验成功列表
    goSuccessList() {
      this.$router.push({
        name: "InvoiceSuccessList"
      });
    },
    //扫一扫
    async goScanner() {
      let _this = this;
      SrmAppCore.scanQrCode(function (result) {
        console.info(result);
        _this.$router.push({
          name: "EditableDetail",
          query: { result, editable: false }
        });
        },function (){
        _this.$notification.open({
          message: _this
              .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
              .$D("扫码异常"),
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 3
        });
      });

      // const navigatorInfo = navigator.userAgent.toLowerCase();
      // if (
      //   navigatorInfo.includes("welink") ||
      //   navigatorInfo.includes("cloudlink")
      // ) {
      //   /** welink **/
      //   await this.getWlScan();
      // } else if (navigatorInfo.indexOf("micromessenger") !== -1) {
      //   /** 微信 **/
      //   await this.getWxScan();
      // } else if (dd.env.platform !== "notInDingTalk") {
      //   console.log("钉钉扫码");
      //   /** 钉钉 **/
      //   await this.getDdScan();
      // } else {
      //   /** APP **/
      //   await this.getAppScan();
      // }
    },
    // welink扫码
    // getWlScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   // eslint-disable-next-line no-undef
    //   HWH5.scanCode({ needResult: 1 })
    //     .then((res) => {
    //       let result = JSON.parse(res).result;
    //       console.log(res);
    //       _this.$router.push({
    //         name: "EditableDetail",
    //         query: { result, editable: false }
    //       });
    //     })
    //     .catch(() => {
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         // eslint-disable-next-line no-undef
    //         key,
    //         class: "notification",
    //         duration: 3
    //       });
    //     });
    // },
    // // APP扫码
    // getAppScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   scanBridge()
    //     .then((res) => {
    //       let result = JSON.parse(res).result;
    //       JSON.stringify(res).indexOf(",") === -1 ?
    //         _this.$notification.open({
    //           message:
    //               _this
    //                 .$T("hipspfm.invoiceInspection.view.message.scanError")
    //                 .$D("扫码有误") +
    //               "," +
    //               _this
    //                 .$T(
    //                   "hipspfm.invoiceInspection.validation.message.useManualEntry"
    //                 )
    //                 .$D("请使用手工录入"),
    //           // eslint-disable-next-line no-undef
    //           key,
    //           class: "notification",
    //           duration: 3
    //         }) :
    //         _this.$router.push({
    //           name: "EditableDetail",
    //           query: { result, editable: false }
    //         });
    //     })
    //     .catch(() => {
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         // eslint-disable-next-line no-undef
    //         key,
    //         class: "notification",
    //         duration: 3
    //       });
    //     });
    // },
    // // 微信扫码
    // getWxScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   const wx = parent.wxBridge || parent.jWeixin;
    //   console.log("ex = ", wx);
    //   if (!wx) {
    //     _this.$notification.open({
    //       message: _this
    //         .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //         .$D("扫码异常"),
    //       // eslint-disable-next-line no-undef
    //       key,
    //       class: "notification",
    //       duration: 3
    //     });
    //   }
    //   wx.scanQRCode({
    //     needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //     scanType: [ "qrCode" ], // 可以指定扫二维码还是一维码，默认二者都有
    //     success: function(resC) {
    //       console.log("扫描单号", resC.resultStr);
    //       let result = resC.resultStr; // 当needResult 为 1 时，扫码返回的结果
    //       _this.$router.push({
    //         name: "EditableDetail",
    //         query: { result, editable: false }
    //       });
    //     },
    //     fail: function(err) {
    //       console.log("scanerr", err);
    //       _this.$notification.open({
    //         message: _this
    //           .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //           .$D("扫码异常"),
    //         // eslint-disable-next-line no-undef
    //         key,
    //         class: "notification",
    //         duration: 3
    //       });
    //     },
    //     cancel: function(resE) {
    //       console.log("cancel", resE);
    //       _this.$router.push({ name: "InvoiceInspection" });
    //     }
    //   });
    // },
    // // 钉钉扫码
    // getDdScan() {
    //   // eslint-disable-next-line consistent-this
    //   let _this = this;
    //   dd.ready(function() {
    //     dd.biz.util.scan({
    //       type: "all",
    //       onSuccess: function(data) {
    //         console.log("扫码结果", data);
    //         let result = data.text;
    //         _this.$router.push({
    //           name: "EditableDetail",
    //           query: { result, editable: false }
    //         });
    //       },
    //       onFail: function(err) {
    //         if (Number(err.errorCode) === 10) {
    //           _this.$router.push({ name: "InvoiceInspection" });
    //         } else {
    //           _this.$notification.open({
    //             message: _this
    //               .$T("hipspfm.invoiceInspection.view.message.scanAbnormal")
    //               .$D("扫码异常"),
    //             // eslint-disable-next-line no-undef
    //             key,
    //             class: "notification",
    //             duration: 3
    //           });
    //         }
    //       }
    //     });
    //   });
    // },
    //进入OCR识别
    goOcR() {
      this.$router.push({
        name: "OcrRecognition"
      });
    },
    //进入手工录入
    goManualEntry() {
      this.$router.push({
        name: "ManualEntry"
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
$color-blue = #6699FF;

.header {
  font-size: 18px;
  line-height: 26px;
  font-weight: bold;
  color: var(--color-font-default);
}

.content {
  .title {
    height: 54px;
    font-size: 18px;
    color: var(--color-font-default);
    font-weight: bold;

    span {
      display: inline-block;
      padding: 20px 0px 8px 20px;
    }
  }

  .check-body {
    display: flex;
    font-size: 16px;
    font-weight: bold;
    padding: 12px 20px 36px 20px;

    img {
      height: 20px;
      width: 20px;
      margin-right: 8px;
    }

    div {
      width: 157px;
      height: 56px;
      padding-left: 28px;
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--color-other-default);
      background: var(--color-bg-default);
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
      border-radius: 2px;

      &:nth-child(2) {
        color: var(--color-other-default-b);
        margin-left: 21px;
      }
    }
  }

  .add-body {
    padding: 0px 20px;

    li {
      display: flex;
      justify-items: center;
      border-radius: 2px;
      height: 68px;
      border-radius: 2px;
      margin-top: 16px;

      &:nth-child(1) {
        background: var(--color-bg-default-i);
      }

      &:nth-child(2) {
        background: var(--color-bg-default-i);
      }

      &:nth-child(3) {
        background:var(--color-bg-default-i);
      }

      img {
        height: 32px;
        width: 32px;
        margin: 18px 16px 18px 24px;
      }

      .right {
        margin-top: 12px;
        font-size: 14px;
        line-height: 22px;

        div:nth-child(1) {
          color: var(--color-font-default);
          font-weight: bold;
        }

        div:nth-child(2) {
          color: var(--color-font-default-b);
        }
      }
    }
  }
}
</style>
