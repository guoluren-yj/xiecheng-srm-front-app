<template>
  <div>
    <iframe
      v-show="html"
      ref="htmlIframe"
      title="view"
      width="100%"
      :height="iframeHeight"
      frameBorder="none"
      style="border: 'none'"/>
    <!-- :srcDoc="`<style>img{max-width:100%;height:auto;}${injectCss || ''}</style>${html}`" -->
    <!-- onLoad="handleChangeIframeHeight" -->
    <div v-show="!html" class="empty-no-intro">
      <img src="@/assets/introduction_empty.png">
      <p class="description">{{ $T('smpc.product.view.noData').$D('暂无数据') }}</p>
    </div>
  </div>
</template>

<script>
import { $T } from "srm-mobile-ui";
export default {
  modules: [ "smpc.product" ],
  name: "HtmlView",
  props: {
    html: {
      type: String,
    }
  },
  data() {
    return {
      iframeHeight: 0,
      injectCss: "",
      timer: null,
    };
  },
  computed: {},
  watch: {
    html(val) {
      if (val && this.$refs.htmlIframe) {
        // 移动端兼容性
        this.$refs.htmlIframe.contentWindow.document.write(
          `<style>img{max-width:100%;height:auto;}${this.injectCss || ""}</style>${this.html}`
        );
      }
      this.timer = setTimeout(() => this.handleChangeIframeHeight(), 1000);
    }
  },
  mounted() {
    const cssurl = this.html?.match(/cssurl='(\S*)'>/)?.[1];
    if (cssurl) {
      fetch(`${window.location.protocol}${cssurl}`)
        .then((res) => res.text())
        .then((res) => {
          this.injectCss = res;
        });
    }
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    handleChangeIframeHeight() {
      const iframe = this.$refs.htmlIframe;
      const iframeWin = iframe?.contentWindow || iframe?.contentDocument?.parentWindow;
      const contentHeight = iframeWin?.document?.documentElement?.scrollHeight || iframeWin?.document?.body?.scrollHeight;
      this.iframeHeight = contentHeight + 16;
    },
  }
};
</script>

<style lang="stylus" scoped>
.empty-no-intro {
    text-align: center;
    padding: 20px 0;
  p {
    margin: 0;
  }
  img {
    width: 250px;
    height: 150px;
  }
  .description {
    font-size: 14px;
    color: var(--font-color-disable);
  }
}
</style>