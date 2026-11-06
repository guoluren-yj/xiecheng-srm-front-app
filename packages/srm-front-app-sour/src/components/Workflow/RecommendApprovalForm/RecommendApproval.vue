<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <srm-scroll-tab class="content" customize-code="SMBL.WORKFLOW.RECOMMEND_SUPPLIER_APPROVAL.TABS">
      <!-- 申请头信息 -->
      <srm-scroll-tab-item
        code="header"
        :label="$T('hipspfm.workFlow.view.message.applicationHeader').$D('申请头信息')">
        <div class="content-item">
          <div class="card">
            <customize
              :columns="getHeadInfoColums"
              :data-source="headInfo"
              code="SMBL.WORKFLOW.RECOMMEND_SUPPLIER_APPROVAL_APPLY_HEADER_INFO"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 评分信息 -->
      <srm-scroll-tab-item
        v-if="showRatingInfoFlag"
        code="ratingInfo"
        :label="$T('sslm.commonApplication.view.message.gradInformation').$D('评分信息')">
        <div class="content-item">
          <div
            v-for="(item, key) in ratingInfo"
            :key="key"
            class="card has-border"
            @click="
              goDetail(
                getRatingInfoDetailColums,
                item,
                item.indicatorName,
                'SMBL.WORKFLOW.RECOMMEND_SUPPLIER_APPROVAL_RATING_INFO_DETAIL'
              )
            ">
            <customize
              :columns="getRatingInfoColums"
              :data-source="item"
              code="SMBL.WORKFLOW.RECOMMEND_SUPPLIER_APPROVAL_RATING_INFO"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 推荐物料品类 -->
      <srm-scroll-tab-item
        v-if="showRecommendInfoFlag"
        code="categoryMaterial"
        :label="$T('sslm.commonApplication.view.message.categoryMaterial').$D('推荐物料/品类')">
        <div class="content-item">
          <div
            v-for="(item, key) in recommendInfo"
            :key="key"
            class="card has-border"
            @click="
              goDetail(
                getRecommendInfoDetailColums,
                item,
                item.itemName,
                'SMBL.WORKFLOW.RECOMMEND_SUPPLIER_APPROVAL_CATE_MATE_INFO_DETAIL'
              )
            ">
            <customize
              :columns="getRecommendInfoColums"
              :data-source="item"
              code="SMBL.WORKFLOW.RECOMMEND_SUPPLIER_APPROVAL_CATEGORY_MATERIAL_INFO"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 供应商分类 -->
      <srm-scroll-tab-item
        v-if="showCategoryInfoFlag"
        code="supplierClass"
        :label="$T('sslm.commonApplication.view.message.tab.supplierAssort').$D('供应商分类')">
        <div class="content-item">
          <div v-for="(item, key) in categoryInfo" :key="key" class="card">
            <customize
              :columns="getCategoryInfoColums"
              :data-source="item"
              code="SMBL.WORKFLOW.RECOMMEND_SUPPLIER_APPROVAL_SUPPLIER_CATEGORY"/>
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="srmDetailPop"
               height="100%"
               :title="headTitle"
               :show-back="false">
      <customize-detail
        class="card-pop"
        :columns="getPopInfoColumns"
        :code="customizeCode"
        :data-source="detailInfo"/>
    </srm-popup>
    <!-- 评分人信息弹窗 -->
    <srm-popup :visible.sync="evalueUserVisible" height="90%" :title="$T('smbl.common.view.tab.scorerInfo').$D('评分人信息')" rounded>
      <div class="content-item">
        <div v-for="(item, key) in evalueUserInfoList" :key="key" class="card">
          <customize
            :columns="getEvalueUserInfoColums"
            :data-source="item"
            code="SMBL.WORKFLOW.RECOMMEND_SUPPLIER_APPROVAL_RATER_INFO"/>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import SupplierRelatedForm from "../../SupplierRelatedDoc/SupplierRelatedForm";
import { getEvalueUserInfoListApi, getOrderHeadInfoApi, getSupplierCategoryInfoApi } from "./api/index";
// import { getOrderHeadInfoApi, getSupplierCategoryInfoApi } from "../api/Sw";

