<!-- eslint-disable vue/no-mutating-props -->
<template>
  <srm-popup
    v-loading="loading"
    :title="$T('ssrc.expertScoring.view.mobile.title.summary.score').$D('查看汇总评分')"
    :visible="value"
    height="100%"
    :show-back="true"
    :show-close="false"
    @onClose="$emit('handleClose')">
    <div class="bigContainer">
      <div v-if="dataSource.bidRuleType === 'DIFF' && ( dataSource.expertTeam === 'TECHNOLOGY' || dataSource.expertTeam === 'BUSINESS_TECHNOLOGY' )" class="score-container">
        <div class="team-title">{{ $T('ssrc.expertScoring.view.mobile.title.techTeamScore').$D('技术组总评分') }}</div>
        <srm-flex v-for="(supplierItem, supplierIndex) in dataSource.evaluateExpertSummaryDTOS" :key="supplierIndex" class="score-detail">
          <srm-flex-item flex="1" class="score-detail-name">
            {{ supplierItem.supplierCompanyName }}
          </srm-flex-item>
          <srm-flex-item class="score-detail-score">
            {{ (supplierItem.technologyTotalScore || supplierItem.technologyTotalScore === 0) ? supplierItem.technologyTotalScore : '-' }}
          </srm-flex-item>
        </srm-flex>
      </div>
      <div v-if="dataSource.bidRuleType === 'DIFF' && ( dataSource.expertTeam === 'BUSINESS' || dataSource.expertTeam === 'BUSINESS_TECHNOLOGY' )" class="score-container">
        <div class="team-title">{{ $T('ssrc.expertScoring.view.mobile.title.busTeamScore').$D('商务组总评分') }}</div>
        <srm-flex v-for="(supplierItem, supplierIndex) in dataSource.evaluateExpertSummaryDTOS" :key="supplierIndex" class="score-detail">
          <srm-flex-item flex="1" class="score-detail-name">
            {{ supplierItem.supplierCompanyName }}
          </srm-flex-item>
          <srm-flex-item class="score-detail-score">
            {{ (supplierItem.businessTotalScore || supplierItem.businessTotalScore === 0) ? supplierItem.businessTotalScore : '-' }}
          </srm-flex-item>
        </srm-flex>
      </div>
      <div v-if="dataSource.bidRuleType === 'NONE' || (dataSource.bidRuleType === 'DIFF' && dataSource.expertTeam === 'BUSINESS_TECHNOLOGY')" class="score-container">
        <div class="team-title">{{ $T('ssrc.expertScoring.view.mobile.title.totalScore').$D('合计总评分') }}</div>
        <srm-flex v-for="(supplierItem, supplierIndex) in dataSource.evaluateExpertSummaryDTOS" :key="supplierIndex" class="score-detail">
          <srm-flex-item flex="1" class="score-detail-name">
            {{ supplierItem.supplierCompanyName }}
          </srm-flex-item>
          <srm-flex-item class="score-detail-score">
            {{ (supplierItem.totalScore || supplierItem.totalScore === 0) ? supplierItem.totalScore : '-' }}
          </srm-flex-item>
        </srm-flex>
      </div>
    </div>
  </srm-popup>
</template>

<script>
export default {
  modules: [ "ssrc.expertScoring" ],
  name: "ScoreSummary",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed:{
  },
};
</script>

<style lang="stylus" scoped>
.bigContainer {
  position: relative;
  height: 100%;
  background-color: var(--color-border-default);
  .score-container {
    padding: 16px;
    border-bottom: 8px solid var(--color-border-default);
    background-color: var(--color-font-default-d);
    .team-title {
      margin-bottom: 12px;
      color: #333333;
    line-height: 20px;
    font-weight: 600;
    }
    .score-detail {
      margin-bottom: 12px;
      line-height: 20px;
      .score-detail-name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .score-detail-score {
        max-width: 48px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .score-detail:last-child {
      margin-bottom: 0
    }
  }
}
</style>
