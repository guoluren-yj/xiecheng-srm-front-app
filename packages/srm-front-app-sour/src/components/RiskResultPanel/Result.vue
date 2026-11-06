<template>
  <div>
    <div class="risk-profile-basic">
      <div class="risk-profile-toggle-row" @click="toggleStatus">
        <span class="srm-icon el-icon-error" style="margin-right: 8px; font-size: 16px;" />
        <div>{{ $T('sdat.riskTroubleshoot.view.title.riskTip').$D('风险提示') }}</div>
        <span
          v-if="showSpan"
          class="srm-icon icon-chevron-down"
          style="margin-left: 8px; cursor: pointer;"/>
        <span
          v-else
          class="srm-icon icon-chevron-down"
          style="margin-left: 8px; cursor: pointer;"/>
      </div>

      <div v-if="showSpan" style="margin-left: 24px; color: #F06200">
        <div class="risk-profile-row">
          <div class="risk-profile-row-title">
            {{ $T('sdat.riskTroubleshoot.view.title.troubleTime').$D('排查时间') }}:
          </div>
          <div class="risk-profile-row-content">{{ result.creationDate || '' }}</div>
        </div>

        <div class="risk-profile-row">
          <div class="risk-profile-row-title">
            {{ $T('sdat.riskTroubleshoot.view.title.investigationScope').$D('排查范围') }}
          </div>
          <div class="risk-profile-row-content">{{ result.companyData || '' }}</div>
        </div>

        <div class="risk-profile-row">
          <div class="risk-profile-row-title">
            {{ $T('sdat.riskTroubleshoot.view.title.relationType').$D('关系类型') }}:
          </div>
          <div class="risk-profile-row-content">
            <ul>
              <li>
                {{ $T('sdat.riskTroubleshoot.view.title.investmentRelations')
                  .$D('投资关系（股东、历史股东）') }}
              </li>
              ，&nbsp;&nbsp;
              <li>
                {{ $T('sdat.riskTroubleshoot.view.title.relationship')
                  .$D('任职关系（法定代表人、董监高、历史董监高）') }}
              </li>
              ，&nbsp;&nbsp;
              <li>
                {{ $T('sdat.riskTroubleshoot.view.title.contact')
                  .$D(
                    '联系方式（相同电话、相同邮箱、相同地址、历史相同电话、历史相同邮箱、历史相同地址）'
                  ) }}
              </li>
            </ul>
          </div>
        </div>

        <div class="risk-profile-row">
          <div class="risk-profile-row-title">
            {{ $T('sdat.riskTroubleshoot.view.title.shootingResults').$D('排查结果') }}：
          </div>
          <div class="risk-profile-row-content" style="display: flex">
            {{ result.relationResult || '' }}
          </div>
        </div>
        <div
          v-if="result && result.fileUrl"
          style="display: flex; align-items: center; cursor: pointer; font-size: 12px;"
          @click="handleDownLoad">
          <span
            class="srm-icon icon-link"
            style="margin-right: 4px;"/>
          <span style="text-decoration: underline;">{{ result.fileName || '' }}</span>
          <span style="margin-left: 4px;" class="srm-icon icon-download" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import { fetchRiskTroubleshoot } from "./api";

export default {
  modules: [ "sdat.riskTroubleshoot" ],
  name: "RiskResultPanel",
  data() {
    return {
      result: {},
      showSpan: false,
    };
  },
  props: {
    businessNumber: {
      type: String,
      default: '',
    },
    businessType: {
      type: String,
      default: '',
    },
    dataType: {
      type: String,
      default: '',
    },
    organizationId: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.getRiskTroubleshoot({
      businessNumber: this.businessNumber,
      businessType: this.businessType,
      dataType: this.dataType,
      organizationId: this.organizationId,
      lang: this.lang,
    });
  },
  methods: {
    toggleStatus() {
      this.showSpan = !this.showSpan;
    },
    async getRiskTroubleshoot(params) {
      this.$loading.show();
      const res = await fetchRiskTroubleshoot({
        ...params,
      });
      this.result = res ? { ...res } : {};
      this.$loading.hide();
    },
    handleDownLoad() {
      const {
        organizationId = "",
      } = this.$route.query;

      if (this.result && this.result.fileUrl) {
        const url = `/hfle/v1/${organizationId}/file-preview/by-url?url=${this.result.fileUrl
        }&bucketName=private-bucket&access_token=${SrmUtil.getUserToken()}`;
        const a = document.createElement("a");
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

.risk-profile-basic {
  padding: 8px 16px;
  background-color: rgba(242, 128, 26, 0.1);
  border-radius: 2px;

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    padding: 0;
    margin: 0;
    list-style: none;
    display: inline-block;
  }

  .risk-profile-toggle-row {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    color: #f06200;
    margin-bottom: 2px;
  }

  .risk-profile-row {
    line-height: 18px;
    margin: 10px 0;
    font-size: 12px;
    .risk-profile-row-title {
      font-weight: 600;
      float: left;
    }

    .risk-profile-row-content {
      line-height: 18px;
    }
  }
}
</style>