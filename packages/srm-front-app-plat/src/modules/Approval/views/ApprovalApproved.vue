<template>
  <div>
    <srm-flex justify="center" class="header">
      {{ $T("smbl.todo.view.todoApproved.title").$D("流程已审批") }}
    </srm-flex>
    <no-content
      img-src="NoOrder@3x.png"/>

    <srm-flex direction="row" justify="center" class="back">
      <!--      {{ $T("smbl.workFlow.view.todoApproved.backTip").$D("即将返回审批列表页") }} -->
      <!--      <srm-blank size="large"/> -->
      <srm-button @click="backToList">{{ $T("smbl.workFlow.button.backTip").$D("返回审批列表") }}({{ timeRemain }})</srm-button>
      <div style="width: 10px;color: white"/>
      <!-- 因存在外部系统待办、已办只接收一个url(待办跳转链接)的情况，当外部点击已办单据实际会跳转待办详情页并直接进入已办提示页；客户方希望仍然可以看到已办的单据详情，为兼容这个情况，此处开个口子支持从已办提示页进入已办详情页    -->
      <srm-button @click="toApprovedDetail">{{ $T("smbl.workFlow.button.approved.detail").$D("查看已办详情") }}</srm-button>
    </srm-flex>
  </div>
</template>

<script>
import NoContent from "@/components/NoContent";

export default {
  modules: [ "smbl.todo", "smbl.workFlow" ],
  name: "ApprovalApproved",
  components: {
    NoContent,
  },
  data() {
    return {
      timeRemain: 5,
      backTimer: null,
      processInstanceId: null
    };
  },
  mounted() {
    this.processInstanceId = this.$route.query.processInstanceId;
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
      this.$router.replace({ path: "/ApprovalList" });
    },
    toApprovedDetail() {
      this.$router.replace({ path: "/ApprovalDetail", query:{
        type:"involved",
        processInstanceId:this.processInstanceId
      } });
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
  bottom 30%;
}
</style>
