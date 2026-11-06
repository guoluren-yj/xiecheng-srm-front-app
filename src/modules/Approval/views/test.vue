<template>
  <srm-flex direction="column">
<!--    <div style="margin-top: 20px;width: 100%; height: 500px;border: 1px red solid">-->
<!--      <srm-button style="margin-top: 20px" @click="preview">SrmAppCore.scanQrCode</srm-button>-->
<!--&lt;!&ndash;      <srm-textarea :auto-size="true" :value="scanResult"></srm-textarea>&ndash;&gt;-->
<!--&lt;!&ndash;      <div>{{this.scanResult}}</div>&ndash;&gt;-->
<!--    </div>-->
    <div style="margin-top: 20px">
      <srm-button style="margin-top: 20px" @click="getLocation">locationTencent</srm-button>
    </div>
    <div style="margin-top: 20px">
      <srm-button style="margin-top: 20px" @click="getLocationShow">locationTencentShow</srm-button>
    </div>
    <div style="margin-top: 20px">
      <action-bar :data="data"/>
    </div>

    <div style="margin-top: 20px;width: 100%">
      <srm-attachment :camera-only="true" attachment-uuid="3283ac2e6e4012306b9adc769204d5703b" display-type="grid" :cols="2"/>
    </div>
    <input
      v-show="false"
      ref="input"
      type="file" name="file"
      :multiple="multiple"
      :accept="accept"
      :capture="capture"
      @change="handleUploadChange">
    <div style="margin-top: 20px">
      <srm-button style="margin-top: 20px" @click="picture">picture</srm-button>
    </div>
    <div style="margin-top: 20px">
      <srm-button style="margin-top: 20px" @click="wechatPicture">wechatPicture</srm-button>
    </div>
    <img v-if="srcImag" :src="srcImag" style="width: 50px;height: 50px;">
    <input style="border: 1px lightgray solid" placeholder="Please input" v-model="host" >
    <srm-button style="margin-top: 20px" @click="testAction">test</srm-button>
  </srm-flex>
</template>
<script>
import SrmAppCore from "srm-front-app-core";
export default {
  data() {
    return {
      srcImag:"",
      capture: "camera",
      multiple: false,
      accept: "*",
      url: null,
      vHtml:"",
      ///OrderConfirmation/#/OrderConfirmationDetail?poHeaderId=${poHeaderId}&orgName=${ouName}&unreadCount=${unreadCount}&switchTenantId=${tenantId}&validateCode=PO_CONFIRM_DETAIL
      data:{ cardInfo:{ cardCode:"PO_CONFIRM_DETAIL", data:{ displayPoNum:"PO20302003020", poHeaderId:1000, tenantId:30, unreadCount:0, ouName:"hello" } } },
      host: null,
      scanResult:""
    };
  },
  mounted() {
  },
  methods: {
    handleUploadChange(e) {
      const files = e.target.files;
      let postFiles = Array.prototype.slice.call(files);
      console.info("files", files);
      postFiles.forEach((item) => {
        // eslint-disable-next-line no-alert
        alert("Success upload:" + item.name);
      });

    },
    preview() {
      console.info(SrmAppCore);
      let that = this;
      // that.scanResult = that.scanResult + "\n" + "111111";
      SrmAppCore.scanQrCode(function (result) {
        that.scanResult = that.scanResult + "\n" + result;
        console.info("result:", result);
      }, function (error) {
        console.info("APP扫码异常：", error);
      });
    },
    getLocation() {
      this.$geoLocation().then((res) => {
        console.info("位置：", res);
      }).catch((err) => {
        console.info("定位错误：", err);
      });
    },
    getLocationShow() {
      this.$popup({
        title: "Location info",
        showHeader: true,
        showClose: true,
        height: "100%",
        position: "bottom",
        content: <Location/>
      });
    },
    picture() {
      this.$refs.input.click();
    },
    wechatPicture() {
      window.top.srmChooseImage().then((res) => {
        this.srcImag = res;
      }).catch((e) => {
        console.info("error", e);
      });
    },
    testAction() {
      // let t = JSON.parse(this.host);
      // this.$router.replace(t);
      const downLoadUrl = this.host;
      let aDom = document.createElement("a");
      aDom.style.display = "none";
      aDom.href = downLoadUrl;
      document.body.appendChild(aDom);
      aDom.click();
      document.body.removeChild(aDom);
    },
  }
};

</script>
