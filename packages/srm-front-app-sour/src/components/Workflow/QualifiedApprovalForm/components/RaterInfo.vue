<template>
  <hips-popup v-model="value" style="height: 100%;width: 100%" position="right">
    <div>
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/back@3x.png" class="image-black-default" alt="">
        </div>
        <div slot="center" class="header">
          {{ $T('sslm.commonApplication.model.commonApplication.scoreInfo').$D('评分人信息') }}
        </div>
      </hips-nav-bar>
      <div class="lineInfoDetail">
        <customize-detail :data-source="ratingDetail" :columns="columns"
                          code="SMBL.WORKFLOW.QUALITY_APPROVAL.SUPPLY_EVAL_USER_INFO_DETAIL"/>
      </div>
      <srm-list v-if="ratingDetail.kpiEvalTplIndRespList && ratingDetail.kpiEvalTplIndRespList.length" :columns="getRateInfoColumns" :data-set="raterInfoDS" customize-code="SMBL.WORKFLOW.QUALITY_APPROVAL.SUPPLY_EVAL_USER_INFO_LIST"/>
    </div>
  </hips-popup>
</template>

<script>
import { View, Input, Popup, NavBar } from "hips";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common", "sslm.commonApplication" ],
  name: "RaterInfo",
  components: {
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
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
      raterInfoDS: new DataSet({
        autoQuery: false,
        selection: 0,
        pageSize: 10,
        editable: false,
        enableQuery: false,
        showTotalCount: false,
        // table表单显示的字段
        fields: [
          {
            fieldName: this.$T("sslm.commonApplication.model.coApp.userName").$D("用户名"),
            fieldCode: "respLoginName",
            fieldType: "TEXT",
          },
          {
            fieldName: this.$T("sslm.commonApplication.model.commonApplication.realNameDes").$D("用户描述"),
            fieldCode: "respUserName",
            fieldType: "TEXT",
          },
          {
            fieldName: this.$T("sslm.commonApplication.model.commonApplication.weight").$D("权重"),
            fieldCode: "respWeight",
            fieldType: "TEXT",
          },
          {
            fieldName: this.$T("sslm.commonApplication.model.coApp.processStatus").$D("状态"),
            fieldCode: "processStatusMeaning",
            fieldType: "TEXT",
          },
          {
            fieldName: this.$T("sslm.commonApplication.model.coApp.supEvaluationScore").$D("评分"),
            fieldCode: "score",
            fieldType: "TEXT",
          },
          {
            fieldName: this.$T("sslm.commonApplication.model.commonApplication.isStandard").$D("符合评分标准"),
            fieldCode: "isStandard",
            fieldType: "TEXT",
            render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
          },
          {
            fieldName: this.$T("sslm.commonApplication.model.score.scoreRemark").$D("评分说明"),
            fieldCode: "remark",
            fieldType: "TEXT",
          },
        ],
        transport: {},
      }),
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
      ]
    };
  },
  computed: {
    raterInfos() {
      return this.ratingDetail.kpiEvalTplIndRespList;
    }
  },
  mounted() {
    this.raterInfoDS.ref = this;
    this.raterInfoDS.setData(this.ratingDetail.kpiEvalTplIndRespList || []);
  },
  methods: {
    getRateInfoColumns() {
      return [
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.userName").$D("用户名"),
          fieldCode: "respLoginName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.realNameDes").$D("用户描述"),
          fieldCode: "respUserName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.weight").$D("权重"),
          fieldCode: "respWeight",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.processStatus").$D("状态"),
          fieldCode: "processStatusMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.supEvaluationScore").$D("评分"),
          fieldCode: "score",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.isStandard").$D("符合评分标准"),
          fieldCode: "isStandard",
          fieldType: "TEXT",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.score.scoreRemark").$D("评分说明"),
          fieldCode: "remark",
          fieldType: "TEXT",
        },
      ];
    },
    closePop() {
      this.$emit("input", false);
    }
  },
};
</script>

<style lang="stylus" scoped>

.lineInfoDetail {
  padding 15px;
}
</style>
