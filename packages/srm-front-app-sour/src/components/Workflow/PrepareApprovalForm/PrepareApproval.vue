<template>
  <div>
    <srm-scroll-tab v-if="headInfo" customize-code="SMBL.WORKFLOW.PREPARE_APPROVAL.TABS">
      <srm-scroll-tab-item code="header" :label="$T('hipspfm.workFlow.view.message.applicationHeader').$D('申请头信息')">
        <customize style="padding-top: 10px" :columns="getHeadInfoColums" code="SMBL.WORKFLOW.PREPARE_APPROVAL.HEADER" :data-source="headInfo" need-padding/>
      </srm-scroll-tab-item>
      <!-- 评分信息 -->
      <srm-scroll-tab-item v-if="showLineInfoFlag" code="ratingInfo" :label="$T('sslm.commonApplication.view.message.gradInformation').$D('评分信息')">
        <div v-for="(item, key) in lineInfo" :key="key" @click="showRatingDetailPop(item)">
          <customize style="padding-top: 10px" need-padding :columns="getRatingInfoColums" :data-source="item" code="SMBL.WORKFLOW.PREPARE_APPROVAL.RATING_INFO" />
        </div>
      </srm-scroll-tab-item>
      <!-- 供应商分类 -->
      <srm-scroll-tab-item v-if="showCategoryInfoFlag" code="supplierClass" :label="$T('sslm.commonApplication.view.message.tab.supplierAssort').$D('供应商分类')">
        <div v-for="(item, key) in categoryInfo" :key="key">
          <customize style="padding-top: 10px" need-padding :columns="getCategoryInfoColums" :data-source="item" code="SMBL.WORKFLOW.PREPARE_APPROVAL.SUPPLIER_CATEGORY_INFO"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 评分信息详情弹框 -->
    <srm-popup :visible.sync="ratingPop" width="100%" height="100%" :title="$T('sslm.common.model.score.detail').$D('评分明细')">
      <customize-detail :need-padding="true" :columns="getRatingInfoDetailColums" code="SMBL.WORKFLOW.PREPARE_APPROVAL.RATING_DETIAL_INFO" :data-source="ratingInfo"/>
    </srm-popup>
    <!-- 评分人信息弹窗 -->
    <srm-popup :visible.sync="evalueUserPop" height="90%" rounded :title="$T('sslm.commonApplication.model.commonApplication.scoreInfo').$D('评分人信息')">
      <div v-for="(item, key) in evalueUserInfoList" :key="key">
        <customize need-padding :columns="getEvalueUserInfoColums" :data-source="item" code="SMBL.WORKFLOW.PREPARE_APPROVAL.EVALUR_USER_INFO"/>
      </div>
    </srm-popup>
  </div>
