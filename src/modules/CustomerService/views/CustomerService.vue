<!-- eslint-disable operator-linebreak -->
<template>
  <div />
</template>
<script>
import { getUserInfo, getCustomerConfig } from "../api";

export default {
  name: "CustomerService",
  data() {
    return {};
  },
  mounted() {
    // 目前只支持en cn
    this.loadCustomer();
  },
  methods: {
    async loadCustomer() {
      let res;
      let config;

      try {
        this.$loading.show();
        res = await getUserInfo();
        if (!res.loginName) {
          return;
        }
        config = await getCustomerConfig();
        if (!config.url) {
          return;
        }
      } catch (e) {
        console.info("cusomerService error:", e);
      } finally {
        this.$loading.hide();
      }

      const additionInfo = res.additionInfo || {};

      const tenantCode = res?.tenantNum ?? "";
      const tenantCodeStr = tenantCode ?
        tenantCode.replace(/-/g, "_") : "";

      const anonymousUserInfo = {
        // eslint-disable-next-line camelcase
        t_belong_tenant: additionInfo.organizationName, // 所属租户
        // eslint-disable-next-line camelcase
        t_current_tenant: res.tenantName, // 当前租户
        // eslint-disable-next-line camelcase
        t_website: window.location.href, // 登录网址
        // eslint-disable-next-line camelcase
        t_web: navigator.userAgent, // 当前浏览器
        company: tenantCodeStr || "",
      };

      const userOptions = {
        anonymousUserName: res.realName,
        anonymousUserCode: res.loginName,
        anonymousUserInfo: JSON.stringify(anonymousUserInfo),
        updateFlag: true,
      };

      const urlParam = encodeURIComponent(JSON.stringify(userOptions));
      const url = `${config.url}?userId=${res.id}&userOptions=${urlParam}`;

      window.location.replace(url);
    },
  },
};
</script>

<style lang="stylus" scoped></style>
