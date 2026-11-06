<template>
  <div class="detail-container">
    <srm-scroll-tab content-scroll>
      <srm-scroll-tab-item :label="$T('sslm.evaluationRecord.model.evaluationDocManage.baseInfo').$D('基本信息')">
        <srm-form
          :data-set="headerDataSet"
          :columns="getDetailHeaderColumns()"
          show-default-detail
          customize-code="SMBL.EVALUATE_ARCHIVES_FILL.DETAIL_HEADER"/>
      </srm-scroll-tab-item>
      <!-- 适配iphone mini小屏手机底部加载更多无法显示问题 -->
      <srm-scroll-tab-item class="last-tab-bottom-space-view"
                           :label="$T('sslm.evaluationRecord.model.evaluationDocManage.lineInfo').$D('行信息')"
                           :show-title="false">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ $T('sslm.evaluationRecord.model.evaluationDocManage.lineInfo').$D('行信息') }}
          <div class="srm-icon icon-filter" @click="showLineFilter = !showLineFilter"/>
        </div>
        <srm-list
          :data-set="lineDataSet"
          :columns="getDetailLineColumns()"
          :scrollable="false"
          customize-code="SMBL.EVALUATE_ARCHIVES_FILL.DETAIL_LINE"
          :show-bottom-bar="false"
          @itemClick="onLineItemClick"/>
        <srm-filter v-model="showLineFilter" :data-set="lineDataSet"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-bottom-handler :btn-arr="getButtons()"/>
  </div>
</template>

<script>

import { DataSet } from "srm-mobile-ui";
import headerMixin from "../mixins";
import detailLineDS from "../datasource/detailLineDS";
import { batchAbandon } from "../api";

