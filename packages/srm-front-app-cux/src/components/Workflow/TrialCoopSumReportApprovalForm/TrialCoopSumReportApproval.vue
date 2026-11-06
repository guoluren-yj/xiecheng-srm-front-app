<!-- 伽蓝纯二开的尝试性合作报告功能- -->
<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <srm-tab class="content">
      <!-- 基本信息 -->
      <srm-tab-pane
        :label="
          $T('scux.trialCoopSumReport.model.archive.baseInfo').$D('基本信息')
        ">
        <div
          class="content-item"
          @click="
            goDetail(
              getBasicDetailColums,
              trialCoopSumReportFormInfo,
              $T('scux.trialCoopSumReport.model.archive.baseInfo').$D(
                '基本信息'
              )
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{
                $T("scux.SupplierAccountSetReport.view.supplierCompanyNum").$D(
                  "供应商编码"
                )
              }}
              : {{ trialCoopSumReportFormInfo.supplierCompanyCode }}
            </div>
            <customize
              :columns="getBasicColums"
              :data-source="trialCoopSumReportFormInfo"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-tab-pane>
      <!-- 合作内容 -->
      <srm-tab-pane
        :label="
          $T('scux.commercialTermsPre.model.cooperativeContents').$D('合作内容')
        ">
        <div
          class="content-item"
          @click="
            goDetail(
              getCooperativeContentsDetailColums,
              trialCoopSumReportFormInfo,
              $T('scux.commercialTermsPre.model.cooperativeContents').$D(
                '合作内容'
              )
            )
          ">
          <div class="card">
            <div class="card-head open-tag">
              {{
                $T("scux.trialCoopSumReport.model.cooperationProjects").$D(
                  "合作项目"
                )
              }}：{{
                trialCoopSumReportFormInfo.cooperationProjects
              }}
            </div>
            <customize
              :columns="getCooperativeContentsColums"
              :data-source="trialCoopSumReportFormInfo"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-tab-pane>
      <!-- 考评结果 -->
      <srm-tab-pane
        :label="
          $T('scux.packingNoticesCreate.model.archive.evaluationResults').$D(
            '考评结果'
          )
        ">
        <div class="content-item">
          <div
            v-for="(evaluationResult, key) in evaluationResultsInfo"
            :key="key"
            class="card has-border"
            @click="
              goDetail(
                getEvalResultDetailColums,
                evaluationResult,
                $T(
                  'scux.packingNoticesCreate.model.archive.evaluationResults'
                ).$D('考评结果')
              )
            ">
            <div class="evaluation-title">
              <div class="card-head open-tag">
                {{ evaluationResult.evalNum }}
              </div>
              <span class="settle-status">
                {{ evaluationResult.evalStatusMeaning }}
              </span>
            </div>
            <customize
              :columns="getEvaluationResultColumns"
              :data-source="evaluationResult"/>
          </div>
        </div>
      </srm-tab-pane>
      <!-- 合作分析 -->
      <srm-tab-pane
        :label="
          $T('scux.packingNoticesCreate.model.archive.collaboration').$D(
            '合作分析'
          )
        ">
        <srm-button-group>
          <srm-button fill>
            <srm-upload
              :attachment-uuid="annexUuid"
              :show-count="false"
              :show-icon="false"
              :title="
                $T('smbl.common.model.supplier.aboutAttachmentUuid').$D(
                  '供应商相关附件'
                )
              "
              :desc-title="
                $T('scux.commercialTermsPre.model.annexUuid').$D('相关附件')
              "
              @showFilePopup="viewAttachment"/>
          </srm-button>
        </srm-button-group>
        <div
          class="content-item"
          @click="
            goDetail(
              getCollaborationDetailColums,
              trialCoopSumReportFormInfo,
              $T('scux.packingNoticesCreate.model.archive.collaboration').$D(
                '合作分析'
              )
            )
          ">
          <div class="card">
            <div class="card-head">
              {{
                $T("scux.trialCoopSumReport.model.supplierPerformance").$D(
                  "供应商表现"
                )
              }}：{{ trialCoopSumReportFormInfo.supplierPerformanceMeaning }}
            </div>
            <customize
              :columns="getCollaborationInfoColums"
              :data-source="trialCoopSumReportFormInfo"/>
          </div>
        </div>
      </srm-tab-pane>
    </srm-tab>
    <!-- 尝试性合作总结报告明细详情页pop -->
    <srm-detail-pop
      :visible.sync="srmDetailPop"
      :pop-title="headTitle"
      :data-source="detailInfo"
      :columns="getPopInfoColumns"/>
  </div>
</template>

