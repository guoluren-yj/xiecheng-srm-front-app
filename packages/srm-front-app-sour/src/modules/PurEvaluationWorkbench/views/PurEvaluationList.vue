<!-- 供应商评估工作台-列表 -->
<template>
  <div>
    <div style="height: 100vh">
      <nav-head :title="$T('sslm.purchaserEvaluation.view.header.Title').$D('评估工作台')" @goBack="goBack" />
      <srm-tab-bar display="justify" @indexChange="onGroupIndexChange">
        <srm-tab-item key="tabGroupManagement" :label="$T('sslm.purchaserEvaluation.tabs.content.tabGroupEvaluationReport').$D('评估报告')">
          <srm-list
            :data-set="manageTabListDs[`${manageCurTab}`]"
            :columns="getColumns"
            :customize-code="getCustomizeCode('manage',manageCurTab)"
            @itemClick="goToTenantDetail">
            <srm-tab-bar
              slot="filter"
              display="justify"
              :tabs="[
                $T('sslm.purchaserEvaluation.tabs.content.tabPaneAssessmentReserve').$D('评估准备'),
                $T('sslm.purchaserEvaluation.tabs.content.tabPaneUnderEvaluation').$D('评估中'),
                $T('sslm.purchaserEvaluation.tabs.content.tabPaneEvaluationCompleted').$D('评估完成'),
                $T('sslm.purchaserEvaluation.tabs.content.tabPaneManageAll').$D('全部')
              ]"
              @indexChange="onTabIndexChange"/>
          </srm-list>
        </srm-tab-item>
        <srm-tab-item :label="$T('sslm.purchaserEvaluation.tabs.content.tabGroupReportScoring').$D('报告打分')" code="platformListTab">
          <srm-list
            :data-set="scoreTabListDs[`${scoreCurTab}`]"
            :columns="getColumns"
            :customize-code="getCustomizeCode('score',manageCurTab)"
            @itemClick="goToTenantDetail">
            <srm-tab-bar
              slot="filter"
              display="justify"
              :tabs="[
                $T('sslm.purchaserEvaluation.tabs.content.tabPaneWaitScore').$D('待评分'),
                $T('sslm.purchaserEvaluation.tabs.content.tabPaneManageAll').$D('全部')
              ]"
              @indexChange="onTabIndexChange"/>
          </srm-list>
        </srm-tab-item>
      </srm-tab-bar>
      <!-- 创建按钮，报告管理时可见，评分不可见 -->
      <srm-flex v-show="grourTab === 0" class="create-button" justify="end" align="end">
        <srm-button class="round-btn" size="x-large" circle type="primary" fill @click="createAction">
          <span class="srm-icon icon-plus"/>
        </srm-button>
      </srm-flex>
    </div>
  </div>
</template>

