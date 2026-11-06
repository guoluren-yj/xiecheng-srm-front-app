<template>
  <srm-list
    :data-set="dataSet"
    :columns="getListColumns()"
    :buttons="getListButtons()"
    customize-code="SMBL.EVALUATE_ARCHIVES.MANAGE_LIST"
    @itemClick="onListItemClick">
    <srm-flex slot="bottom" class="round-btn-box" justify="end">
      <srm-button class="round-btn" size="x-large" circle type="primary" fill @click="openCreatePopup">
        <em class="srm-icon icon-plus"/>
      </srm-button>
    </srm-flex>
  </srm-list>
</template>

<script>

import { DataSet, SrmUtil } from "srm-mobile-ui";
import manageDS from "../datasource/manageDS";
import { getUserMasterUnit, getDefaultGroup } from "../api";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common" ],
  name: "EvaluateArchivesManageList",
  data() {
    return {
      dataSet: new DataSet(manageDS()),
      kpiMethod: {},
      userMasterUnit: {},
      defaultGroup: {},
    };
  },
  computed: {},
  watch: {},
  activated() {
    this.dataSet.refresh();
  },
  mounted() {
    SrmUtil.getValueSetBatch({ kpiMethod: "SSLM.KPI_EVAL_METHOD" }, this);
    getUserMasterUnit().then((res) => this.userMasterUnit = res || {});
    getDefaultGroup().then((res) => {
      if (res && res.content) {
        this.defaultGroup = res.content[0] || {};
      }
    });
  },
  methods: {
    createEvaluate() {

    },
    openCreatePopup() {
      this.dataSet.create({
        processUnitId: this.userMasterUnit.unitId,
        processUnitName: this.userMasterUnit.unitName,
        defaultGroup: this.defaultGroup,
      }, 0);
      const popups = {};
      popups.popup = this.$popup({
        position: "right",
        content: <SrmForm
          customizeType="detail"
          customizeCode="SMBL.EVALUATE_ARCHIVES.CREATE_FORM"
          dataSet={this.dataSet}
          buttons={this.getCreateButtons(popups)}
          columns={this.getCreateColumns()}/>,
        onClose: () => this.dataSet.removeLocalRecords([ this.dataSet.current ]),
      });
    },
    getCreateButtons(popups) {
      return [
        {
          title: this.$T("smbl.common.button.cancel").$D("取消"),
          type: "primary",
          handler: () => popups.popup.closePopup(),
        },
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          type: "primary",
          fill: true,
          handler: () => {
            this.dataSet.submit().then((res) => {
              this.dataSet.refresh();
              popups.popup.closePopup();
              const evalHeaderId = res.evalHeaderId;
              setTimeout(() => this.$router.push({
                name: "EvaluateArchivesManageDetail",
                query: {
                  evalHeaderId,
                }
              }), 0);
            });
          },
        },
      ];
    },
    getCreateColumns() {
      return [
        { formRow: 1, fieldCode: "evalNum", },
        { formRow: 10, fieldCode: "evalName", },
        { formRow: 20, fieldCode: "evalTplId", },
        { formRow: 30, fieldCode: "evalDimension", },
        { formRow: 40, fieldCode: "evalDimensionValue", },
        { formRow: 50, fieldCode: "evalCycle", },
        { formRow: 60, fieldCode: "evalDateFrom", required: true, },
        { formRow: 70, fieldCode: "evalDateTo", required: true, },
        //{ formRow: 80, fieldCode: "kpiMethod", render: (val) => this.kpiMethod[val] || val },
        //{ formRow: 90, fieldCode: "processUserName", },
        //{ formRow: 100, fieldCode: "creationDate", },
        //{ formRow: 110, fieldCode: "autoPushVendorFlageMeaning", },
        { formRow: 120, fieldCode: "evalRuleRemark", },
        { formRow: 130, fieldCode: "remark", },
        { formRow: 140, fieldCode: "processUnitId", },
      ];
    },
    getListButtons() {
      return [
        {
          text: this.$T("sslm.supplierDocManage.view.button.invalid").$D("废弃"),
          type: "danger",
          fill: true,
          visible: true,
          callback: () => {
            this.dataSet.removeSelect();
          },
        }
      ];
    },
    onListItemClick(record) {
      this.$router.push({
        name: "EvaluateArchivesManageDetail",
        query: {
          evalHeaderId: record.get("evalHeaderId"),
          evalGranularity: record.get("evalGranularity"),
        }
      });
    },
    getListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "evalNum",
          fieldType: "EMPTY",
          render: (val, item) => {
            const colorMap = {
              "SYSTEM_PROCESSING": "warn",
              "MANUAL_EVALUATING": "warn",
              "APPROVING": "warn",
              "NEW": "warn",
              "SYSTEM_COMPLETE": "success",
              "MANUAL_COMPLETE": "success",
              "FINAL_COLLECTED": "success",
              "PUBLISHED": "success",
              "COMPLETED": "success",
              "MANUAL_EVALUATING_COMPLETE": "success",
              "SYSTEM_FAIL": "danger",
            };
            return <srm-list-header>
              {val}
              <SrmButton slot="right" style={{ fontWeight: "bold" }} type={colorMap[item.evalStatus]} plain rect>{item.evalStatusMeaning}</SrmButton>
            </srm-list-header>;
          },
        },
        { formRow: 10, fieldCode: "evalName", editor: false, required: false, },
        { formRow: 20, fieldCode: "evalTplName", },
        { formRow: 30, fieldCode: "evalDimensionMeaning", },
        { formRow: 40, fieldCode: "evalDimensionValueMeaning", },
        { formRow: 50, fieldCode: "processUserName", },
        { formRow: 60, fieldCode: "creationDate", },
      ];
    }
  }
};
</script>

<style lang="stylus" scoped>
.round-btn {
  padding 0;
  line-height normal;
  pointer-events auto;

  .srm-icon {
    font-size 28px;
  }
}

.round-btn-box {
  background transparent;
  padding-bottom 60px;
  padding-right 15px;
}

</style>
