<template>
  <srm-flex direction="column" style="height:100%;width: 100%">
    <iframe v-if="iframeSrc" style="width: 380px;height: 100%" :src="iframeSrc"/>
  </srm-flex>
</template>

<script>
export default {
  name: "ZhenyunApprovalDetail",
  data() {
    return {
      iframeSrc: ""
    };
  },
  mounted() {
    let url = window.location.href;
    url = url.replace("ApprovalDetail", "ApprovalDetailDemo") + "&enterSource=uniApp&access_token=" + window.localStorage.getItem("user-token") + "&test=111";
    this.iframeSrc = url.replace("ZhenyunApprovalDetail", "ApprovalDetailDemo");
  }
};
</script>

<style lang="stylus" scoped>

</style>