<script>
import uuid from "uuid";
import { SrmButton } from "srm-mobile-ui";
import SrmButtonGroup from "@/components/V5/SrmButtonGroup";
import SrmDetailPop from "@/components/V5/SrmDetailPop";
import {
  getTrialCoopSumReportInfoApi,
  getEvalResultsListApi,
} from "./api/TrialCoopSumReport";
export default {
  modules: [ "scux.trialCoopSumReport", "scux.SupplierAccountSetReport", "scux.commercialTermsPre", "scux.packingNoticesCreate", "smbl.common", "scux.capacityAllocation" ],
  name: "TrialCoopSumReportApproval",
  components: {
    SrmButtonGroup,
    SrmButton,
    SrmDetailPop,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      annexUuid: "", //当前传入的文件uuid
      headTitle: "", //表头标题
      reportId: "",
      trialCoopSumReportFormInfo: {}, //尝试性合作总结报告信息
      evaluationResultsInfo: [], //考评结果报告列表信息
      srmDetailPop: false, //明细页pop
      getPopInfoColumns: [],
      detailInfo: {},
    };
  },
  computed: {
    // 基本信息
    getBasicColums() {
      const columns = [
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.supplierCompanyName").$D("供应商全称"),
          fieldCode: "supplierCompanyName",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.openUpDate").$D("开户日期"),
          fieldCode: "openUpDate",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.itemCategoryName").$D("关联免现场评审单"),
          fieldCode: "outSiteReviewNum",
          formRow: 3,
          formCol: 1,
        },
      ];

      return columns;
    },
    // 基本信息详情
    getBasicDetailColums() {
      const columns = [
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.processNum").$D("流程编号"),
          fieldCode: "processNum",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.unitName").$D("提报部门"),
          fieldCode: "unitName",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.realName").$D("提报人"),
          fieldCode: "realName",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.creationDateFrom").$D("提报日期"),
          fieldCode: "creationDate",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.capacityAllocation.model.title.yunfuCompanyCode").$D("供应商编码"),
          fieldCode: "supplierCompanyCode",
          required: 1,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.supplierCompanyName").$D("供应商全称"),
          fieldCode: "supplierCompanyName",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.openUpDate").$D("开户日期"),
          fieldCode: "openUpDate",
          formRow: 70,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.itemCategoryName").$D("关联免现场评审单"),
          fieldCode: "outSiteReviewNum",
          required: 1,
          formRow: 80,
          formCol: 10,
        },
      ];

      return columns;
    },
    // 合作内容
    getCooperativeContentsColums() {
      const columns = [
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.purchasedAmount").$D("已采购金额"),
          fieldCode: "purchasedAmount",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.purchasedBatch").$D("已采购批次"),
          fieldCode: "purchasedBatch",
          formRow: 1,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.actualSupplyMaterials").$D("实际供货物料"),
          fieldCode: "actualSupplyMaterials",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.actualSupplyCategory").$D("实际供应品类"),
          fieldCode: "actualSupplyCategory",
          formRow: 3,
          formCol: 1,
        },
      ];

      return columns;
    },
    //合作内容详情
    getCooperativeContentsDetailColums() {
      const columns = [
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.cooperationProjects").$D("合作项目"),
          fieldCode: "cooperationProjects",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.actualSupplyCategory").$D("实际供应品类"),
          fieldCode: "actualSupplyCategory",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.actualSupplyMaterials").$D("实际供货物料"),
          fieldCode: "actualSupplyMaterials",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.purchasedAmount").$D("已采购金额"),
          fieldCode: "purchasedAmount",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.purchasedBatch").$D("已采购批次"),
          fieldCode: "purchasedBatch",
          formRow: 50,
          formCol: 10,
        },
      ];

      return columns;
    },
    // 考评结果
    getEvaluationResultColumns() {
      const columns = [
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalName").$D("档案描述"),
          fieldCode: "evalName",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalTplName").$D("考评模版"),
          fieldCode: "evalTplName",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalCycleMeaning").$D("考评周期"),
          fieldCode: "evalCycleMeaning",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalDimensionMeaning").$D("考评维度"),
          fieldCode: "evalDimensionMeaning",
          formRow: 3,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalDimensionValueMeaning").$D("维度值"),
          fieldCode: "evalDimensionValueMeaning",
          formRow: 4,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.processUserName").$D("考评负责人"),
          fieldCode: "processUserName",
          formRow: 5,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.creationDate").$D("提报日期"),
          fieldCode: "creationDate",
          formRow: 6,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalDateFrom").$D("考评日期从"),
          fieldCode: "evalDateFrom",
          formRow: 7,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalDateTo").$D("考评日期至"),
          fieldCode: "evalDateTo",
          formRow: 8,
          formCol: 1,
        },
      ];

      return columns;
    },
    // 考评结果详情
    getEvalResultDetailColums() {
      const columns = [
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalStatusMeaning").$D("档案状态"),
          fieldCode: "evalStatusMeaning",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalNum").$D("档案编码"),
          fieldCode: "evalNum",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalName").$D("档案描述"),
          fieldCode: "evalName",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalTplName").$D("考评模版"),
          fieldCode: "evalTplName",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalCycleMeaning").$D("考评周期"),
          fieldCode: "evalCycleMeaning",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalDateFrom").$D("考评日期从"),
          fieldCode: "evalDateFrom",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalDateTo").$D("考评日期至"),
          fieldCode: "evalDateTo",
          formRow: 70,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalDimensionMeaning").$D("考评维度"),
          fieldCode: "evalDimensionMeaning",
          formRow: 80,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.evalDimensionValueMeaning").$D("维度值"),
          fieldCode: "evalDimensionValueMeaning",
          formRow: 90,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.processUserName").$D("考评负责人"),
          fieldCode: "processUserName",
          formRow: 100,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.creationDate").$D("提报日期"),
          fieldCode: "creationDate",
          formRow: 110,
          formCol: 10,
        },
      ];

      return columns;
    },
    // 合作分析
    getCollaborationInfoColums() {
      const columns = [
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.supplierPerformanceDescription").$D("供应商表现说明"),
          fieldCode: "supplierPerformanceDescription",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.productTrends").$D("产品趋势"),
          fieldCode: "productTrendsMeaning",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.productTrendsDescription").$D("产品趋势说明"),
          fieldCode: "productTrendsDescription",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.cooperate").$D("是否继续合作"),
          fieldCode: "cooperateMeaning",
          formRow: 4,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.remarks").$D("备注说明"),
          fieldCode: "remarks",
          formRow: 5,
          formCol: 1,
        },
      ];

      return columns;
    },
    // 合作分析详情
    getCollaborationDetailColums() {
      const columns = [
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.supplierPerformance").$D("供应商表现"),
          fieldCode: "supplierPerformanceMeaning",
          required: 1,
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.supplierPerformanceDescription").$D("供应商表现说明"),
          fieldCode: "supplierPerformanceDescription",
          required: 1,
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.productTrends").$D("产品趋势"),
          fieldCode: "productTrendsMeaning",
          required: 1,
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.productTrendsDescription").$D("产品趋势说明"),
          fieldCode: "productTrendsDescription",
          required: 1,
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.cooperate").$D("是否继续合作"),
          fieldCode: "cooperateMeaning",
          required: 1,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T("scux.trialCoopSumReport.model.remarks").$D("备注说明"),
          fieldCode: "remarks",
          formRow: 60,
          formCol: 10,
        },
      ];

      return columns;
    },
  },
  mounted() {
    this.reportId = this.changeReqId;
    this.getTrialCoopSumReportInfo();
    this.getEvalResultsList();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.trialCoopSumReport.view.title.updateAndDetailsTrial").$D(
        "尝试性合作总结报告"
      )
    );
  },
  methods: {
    //跳到详情页
    goDetail(columns, infos, title) {
      this.getPopInfoColumns = columns;
      this.detailInfo = infos;
      this.headTitle = title;
      this.srmDetailPop = !this.srmDetailPop;
    },
    // 获取尝试性合作总结报告
    async getTrialCoopSumReportInfo() {
      await getTrialCoopSumReportInfoApi(this.reportId).then((res) => {
        this.trialCoopSumReportFormInfo = res;
      });
    },
    // 获取考评结果列表
    async getEvalResultsList() {
      await getEvalResultsListApi().then((res) => {
        this.evaluationResultsInfo = res.content;
      });
    },
    //查看合作分析附件
    viewAttachment() {
      this.annexUuid =
          this.trialCoopSumReportFormInfo.annexUuid || uuid();
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .customize-detail .form-item .value {
  justify-content: start;
}

>>> .file-title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: var(--color-font-default-d);
}

>>> .navWrap .navContent li.active:before {
  display: none;
}

>>> .navWrap .navContent li {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #afafaf;
}

>>> .navWrap .navContent li.active {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #1f1f1f;
}

>>> .srm-button-group .srm-button-group-area {
  padding-bottom: 12px;
  border-bottom: 1px solid #f6f6f6;
}

>>> .srm-upload-title {
  color: #fff;
}

.detail-wrap {
  height: calc(100vh - 220px);
  overflow: auto;
  .content {
    .card {
      box-sizing: border-box;
      padding: 16px 0 16px 15px;

      .evaluation-title {
        display: flex;
        justify-content: space-between;

        .settle-status {
          font-size: 14px;
          font-family: Alibaba, Alibaba-PuHuiTi;
          font-weight: PuHuiTi;
          color: #276ef1;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
