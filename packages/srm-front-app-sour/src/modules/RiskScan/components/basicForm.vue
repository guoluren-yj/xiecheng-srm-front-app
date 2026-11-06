<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <!-- 核价 -->
  <div>
    <div class="risk-scan-basic-info">
      <div class="risk-scan-basic-header">
        <div>
          <div>
            <span style="font-size: 14px;color: #333333;font-weight: 500;">
              {{ companyDetail.stdFormatName || `上海甄云信息科技有限公司` }}
            </span>
            <span
              :style="{ background: companyDetail && companyDetail.stdStatus &&
                          (companyDetail.stdStatus.includes(`存续`) ||
                            companyDetail.stdStatus.includes(`在营`) ||
                            companyDetail.stdStatus.includes(`开业`)) ? 'rgba(71,184,131,0.15)' : '#F2F3F5',
                        color: companyDetail &&
                          companyDetail.stdStatus &&
                          (companyDetail.stdStatus.includes(`存续`) ||
                            companyDetail.stdStatus.includes(`在营`) ||
                            companyDetail.stdStatus.includes(`开业`)) ? '#179454' : '#333',
                        padding: '1px 2px',
                        borderRadius: '2px',
                        marginLeft: '8px',
                        fontWeight: '600',
                        fontSize: '12px',
                        display: companyDetail && companyDetail.stdStatus ? '' : 'none'}">
              {{ companyDetail.stdStatus || '' }}
            </span>
          </div>
          <div class="risk-scan-tag-list">
            <span
              v-for="(item, index) in companyDetail.stdHistoryNames"
              v-if="companyDetail && companyDetail.stdHistoryNames && companyDetail.stdHistoryNames.length"
              :key="`name_${index}`"
              class="risk-scan-report-tag"
              style="color: #4E5769; background: #F2F3F5; border: 1px solid rgba(201,205,212,1);">
              {{ item }}
            </span>

            <span
              class="risk-scan-report-tag"
              :style="{
                color: '#0161D5',
                background: 'rgba(10,125,245,0.15)',
                display: companyDetail && companyDetail.stdEconKind ? '' : 'none',
              }">
              {{ companyDetail.stdEconKind || '' }}
            </span>

            <span
              v-for="(item, index) in companyDetail.stdTags"
              v-if="companyDetail && companyDetail.stdTags && companyDetail.stdTags.length"
              :key="`name_${index}`"
              class="risk-scan-report-tag"
              style="color: #F06200; background: rgba(255,120,0,0.15);">
              {{ item }}
            </span>
          </div>
        </div>
        <div :class="levelMap[companyDetail.riskLevel || 0]">
          <div class="score-row">{{ companyDetail.score || 0 }}</div>
          <div class="level-word-row">{{ valueMap[companyDetail.riskLevel || 0] }}</div>
        </div>
      </div>
      <div class="risk-scan-form-panel">
        <div class="risk-scan-form-item">
          <span class="form-item-title">{{ $T('sdat.riskScanReport.view.title.uscc').$D('统一社会信用代码') }}: </span>
          <span class="form-item-value">{{ companyDetail.stdCreditNo || '' }}</span>
        </div>
        <div class="risk-scan-form-item">
          <span class="form-item-title">{{ $T('sdat.riskScanReport.view.title.industry').$D('所属行业') }}: </span>
          <span class="form-item-value">{{ companyDetail.stdDomain || '' }}</span>
        </div>
        <div class="risk-scan-form-item">
          <span class="form-item-title">
            {{ $T('sdat.riskScanReport.view.title.legalRepresent').$D('法定代表人') }}:
          </span>
          <span class="form-item-value">{{ companyDetail.stdOperName || '' }}</span>
        </div>
        <div class="risk-scan-form-item">
          <span class="form-item-title">{{ $T('sdat.riskScanReport.view.title.businessType').$D('企业类型') }}: </span>
          <span class="form-item-value">{{ companyDetail.stdEconKind || '' }}</span>
        </div>
        <div class="risk-scan-form-item">
          <span class="form-item-title">
            {{ $T('sdat.riskScanReport.view.title.registeredCapital').$D('注册资本') }}:
          </span>
          <span class="form-item-value">{{ companyDetail.stdRegistCapi || '' }}</span>
        </div>
        <div class="risk-scan-form-item">
          <span class="form-item-title">{{ $T('sdat.riskScanReport.view.title.paidInCapital').$D('实缴资本') }}: </span>
          <span class="form-item-value">{{ companyDetail.stdActualCapi || '' }}</span>
        </div>
        <div class="risk-scan-form-item">
          <span class="form-item-title">
            {{ $T('sdat.riskScanReport.view.title.operatingPeriod').$D('营业期限') }}:
          </span>
          <span class="form-item-value">
            {{ `${companyDetail.stdTermStart || ''} - ${companyDetail.stdTermEnd || ''}` }}
          </span>
        </div>
        <div class="risk-scan-form-item" style="display: flex; justify-content: space-between;">
          <div>
            <span class="form-item-title">{{ $T('sdat.riskScanReport.view.title.creationDate').$D('成立日期') }}: </span>
            <span class="form-item-value">{{ companyDetail.stdStartDate || '' }}</span>
          </div>

          <div style="margin-right: auto;">
            <span class="form-item-title" style="margin-left: 10px;">
              {{ $T('sdat.riskScanReport.view.title.approvalDate').$D('核准日期') }}:
            </span>
            <span class="form-item-value">{{ companyDetail.stdCheckDate || '' }}</span>
          </div>
        </div>
        <div class="risk-scan-form-item">
          <span class="form-item-title">
            {{ $T('sdat.riskScanReport.view.title.registrationAuthority').$D('登记机关') }}:
          </span>
          <span class="form-item-value">{{ companyDetail.stdBelongOrg || '' }}</span>
        </div>
        <div class="risk-scan-form-item">
          <span class="form-item-title">{{ $T('sdat.riskScanReport.view.title.regisAddress').$D('注册地址') }}: </span>
          <span class="form-item-value">{{ companyDetail.stdAddress || '' }}</span>
        </div>
        <div class="risk-scan-form-item">
          <span class="form-item-title">{{ $T('sdat.riskScanReport.view.title.businessScope').$D('经营范围') }}: </span>
          <span class="form-item-value">{{ companyDetail.stdScope || '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  modules: [ "sdat.riskScanReport", "sdat.riskProfile" ],
  name: "BasicForm",
  props: {
    companyDetail: {
      type: Object,
    },
  },
  data() {
    return {
      levelMap: {
        1: "low-score-area",
        2: "middle-score-area",
        3: "high-score-area",
      },
      valueMap: {
        1: this.$T("sdat.riskProfile.view.title.lowRisk").$D("低风险"),
        2: this.$T("sdat.riskProfile.view.title.middleRisk").$D("中风险"),
        3: this.$T("sdat.riskProfile.view.title.highRisk").$D(""),
      }
    };
  },
  computed: {},
  async mounted() {

  },
  methods: {},
};
</script>
<style lang="stylus" scoped>
  .risk-scan-basic-info {
    .risk-scan-basic-header {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
    }

    .risk-scan-form-panel {
      border-top: 1px solid #F6F6F6;
      padding: 10px 15px;
    }
  }

  .risk-scan-tag-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 4px;
  }

  .risk-scan-report-tag {
    padding: 2px;
    border-radius: 2px;
    margin: 1px 8px 1px 0;
    font-size: 10px;
    display: flex;
    align-items: center;
  }

  .score-row {
    font-size:14px;
    font-weight: 500;
  }

  .level-word-row {
    font-size: 12px;
    font-weight: 400;
  }

  .low-score-area {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 44px;
    height: 44px;
    color: #179454;
    background-color: rgba(71, 184, 131, 0.1);
    border-radius: 3.6px;
  }

  .middle-score-area {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 44px;
    height: 44px;
    color: #f06200;
    background-color: rgba(242, 128, 26, 0.1);
    border-radius: 3.6px;
  }

  .high-score-area {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 44px;
    height: 44px;
    color: #e64322;
    background-color: rgba(242, 85, 53, 0.1);
    border-radius: 3.6px;
  }

  .risk-scan-form-item {
    margin: 8px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .form-item-title {
      font-size: 12px;
      color: #868D9C;
      line-height: 16px;
      font-weight: 400;
    }

    .form-item-value {
      font-size: 12px;
      color: #333333;
      line-height: 16px;
      font-weight: 400;
    }
  }
</style>