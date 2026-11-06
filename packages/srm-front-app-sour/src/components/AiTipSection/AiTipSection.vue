<template>
  <div v-if="aiApproveStatus">
    <div class="slip">
      <div :class="['container', getBackground]">
        <div class="container-icon">
          <img class="container-img" src="@/assets/check_res.svg" alt >
        </div>
        <div class="container-content">
          <div class="content-top">
            <div :class="['content-word', getFontColor]">{{ getContent }}</div>
            <div v-if="['REJECTED', 'APPROVED', 'APPROVED_SUGGEST', 'FAIL'].includes(aiApproveStatus)" @click="handleReviewResult"><em class="srm-icon icon-chevron-right" /></div>
          </div>
          <div v-if="['REJECTED', 'APPROVED', 'APPROVED_SUGGEST', 'FAIL'].includes(aiApproveStatus)" class="content-bottom">{{ showTime }}</div>
          <div v-else class="content-bottom">{{ getDescription }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { $T } from "srm-mobile-ui";
import { formatDateTime } from "hips/lib/utils";
import AiCheckComp from "../AiCheckComp/AiCheckComp.vue";

export default {
  name: "AiTipSection",
  modules: [ "sodr.common", "sodr.workspace", "smbl.checkRules", "hzero.common", "hipspfm.common", "srm.common" ],
  props: {
    aiApproveStatus: {
      type: String,
      default: "",
    },
    aiReviewParams: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
      showTime: formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
  },
  computed: {
    // 获取背景色
    getBackground() {
      let className;
      switch (this.aiApproveStatus) {
      case "APPROVING":
        className = "aiPreReviewCompleting";
        break;
      case "REJECTED":
        className = "aiPreReviewUnCompleted";
        break;
      case "APPROVED":
        className = "aiPreReviewCompleted";
        break;
      case "APPROVED_SUGGEST":
        className = "aiPreReviewCompletedSuggest";
        break;
      case "FAIL":
        className = "aiPreReviewCompletedSuggest";
        break;
      default:
        break;
      }
      return className;
    },
    // 智能预审提示词字体色
    getFontColor() {
      let color;
      switch (this.aiApproveStatus) {
      case "APPROVING":
        color = "aiPreReviewCompletingColor";
        break;
      case "REJECTED":
        color = "aiPreReviewUnCompletedColor";
        break;
      case "APPROVED":
        color = "aiPreReviewCompletedColor";
        break;
      case "APPROVED_SUGGEST":
        color = "aiPreReviewCompletedSuggestColor";
        break;
      case "FAIL":
        color = "aiPreReviewCompletedSuggestColor";
        break;
      default:
        break;
      }
      return color;
    },
    // 智能预审内容
    getContent() {
      let content;
      switch (this.aiApproveStatus) {
      case "APPROVING":
        content = $T("sodr.common.model.common.approving").$D("智能预审中");
        break;
      case "REJECTED":
        content = $T("sodr.common.model.common.rejected").$D("智能预审不通过");
        break;
      case "APPROVED":
        content = $T("sodr.common.model.common.approved").$D("智能预审通过");
        break;
      case "APPROVED_SUGGEST":
        content = $T("sodr.common.model.common.approvedSuggest").$D("智能预审通过（有建议）");
        break;
      case "FAIL":
        content = $T("srm.common.model.common.approveFail").$D("智能审核失败");
        break;
      default:
        break;
      }
      return content;
    },
    // 智能预审描述
    getDescription() {
      let description = "";
      switch (this.aiApproveStatus) {
      case "APPROVING":
        description = $T("sodr.workspace.view.workspace.reviewing").$D("正在为您生成预审结果，请稍等片刻");
        break;
      // case "FAIL":
      //   description = $T("sodr.workspace.view.workspace.resultFailed").$D("大数据模型未返回智能审核结果，请联系运维经理处理");
      //   break;
      default:
        break;
      }
      return description;
    }
  },
  methods: {
    // 智能审核弹框
    handleReviewResult() {
      this.$popup({
        showHeader: false,
        showClose: false,
        position: "bottom",
        showBack: true,
        height: "80%",
        content: <AiCheckComp bindObjList={this.aiReviewParams} />,
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.slip{
  width: 100vw;
  background-color: #f6f6f6 !important;
  border-top: 1px solid rgba(255, 0, 0, 0);
}
.container{
  display: flex;
  justify-self: center;
  width: calc(100vw - 16px);
  border-radius: 6px;
  margin-top: 8px;
  border: 1px solid rgba(255,255,255,1);
}

.aiPreReviewUnCompleted{
  background-image: linear-gradient(180deg, #FFEFED 0%, #FFFFFF 100%);
}

.aiPreReviewCompleting{
  background-image: linear-gradient(180deg, #EFF3FE 0%, #FFFFFF 100%);
}

.aiPreReviewCompleted{
  background-image: linear-gradient(180deg, #E6F2ED 0%, #FFFFFF 100%);
}

.aiPreReviewCompletedSuggest{
  background-image: linear-gradient(180deg, #FFFAF0 0%, #FFFFFF 100%);
}

.content-word{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}

.aiPreReviewUnCompletedColor{
  color: #E11900;
}

.aiPreReviewCompletingColor{
  color: #276EF1;
}

.aiPreReviewCompletedColor{
  color: #05944F;
}

.aiPreReviewCompletedSuggestColor{
  color: #FFC043;
}

.container-icon{
  margin-left: 16px;
  margin-top: 16px
}

.container-img{
  width: 40px;
  height: 40px;
}

.container-content{
  height: 100%;
  margin-left: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.content-top{
  width: calc(100vw - 124px)
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-bottom{
  margin-top: 4px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #757575;
  line-height: 16px;
  font-weight: 400;
}
</style>