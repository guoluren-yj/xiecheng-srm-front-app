<template>
  <hips-popup
    v-model="value"
    style="height: 100%;width:100%"
    position="bottom">
    <div>
      <hips-nav-bar slot="header" :have-border="false" class="popup-header">
        <div slot="left" class="popup-left">{{ title }}</div>
        <div slot="right" class="cancel" @click="$emit('input',false)">
          <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt>
        </div>
      </hips-nav-bar>
      <iframe v-if="value" :src="src" style="width: 100%;height: calc(100vh - 48px)" :title="title"/>
    </div>
  </hips-popup>
</template>

<script>
import { Popup, NavBar, Textarea } from "hips";

export default {
  name: "IframePopup",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    src: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.title);
  },
  methods: {
    closePop() {
      this.$emit("input", false);
    },
  }
};
</script>

<style lang="stylus" scoped>
@import '../style/mixin.styl'
.popup-header {
  height: 48px;

  .popup-left {
    margin-left: 10px;
    font-size: 18px;
    line-height: 26px;
    color: var(--color-font-default);
    font-weight: bold;
    height: 44px;
    padding: 10px 0 9px 0;
  }

  .cancel {
    color: var(--color-font-default-b);
    margin-right: 22.8px;
  }
}
</style>
