<template>
  <srm-popup
    height="100%"
    width="100%"
    position="right"
    :visible="value"
    :title="$T('hipspfm.workFlowbidHal.view.message.title.ladderQuotationDetails').$D('招标书结果审批明细')"
    @onClose="$emit('input',false)">
    <div class="lineInfoDetail">
      <srm-detail-head :data-source="scoreDetail" :columns="getHeadColumns"/>
      <h3>{{ scoreDetail.itemCode }}-{{ scoreDetail.itemName }}</h3>
      <div>
        <customize-detail :need-padding="true" :columns="getScoreDetailColumns" :data-source="scoreDetail"/>
      </div>
      <div class="lineBody">
        <ul v-for="(li,key) in moreScoreDetail" :key="key">
          <customize :need-padding="true" :columns="getColumns" :data-source="li"/>
        </ul>
      </div>
    </div>
  </srm-popup>
</template>

<script>
import {
  getCalibrationScroeDetailApi,
} from "../api/Jin";
import { SrmListHeader } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.workFlowbidHal", "ssrc.bidHall", "hipspfm.common" ],
  name: "CalibrationScoreDetail",
  components: {
  },
  props: {
    value: {
      type: Boolean
    },
    scoreDetail: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  data() {
    return {
      moreScoreDetail:[],
    };
  },
  computed:{
    //详情头
    getHeadColumns() {
      const columns = [
        {
          fieldCode: "bidNum",
        },
        {
          fieldCode: "bidTitle",
        },
      ];

      return columns;
    },
    getScoreDetailColumns() {
      const columns = [
        {
          fieldName:this.$T("ssrc.bidHall.model.bidHall.supplierName").$D("名称"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName:this.$T("ssrc.bidHall.model.bidHall.sectionName").$D("标段名称"),
          fieldCode: "sectionName",
        },
      ];

      return columns;
    },
    getColumns() {
      const columns = [
        {
          fieldCode: "indicateName",
          fieldType:"EMPTY",
          formRow:0,
          render:(val) => <SrmListHeader>
            <span>{this.$T("ssrc.bidHall.model.bidHall.indicateNames").$D("要素名称")}：{val}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.team").$D("所属组别"),
          fieldCode: "teamMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.weight").$D("权重"),
          fieldCode: "weight",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.averageScore").$D("平均分"),
          fieldCode: "averageScore",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.pass").$D("是否通过"),
          fieldCode: "passStatusMeaning",
        },
      ];
      return columns;
    }
  },
  watch:{
    scoreDetail:{
      handler() {
        this.$loading.show();
        this.getCalibrationScroeDetail();
      },
      deep:true
    }
  },
  mounted() {},
  methods: {
    getCalibrationScroeDetail() {
      getCalibrationScroeDetailApi(this.scoreDetail.evaluateSummaryId).then((res) => {
        if (res && !res.empty) {
          this.moreScoreDetail = res.content;
        }
        this.$loading.hide();
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
h3 {
    padding: 20px 20px 12px;
    font-size: 18px;
    color:var(--color-font-default,#1b1e2b);
    line-height: 26.1px;
    font-weight: 700;
    background:var(--color-bg-default-b);
  }
</style>
