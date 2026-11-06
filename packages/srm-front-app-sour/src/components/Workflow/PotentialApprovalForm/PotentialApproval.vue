<template>
  <div class="detail-wrap">
    <!-- 内容区 -->
    <srm-scroll-tab class="content" customize-code="SMBL.WORKFLOW.POTENTIAL_SUPPLIER_APPROVAL.TABS">
      <!-- 申请头信息 -->
      <srm-scroll-tab-item
        code="header"
        :label="$T('hipspfm.workFlow.view.message.applicationHeader').$D('申请头信息')">
        <div class="content-item">
          <div class="card">
            <customize
              style="padding-top: 10px"
              :columns="getHeadInfoColums"
              :data-source="headInfo"
              code="SMBL.WORKFLOW.POTENTIAL_SUPPLIER_APPROVAL_HEAD_INFO"
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
                'SMBL.WORKFLOW.POTENTIAL_SUPPLIER_APPROVAL_RATING_INFO_DETAIL'
              )
            ">
            <customize
              :columns="getRatingInfoColums"
              :data-source="item"
              code="SMBL.WORKFLOW.POTENTIAL_SUPPLIER_APPROVAL_RATING_INFO"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 供货能力清单 -->
      <srm-scroll-tab-item
        v-if="showSupplyInfoFlag"
        code="supplyInfo"
        :label="$T('sslm.commonApplication.view.message.tab.supplyAbility').$D('供货能力清单')">
        <div class="content-item">
          <div
            v-for="(item, key) in supplyInfo"
            :key="key"
            class="card has-border"
            @click="
              goDetail(
                getSupplyInfoDetailColums,
                item,
                item.itemName,
                'SMBL.WORKFLOW.POTNETIAL_SUPPLIER_SUPPLY_ABILITY_LIST_DETAIL'
              )
            ">
            <customize
              :columns="getSupplyInfoColums"
              :data-source="item"
              code="SMBL.WORKFLOW.POTENTIAL_SUPPLIER_SUPPLY_ABILITY_LIST"/>
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
              code="SMBL.WORKFLOW.POTENTIAL_SUPPLIER_SUPPLY_CATEGORY_LIST"/>
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 潜在供应商审批详情页pop -->
    <srm-detail-pop
      :visible.sync="srmDetailPop"
      :pop-title="headTitle"
      :data-source="detailInfo"
      :pop-customize-code="customizeCode"
      :columns="getPopInfoColumns"/>
    <!-- 评分人信息弹窗 -->
    <srm-popup :visible.sync="evalueUserVisible" height="90%" :title="$T('smbl.common.view.tab.scorerInfo').$D('评分人信息')" rounded>
      <div class="content-item">
        <div v-for="(item, key) in evalueUserInfoList" :key="key" class="card">
          <customize
            :columns="getEvalueUserInfoColums"
            :data-source="item"
            code="SMBL.WORKFLOW.POTENTIAL_SUPPLIER_APPROVAL_RATING_USER_INFO"/>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import SrmDetailPop from "@/components/V5/SrmDetailPop";
import SupplierRelatedForm from "../../SupplierRelatedDoc/SupplierRelatedForm";
import { getSupplyAbilityAttrLineInfoApi, getEvalueUserInfoListApi, getOrderHeadInfoApi } from "./api/index.js";
import uuid from "uuid";

