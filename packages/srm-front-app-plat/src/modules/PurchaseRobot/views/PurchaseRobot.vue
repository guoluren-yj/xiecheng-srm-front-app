<template>
  <div class="purchase-robot-container">
    <iframe v-if="url"
            class="purchase-robot-iframe"
            :src="url"
            @load="onLoaded" />
    <div v-if="failed"
         class="purchase-robot-error">
      <img src="@/assets/purchase_robot_error.svg">
      <div>{{ $T("smbl.purchaseRobot.view.loginError").$D("登陆失败，请联系管理员") }}</div>
      <div v-if="errorTips">{{ errorTips }}</div>
    </div>
  </div>
</template>
<script>
import { getUrlWithCodeApi } from "@/modules/PurchaseRobot/api";

export default {
  name: "PurchaseRobot",
  modules: ["smbl.purchaseRobot"],
  components: {},
  data() {
    return {
      url: "",
      failed: false,
      errorTips: "",
    };
  },
  computed: {},
  mounted() {
    this.getUrl();
  },
  methods: {
    hideNotification() {
      const notification = document.getElementsByClassName("srm-notification")[0];
      if (notification) {
        notification.remove();
      }
    },
    getUrl() {
      this.$loading.show();
      getUrlWithCodeApi("user_chat_mobile").then(
        (res) => {
          if (res?.failed) {
            this.failed = true;
            this.errorTips = res?.message;
            this.$loading.hide();
          } else {
            this.url = res;
          }
        },
        () => {
          this.failed = true;
          this.$loading.hide();
          this.hideNotification();
        }
      );
    },
    onLoaded() {
      this.$loading.hide();
    },
  },
};
</script>

<style lang="stylus" scoped>
.purchase-robot-container {
  height: 100vh;
  width: 100vw;

  .purchase-robot-iframe {
    height: 100%;
    width: 100%;
    border: none;
  }

  .purchase-robot-error {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    color: #AFAFAF;
    line-height: 20px;
    font-weight: 400;

    &::before {
      content: '';
      height: 23%;
    }

    >img {
      width: 250px;
    }
  }
}
</style>
