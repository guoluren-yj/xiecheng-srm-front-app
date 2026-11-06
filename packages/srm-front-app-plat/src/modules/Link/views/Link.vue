<template>
  <div class="link-iframe-container">
    <iframe :title="title" :src="url" style="width: 100%; height: 100%; verticalAlign: top;" frameBorder="0" />
  </div>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";

export default {
  name: "Link",
  data() {
    return {
      url: "",
      title: "",
    };
  },
  beforeMount() {
    let url = "";
    const paramsArray = [];
    if (this.$route.query && this.$route.query.url) {
      url = decodeURIComponent(this.$route.query.url || "");
      // 现有配置方案受限与移动端多处重定向以及对参数的处理，只能写额外的逻辑去兼容
      // 第一个是uni-app对子应用维护中配置的url会进行多次decode，直到url不包含%，这个过程最大为10次解码
      // 导致不能将复杂参数（包含/的地址参数）作为路径参数放，如/Link/:url这种路径是不支持的，只能用?传参
      // 配置外链子应用时，路由的参数部分只进行一次encode(包含?)，以此保证第一次参数解析正常
      // 同样由于多次decode的缘故，url=xxx中如果包含query参数，会被解析为/Link的query参数
      // 下面逻辑是为了排除url和uniParam，获取原本url后面跟着的query参数，重组url
      const ignoreKeys = ["uniParam", "url"];
      Object.keys(this.$route.query).forEach((k) => {
        if (ignoreKeys.includes(k)) {
          return;
        }
        // 某处跳转逻辑会将access_token=变为空字符串，所以配置时得用srmAccessToken=代替，然后在这里转为正确的key
        if (k === "srmAccessToken") {
          paramsArray.push(`access_token=${this.$route.query[k]}`);
        } else {
          paramsArray.push(`${k}=${this.$route.query[k]}`);
        }
      });
    }
    if (!url) {
      return;
    }
    if (paramsArray.length) {
      if (/\?([a-zA-Z0-9_]+=)/.test(url)) {
        url += `&${paramsArray.join("&")}`;
      } else {
        url += `?${paramsArray.join("&")}`;
      }
    }
    if (url.startsWith("/")) {
      url = `${SrmUtil.getApiBaseUrl()}${url}`;
    }
    // @ts-ignore
    url = url.replace(/\{accessToken\}/, window.localStorage.getItem("user-token"));
    url = url.replace(/\{tenantId\}/, SrmUtil.getTenantId());
    this.url = url;
  },
};
</script>

<style lang="stylus" scoped>
.link-iframe-container {
  height 100vh;
  width: 100vw;
}
</style>