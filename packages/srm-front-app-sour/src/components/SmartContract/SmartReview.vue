<template>
  <div class="smart-review-container">
    <div class="smart-review-header">
      <srm-switch-field
        type="primary"
        :default-value="passedReviewFlag"
        @inputChange="handPassedReview">
        <span
          slot="left">{{
          $T("spcm.common.view.title.showPassedReview").$D("显示已通过审查点") }}</span>
      </srm-switch-field>
    </div>
    <srm-blank
      size="1px"
      theme="fill"/>
    <div
      v-for="(item, index) in smartReviewInfo"
      :key="index"
      class="smart-review-item">
      <ul>
        <li class="name-title">
          {{ `${item.riskTypeMeaning}` }}
        </li>
        <srm-blank
          size="1px"
          theme="fill"/>

        <!-- 个性化组件替换后的代码 -->
        <customize
          v-for="(data, idx) in item.treeList"
          :key="idx"
          :columns="getColumns(data)"
          :data-source="data"
          code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.SMART_REVIEW_INFO_C"/>
      </ul>
    </div>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { smartReviewDS } from "./datasource/SmartDS.js";

export default {
  modules: [ "spcm.common" ],
  name: "SmartReview",
  props: {
    passedReviewFlag: {
      type: Boolean,
      default: false,
    },
    headerInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      smartReviewInfo: [],
      smartReviewDs: new DataSet(smartReviewDS()),
      queryParams: {
        pcHeaderId: this.headerInfo?.pcHeaderId,
        sortField: "riskLevel",
        onlyPassFlag: 0,
        customizeUnitCode: "SMBL.WORKFLOW.AGREEMENT_APPROVAL.SMART_REVIEW_INFO_C",
      },
    };
  },
  watch: {
    headerInfo: {
      handler(newValue) {
        this.queryParams.pcHeaderId = newValue.pcHeaderId;
        this.querySmartReview();
      },
      deep: true
    },
  },
  created() {
    this.querySmartReview();
  },
  methods: {
    querySmartReview(params = {}) {
      this.smartReviewDs.setQueryParameter({
        ...this.queryParams,
        ...params,
      });
      this.smartReviewDs.refresh().then(() => {
        this.smartReviewInfo = this.smartReviewDs.toData();
      });
    },
    // 显示已通过审查点
    handPassedReview(value) {
      this.querySmartReview({ onlyPassFlag: value ? 1 : 0 });
    },
    getColumns(record) {
      const columns = [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.reviewName}
            <span slot="right">
              {item.ignoreFlag === 1 && <srm-tag style="margin-right: 4px;" size="small" type="info">{this.$T("spcm.common.model.common.ignoreFlag").$D("已忽略")}</srm-tag>}
              {item.reviewResult === "FAILED" && <img src={require("@/assets/icon_not_pass.svg")} />}
              {item.reviewResult === "PASSED" && <img src={require("@/assets/icon_pass.svg")} />}
            </span>
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("spcm.common.model.common.riskLevel").$D("风险等级"),
          fieldCode: "riskLevel",
          render: (val, item) => {
            switch (val) {
            case "HIGH":
              return <srm-tag type="danger">{item?.riskLevelMeaning}</srm-tag>;
            case "MIDDLE":
              return <srm-tag type="warn">{item?.riskLevelMeaning}</srm-tag>;
            case "LOW":
              return <srm-tag type="success">{item?.riskLevelMeaning}</srm-tag>;
            default:
              return "-";
            }
          },
        },
        {
          fieldCode: "locationField",
          fieldType: "TEXT",
          fieldName: this.$T("spcm.common.model.common.positionInfo").$D("定位信息"),
        },
        {
          fieldCode: "riskDescription",
          fieldName: this.$T("spcm.common.model.common.riskDesc").$D("风险说明"),
        },
        {
          fieldCode: "resolution",
          fieldName: this.$T("spcm.common.model.common.modifySuggestion").$D("修改建议"),
        },
        record?.ignoreFlag && {
          fieldCode: "ignoreReason",
          fieldType: "TEXT",
          fieldName: this.$T("spcm.common.model.common.ignoreReason").$D("忽略原因"),
        },
        record?.errorMessage && {
          fieldCode: "errorMessage",
          fieldType: "TEXT",
          fieldName: this.$T("spcm.common.model.common.errorMessage").$D("异常信息"),
        },
      ].filter(Boolean);
      return columns;
    },
  }
};
</script>

<style lang="stylus" scoped>
.smart-review-container {
  .smart-review-header {
    padding: 12px 15px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 400;
  }
}

.smart-review-item {
  >>> .customize {
    width: 100%;
    color: #333333;
    padding: 12px 15px;
    background: var(--color-bg-default);
    border-bottom: 1px solid var(--color-border-default);
  }

  >>> .srm-list-item-card-head-right {
    color: normal;
  }

  li {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #333333;
    line-height: 16px;
    font-weight: 500;
    padding: 10px 15px;
  }

  .distr {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #EFF3FE;
    border-radius: 2px;
    width: 44px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #276EF1;
    line-height: 20px;
    margin-right: 8px;
  }

  img {
    vertical-align: middle;
  }
}
</style>