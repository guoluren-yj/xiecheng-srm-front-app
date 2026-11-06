<template>
  <hips-popup v-model="value" class="FullPop" style="height: 100%;width:100%" position="right">
    <div>
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/back@3x.png" class="image-black-default" alt="">
        </div>
        <div slot="center" class="header">{{ $T('sslm.common.model.score.detail').$D('评分明细') }}</div>
      </hips-nav-bar>
      <div class="lineInfoDetail">
        <customize-detail :columns="columns" :data-source="ratingDetail" code="SMBL.WORKFLOW.QUALITY_APPROVAL.SUPPLY_EVAL_INFO_DETAIL" />
      </div>
    </div>
    <!-- 评分人详情弹窗 -->
    <rater-info v-model="ratingInfoPop" :rating-detail="ratingDetail" />
  </hips-popup>
</template>

<script>
import RaterInfo from "./RaterInfo";
import { View, Input, Popup, NavBar } from "hips";
export default {
  modules: [ "hipspfm.workFlow", "sslm.common", "sslm.commonApplication", "hipspfm.common" ],
  name: "RatingDetail",
  components: {
    RaterInfo,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
  },
  props: {
    value: {
      type: Boolean
    },
    ratingDetail: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      ratingInfoPop: false,
      columns: [
        {
          fieldName: this.$T("sslm.commonApplication.model.score.goal").$D("得分"),
          fieldCode: "score",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indicateCode").$D("评价项目编号"),
          fieldCode: "indicatorCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.description").$D("评价项目"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.itemRemark").$D("评分标准"),
          fieldCode: "evalStandard",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.scoreType").$D("评分方式"),
          fieldCode: "scoreTypeMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indicatorType").$D("指标类型"),
          fieldCode: "receiveStatusMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.scoreFrom").$D("分值从"),
          fieldCode: "scoreFrom",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.scoreTo").$D("分值至"),
          fieldCode: "scoreTo",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indiScore").$D("指标分值"),
          fieldCode: "indicatorScore",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.scoreInfo").$D("评分人信息"),
          fieldCode: "indicatorScore",
          fieldType: "TEXT",
          render: () => this.$T("hipspfm.workFlow.view.message.message.viewGrader").$D("查看评分人"),
          callBack: () => {
            this.showRaterInfoPop();
          }
        },
      ]
    };
  },
  mounted() {},
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    showRaterInfoPop() {
      this.ratingInfoPop = !this.ratingInfoPop;
    }
  }
};
</script>

<style lang="stylus" scoped>
.font-blue {
  color: var(--color-other-default-b) !important;
}

.lineInfoDetail {
  padding 15px;
}
</style>