export default {
  modules: [ "ssrc.common", "sodr.common", "hwfp.commom", "sslm.sampleHead", "hwfm.commom", "sprm.common", "sslm.supplierInfoChange", "spcm.common", "scux.commercialTermsPre", "scux.upgradeOrderCreate", "smpc.product", "scux.soSend", "ssrc.projectSetup", "sinv.common", "sqam.common", "scux.watsons", "scux.listOfReviewItems", "smbl.common", "mallf.common", "hipspfm.workFlow", "sslm.commonApplication", "hipspfm.common", "scux.bidEvaluationReport", "sslm.supplyAbility", "hipspfm.supplierLifeCycle", "ssrc.supplyInfoChange", "sslm.supplierDetail", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "spcm.purchaseContractView", "spcm.contractTemplate", "sslm.investigationCorrelation", "spcm.purchaseContractType", "ssrc.inquiryHall", "hzero.button", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "entity.supplier", "entity.company", "entity.organization", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "ssrc.inquiryHall", "sqam.common", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "hzero.button", "sagm.common", "spcm.purchaseRequisitionCreation", "hipspfm.workFlowAgrement", "small.common", "entity.attachment", "sqam.inquiryHall", "ssrc.bidHall", "ssrc.priceLibrary", "ssrc.supplierQuotation", "ssrc.queryRfq", "hipspfm.expertScoring", "hipspfm.invoiceBill", "ssrc.bidHall", "smbl.inquiryHall" ],
  name: "RecommendApproval",
  components: {
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      uuid: "",
      headInfo: {},
      ratingInfo: [], // 评分信息
      recommendInfo: [], //推荐物料/品类
      categoryInfo: [], //供应商分类信息
      srmDetailPop: false,
      headTitle: "",
      detailInfo: {},
      getPopInfoColumns: [],
      customizeCode: "",
      evalueUserVisible: false,
      evalueUserInfoList: [],
      recommendAttachmentLines: [],
      showRatingInfoFlag: true,
      showCategoryInfoFlag: true,
      showRecommendInfoFlag: true,
    };
  },
  computed: {
    // 申请头信息
    getHeadInfoColums() {
      const columns = [
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.applicationNumber").$D("申请单编号"),
          fieldCode: "recommendNumber",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.supplierCompanyNum").$D("供应商编码"),
          fieldCode: "supplierCompanyNum",
          render:(val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.jumpTo360(record)}>{val}</a>,
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.conApp.createDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.Log inName").$D("创建人"),
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
          fieldName: this.$T("sslm.commonApplication.model.coApp.companyName").$D("公司名称"),
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
              <span>{val}</span>
              <span
                slot="right"
                style="font-weight: 700; color:var(--color-font-default-e);"
              >
                {this.$T("sslm.commonApplication.model.score.goal").$D(
                  "得分"
                )}
                  : {record.score}
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
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.score").$D("得分"),
          fieldCode: "score",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.indicatorCode").$D("评价项目编号"),
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
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.totalScore").$D("未加权评分"),
          fieldCode: "totalScore",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.evalueInfo").$D("评分人信息"),
          fieldCode: "evalueInfo",
          render: (val, record) => {
            console.log(record, "record");
            return <span style={{ color: "blue" }} onClick={() => this.getEvalueUserInfoList(record)}>
              {this.$T("sslm.commonApplication.model.evalueInfo").$D(
                "评分人信息"
              )}
            </span>;
          },
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.allExplain").$D("反馈备注"),
          fieldCode: "allExplain",
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
    // 推荐物料/品类
    getRecommendInfoColums() {
      const columns = [
        {
          fieldName: "supplyFlag",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{record.itemCategoryName}</span>
              <span
                slot="right"
                style="font-weight: 700; color:var(--color-font-default-e);"
              >
                {this.$T("sslm.commonApplication.model.coApp.supplyFlag").$D(
                  "是否可供"
                )}
                  ：
                {record.supplyFlag === 1 ?
                  this.$T("hipspfm.common.status.yes").$D("是") :
                  this.$T("hipspfm.common.status.no").$D("否")}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.itemName").$D("物料"),
          fieldCode: "itemName",
        },
      ];

      return columns;
    },
    //推荐物料/品类详情
    getRecommendInfoDetailColums() {
      const columns = [
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.itemCategoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.itemCategoryName").$D("品类"),
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.adapterProducts").$D("适配产品"),
          fieldCode: "adapterProducts",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.supplyFlag").$D("是否可供"),
          fieldCode: "supplyFlag",
          render: (val) => val ?
            this.$T("hipspfm.common.status.yes").$D("是") :
            this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.countryIdMeaning").$D("服务国家"),
          fieldCode: "countryIdMeaning",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.regionIdMeaning").$D("服务地区"),
          fieldCode: "regionIdMeaning",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.cityIdMeaning").$D("服务城市"),
          fieldCode: "cityIdMeaning",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.dateFrom").$D("有效期从"),
          fieldCode: "dateFrom",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.dateTo").$D("有效期至"),
          fieldCode: "dateTo",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.marketCompetitionCode").$D("市场竞争力"),
          fieldCode: "marketCompetitionMeaning",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.priceLevel").$D("价格水平"),
          fieldCode: "priceLevelMeaning",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.mainCustomers").$D("主要客户"),
          fieldCode: "mainCustomers",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.mainProducts").$D("主要项目"),
          fieldCode: "mainProducts",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.table.remark").$D("备注"),
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
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{val}</span>
              <span
                slot="right"
                style="font-weight: 700; color:var(--color-font-default-e);"
              >
                {this.$T(
                  "sslm.commonApplication.model.coApp.processStatus"
                ).$D("状态")}{" "}
                  ：
                {record.enabledFlag ?
                  this.$T("hipspfm.common.status.enabledFlag.enable").$D(
                    "启用"
                  ) :
                  this.$T("hipspfm.common.status.enabledFlag.disable").$D(
                    "禁用"
                  )}
              </span>
            </SrmListHeader>
          ,
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
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getRecommendOrderHead();
        // 直接从头查询接口中取供应商分类信息
        // await this.getSupplierCategoryInfo(
        //   this.headInfo.supplierCompanyId,
        //   this.headInfo.supplierTenantId
        // );
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.view.message.title.recommendApproval").$D(
        "推荐供应商审批"
      )
    );
  },
  methods: {
    showHeaderAttachment() {
      this.$showFileList({
        fileList: this.recommendAttachmentLines.map((e) => ({
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
    //跳到详情页
    goDetail(columns, infos, title, code) {
      this.getPopInfoColumns = columns;
      this.detailInfo = infos;
      this.headTitle = title;
      this.srmDetailPop = !this.srmDetailPop;
      this.customizeCode = code;
    },
    // 获取推荐单头信息
    async getRecommendOrderHead() {
      await getOrderHeadInfoApi("recommend", this.changeReqId).then(
        ({
          recommendHeader = {},
          recommendItemLines = [],
          kpiEvalTplIndDTOS = [],
          recommendAttachmentLines = [],
          supplierCategoryAlterLines = []
        } = res) => {
          this.headInfo = recommendHeader;
          this.recommendInfo = recommendItemLines;
          this.ratingInfo = kpiEvalTplIndDTOS;
          this.recommendAttachmentLines = recommendAttachmentLines || [];
          this.categoryInfo = supplierCategoryAlterLines || [];
          this.showRatingInfoFlag = this.ratingInfo && this.ratingInfo.length > 0;
          this.showCategoryInfoFlag = this.categoryInfo && this.categoryInfo.length > 0;
          this.showRecommendInfoFlag = this.recommendInfo && this.recommendInfo.length > 0;
        }
      );
    },
    // 获取供应商分类信息
    async getSupplierCategoryInfo(supplierCompanyId, supplierTenantId) {
      const params = {
        page: 0,
        size: 400,
        isAssignFlag: this.isAssignFlag ? this.isAssignFlag : 1,
        organizationId: window.localStorage.getItem("organizationId"),
        supplierCompanyId: supplierCompanyId,
        supplierTenantId: supplierTenantId
      };
      await getSupplierCategoryInfoApi(params).then((res) => {
        if (res && !res.empty) {
          this.categoryInfo = res.content;
        }
      });
    },
    // 显示推荐平品类明细弹窗
    showRecommendDetailPop(data) {
      this.recommendDetail = data;
      setTimeout(() => {
        this.recommendDetailPop = !this.recommendDetailPop;
      }, 150);
    },
    // 获取评分人信息列表
    getEvalueUserInfoList(record) {
      getEvalueUserInfoListApi(record.requisitionId, record.indicateLineId).then((res) => {
        console.log(res, "res");
        this.evalueUserVisible = !this.evalueUserVisible;
        this.evalueUserInfoList = res;
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
    }
  },
};
</script>

<style lang="stylus" scoped>

>>> .srm-popup-content {
  padding: 0 15px;
}

.detail-wrap {
  width: 100%;
  min-height: 500px;
  .content {
    .card {
      box-sizing: border-box;
      padding: 16px 15px 16px 15px;
    }
  }
}

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