export default {
  modules: [ "sslm.evaluationRecord", "sslm.common", "sslm.supplierDocManage", "smbl.common", "sslm.supplierReview" ],
  name: "EvaluateArchivesFillDetail",
  mixins: [ headerMixin ],
  data() {
    return {
      lineDataSet: new DataSet(detailLineDS(this.$route.query.evalHeaderId, this.lineDataSetAfterQuery, this.lineDataSetBeforeUpdate, this.lineDataSetBeforeSubmit)),
      showLineFilter: false,
    };
  },
  methods: {
    getButtons() {
      const { evalHeaderId } = this.$route.query;
      const buttons = [
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          type: "primary",
          handler: () => {
            this.$loading.show();
            this.lineDataSet.updateRecords(this.lineDataSet.records)
              .then(() => this.lineDataSet.refresh())
              .finally(() => this.$loading.hide());
          },
        },
        {
          title: this.$T("smbl.common.button.submit").$D("提交"),
          type: "primary",
          fill: true,
          handler: () => {
            this.$loading.show();
            this.lineDataSet.submitRecords(this.lineDataSet.records)
              .then(() => {
                this.$router.back();
              })
              .finally(() => this.$loading.hide());
          },
        },
      ];
      if (this.abandonFlag) {
        buttons.push({
          title: this.$T("sslm.common.view.button.giveUpScore").$D("放弃评分"),
          type: "danger",
          handler: () => {
            if (!this.lineDataSet.selected.length) {
              this.$notification.open({
                message: this.$T("sslm.supplierReview.view.message.minOneData").$D("请至少选择一条数据"),
              });
              return;
            }
            this.$loading.show();
            // const selectAllFlag = this.lineDataSet.selected.length === this.lineDataSet.records.length ? 1 : 0;
            const selectAllFlag = 0;
            batchAbandon(evalHeaderId, this.lineDataSet.selected.map((r) => r.toData()), [], selectAllFlag).then((res) => {
              if (!res || !res.failed) {
                if (selectAllFlag) {
                  this.$router.back();
                } else {
                  this.lineDataSet.refresh();
                }
              }
            }).finally(() => this.$loading.hide());
          },
        });
      }
      return buttons;
    },
    getDetailLineColumns() {
      const evalGranularity = this.$route.query.evalGranularity;
      // console.log("evalGranularity:", evalGranularity);
      return [
        {
          formRow: 1,
          fieldCode: "supplierNum",
          fieldType: "EMPTY",
          render: (val) => <srm-list-header>{val}</srm-list-header>,
        },
        { formRow: 10, fieldCode: "supplierName", },
        { formRow: 20, fieldCode: "erpSupplierNum", },
        { formRow: 30, fieldCode: "indicatorName", },
        { formRow: 40, fieldCode: "completeFlagMeaning", },
        { formRow: 40, fieldCode: "categoryName", visible: evalGranularity === "SU+CA" },
        { formRow: 40, fieldCode: "itemName", visible: evalGranularity === "SU+IT" },
        { formRow: 60, fieldCode: "evalStandard", },
        { formRow: 70, fieldCode: "backReason", },
        { formRow: 70, fieldCode: "indicatorType", render: (val) => this.indicatorType[val] || val },
        { formRow: 80, fieldCode: "finalScore", },
        { formRow: 80, fieldCode: "evalWeight", },
        { formRow: 100, fieldCode: "scoreFrom", },
        { formRow: 100, fieldCode: "scoreTo", },
        { formRow: 120, fieldCode: "isStandard", },
        { formRow: 130, fieldCode: "isVeto", },
        { formRow: 140, fieldCode: "evalTplIndOptId", },
        { formRow: 150, fieldCode: "remark", },
        { formRow: 160, fieldCode: "scorerAttachmentUuid", },
      ];
    },
    onLineItemClick() {
      const columns = this.getDetailLineColumns();
      columns[0] = {
        formRow: 1,
        fieldCode: "supplierNum",
        fieldType: "TEXT",
      };
      const popup = this.$popup({
        showHeader: false,
        position: "right",
        width: "100%",
        height: "100%",
        content: <SrmForm
          customizeType="detail"
          dataSet={this.lineDataSet}
          columns={columns}
          buttons={[ {
            text: this.$T("smbl.common.button.confirm").$D("确定"),
            type: "primary",
            handler: () => popup.closePopup(),
          } ]}
        />
      });
    },
    getDetailHeaderColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "evalNum",
          fieldType: "EMPTY",
          render: (val, item) => <srm-list-header>
            {val}
            <SrmButton slot="right" style={{ fontWeight: "bold" }} plain rect>{item.evalStatusMeaning}</SrmButton>
          </srm-list-header>,
        },
        { formRow: 10, fieldCode: "evalName", },
        { formRow: 20, fieldCode: "evalTplName", },
        { formRow: 30, fieldCode: "kpiMethod", render: (val) => this.kpiMethod[val] || val },
        { formRow: 30, fieldCode: "evalCycleMeaning", },
        { formRow: 40, fieldCode: "evalDateFrom", },
        { formRow: 40, fieldCode: "evalDateTo", },
        { formRow: 50, fieldCode: "evalDimensionMeaning", },
        { formRow: 60, fieldCode: "evalDimensionValueMeaning", },
        { formRow: 70, fieldCode: "processUserName", },
        { formRow: 80, fieldCode: "creationDate", },
        { formRow: 90, fieldCode: "evalRuleRemark", },
        { formRow: 100, fieldCode: "remark", },
        {
          formRow: 110,
          fieldCode: "totalAttachment",
          render: (val) => <SrmButton plain rect onClick={() => this.openHeaderAttachment()}>
            {this.$T("smbl.common.button.viewAttachment").$D("查看附件")}({this.attachmentDataSet.totalCount || val || 0})
          </SrmButton>,
        },
      ];
    },
  }
};
</script>

<style lang="stylus" scoped>
.detail-container {
  height 100vh;
}

.last-tab-bottom-space-view {
  margin-bottom: 120px
}

.line-filter {
  display flex;
  justify-content space-between;

  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
  }
}
</style>
