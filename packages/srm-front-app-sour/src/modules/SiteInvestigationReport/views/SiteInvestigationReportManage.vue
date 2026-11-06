<template>
  <div class="site-investigation-report-manage">
    <nav-head :title="$T('sslm.siteInvestigateReport.view.title.siteInvestigateReport').$D('现场考察报告')"/>
    <!-- 顶部标签（管理、填制） -->
    <srm-tab-bar display="justify" @indexChange="tabIndexChange">
      <srm-tab-item :label="$T('sslm.siteInvestigateReport.view.manage.title').$D('现场考察报告管理')">
        <!-- 报告管理列表 -->
        <srm-list :data-set="reportManageDataSet" :columns="getReportManageColumns" customize-code="SMBL.SITE_INVESTIGATE_REPORT.LIST" @itemClick="itemClick" />
      </srm-tab-item>
      <srm-tab-item :label="$T('sslm.siteInvestigateReport.view.filling.title').$D('现场考察报告填制')">
        <!-- 报告填制列表 -->
        <srm-list :data-set="reportFilledInDataSet" :columns="getReportManageColumns" customize-code="SMBL.SITE_INVESTIGATE_REPORT.LIST" @itemClick="filledItemClick"/>
      </srm-tab-item>
    </srm-tab-bar>
    <!-- 创建按钮，报告管理时可见，填制不可见 -->
    <srm-flex v-show="tabbarIndex === 0" class="create-button" justify="end" align="end">
      <srm-button class="round-btn" size="x-large" circle type="primary" fill @click="createAction">
        <span class="srm-icon icon-plus"/>
      </srm-button>
    </srm-flex>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { reportManageDS } from "../datasource/ReportManageDS";
import { reportFilledInDS } from "../datasource/ReportFilledInDS";
export default {
  modules: [ "sslm.siteInvestigateReport", "smbl.common", "scux.ruleElimination" ],
  name: "SiteInvestigationReportManage",
  data() {
    return {
      // 报告管理DataSet
      reportManageDataSet: new DataSet(reportManageDS()),
      // 报告填制DataSet
      reportFilledInDataSet: new DataSet(reportFilledInDS()),
      // tabbar下标
      tabbarIndex: 0,
    };
  },
  computed: {
    getReportManageColumns() {
      return [ {
        fieldName: "header",
        fieldType: "EMPTY",
        fieldCode: "evalNum",
        render: (val, item) => <srm-list-header show-open-tag={true}>
          <span>{val}</span>
          <span slot="right" style={{
            color: this.colorForState(item.evalStatus),
          }}>{item.evalStatusMeaning}</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplier").$D("供应商"),
        fieldType: "TEXT",
        fieldCode: "supplierName",
      }, {
        fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.inspectionTemplate").$D("考察模板"),
        fieldType: "TEXT",
        fieldCode: "evalTplName",
      }, {
        fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.describe").$D("考察报告描述"),
        fieldType: "TEXT",
        fieldCode: "evalDescription",
      }, {
        fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人"),
        fieldType: "TEXT",
        fieldCode: "realName",
      }, {
        fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.company").$D("公司"),
        fieldType: "TEXT",
        fieldCode: "companyName",
      }, {
        fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间"),
        fieldType: "TEXT",
        fieldCode: "creationDate",
      }, ];
    }
  },
  methods: {
    // 按状态设置颜色
    colorForState(state) {
      let warningState = [ "NEW", "SYSTEM_PROCESSING", "MANUAL_EVALUATING", "APPROVALING", "FEEDBACK", "MANUAL_COMPLETE", "FINAL_COLLECTED" ];
      let dangerState = [ "SYSTEM_FAIL", "REJECTED" ];
      let successState = [ "SYSTEM_COMPLETE", "APPROVED", "PUBLISHED" ];
      if (warningState.indexOf(state) !== -1) {
        return "var(--color-warn)";
      } else if (dangerState.indexOf(state) !== -1) {
        return "var(--color-danger)";
      } else if (successState.indexOf(state) !== -1) {
        return "var(--color-success)";
      }
      return "var(--font-color-disable)";
    },
    // 列表点击事件，进入详情页
    itemClick(record) {
      this.$router.push({
        path: "/SiteInvestigationReportDetailMaintain",
        query: {
          evalNum: record.data.evalNum,
          evalHeaderId: record.data.evalHeaderId,
        },
      });
    },
    // 填制列表点击事件，进入详情页
    filledItemClick(record) {
      this.$router.push({
        path: "/SiteInvestigationReportFilled",
        query: {
          evalNum: record.data.evalNum,
          evalHeaderId: record.data.evalHeaderId,
        },
      });
    },
    // 创建单据
    createAction() {
      this.$router.push({
        path: "/SiteInvestigationReportCreate"
      });
    },
    // tab下标变化
    tabIndexChange(index) {
      this.tabbarIndex = index;
    },
  },
};
</script>

<style lang="stylus" scoped>

.site-investigation-report-manage {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.create-button {
  position: absolute;
  right: 15px;
  bottom: 72px;
  width: 60px;
  height: 60px;
}

.round-btn {
  padding: 0;

  .srm-icon {
    font-size: 28px;
  }
}

</style>