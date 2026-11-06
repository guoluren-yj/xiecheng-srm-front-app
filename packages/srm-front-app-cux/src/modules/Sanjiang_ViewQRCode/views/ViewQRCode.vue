<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ title }}</div>
    </hips-nav-bar>
    <div class="qr-code-wrapper">
      <img v-if="src" :src="src" alt="">
    </div>
  </hips-view>
</template>

<script>
import { Icon, View, NavBar } from "hips";
import { getQrCodeRedirectUrl, getQrCode } from "../api/index";

export default {
  name: "ViewQRCode",
  components: {
    [View.name]: View,
    [Icon.name]: Icon,
    [NavBar.name]: NavBar,
  },
  data() {
    return {
      url: "",
      src: null,
      title: ""
    };
  },
  mounted() {
    this.title = this.$route.query.title;
    let pagePath = this.$route.query.url;
    let innerFlag = this.$route.query.innerFlag;
    let thirdPartyCode = "wechatService";

    getQrCodeRedirectUrl({ innerFlag, pagePath, thirdPartyCode }).then((res) => {
      if (typeof res === "string") {
        getQrCode(res).then((img) => {
          let blob = new Blob([ img ], { type: "image/png" });
          this.src = URL.createObjectURL(blob);
        }).finally(() => {
          this.$loading.hide();
        });
      }
    }).finally(() => {
      this.$loading.hide();
    });
  }
};
</script>

<style lang="stylus" scoped>
$color-blue = #6699FF;

>>> .hips-ellipsis {
  font-size: 16px;
}

>>> .hips-tab__panel {
  padding: 0;
}

.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: 600;
}

.qr-code-wrapper {
  width: 100vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 80vw;
    height: 80vw;
  }
}
</style>
