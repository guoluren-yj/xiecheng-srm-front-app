<template>
  <div class="notice">
    <div class="notice-content">
      <div class="circle-wrap">
        <div class="circle-bg"/>
        <div class="circle-progress" :style="{borderColor: status === 'formValidting' ? '#3b82f6' : '#ff9933'}" />
        <div class="icon">
          <img
            v-if="status === 'formValidting'"
            src="@/assets/form_validate.svg"
            class="icon">
          <img
            v-else-if="status === 'serviceExcuting'"
            src="@/assets/service_run.svg"
            class="icon">
        </div>
      </div>
      <div class="title">{{ text }}</div>
      <div class="desc">
        {{ $T('hwfp.common.view.title.processExcuting').$D('执行过程中，请勿离开页面') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ApprovalLoading",
  modules: [ "hwfp.common" ],
  props: {
    status: {
      type: String,
      default: "",
    },
    loadingProps: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    text() {
      const map = {
        formValidting: this.$T("hwfp.common.view.title.formValidating").$D("正在执行表单校验"),
        serviceExcuting: this.$T("hwfp.common.view.title.serviceExcuting").$D("正在执行服务任务"),
      };
      return map[this.status] || "";
    },
  },
};
</script>

<style lang="stylus" scoped>
.notice {
  background-color: #fff;
  width: 186px;
  height: 186px;
  box-shadow: 0 6px 16px -8px rgba(29,33,41,0.08),
    0 9px 28px 0 rgba(29,33,41,0.05),
    0 12px 48px 16px rgba(29,33,41,0.03);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notice-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.circle-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 12px;
}
.circle-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 6px solid #e5e7eb;
  box-sizing: border-box;
}
.circle-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 6px solid #3b82f6;
  border-top-color: transparent !important;
  box-sizing: border-box;
  animation: rotate 1.5s linear infinite;
}
.icon {
  width: 43px;
  height: 43px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.title {
  font-size: 14px;
  color: #333333;
  text-align: center;
  line-height: 20px;
  font-weight: 500;
  margin-bottom: 4px;
}
.desc {
  font-size: 12px;
  color: #868D9C;
  text-align: center;
  line-height: 16px;
  font-weight: 400;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>