</template>
<script>
import SupplierRelatedForm from "../../SupplierRelatedDoc/SupplierRelatedForm";
import { getEvalueUserInfoListApi, getOrderHeadInfoApi, getSupplierCategoryInfoApi } from "./api/index";
// import { getOrderHeadInfoApi, getSupplierCategoryInfoApi } from "../api/Sw";
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.workFlow", "sslm.commonApplication", "hipspfm.common", "sslm.supplierDetail", "spcm.common", "sslm.investigationCorrelation", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "spcm.purchaseContractView", "spcm.contractTemplate", "spcm.purchaseContractType", "smbl.common", "hipspfm.supplierLifeCycle", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "ssrc.inquiryHall", "sqam.common", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "hzero.button", "sagm.common", "spcm.purchaseRequisitionCreation", "ssrc.common", "hipspfm.workFlowAgrement", "sodr.common", "small.common", "entity.attachment", "sqam.inquiryHall", "ssrc.bidHall", "ssrc.priceLibrary", "ssrc.supplierQuotation", "ssrc.queryRfq", "hipspfm.expertScoring", "hipspfm.invoiceBill", "ssrc.bidHall", "smbl.inquiryHall" ],
  name: "PrepareApproval",
  props: {
    // 传入的单据主键id
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [], // 评分信息
      categoryInfo: [], //供应商分类信息
      showLineInfoFlag: true,
      showCategoryInfoFlag: true,
      prepareAttachmentLines: [], // 行附件
      ratingInfo:{}, // 评分详情信息
      ratingPop:false, // 评分详情pop
      evalueUserInfoList: [], //评分人信息
      evalueUserPop:false, // 评分人详情pop
    };
  },
  computed: {
    // 申请头信息
    getHeadInfoColums() {
      const columns = [
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.applicationNumber").$D("申请单编号"),
          fieldCode: "prepareNumber",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.supplierCompanyNum").$D("供应商编码"),
          fieldCode: "supplierCompanyNum",
          render:(val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.jumpTo360(record)}>{val}</a>,
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.conApp.createDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.LoginName").$D("创建人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.stageDescription").$D("当前阶段"),
          fieldCode: "stageDescription",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.targetStageDesc").$D("目标阶段"),
          fieldCode: "targetStageDescription",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.companyName").$D("公司名称"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.view.message.scoreElementCode").$D("评分要素编码"),
          fieldCode: "templateCode",
        },
        {
          fieldName: this.$T("sslm.commonApplication.view.message.scoreElementDes").$D("评分要素名称"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.score.goal").$D("得分"),
          fieldCode: "score",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.score.scoreLevelDesc").$D("等级"),
          fieldCode: "scoreLevelDesc",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.supplier.authorized").$D("是否特准"),
          fieldCode: "authorizeFlag",
          render: (val) => val ?
            this.$T("hipspfm.common.status.yes").$D("是") :
            this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.supplier.weightFlag").$D("权重式计算"),
          fieldCode: "weightedFlag",
          render: (val) => val ?
            this.$T("hipspfm.common.status.yes").$D("是") :
            this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.remark").$D("说明"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sslm.supplierDetail.button.relatedForm").$D("关联单据"),
          fieldCode: "relatedForm",
          render: () => <SrmButton plain rect onClick={this.showRelatedForm}>
            {
              this.$T("sslm.supplierDetail.button.seeRelatedForm").$D("查看关联单据")
            }
          </SrmButton>
        },
        {
          fieldName: this.$T("sslm.supplierDetail.title.attachment").$D("附件信息"),
          fieldCode: "viewAttachment",
          render: () => <SrmButton plain rect onClick={() => this.showHeaderAttachment()}>
            {
              this.$T("sslm.supplierDetail.button.viewAttachment").$D("查看附件")
            }
          </SrmButton>
        },
      ];

      return columns;
    },
    // 评分信息
    getRatingInfoColums() {
      const columns = [
        {
          fieldCode: "indicatorName",
          fieldType: "EMPTY",
          langCode: "sslm.commonApplication.model.coApp.indicatorName",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span> { record.indicatorName } </span>
              <span slot="right" style="font-weight: 700; color:var(--color-font-default-e);">
                { this.$T("sslm.commonApplication.model.score.goal").$D("得分") } : { record.score }
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indicateCode").$D("评价项目编号"),
          fieldCode: "indicatorCode",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.itemRemark").$D("评分标准"),
          fieldCode: "evalStandard",
        },
      ];

      return columns;
    },
    //评分信息详情
    getRatingInfoDetailColums() {
      const columns = [
        {
          fieldName: this.$T("sslm.commonApplication.model.score.goal").$D("得分"),
          fieldCode: "score",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indicateCode").$D("评价项目编号"),
          fieldCode: "indicatorCode",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indicatorName").$D("评价项目"),
          fieldCode: "indicatorName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evalStandard").$D("评分标准"),
          fieldCode: "evalStandard",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.scoreTypeMeaning").$D("评分方式"),
          fieldCode: "scoreTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indicatorTypeMeaning").$D("指标类型"),
          fieldCode: "indicatorTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.scoreFrom").$D("分值从"),
          fieldCode: "scoreFrom",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.scoreTo").$D("分值至"),
          fieldCode: "scoreTo",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indicatorScore").$D("指标分值"),
          fieldCode: "indicatorScore",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evalueInfo").$D("评分人信息"),
          fieldCode: "evalueInfo",
          render: (val, record) => {
            // console.log(record, "record");
            const btnName = this.$T("sslm.commonApplication.model.evalueInfo").$D("评分人信息");
            return <span style={{ color: "blue" }} onClick={() => this.getEvalueUserInfoList(record)}>
              { btnName }
            </span>;
          },
        },
      ];

      return columns;
    },
    //评分人信息
    getEvalueUserInfoColums() {
      const columns = [
        {
          fieldName: "respLoginName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{record.respLoginName}-{record.respUserName}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.supplyAbility.respUserName").$D("用户描述"),
          fieldCode: "respUserName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.supplyAbility.respWeight").$D("权重（%）"),
          fieldCode: "respWeight",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.supplyAbility.score").$D("评分"),
          fieldCode: "score",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.isStandard").$D("符合评分标准"),
          fieldCode: "isStandard",
          render: (val) => val ?
            this.$T("hipspfm.common.status.yes").$D("是") :
            this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.isVeto").$D("否决该项"),
          fieldCode: "isVeto",
          render: (val) => val ?
            this.$T("hipspfm.common.status.yes").$D("是") :
            this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("sslm.commonApplication.supplyAbility.remark").$D("评分项说明"),
          fieldCode: "remark",
        },
      ];

      return columns;
    },
    // 供应商分类
    getCategoryInfoColums() {
      const columns = [
        {
          fieldCode: "categoryDescription",
          fieldType: "EMPTY",
          langCode: "sslm.commonApplication.view.message.tab.supplierAssort",
          formRow: 0,
          render: (val, record) => {
            const enabledFlagStr = record.enabledFlag ? this.$T("hipspfm.common.status.enabledFlag.enable").$D("启用") : this.$T("hipspfm.common.status.enabledFlag.disable").$D("禁用");
            return <SrmListHeader showOpenTag={false}>
              <span>{ record.categoryDescription }</span>
              <span slot="right" style="font-weight: 700; color:var(--color-font-default-e);">
                { this.$T("sslm.commonApplication.model.coApp.processStatus").$D("状态")} ：{ enabledFlagStr }
              </span>
            </SrmListHeader>;
          }
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evaluationLevel").$D("分类评级"),
          fieldCode: "evaluationLevel",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evaluationScore").$D("分类评分"),
          fieldCode: "evaluationScore",
        },
        {
          fieldName: this.$T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.alterDate").$D("变更时间"),
          fieldCode: "alterDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
          ,
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.alterUserName").$D("变更人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.alterReason").$D("变更理由"),
          fieldCode: "alterReason",
        },
      ];

      return columns;
    },
  },
  async mounted () {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getPrepareOrderHead();
        await this.getSupplierCategoryInfo(
          this.headInfo.supplierCompanyId,
          this.headInfo.supplierTenantId
        );
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    // 设置表单标题
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.view.message.title.prepareApproval").$D(
        "预留供应商审批"
      )
    );
  },
  methods: {
    showRatingDetailPop(item) {
      this.ratingInfo = {};
      this.ratingPop = !this.ratingPop;
      this.ratingInfo = item;
    },
    //行附件
    showHeaderAttachment() {
      this.$showFileList({
        fileList: this.prepareAttachmentLines.map((e) => ({
          fileUrl: e.attachmentUrl,
          fileName: e.attachmentDesc,
          fileSize: e.attachmentSize,
          creationDate: e.creationDate,
          bucketName: "private-bucket",
        }))
      });
    },
    // 关联单据
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
    // 获取推荐单头信息
    async getPrepareOrderHead() {
      await getOrderHeadInfoApi("prepare", this.changeReqId).then(
        ({
          prepareHeader = {},
          kpiEvalTplIndDTOS = [],
          prepareAttachmentLines = []
        // eslint-disable-next-line no-undef
        } = res) => {
          this.headInfo = prepareHeader;
          // this.recommendInfo = recommendItemLines;
          this.lineInfo = kpiEvalTplIndDTOS;
          this.showLineInfoFlag = this.lineInfo && this.lineInfo.length > 0;
          this.prepareAttachmentLines = prepareAttachmentLines || [];
        }
      );
    },
    // 获取供应商分类信息
    async getSupplierCategoryInfo(supplierCompanyId, supplierTenantId) {
      const params = {
        page: 0,
        size: 400,
        isAssignFlag: this.isAssignFlag ? this.isAssignFlag : 1,
        organizationId: SrmUtil.getOrganizationId(),
        supplierCompanyId: supplierCompanyId,
        supplierTenantId: supplierTenantId
      };
      await getSupplierCategoryInfoApi(params).then((res) => {
        // console.log("res:", res);
        if (res && !res.empty) {
          this.categoryInfo = res.content;
          this.showCategoryInfoFlag = this.categoryInfo && this.categoryInfo.length > 0;
        }
      });
    },
    // 获取评分人信息列表
    getEvalueUserInfoList(record) {
      getEvalueUserInfoListApi(record.requisitionId, record.indicateLineId, this.headInfo.stageCode, this.headInfo.templateId).then((res) => {
        // console.log(res, "res");
        this.evalueUserInfoList = res;
        this.evalueUserPop = !this.evalueUserPop;
      });
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
  }
};
</script>