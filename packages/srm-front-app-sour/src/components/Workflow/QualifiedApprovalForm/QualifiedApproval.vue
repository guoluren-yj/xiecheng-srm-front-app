<template>
  <section v-if="headInfo">
    <srm-scroll-tab no-all customize-code="SMBL.WORKFLOW.QUALITY_APPROVAL.TABS">
      <ai-tip-section
        v-if="headInfo.aiApproveStatus"
        key="aiTipSection"
        :ai-approve-status="headInfo.aiApproveStatus"
        :ai-review-params="headInfo.aiApproveDTOList" />
      <srm-scroll-tab-item
        class="tab-container"
        code="header"
        :label="$T('hipspfm.workFlow.view.message.applicationHeader').$D('申请头信息')">
        <customize
          style="padding-top: 10px"
          need-padding :data-source="headInfo" code="SMBL.WORKFLOW.QUALITY_APPROVAL.HEAD_DETAIL"
          :columns="columns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="showsupplyEvalInfoFlag"
        class="tab-container"
        code="ratingInfo"
        :label="$T('sslm.commonApplication.view.message.gradInformation').$D('评分信息')">
        <srm-list :data-set="supplyEvalInfoDS" customize-code="SMBL.WORKFLOW.QUALITY_APPROVAL.SUPPLY_EVAL_INFO"
                  :scrollable="false"
                  :columns="getSupplyEvalInfoColumns()"
                  @onItemClick="onSupplyEvalInfoItemClick"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="showSupplyInfoFlag"
        class="tab-container"
        code="supplyAbility"
        :label="$T('sslm.commonApplication.view.message.tab.supplyAbility').$D('供货能力清单')">
        <srm-list :data-set="supplyInfoDS" customize-code="SMBL.WORKFLOW.QUALITY_APPROVAL.SUPPLY_INFO"
                  :scrollable="false"
                  :columns="getSupplyInfoColumns()"
                  @onItemClick="onSupplyInfoItemClick"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="showSupplyCategoryFlag"
        class="tab-container"
        code="supplierClass"
        :label="$T('sslm.commonApplication.view.message.tab.supplierAssort').$D('供应商分类')">
        <srm-list v-if="headInfo.supplierTenantId" :data-set="supplyCategoryDS"
                  customize-code="SMBL.WORKFLOW.QUALITY_APPROVAL.SUPPLY_CATEGORY"
                  :scrollable="false"
                  :columns="getSupplyCategoryColumns()"
                  @onItemClick="onSupplyCategoryItemClick"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 评分明细弹窗 -->
    <rating-detail v-model="ratingDetailPop" :rating-detail="ratingDetail"/>
    <!-- 供货能力弹窗 -->
    <supply-detail v-model="supplyDetailPop" :supply-detail="supplyDetail"/>
  </section>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import SupplierRelatedForm from "../../SupplierRelatedDoc/SupplierRelatedForm";
import RatingDetail from "./components/RatingDetail";
import SupplyDetail from "./components/SupplyDetail";
import { Popup, NavBar } from "hips";
// import { getOrderHeadInfoApi } from "../api/Sw";
import { getOrderHeadInfoApi } from "./api/index";
import NavWrap from "@/components/NavWrap";
import supplyInfoDS from "./datasource/SupplyInfoDS";
import supplyEvalInfoDS from "./datasource/SupplyEvalInfoDS";
import supplyCategoryDS from "./datasource/SupplyCategoryDS";
import AiTipSection from "@/components/AiTipSection/AiTipSection.vue";
import { associatedSupplierDS } from "./datasource/AssociatedSupplierDS";
import { queryRelTableConfigByParams } from "@/components/DynamicTable/utils/service.js";

