<!-- 引用评估计划组件 -->
<template>
  <div>
    <srm-list
      :data-set="evalPlanDs"
      :columns="getListColumns"/>
    <srm-list-bottom-bar :data-set="evalPlanDs" :buttons="getBottomBarButtons()"/>
    <srm-dialog
      :show="showDialog"
      :content="buttonsList.content"
      :show-cancel="buttonsList.cance.show"
      :show-other="buttonsList.curVersion.show"
      :show-ok="buttonsList.newVersion.show"
      :other-text="buttonsList.curVersion.text"
      :ok-text="buttonsList.newVersion.text"
      :on-cancel="buttonsList.cance.handClick"
      :on-other="buttonsList.curVersion.handClick"
      :on-ok="buttonsList.newVersion.handClick"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { getEvalPlanDs } from "./datasource/evalPlanDs";
import { createEvaluationApi, handleEvalPlanCreateApi } from "../api";
import SrmDialog from "./SrmDialog.vue";

export default {
  modules: [ "sslm.common", "smbl.common", "sslm.purchaserEvaluation", "hzero.common", "sslm.purchaserEvaluationDetail", "hipspfm.common" ],
  name: "EvalPlan",
  components: { SrmDialog },
  data() {
    return {
      buttonsList: {
        content: this.$T("sslm.purchaserEvaluation.strategyModal.tooltip").$D("来源评估计划关联的评估策略版本已更新，请选择继续使用当前版本或选用最新版本。"),
        cance:{
          show: true,
          handClick: () => {
            this.showDialog = false;
          },
        },
        curVersion: {
          text: this.$T("sslm.purchaserEvaluation.strategyModal.confirm.cancel").$D("当前版本"),
          show: true,
          handClick: () => {
            const { evalPlanLineIds, oldStrategyId } = this.evaluationInfo;
            const params = { evalPlanLineIds, strategyId: oldStrategyId };
            handleEvalPlanCreateApi(params).then((res) => {
              if (res && !res.failed) {
                this.toDetail(res);
              }
            });
          },
        },
        newVersion: {
          text: this.$T("sslm.purchaserEvaluation.strategyModal.confirm.ok").$D("最新版本"),
          show: true,
          handClick: () => {
            const { evalPlanLineIds, newStrategyId } = this.evaluationInfo;
            const params = { evalPlanLineIds, strategyId: newStrategyId };
            handleEvalPlanCreateApi(params).then((res) => {
              if (res && !res.failed) {
                this.toDetail(res);
              }
            });
          },
        },
      },
      evalPlanDs: new DataSet(getEvalPlanDs()),
      showDialog: false,
      evaluationInfo: {},
    };
  },
  computed: {
    getListColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "evalPlanNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={false}>
            <span>{val}</span>
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluation.table.column.label.supplierName").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluation.table.column.label.categoryName").$D("品类名称"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluation.table.column.label.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
      ];
    },
  },
  methods: {
    // 跳转详情页
    toDetail(record) {
      this.$emit("toDetail", record);
    },
    // 新建评估报告回调
    handleCreate(selected) {
      const evalPlanLineIds = selected.map((e) => e.data?.evalPlanLineId);
      createEvaluationApi({ evalPlanLineIds }).then((res) => {
        if (res && !res.failed) {
          const { sameFlag } = res;
          if (sameFlag) {
            this.toDetail(res);
            return true;
          // eslint-disable-next-line no-else-return
          } else {
            this.evaluationInfo = { evalPlanLineIds, ...res };
            this.showDialog = true;
          }
        }
      });
    },
    getBottomBarButtons() {
      return [
        {
          text: this.$T("sslm.purchaserEvaluationDetail.view.header.createTitle").$D("新建评估报告"),
          type: "primary",
          visible: true,
          disabled: (selected) => selected.length === 0,
          callback: (selected) => this.handleCreate(selected),
        },
      ];
    },
  }
};
</script>

<style lang="stylus" scoped>

</style>
