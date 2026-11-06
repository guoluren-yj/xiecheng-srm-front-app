<template>
  <div>
    <srm-flex justify="center" class="header">
      {{ $T("smbl.todo.view.todoApproved.title").$D("流程已审批") }}
    </srm-flex>
    <no-content
      img-src="NoOrder@3x.png"/>

    <srm-flex direction="column" justify="center" class="back">
      {{ $T("smbl.workFlow.view.todoApproved.backTip").$D("即将返回审批列表页") }}
      <srm-blank size="large"/>
      <srm-button @click="backToList">{{ $T("smbl.workFlow.button.backTip").$D("立即返回") }}({{ timeRemain }})</srm-button>
    </srm-flex>
  </div>
</template>

<script>
import NoContent from "../../../../components/NoContent";

export default {
  modules: [ "smbl.todo", "smbl.workFlow", "hipspfm.common" ],
  name: "StarBucksApprovalApproved",
  components: {
    NoContent,
  },
  data() {
    return {
      timeRemain: 5,
      backTimer: null,
    };
  },
  mounted() {
    this.backTimer = setInterval(this.countDown, 1000);
  },
  beforeDestroy() {
    this.backTimer && clearInterval(this.backTimer);
  },
  methods: {
    countDown() {
      this.timeRemain--;
      if (this.timeRemain <= 0) {
        this.backToList();
      }
    },
    backToList() {
      this.backTimer && clearInterval(this.backTimer);
      this.$router.replace({ path: "/StarBucks_ApprovalList" });
    }
  }
};
</script>

<style lang="stylus" scoped>
.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: bold;
  padding 10px;
}

.back {
  position absolute;
  bottom 20%;
}
</style>