<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { renderStatus } from "@/utils/sslmUtils";
import { getManageTableDs, getScoreTableDs } from "../datasource";
import EvalPlan from "../component/EvalPlan.vue";
import { forEach } from "lodash";
import {
  queryCustomizeApi,
} from "../api";
export default {
  modules: [ "smbl.common", "sslm.purchaserEvaluation", "spfm.invitationList", "ssrc.priceLibraryNew", "hzero.common", "hipspfm.disposeInvite", "spfm.invitationRegister", "sslm.common", "sslm.supplierDocManage", "sslm.purchaserEvaluationDetail", "hipspfm.common" ],
  name: "PurEvaluationList",
  // eslint-disable-next-line vue/no-unused-components
  components: { EvalPlan },
  data() {
    return {
      grourTab: 0, // 管理：0 ｜ 评分：1
      manageCurTab: 0,
      btnCustomizeProperty: {}, // 创建按钮个性化配置
      manageTabListDs: {
        0: new DataSet(getManageTableDs(0)),
        1: new DataSet(getManageTableDs(1)),
        2: new DataSet(getManageTableDs(2)),
        3: new DataSet(getManageTableDs(3)),
      },
      scoreCurTab: 0,
      scoreTabListDs: {
        0: new DataSet(getScoreTableDs("waitScore")),
        1: new DataSet(getScoreTableDs("all")),
      },
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "evalNum",
          fieldType: "EMPTY",
          render: (val, record) => {
            const color = this.grourTab ? renderStatus(record.scoreStatus) : renderStatus(record.reportStatus);
            return <SrmListHeader showOpenTag={true}>
              <span>{val}</span>
              <span slot="right" style={{ color: `${color}` }}>{this.grourTab ? record.scoreStatusMeaning : record.reportStatusMeaning}</span>
            </SrmListHeader>;
          },
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluation.table.column.label.supplierCompanyName").$D("供应商"),
          fieldCode: "supplierCompanyName",
          render: (val, record) => {
            const { supplierName } = record || {};
            return val || supplierName || "-";
          }
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluation.table.column.label.strategyName").$D("评估策略"),
          fieldCode: "strategyName",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluation.table.column.label.evalDescription").$D("评估报告描述"),
          fieldCode: "evalDescription",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluation.table.column.label.realName").$D("创建人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluation.table.column.label.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluation.table.column.label.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
      ];
    },
  },
  activated() {
    if (this.grourTab === 0) {
      this.manageTabListDs[`${this.manageCurTab}`].refresh();
    } else {
      this.scoreTabListDs[`${this.scoreCurTab}`].refresh();
    }
  },
  mounted() {
    // 设置页签查询参数
    // 管理ds 0: 评估准备 ｜ 1: 评估中 2: ｜ 评估完成 3: 全部
    this.manageTabListDs[0].setQueryParameter({
      progressStatus: "EVAL_PREPARE",
      customizeOrderField: "creationDate:desc",
      customizeFilterComparison: "evalNum:LIKE,evalDescription:LIKE,realName:LIKE",
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_LIST.MANAGE.ASSESS_RESERVE,SSLM.PURCHASER_ASSESS_LIST.MANAGE.ASSESS_RESERVE_TABLE",
    });
    this.manageTabListDs[1].setQueryParameter({
      progressStatus: "EVAL_PROGRESSING",
      customizeOrderField: "creationDate:desc",
      customizeFilterComparison: "evalNum:LIKE,evalDescription:LIKE,realName:LIKE",
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_LIST.MANAGE.UNDER_EVALUATION,SSLM.PURCHASER_ASSESS_LIST.MANAGE.TABLE",
    });
    this.manageTabListDs[2].setQueryParameter({
      progressStatus: "EVAL_COMPLETE",
      customizeOrderField: "creationDate:desc",
      customizeFilterComparison: "evalNum:LIKE,evalDescription:LIKE,realName:LIKE",
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_LIST.MANAGE.ASSESS_COMPLETED,SSLM.PURCHASER_ASSESS_LIST.MANAGE.ASSESS_COMPLETED_TABLE",
    });
    this.manageTabListDs[3].setQueryParameter({
      customizeOrderField: "creationDate:desc",
      customizeFilterComparison: "evalNum:LIKE,evalDescription:LIKE,realName:LIKE",
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_LIST.MANAGE.ALL,SSLM.PURCHASER_ASSESS_LIST.MANAGE.ALL_TABLE",
    });
    // 评分ds 0: 待评分 ｜ 1: 全部
    this.scoreTabListDs[0].setQueryParameter({
      createMethod: "eval_report",
      customizeOrderField: "creationDate:desc",
      customizeFilterComparison: "evalNum:LIKE,evalDescription:LIKE,realName:LIKE",
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_LIST.SCORE.WAIT_SCORE,SSLM.PURCHASER_ASSESS_LIST.SCORE.WAIT_SCORE_TABLE",
    });
    this.scoreTabListDs[1].setQueryParameter({
      evalStatusCustoms: null,
      customizeOrderField: "creationDate:desc",
      customizeFilterComparison: "evalNum:LIKE,evalDescription:LIKE,realName:LIKE",
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_LIST.SCORE.ALL,SSLM.PURCHASER_ASSESS_LIST.SCORE.ALL_TABLE",
    });
    // 获取个性化单元信息,按钮个性化
    const unitCode = [ "SMBL.PUR_EVALUATION_WORKBENCH.LIST.CREATE_BUTTON" ];
    queryCustomizeApi(unitCode).then(async (res) => {
      if (res && !res.failed) {
        const btnCustomizeProperty = this.getFieldProperty(res, unitCode);
        this.btnCustomizeProperty = btnCustomizeProperty;
      }
    });
  },
  methods: {
    /**
     * 获取个性化字段配置信息
     * data: 个性化数据
     * unitCode：单元编码
     */
    getFieldProperty(data, unitCode) {
      let property = {};
      if (data && data[unitCode]) {
        const unitCodeData = data[unitCode];
        forEach(unitCodeData.fields || [], (fiel) => {
          property[`${fiel.fieldCode}`] = fiel;
        });
      }
      return property;
    },
    // 动态获取个性化单元编码
    getCustomizeCode(groupCode, tabCode) {
      if (groupCode === "manage") {
        const customizeCodeList = {
          0: "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.RESERVE_LIST", // 评估准备
          1: "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.EVALUATION_LIST", // 评估中
          2: "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.COMPLETED_LIST", // 评估完成
          3: "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.ALL_LIST", // 全部
        };
        return customizeCodeList[tabCode];
      } else if (groupCode === "score") {
        const customizeCodeList = {
          0: "SMBL.PUR_EVALUATION_WORKBENCH.SCORE.WAIT_LIST", // 待评分
          1: "SMBL.PUR_EVALUATION_WORKBENCH.SCORE.ALL_LIST", // 全部
        };
        return customizeCodeList[tabCode];
      }
    },
    // 创建单据
    createAction() {
      const dataList = [
        {
          name: this.$T("sslm.purchaserEvaluation.dropdown.menuItem.manualCreation").$D("手工新建"),
          handleClick: () => this.handleCreat("manual"),
          hideFlag: this.btnCustomizeProperty["manual"].visible === 0,
        },
        {
          name: this.$T("sslm.purchaserEvaluation.dropdown.menuItem.referenceEvaluationPlanCreation").$D("引用评估计划新建"),
          handleClick: () => this.handleCreat("evaluationPlan"),
          hideFlag: this.btnCustomizeProperty["evaluationPlan"].visible === 0,
        },
      ];
      this.createModalRef = this.$popup({
        title: this.$T("hzero.common.button.create").$D("新建"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        height: "232px",
        rounded: true,
        content: <div class="srm-creat-pop">
          <div class="srm-creat-pop-top">
            {dataList.map((data) =>
              <div class="srm-creat-pop-containe" style={data.hideFlag ? { display: "none" } : {}}>
                <srm-button type="info" plain onClick={() => data.handleClick()}>{data.name}</srm-button>
              </div>)
            }
          </div>
          <div class="srm-creat-pop-bottom">
            <srm-button type="info" plain onClick={() => this.createModalRef.closePopup()}>{this.$T("hzero.common.button.cance").$D("取消")}</srm-button>
          </div>
        </div>
      });
    },
    // 新建回调
    handleCreat(type) {
      switch (type) {
      // 手工新建
      case "manual":
        this.createModalRef.closePopup();
        setTimeout(() => {
          this.$router.push({
            name: "PurEvaluationManageCreate",
          });
        }, 500);
        break;
      // 引用评估计划新建
      case "evaluationPlan":
        this.createModalRef.closePopup();
        this.$popup({
          title: this.$T("sslm.purchaserEvaluation.dropdown.menuItem.referenceEvaluationPlanCreation").$D("引用评估计划新建"),
          showHeader: true,
          showClose: true,
          position: "bottom",
          height: "70vh",
          rounded: true,
          content: <EvalPlan onToDetail={(record) => this.goToTenantDetail(record, "other")}/>,
        });
        break;
      default:
        break;
      }
    },
    // 跳转详情页[列表跳转：list, 其他页签跳转：other]
    goToTenantDetail(record, type = "list") {
      let evalHeaderId = "";
      let realName = "";
      let viewFlag = false;
      let scoreStatus = null;
      let scoreViewFlag = false;
      if (type === "other") {
        evalHeaderId = record.evalHeaderId;
        realName = record.realName;
        scoreStatus = record.scoreStatus;
      } else {
        evalHeaderId = record.get("evalHeaderId");
        realName = record.get("realName");
        scoreStatus = record.get("scoreStatus");
        const reportStatus = record.get("reportStatus");
        viewFlag = [ "PUBLISHED" ].includes(reportStatus);
        scoreViewFlag = ![ "UNSCORE", "SCORE_REJECTED" ].includes(scoreStatus);
      }
      // 管理-跳转
      if (this.grourTab === 0) {
        this.$router.push({
          name: "PurEvaluationManageDetail",
          query: {
            evalHeaderId: evalHeaderId,
            status: viewFlag ? "view" : "edit",
          },
        });
      } else {
        const getUserId = SrmUtil.getUserInfo().id;
        this.$router.push({
          name: "PurEvaluationScoreDetail",
          query: {
            evalHeaderId: evalHeaderId,
            status: scoreViewFlag ? "view" : "edit",
            socure: this.manageCurTab === 0 ? "waitScore" : "allScore",
            scorerName: realName,
            scorerId: getUserId,
            flag: Number([ "UNSCORE", "SCORE_REJECTED" ].includes(scoreStatus)),
          },
        });
      }
    },
    // 管理/评分 tab切换
    onGroupIndexChange(index) {
      this.grourTab = index;
    },
    // 二级tab栏切换
    onTabIndexChange(index) {
      if (this.grourTab === 0) {
        this.manageCurTab = index;
        this.manageTabListDs[index].refresh();
      } else if (this.grourTab === 1) {
        this.scoreCurTab = index;
        this.scoreTabListDs[index].refresh();
      }
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>
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

.srm-creat-pop {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #333333;
  font-weight: 400;
  .srm-creat-pop-top {
    width: 100%;
    display: flex;
    flex-direction: column;
    .srm-creat-pop-containe {
      height: 54px;
      width: 100%;
      display: inline-flex;
      justify-content: center;
      border-bottom: 1px solid #F6F6F6;
    }
  }
  .srm-creat-pop-bottom {
    width: 100%;
    height: 54px;
    display: inline-flex;
    justify-content: center;
    border-top: 12px solid #F6F6F6;
  }
}

</style>
