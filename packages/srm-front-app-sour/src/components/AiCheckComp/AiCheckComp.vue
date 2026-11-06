<template>
  <div style="height: 100vh">
    <!-- 审核页面头 -->
    <div class="ai-check-header-content">
      <div class="ai-check-header-content-top">
        <img src="@/assets/check_res.svg" alt="" width="60" height="58" >
        <div>
          <div class="ai-check-header-title">
            {{ $T("smbl.checkRules.view.title.checkRuleTitle").$D("智能审核") }}
          </div>
          <div class="ai-check-header-desc">
            {{
              $T("smbl.checkRules.view.message.aiAlertMsg").$D(
                "内容由 AI 生成，仅供参考，您据此所作判断及操作均由您自行承担责任",
              )
            }}
          </div>
        </div>
      </div>
      <div class="ai-check-header-content-bottom">
        <div class="ai-check-header-content-bottom-item">
          <div class="ai-check-header-content-bottom-item-title">
            {{
              $T("smbl.checkRules.view.message.aiCheckResult1").$D(
                "智能预审结果",
              )
            }}
          </div>
          <div>
            <span
              :class="statusClassMap[checkResult && checkResult.approveResult]">{{
              statusLabelMap[checkResult && checkResult.approveResult]
            }}</span>
          </div>
        </div>
        <div style="height: 1px; background-color: #f6f6f6; margin: 8px 0" />
        <div class="ai-check-header-content-result-card">
          <div class="ai-check-header-content-result-card-item">
            <div>
              <span
                style="
                  margin-right: 4px;
                  font-size: 16px;
                  color: #05944f;
                  font-weight: 500;
                  line-height: 22px;
                ">{{ approveList.length || 0 }}</span>{{ $T("smbl.checkRules.view.message.passedCount").$D("笔") }}
            </div>
            <div>
              {{
                $T("smbl.checkRules.view.message.statusApproved").$D("审核通过")
              }}
            </div>
          </div>

          <div class="ai-check-header-content-result-card-item">
            <div>
              <span
                style="
                  margin-right: 4px;
                  font-size: 16px;
                  color: #e11900;
                  font-weight: 500;
                  line-height: 22px;
                ">{{ rejectList.length || 0 }}</span>{{ $T("smbl.checkRules.view.message.passedCount").$D("笔") }}
            </div>
            <div>
              {{
                $T("smbl.checkRules.view.message.statusRejected").$D(
                  "审核不通过",
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <srm-scroll-tab v-if="hasResult">
      <!-- 审核不通过列表 -->
      <srm-scroll-tab-item
        v-if="rejectList.length > 0"
        :key="1"
        :label="
          $T('smbl.checkRules.view.message.rejectedList').$D('不通过清单')
        ">
        <ul>
          <ai-check-result
            code="SMBL.AI_CHECK_RESULT_REJECTED_LIST"
            :data-set="rejectDS"
            :columns="columns"
            :all-list="rejectList"/>
        </ul>
      </srm-scroll-tab-item>
      <!-- 审核通过列表 -->
      <srm-scroll-tab-item
        v-if="approveList.length > 0"
        :key="2"
        :label="$T('smbl.checkRules.view.message.approvedList').$D('通过清单')">
        <ul>
          <ai-check-result
            code="SMBL.AI_CHECK_RESULT_APPROVED_LIST"
            :data-set="approveDS"
            :columns="columns"
            :all-list="approveList"/>
        </ul>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="executeList.length > 0"
        :key="3"
        :label="
          $T('smbl.checkRules.view.message.approvingList').$D('审批中清单')
        ">
        <ul>
          <ai-check-result
            code="SMBL.AI_CHECK_RESULT_EXECUTING_LIST"
            :data-set="executeDS"
            :columns="columns"
            :all-list="executeList"/>
        </ul>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <no-content
      v-else
      :title="'hzero.common.message.data.none'"
      img-src="NoResult@3x.png"/>
  </div>
</template>

<script>
import { DataSet, $T, SrmListHeader } from "srm-mobile-ui";
import { fetchCheckResult, queryMapIdpValue } from "./api/aiCheck";
import AiCheckResult from "./components/aiCheckResult.vue";
import { resultTableDS } from "./datasource/resultTabData";
import NoContent from "../NoContent";

export default {
  modules: [ "smbl.checkRules", "hzero.common", "hipspfm.common" ],
  name: "AiCheckComp",
  components: { AiCheckResult, NoContent },
  props: {
    bindObjList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkResult: {},
      rejectDS: new DataSet(),
      approveDS: new DataSet(),
      executeDS: new DataSet(),
      rejectList: [],
      approveList: [],
      executeList: [],
      statusLabelMap: {
        APPROVED: this.$T("smbl.checkRules.view.message.approved").$D("通过"),
        REJECTED: this.$T("smbl.checkRules.view.message.rejected").$D("不通过"),
        APPROVED_SUGGEST: this.$T(
          "smbl.checkRules.view.message.approvedSuggest",
        ).$D("审核通过(有建议)"),
      },
      statusClassMap: {
        APPROVED: "status-count-approved",
        REJECTED: "status-count-rejected",
        APPROVED_SUGGEST: "status-count-approved-suggest",
      },
      statusTagMap: {
        EXECUTING: "alert", // 执行中
        FAIL: "rejected", // 审核失败
        APPROVED: "passed", // 审核通过
        REJECTED: "check", // 审核拒绝
        APPROVED_SUGGEST: "alert", // 审核通过(有建议)
      },
      strategyTypeMap: {},
      finalResultMsg: {},
      valueStyle: {
        control: "rejected", // 强控
        noticeOnly: "noticeOnly", // 提醒
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          formRow: 1,
          fieldCode: "headerRow",
          fieldType: "EMPTY",
          render: (val, data) =>
            <SrmListHeader>
              <span>{data.ruleName}</span>
              <span slot="right" class={this.statusTagMap[data.approveStatus]}>
                {this.finalResultMsg[data.approveStatus]}
              </span>
            </SrmListHeader>
          ,
        },
        {
          formRow: 20,
          fieldName: $T("smbl.checkRules.model.checkScope").$D("审核范围"),
          fieldCode: "displayName",
        },
        {
          formRow: 30,
          fieldName: this.$T("smbl.checkRules.model.ruleStrength").$D(
            "规则强度",
          ),
          fieldCode: "ruleControlStrategy",
          render: (val) =>
            <span class={this.valueStyle[val]}>
              {this.strategyTypeMap[val]}
            </span>
          ,
        },
        {
          formRow: 40,
          fieldName: $T("smbl.checkRules.model.ruleRequirements").$D(
            "规则要求",
          ),
          fieldCode: "ruleDetail",
        },
        {
          formRow: 50,
          fieldName: this.$T("smbl.checkRules.model.matchResult").$D(
            "匹配结果",
          ),
          fieldCode: "executeResult",
        },
      ];
    },
    hasResult() {
      return (
        this.rejectList.length > 0 ||
        this.approveList.length > 0 ||
        this.executeList.length > 0
      );
    },
  },
  activated() {},
  mounted() {
    this.approveDS = new DataSet(resultTableDS());
    this.executeDS = new DataSet(resultTableDS());
    this.rejectDS = new DataSet(resultTableDS());

    this.fetchLookupData();
    this.getCheckResult({ bindList: this.bindObjList });
  },
  methods: {
    async fetchLookupData() {
      const res = await queryMapIdpValue({
        strategyList: "SMBL.CHECK_RULES_STRATEGY",
        finalResultList: "SMBL.CHECK_RESULT_STATUS",
      }).catch((err) => {
        throw err;
      });
      if (!res) {
        return;
      }
      if (!res.failed) {
        const { strategyList = [], finalResultList = [] } = res;
        const obj = {};

        strategyList.forEach((item) => {
          obj[item.value] = item.meaning;
        });

        const obj2 = {};
        finalResultList.forEach((item) => {
          obj2[item.value] = item.meaning;
        });
        this.strategyTypeMap = { ...obj };
        this.finalResultMsg = { ...obj2 };
      } else {
        this.$notification.open({ message: res.message });
      }
    },
    async getCheckResult({ bindList, field = "ruleName,DESC" }) {
      if (!bindList || bindList.length === 0) {
        return;
      }

      this.$loading.show();
      const res = await fetchCheckResult({
        queryList: [ ...bindList ],
        sort: field || "",
        page: -1,
        size: 10,
      });
      this.$loading.hide();

      if (res?.records && res?.records?.length > 0) {
        const rejectList =
          res?.records?.filter(
            (item) =>
              item.approveStatus === "REJECTED" ||
              item.approveStatus === "APPROVED_SUGGEST",
          ) || [];
        this.rejectList = [ ...rejectList ];

        this.approveList = [
          ...res?.records?.filter(
            (item) => item.approveStatus === "APPROVED",
          ) || [],
        ];

        this.executeList = [
          ...res?.records?.filter(
            (item) => item.approveStatus === "EXECUTING",
          ) || [],
        ];
      }
      this.checkResult = res ? { ...res } : {};
    },
  },
};
</script>

<style lang="stylus" scoped>
.ai-check-page-header {
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
}

.ai-check-header-content {
    padding: 20px;
    background-image: linear-gradient(180deg, rgba(39,110,241,0.20) 0%, rgba(39,110,241,0.00) 100%);

  .ai-check-header-content-top {
    display: flex;
    align-items: center;
  }

  .ai-check-header-title {
    font-size: 16px;
    color: #333333;
    line-height: 24px;
    font-weight: 500;
  }

  .ai-check-header-desc {
    font-size: 12px;
    color: #757575;
    line-height: 18px;
    font-weight: 400;
  }

  .ai-check-header-content-bottom {
    margin-top: 12px;
    padding: 12px 20px;
    border-radius: 6px;
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(117,117,117,0.08);
  }

  .ai-check-header-content-bottom-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ai-check-header-content-bottom-item-title {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-weight: 500;
  }
}

.ai-check-header-content-result-card {
  display: flex;
}

.status-count-approved-suggest {
  padding: 2px 4px;
  font-size: 12px !important;
  color: #FFC043;
  line-height: 16px;
  font-weight: 500;
  border-radius: 2px;
  background: #FFFAF0;
}

.status-count-rejected {
  padding: 2px 4px;
  font-size: 12px !important;
  color: #E11900;
  line-height: 16px;
  font-weight: 500;
  border-radius: 2px;
  background: #FFEFED;
}

.status-count-approved {
  padding: 2px 4px;
  font-size: 12px !important;
  color: #05944F;
  line-height: 16px;
  font-weight: 500;
  border-radius: 2px;
  background: #E6F2ED;
}

.ai-check-header-content-result-card-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #757575;
  line-height: 18px;
  font-weight: 400;

  &:first-child {
    border-right: 1px solid #F6F6F6;
    padding-right: 12px;
  }

  &:last-child {
    padding-left: 12px;
  }
}

.passed {
  padding: 2px 4px;
  background: rgba(71, 184, 131, 0.15);
  border-radius: 2px;
  font-size: 12px;
  color: #179454;
  line-height: 16px;
  font-weight: 600;
}

.rejected {
  padding: 2px 4px;
  background: #FFEFED;
  border-radius: 2px;
  font-size: 12px;
  color: #E11900;
  line-height: 16px;
  font-weight: 600;
}

.noticeOnly {
  padding: 1px 4px;
  font-size: 12px;
  color: #f06200;
  line-height: 18px;
  font-weight: 400;
  background: rgba(255, 120, 0, 0.15);
  border-radius: 2px;
}

.check {
  padding: 2px 4px;
  background: #FFEFED;
  border-radius: 2px;
  font-size: 12px;
  color: #E11900;
  line-height: 16px;
  font-weight: 600;
}

.alert {
  padding: 2px 4px;
  font-size: 12px;
  color: #FFC043;
  line-height: 16px;
  font-weight: 400;
  background: #FFFAF0;
  border-radius: 2px;
}
</style>