export default {
  modules: [ "hipspfm.common", "hipspfm.workFlow", "sslm.commonApplication", "sslm.supplyAbility", "sslm.supplierDetail", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteInvestigateReport", "spcm.common", "spcm.purchaseContractView", "spcm.contractTemplate", "spcm.purchaseContractType", "sslm.investigationCorrelation", "smbl.common", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "ssrc.inquiryHall", "sqam.common", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "hzero.button", "sslm.investigationCorrelation", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "ssrc.supplyInfoChange", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "ssrc.inquiryHall", "sqam.common", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "hzero.button", "sslm.investigationCorrelation", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteInvestigateReport", "spcm.purchaseContractType", "scux.relationSupplier", "sagm.common", "spcm.purchaseRequisitionCreation", "ssrc.common", "hipspfm.workFlowAgrement", "sodr.common", "small.common", "entity.attachment", "sqam.inquiryHall", "ssrc.bidHall", "ssrc.priceLibrary", "ssrc.supplierQuotation", "ssrc.queryRfq", "hipspfm.expertScoring", "hipspfm.invoiceBill", "ssrc.bidHall", "smbl.inquiryHall", "sslm.purchaserEvaluation", "sslm.purchaserEvaluationDetail", "smbl.small", "sslm.evaluationStrategyDetail" ],
  name: "QualifiedApproval",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    NavWrap,
    RatingDetail,
    SupplyDetail,
    AiTipSection,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
  },
  filters: {},
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      activeKey: 0,
      headInfo: {},
      ratingInfo: [], // 评分信息
      supplyInfoDS: new DataSet(supplyInfoDS()),
      supplyEvalInfoDS: new DataSet(supplyEvalInfoDS()),
      supplyCategoryDS: new DataSet(supplyCategoryDS(this)),
      showSupplyInfoFlag: true,
      showsupplyEvalInfoFlag: true,
      showSupplyCategoryFlag: true,
      supplyInfo: [], //供货能力清单
      categoryInfo: [], //供应商分类信息
      scroll: "",
      show: false,
      navIndex: 0,
      contentLenArr: [],
      lengthArr: [],
      ratingDetailPop: false, //评分信息弹窗
      supplyDetailPop: false, //供货能力清单弹窗
      ratingDetail: {},
      supplyDetail: {},
      qualifiedAttachmentLines: [],
      columns: [ {
        fieldCode: "qualifiedNumber",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.reqNum").$D("申请单号"),
      }, {
        fieldCode: "supplierCompanyNum",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.supplierCompanyNum").$D("供应商编码"),
        render:(val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.jumpTo360(record)}>{val}</a>,
      }, {
        fieldCode: "creationDate",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.creationDate").$D("创建日期"),
      }, {
        fieldCode: "supplierCompanyName",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.supplierCompanyName").$D("供应商名称"),
      }, {
        fieldCode: "realName",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.realName").$D("创建人"),
      }, {
        fieldCode: "stageDescription",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.stageDescription").$D("当前阶段"),
      }, {
        fieldCode: "targetStageDescription",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.targetStageDescription").$D("目标阶段"),
      }, {
        fieldCode: "acceptDetails",
        fieldName: this.$T("sslm.commonApplication.view.message.scoreLevelDesc").$D("等级"),
      }, {
        fieldCode: "authorizeFlag",
        fieldName: this.$T("sslm.commonApplication.model.allow.flag").$D("是否特准"),
        render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
      }, {
        fieldCode: "companyName",
        fieldName: this.$T("sslm.commonApplication.model.commonApplication.companyName").$D("公司名称"),
      }, {
        fieldCode: "remark",
        fieldName: this.$T("sslm.commonApplication.model.recommend.remark").$D("说明"),
      }, {
        fieldCode: "templateCode",
        fieldName: this.$T("sslm.commonApplication.view.message.scoreElementCode").$D("评分要素编码"),
      }, {
        fieldCode: "templateName",
        fieldName: this.$T("sslm.commonApplication.view.message.scoreElementDes").$D("评分要素名称"),
      }, {
        fieldCode: "weightedFlag",
        fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.weightCalculation").$D("权重式计算"),
      }, {
        fieldCode: "score",
        fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.score").$D("得分"),
      }, {
        fieldName: this.$T("sslm.supplierDetail.button.relatedForm").$D("关联单据"),
        fieldCode: "relatedForm",
        render: () => <SrmButton plain rect onClick={this.showRelatedForm}>
          {
            this.$T("sslm.supplierDetail.button.seeRelatedForm").$D("查看关联单据")
          }
        </SrmButton>
      }, {
        fieldName: this.$T("sslm.supplierDetail.title.attachment").$D("附件信息"),
        fieldCode: "viewAttachment",
        render: () => <SrmButton plain rect onClick={() => this.showHeaderAttachment()}>
          {
            this.$T("sslm.supplierDetail.button.viewAttachment").$D("查看附件")
          }
        </SrmButton>
      },
      // 协鑫增加链接跳转 src-25192
      window.localStorage.getItem("tenantNum") === "SRM-XXJT" && {
        fieldName: this.$T("sslm.supplierDetail.title.viewSupplierTarget").$D("查看供应商标的"),
        fieldCode: "viewSupplierTarget",
        render:(_, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.jumpToSupplierTarget(record)}>{this.$T("sslm.supplierDetail.title.viewSupplierTarget").$D("查看供应商标的")}</a>,
      },
      // 协鑫增加关联供应商 src-26814
      window.localStorage.getItem("tenantNum") === "SRM-XXJT" && {
        fieldName: this.$T("sslm.supplierDetail.title.associatedSupplier").$D("关联供应商"),
        fieldCode: "viewAssociatedSupplier",
        render:(val, record) => <srm-button type="primary" plain rect onClick={() => this.openAssociatedSupplierModal(record)}>{ this.$T("smbl.common.view.button.view").$D("查看") }</srm-button>,
      }, ].filter(Boolean)
    };
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getQualifiedOrderHead();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.view.message.title.qualifiedApproval").$D(
        "合格供应商审批"
      )
    );
  },
  methods: {
    showHeaderAttachment() {
      this.$showFileList({
        fileList: this.qualifiedAttachmentLines.map((e) => ({
          fileUrl: e.attachmentUrl,
          fileName: e.attachmentDesc,
          fileSize: e.attachmentSize,
          creationDate: e.creationDate,
          bucketName: "private-bucket",
        }))
      });
    },
    showRelatedForm() {
      this.$popup({
        title: this.$T("sslm.supplierDetail.button.relatedForm").$D("关联单据"),
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <SupplierRelatedForm
          supplierCompanyId={this.headInfo.supplierCompanyId}
          requisitionId={this.headInfo.requisitionId}
          toStageId={this.headInfo.toStageId}
          companyId={this.headInfo.companyId}
          parentRouter={this.$router}
        />,
      });
    },
    getSupplyEvalInfoColumns() {
      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.indicatorName}</span>
            <span slot="right">{item.score}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.score.goal").$D("得分"),
          fieldCode: "score",
          fieldType: "TEXT",
          defaultValue: "",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indicateCode").$D("评价项目编号"),
          fieldCode: "indicatorCode",
          fieldType: "TEXT",
          defaultValue: "",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.itemRemark").$D("评分标准"),
          fieldCode: "evalStandard",
          fieldType: "TEXT",
        },
      ];
    },
    getSupplyInfoColumns() {
      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.itemName}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.itemCategoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.supplyFlag").$D("是否可供"),
          fieldCode: "supplyFlag",
          fieldType: "TEXT",
          defaultValue: "",
          render: (val) => {
            if (val) {
              return this.$T("smbl.common.message.yes").$D("是");
            }
            return this.$T("smbl.common.message.no").$D("否");
          },
        },
      ];
    },
    getSupplyCategoryColumns() {
      return [
        {
          fieldCode: "categoryDescription",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.categoryDescription}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.processStatus").$D("状态"),
          fieldCode: "enabledFlag",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evaluationLevel").$D("分类评级"),
          fieldCode: "evaluationLevel",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evaluationScore").$D("分类评分"),
          fieldCode: "evaluationScore",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.alterDate").$D("变更时间"),
          fieldCode: "alterDate",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.alterUserName").$D("变更人"),
          fieldCode: "realName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.alterReason").$D("变更理由"),
          fieldCode: "alterReason",
          fieldType: "TEXT",
        },
      ];
    },
    onSupplyCategoryItemClick() {
    },
    onSupplyEvalInfoItemClick(item) {
      this.showRatingDetailPop(item);
    },
    onSupplyInfoItemClick(item) {
      this.showSupplyDetailPop(item);
    },
    // 获取申请头信息
    async getQualifiedOrderHead() {
      await getOrderHeadInfoApi("qualified", this.changeReqId).then((res) => {
        this.supplyInfoDS.setData(res.qualifiedSupRecList || []);
        this.supplyEvalInfoDS.setData(res.kpiEvalTplIndDTOS || []);
        this.supplyCategoryDS.setData(res.supplierCategoryAlterLines || []);
        // this.supplyCategoryDS.setQueryParameter({
        //   isAssignFlag: this.isAssignFlag ? this.isAssignFlag : 1,
        //   organizationId: window.localStorage.getItem("organizationId"),
        //   supplierCompanyId: this.headInfo.supplierCompanyId,
        //   supplierTenantId: this.headInfo.supplierTenantId
        // });
        this.headInfo = res;
        this.qualifiedAttachmentLines = res.qualifiedAttachmentLines || [];

        this.showSupplyInfoFlag = this.supplyInfoDS && this.supplyInfoDS.data.length > 0;
        this.showsupplyEvalInfoFlag = this.supplyEvalInfoDS && this.supplyEvalInfoDS.data.length > 0;
        this.showSupplyCategoryFlag = this.supplyCategoryDS && this.supplyCategoryDS.data.length > 0;
      });
    },
    // 显示评分明细弹窗
    showRatingDetailPop(data = {}) {
      this.ratingDetail = data;
      this.ratingDetailPop = !this.ratingDetailPop;
    },
    // 显示供货能力弹窗
    showSupplyDetailPop(data) {
      this.supplyDetail = data;
      this.supplyDetailPop = !this.supplyDetailPop;
    },
    // 跳转360详情
    jumpTo360(record) {
      const {
        spfmCompanyId,
        spfmPartnerCompanyId,
        tenantId,
        companyId,
        supplierCompanyId,
        supplierTenantId
      } = record;
      this.$router.push({
        path: "/appSour/SupplierLifeCycleDetail",
        query: {
          spfmCompanyId,
          tenantId,
          companyId,
          supplierCompanyId,
          partnerTenantId:supplierTenantId,
          spfmSupplierCompanyId:spfmPartnerCompanyId,
        }
      });
    },
    // 跳转供应商标的
    jumpToSupplierTarget(record) {
      const { supplierCompanyId } = record;
      this.$router.push({
        path: "/appCux/XxjtSupplierApplication",
        query: {
          sourceFrom:"OTHERS-MODULE",
          supplierCompanyId,
        }
      });
    },
    openAssociatedSupplierModal(record) {
      const associatedSupplierDataSet = new DataSet(associatedSupplierDS());
      const associatedSupplierColumns = [
        {
          fieldName: this.$T("scux.relationSupplier.model.relation.relationCompany").$D("关联企业"),
          fieldCode: "attributeVarchar3Meaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("scux.relationSupplier.model.relation.relationRemark").$D("关联关系说明"),
          fieldCode: "attributeLongtext1Meaning",
          fieldType: "TEXT",
        },
      ];

      const { supplierCompanyId:relationId, tenantId } = record;
      const targetPage = "sslm_life_cycle_qualified_req";
      const tableCode = "scux_srm_xxjt_sslm_linked_supplier";
      const uniqueCode = `${tableCode}@${targetPage}`;
      queryRelTableConfigByParams({
        tableCode,
        uniqueCode,
      }).then((res) => {
        if (res && Array.isArray(res)) {
          const definitionList = res;
          associatedSupplierDataSet.setBodyParameter(
            {
              tableCode: uniqueCode,
              definitionList: definitionList,
              relationId,
              tenantId,
            });
          associatedSupplierDataSet.query().then(() => {
            this.$popup({
              title: this.$T("scux.relationSupplier.view.relation.relationSupplier").$D("关联供应商"),
              showHeader: true,
              showBack: true,
              position: "bottom",
              height: "100vh",
              content: <SrmList
                scrollable={false}
                dataSet={associatedSupplierDataSet}
                columns={associatedSupplierColumns}/>,
            });
          });
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

.title {
  padding: 12px 15px;
  font-weight: 700;
  font-size: 16px;
  text-align: left;
  color: #333;
  line-height: 22px;
  background: #f6f6f6;
}
</style>
