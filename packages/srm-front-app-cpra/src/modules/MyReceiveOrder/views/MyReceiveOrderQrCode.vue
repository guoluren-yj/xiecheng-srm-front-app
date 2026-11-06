<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ $T('hipspfm.common.message.title.receiveQrCode').$D('收货二维码') }}</div>
    </hips-nav-bar>
    <div class="qr-code-wrapper">
      <img v-if="src" :src="src" alt="">
    </div>
  </hips-view>
</template>

<script>

import { SrmUtil } from "srm-mobile-ui";
import { Icon, View, NavBar } from "hips";
import { getQrCodeRedirectUrl, getQrCode } from "../api/index";

export default {
  modules: [ "hipspfm.common" ],
  name: "MyReceiveOrderQrCode",
  components: {
    [View.name]: View,
    [Icon.name]: Icon,
    [NavBar.name]: NavBar,
  },
  data() {
    return {
      poHeaderId: 0,
      src: null,
      userInfo: {}
    };
  },
  mounted() {
    this.poHeaderId = this.$route.query.poHeaderId;
    this.$loading.show();
    this.userInfo = SrmUtil.getUserInfo();
    getQrCodeRedirectUrl({
      poHeaderId: this.poHeaderId,
      agentId: this.userInfo.id,
      agentName: this.userInfo.realName
    }).then((res) => {
      if (typeof res === "string") {
        getQrCode(res).then((img) => {
          let blob = new Blob([ img ], { type: "image/png" });
          this.src = URL.createObjectURL(blob);
        }).finally(() => {
          this.$loading.hide();
        });
      }
    }).catch(() => {
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
