<template>
  <div style="height: 100vh">
    <div class="risk-scan-page-header">
      <div class="arrow-icon srm-icon icon-chevron-left" @click="() => $router.back(-1)" />
      <div class="risk-scan-header-title">
        {{ $T('sdat.riskScanReport.view.title.riskScan').$D('风险扫描') }}
      </div>
    </div>

    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="$T('sdat.riskScanReport.view.title.basicInfo').$D('基础信息')">
        <ul>
          <basic-form :company-detail="basicInfo" />
        </ul>
      </srm-scroll-tab-item>
      <!-- 风险扫描结果 -->
      <srm-scroll-tab-item :label="$T('sdat.riskScanReport.view.title.riskScanResult').$D('风险扫描结果')">
        <ul style="padding: 10px;">
          <risk-scan-result :results="riskResults" />
        </ul>
      </srm-scroll-tab-item>
      <!-- 风险扫描分析 -->
      <srm-scroll-tab-item :label="$T('sdat.riskScanReport.view.title.riskScanAnalysis').$D('风险扫描分析')">
        <ul style="padding: 16px 15px;">
          <risk-scan-dynamic-table :results="dynamicArray" :data-source="tableDataMap" :level-map="levelMap" />
        </ul>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { fetchRiskDetail, fetchDynamicUrl, queryIdpValue, fetchDynamicTable } from "../api/riskScan";

import { getResultTab } from "../datasource/resultTabData";
import BasicForm from "../components/basicForm.vue";
import RiskScanResult from "../components/riskScanResult.vue";
import RiskScanDynamicTable from "../components/riskScanDynamicTable.vue";
// import RiskResultPanel from "../../../components/RiskResultPanel/Result.vue";

export default {
  modules: [ "sdat.riskScanReport", "sdat.riskProfile", "hzero.common", "sdat.riskTroubleshoot" ],
  name: "RiskScan",
  components: { BasicForm, RiskScanResult, RiskScanDynamicTable },
  data() {
    return {
      basicInfo: {},
      results: [],
      riskResults: [],
      dynamicResults: [],
      levelMap: {},
      tableDataMap: {},
      dynamicArray: [],
    };
  },
  activated() {
    const {
      tenantId = ""
    } = this.$route.query;

    queryIdpValue({
      tenantId,
      lovCode: "SDAT.WORKBENCH_EVENT_LEVEL",
    }).then((res) => {
      if (Array.isArray(res) && res.length) {
        const map = {};
        res.forEach((item) => {
          map[item.value] = item.meaning;
        });
        this.levelMap = map;
      }
    });
  },
  mounted() {
    const {
      passport = "",
      keyWord = "",
      tenantId = ""
    } = this.$route.query;
    this.fetchCompanyDetail({ passport, keyWord, tenantId });
    this.fetchDynamicResult({ passport, keyWord, tenantId });
  },
  methods: {
    async fetchCompanyDetail(params) {
      this.$loading.show();
      const res = await fetchRiskDetail(params);
      this.$loading.hide();
      this.basicInfo = res;
    },
    async fetchDynamicResult({ passport, keyWord, tenantId }) {
      const resultTab = getResultTab();
      const arr = await fetchDynamicUrl({ tenantId });

      if (Array.isArray(arr) && arr.length) {
        resultTab.forEach((item) => {
          arr.forEach((obj) => {
            if (item.url && obj.key && item.url === obj.key) {
              this.dynamicResults.push({
                ...item,
                riskLevel: obj.riskLevel || "",
                levelCount: obj.levelCount || 0,
                level: obj.level || "",
              });
            }
          });
        });

        this.results = [ ...this.dynamicResults ];

        if (this.dynamicResults.length) {
          this.dynamicResults.forEach(async (item) => {
            const fields = [];

            if (item.fields && item.fields.length) {
              item.fields.forEach((field) => {
                fields.push({
                  name: field.fieldName,
                });
              });
            }

            try {
              const res = await fetchDynamicTable({
                tenantId,
                fetchUrl: item.url,
                keyWord,
                passport,
              });

              this.results.forEach((item2) => {

                if (item2.id === item.id) {
                  if (
                    [
                      "/change-records",
                      "/case-detail",
                      "/court-notice",
                      "/judgment-document",
                      "/certificate",
                    ].includes(item2.url)
                  ) {
                    this.$set(item2, "levelList", res.levelList || []);
                    this.$set(item2, "count", res && res.changeList ? res.changeList.length : 0);
                    this.tableDataMap[item.id] = res && res.changeList ? [ ...res.changeList || [] ] : [];
                  } else {
                    this.$set(item2, "count", res.totalElements || res.total || 0);
                    this.tableDataMap[item.id] = res && res.content ? [ ...res.content || [] ] : [];
                  }
                }
              });
            } catch (error) {
              this.results.forEach((item2) => {
                if (item2.id === item.id) {
                  // 接口响应失败
                  item2.fetchFailed = error;
                }
              });
            }
          });
        }

        this.riskResults = this.results;
        this.dynamicArray = this.dynamicResults;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.risk-scan-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  height: 44px;
  background: #fff;
  font-size: 18px;
  font-weight: 500;

  .arrow-icon {
    width: 24px;
    height: 24px;
    line-height: 24px;
    font-size: 24px;
    color: #333;
    margin-right: auto;
    border-radius: 50%;
    &:hover {
      background: #F7F8FA;
    }
  }

  .risk-scan-header-title {
    margin-right: auto;
    margin-left: -33px;
  }
}


</style>