export default {
  modules: [ "ssrc.common", "sodr.common", "hwfp.commom", "sslm.sampleHead", "hwfm.commom", "sprm.common", "sslm.supplierInfoChange", "spcm.common", "scux.commercialTermsPre", "scux.upgradeOrderCreate", "smpc.product", "scux.soSend", "ssrc.projectSetup", "sinv.common", "sqam.common", "scux.watsons", "scux.listOfReviewItems", "smbl.common", "mallf.common", "hipspfm.workFlow", "sslm.commonApplication", "hipspfm.common", "scux.bidEvaluationReport", "sslm.supplyAbility", "hipspfm.supplierLifeCycle", "sslm.evaluationQuery", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "ssrc.inquiryHall", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "hzero.button", "sslm.investigationCorrelation", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "spcm.purchaseContractView", "spcm.contractTemplate", "spcm.purchaseContractType", "sslm.supplierDetail", "ssrc.supplyInfoChange", "sagm.common", "spcm.purchaseRequisitionCreation", "hipspfm.workFlowAgrement", "small.common", "entity.attachment", "sqam.inquiryHall", "ssrc.bidHall", "ssrc.priceLibrary", "ssrc.supplierQuotation", "ssrc.queryRfq", "hipspfm.expertScoring", "hipspfm.invoiceBill", "ssrc.bidHall", "smbl.inquiryHall" ],
  name: "PotentialApproval",
  components: {
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
      uuid: "",
      headInfo: {},
      ratingInfo: [], // 评分信息
      supplyInfo: [], //供货能力清单
      categoryInfo: [], //供应商分类信息
      showRatingInfoFlag:true,
      showSupplyInfoFlag:true,
      showCategoryInfoFlag:true,
      srmDetailPop: false,
      headTitle: "",
      detailInfo: {},
      getPopInfoColumns: [],
      customizeCode: "",
      evalueUserVisible: false,
      potentialAttachmentLines: [],
      evalueUserInfoList: []
    };
  },
  computed: {
    // 申请头信息
    getHeadInfoColums() {
      const columns = [
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.applicationNumber").$D("申请单编号"),
          fieldCode: "potentialNumber",
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
          fieldName: this.$T("sslm.commonApplication.model.coApp.stageDescription").$D("当前阶段"),
          fieldCode: "stageDescription",
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
          fieldName: this.$T("sslm.commonApplication.model.coApp.targetStageDesc").$D("目标阶段"),
          fieldCode: "targetStageDescription",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.companyNum").$D("公司编码"),
          fieldCode: "companyNum",
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
          fieldName: this.$T("sslm.commonApplication.model.coApp.processStatus").$D("状态"),
          fieldCode: "processStatusMeaning",
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
          fieldName: this.$T("sslm.commonApplication.model.authorizeFlag").$D("特准供应商"),
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
                )}{" "}
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
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.score").$D("得分"),
          fieldCode: "score",
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
    // 供货能力清单
    getSupplyInfoColums() {
      const columns = [
        {
          fieldName: "supplyFlag",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{record.itemName}</span>
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
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          formRow: 10,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称"),
          fieldCode: "itemName",
          formRow: 20,
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.itemCategoryName").$D("品类"),
          fieldCode: "itemCategoryName",
          formRow: 30,
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.itemCategoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
          formRow: 30,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.supplyFlag").$D("是否可供"),
          fieldCode: "supplyFlag",
          formRow: 40,
          render: (val) => val ?
            this.$T("hipspfm.common.status.yes").$D("是") :
            this.$T("hipspfm.common.status.no").$D("否"),
        },
      ];

      return columns;
    },
    //供货能力清单详情
    getSupplyInfoDetailColums() {
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
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.itemCategoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.coApp.supplyFlag").$D("是否可供"),
          fieldCode: "supplyFlag",
          render: (val) => val ?
            this.$T("hipspfm.common.status.yes").$D("是") :
            this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("sslm.commonApplication.model.commonApplication.adapterProducts").$D("适配产品"),
          fieldCode: "adapterProducts",
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
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.supplyStatus").$D("可供状态"),
          fieldCode: "supplyStatus",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supAbility.psaEvaluationLevel").$D("PSA评级"),
          fieldCode: "psaEvaluationLevel",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.psaEvaluationScore").$D("PSA评分"),
          fieldCode: "psaEvaluationScore",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.psaFinishDate").$D("PSA完成时间"),
          fieldCode: "psaFinishDate",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaEvaluationLevel").$D("SPA评级"),
          fieldCode: "spaEvaluationLevel",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaEvaluationScore").$D("SPA评分"),
          fieldCode: "spaEvaluationScore",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.spaFinishDate").$D("SPA完成时间"),
          fieldCode: "spaFinishDate",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.evaluateRemark").$D("评价信息"),
          fieldCode: "evaluateRemark",
        },
        {
          fieldName: this.$T("ssrc.supplyInfoChange.view.button.attachuuid").$D("附件"),
          fieldCode: "fileArr",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                color="#276EF1"
                title={this.$T("ssrc.supplyInfoChange.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "ssrc.supplyInfoChange.view.button.viewUpload"
                ).$D("查看")}
              />
            </div>
          ,
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
    this.uuid = uuid();
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getPotentialOrderHead();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.view.message.title.potentialApproval.vue").$D(
        "潜在供应商审批"
      )
    );
  },
  methods: {
    showHeaderAttachment() {
      this.$showFileList({
        fileList: this.potentialAttachmentLines.map((e) => ({
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
    // 获取申请头信息
    async getPotentialOrderHead() {
      const params = {
        customizeUnitCode: "SSLM.SUPPLIER_LIFE_MANAGE.POTENTIAL_ITEM_TABLE,SSLM.SUPPLIER_LIFE_MANAGE.POTENTIAL_HEADER,SSLM.SUPPLIER_LIFE_MANAGE.PURCHASE_HEADER,SSLM.SUPPLIER_LIFE_MANAGE.PURCHASE_LINES,SSLM.SUPPLIER_LIFE_MANAGE.POTENTIAL_SCORE_TABLE,SSLM.SUPPLIER_LIFE_MANAGE.POTENTIAL_ATT_LINE"
      };
      await getOrderHeadInfoApi("potential", this.changeReqId, params).then(
        ({
          potentialHeader = {},
          potentialLines = [],
          kpiEvalTplIndDTOS = [],
          potentialAttachmentLines = [],
          supplierCategoryAlterLines = [],
        } = res) => {
          // eslint-disable-next-line no-unused-vars
          for (let item of potentialAttachmentLines) {
            item.creationDate = item.uploadDate;
          }
          this.headInfo = { ...potentialHeader, potentialAttachmentLines };
          // eslint-disable-next-line no-unused-vars
          for (let item of potentialLines) {
            getSupplyAbilityAttrLineInfoApi(
              item.potentialLineId,
              item.requisitionId
            ).then((res) => {
              item.fileArr = res.content;
            });
          }
          this.supplyInfo = potentialLines;
          this.ratingInfo = kpiEvalTplIndDTOS;
          this.categoryInfo = supplierCategoryAlterLines;
          this.showRatingInfoFlag = this.ratingInfo && this.ratingInfo.length > 0;
          this.showSupplyInfoFlag = this.supplyInfo && this.supplyInfo.length > 0;
          this.showCategoryInfoFlag = this.categoryInfo && this.categoryInfo.length > 0;
          this.potentialAttachmentLines = potentialAttachmentLines || [];
        }
      );
    },
    // eslint-disable-next-line no-shadow
    showFilePop(uuid) {
      this.attachmentUuid = uuid;
      this.filePopup = true;
    },
    // 获取评分人信息列表
    getEvalueUserInfoList(record) {
      getEvalueUserInfoListApi(record.requisitionId, record.indicateLineId).then((res) => {
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
  color: #276EF1;
}

>>> .srm-popup-content {
  padding: 0 15px;
}

.detail-wrap {
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
