
<template>
  <div class="no-content" @click="refresh?refresh():''">
    <div>
      <img :src="getImgSrc" alt >
      <p>
        {{ $T(title).$D(title) }}
        <span v-if="refresh" style="color:var(--color-other-default-b)">,{{ $T(refreshTilte).$D(refreshTilte) }}！</span>
      </p>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  modules: [ "hipspfm.common" ],
  name: "NoContent",
  props: {
    title: {
      type: String,
      default: "hipspfm.common.view.message.title.noData"
    },
    refreshTilte: {
      type: String,
      default: "hipspfm.common.message.clickRefresh"
    },
    imgSrc: {
      type: String,
      default: ""
    },
    refresh: {
      type: Function,
      default: null
    }
  },
  computed: {
    getImgSrc() {
      if (this.imgSrc) {
        return require("@/assets/" + this.imgSrc);
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.no-content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  // height: calc(100vh - 120px);
  height: 100%;

  div {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 200px;
      height: 200px;
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
