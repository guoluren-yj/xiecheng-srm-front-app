<template>
  <!-- 发布准备 -->
  <section>
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('refBasicInfo')">
        <ul style="padding: 16px 15px;"
            @click="openPopup('refBasicInfoDetail', {code: 'SMBL.INQUIRY_HALL.RP.BASICINFO.DETAIL', columns: getColumns('refBasicInfoDetail'), data: headInfo})">
          <customize
            :data-source="headInfo"
            :columns="getColumns('refBasicInfo')"
            code="SMBL.INQUIRY_HALL.RP.BASICINFO"
            type="list"
            :need-padding="false"/>
        </ul>
      </srm-scroll-tab-item>
      <!-- 采购组织及人员 -->
      <srm-scroll-tab-item :label="getLanguageDefine('purOrganizationAndStaff')">
        <ul style="padding: 16px 15px;">
          <customize
            :data-source="headInfo"
            :columns="getColumns('demandSide')"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank size="mid" theme="fill"/>
        <ul style="padding: 16px 15px;">
          <customize
            :data-source="headInfo"
            :columns="getColumns('procureExec')"
            code="SMBL.INQUIRY_HALL.RP.PROCUREEXEC"
            type="list"
            :need-padding="false"/>
        </ul>
      </srm-scroll-tab-item>
      <!-- 询价标的物 -->
      <srm-scroll-tab-item :label="getLanguageDefine('sectionItem')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="sectionItemDataSet"
                  :columns="getColumns('sectionItem')"
                  customize-code="SMBL.INQUIRY_HALL.RP.SECTIONITEM"
                  @itemClick="clickSectionItem"/>
      </srm-scroll-tab-item>
      <!-- 对供应商要求 -->
      <!-- :data-type="dataType" -->
      <srm-scroll-tab-item :label="getLanguageDefine('supplierWithRequest')">
        <risk-result-panel
          :business-number="headInfo.rfxNum"
          :business-type="headInfo.secondarySourceCategory"
          :organization-id="organizationId"
          :lang="lang"/>
        <ul style="padding: 16px 15px;">
          <customize
            :columns="getColumns('supplierRequireHead')"
            :data-source="headInfo"
            :code="getCustomizeCode('supplierWithRequest')"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank v-if="headInfo.sourceMethod === 'INVITE'" size="mid" theme="fill"/>
        <srm-list v-if="headInfo.sourceMethod === 'INVITE'"
                  :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="supplierInfoDataSet"
                  :columns="getColumns('supplierList')"
                  customize-code="SMBL.INQUIRY_HALL.RP.SUPPLIERLIST"
                  @itemClick="clickSupplierList"/>
      </srm-scroll-tab-item>
      <!-- 询价要求 -->
      <srm-scroll-tab-item :label="getLanguageDefine('rfxDeamnd')">
        <!-- 寻源准备 -->
        <ul v-if="headInfo.rfxHeaderId" style="padding: 16px 15px;">
          <customize
            :columns="getColumns('rfxPrepare')"
            :data-source="headInfo"
            :code="getCustomizeCode('rfxPrepare')"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank size="mid" theme="fill"/>
        <!-- 报价 -->
        <ul v-if="headInfo.rfxHeaderId" style="padding: 10px 15px 16px 15px;"
            @click="openPopup('quotation', {code: 'SMBL.INQUIRY_HALL.RP.QUOTATION.DETAIL', columns: getColumns('quotationDetail'), data: headInfo})">
          <customize
            :data-source="headInfo"
            :columns="getColumns('quotation')"
            code="SMBL.INQUIRY_HALL.RP.QUOTATION"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank v-if="headInfo.roundHeaderDates && headInfo.roundHeaderDates.length > 0" size="mid" theme="fill"/>
        <!-- 自动多轮报价 -->
        <ul v-if="headInfo.roundHeaderDates && headInfo.roundHeaderDates.length > 0" style="padding: 10px 15px 16px 15px;">
          <customize
            style="padding-bottom: 10px"
            :columns="getColumns('autoRoundQuotation')"
            :data-source="headInfo"
            type="list"
            :need-padding="false"/>
          <template v-for="(item, index) of headInfo.roundHeaderDates">
            <customize
              :key="index"
              :style="{'padding-bottom': index !== headInfo.roundHeaderDates.length -1 ? '10px' : '0'}"
              :columns="getColumns('autoRoundQuotationLine')"
              :data-source="item"
              :code="getCustomizeCode('autoRoundQuotationLine')"
              type="list"
              :need-padding="false"/>
          </template>
        </ul>
        <srm-blank v-if="headInfo.preQualificationFlag === 1" size="mid" theme="fill"/>
        <!-- 资格预审 -->
        <ul v-if="headInfo.preQualificationFlag === 1" style="padding: 10px 15px 16px 15px;">
          <customize
            :columns="getColumns('preQualificationHead')"
            :data-source="headInfo"
            :code="getCustomizeCode('preQualification')"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank v-if="expertInfoDataSet.data.length > 0" size="mid" theme="fill"/>
        <!-- 专家 -->
        <ul v-if="expertInfoDataSet.data.length > 0">
          <customize
            style="padding: 10px 15px 0px 15px;"
            :columns="getColumns('expertHead')"
            type="list"
            :need-padding="false"/>
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="expertInfoDataSet"
                    :columns="getColumns('expert')"
                    customize-code="SMBL.INQUIRY_HALL.RP.EXPERT"
                    @itemClick="clickExpert"/>
        </ul>
        <srm-blank v-if="scoreIndicDataSet.data.length > 0" size="mid" theme="fill"/>
        <!-- 符合性检查 -->
        <ul v-if="scoreIndicDataSet.data.length > 0">
          <customize
            style="padding: 10px 15px 0px 15px;"
            :columns="getColumns('initialReviewIndicHead')"
            :code="getCustomizeCode('initialReviewIndicHead')"
            type="list"
            :need-padding="false"/>
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="scoreIndicDataSet"
                    :columns="getColumns('initialReviewIndic')"
                    :customize-code="getCustomizeCode('initialReviewIndicHead')"/>
        </ul>
        <srm-blank v-if="indicsInfoDataSet.data.length > 0 || technologyIndicDataSet.data.length > 0" size="mid" theme="fill"/>
        <!-- 评分要素 -->
        <ul v-if="indicsInfoDataSet.data.length > 0">
          <customize
            style="padding: 10px 15px 0px 15px;"
            :columns="getColumns('scoringElementsHead')"
            type="list"
            :need-padding="false"/>
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="indicsInfoDataSet"
                    :columns="getColumns('scoringElements')"
                    customize-code="SMBL.INQUIRY_HALL.RP.SCORINGELEMENTS"
                    @itemClick="clickScoringElements"/>
        </ul>
        <ul v-if="technologyIndicDataSet.data.length > 0">
          <customize
            style="padding: 10px 15px 0px 15px;"
            :data-source="headInfo"
            :columns="getColumns('scoringTechnicalGroupHead')"
            type="list"
            :need-padding="false"/>
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="technologyIndicDataSet"
                    :columns="getColumns('scoringElements')"
                    customize-code="SMBL.INQUIRY_HALL.RP.SCORINGELEMENTS"
                    @itemClick="clickScoringElements"/>
        </ul>
        <srm-blank v-if="businessIndicDataSet.data.length > 0" size="mid" theme="fill"/>
        <ul v-if="businessIndicDataSet.data.length > 0">
          <customize
            style="padding: 10px 15px 0px 15px;"
            :data-source="headInfo"
            :columns="getColumns('scoringBusinessGroupHead')"
            type="list"
            :need-padding="false"/>
          <srm-list :scrollable="false"
                    height="auto"
                    style="height: auto"
                    :data-set="businessIndicDataSet"
                    :columns="getColumns('scoringElements')"
                    customize-code="SMBL.INQUIRY_HALL.RP.SCORINGELEMENTS"
                    @itemClick="clickScoringElements"/>
        </ul>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item :label="getLanguageDefine('attachment')">
        <ul style="padding: 16px 15px;">
          <customize
            :columns="getColumns('attachment')"
            :data-source="headInfo"
            :code="getCustomizeCode('attachment')"
            type="list"
            :need-padding="false"/>
        </ul>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 风险扫描 -->
    <iframe-popup
      v-model="riskScanPopup"
      :title="$T('ssrc.inquiryHall.model.inquiryHall.riskScan').$D('风险扫描')"
      :src="riskScanUrl"/>
    <!-- 弹框 -->
    <srm-popup :visible.sync="visiblePopup"
               :show-header="false"
               height="100%">
      <!-- 阶梯报价 -->
      <div v-if="ladderQuotationVisible">
        <ul style="padding: 16px 0 12px 15px">
          <customize
            :data-source="infoPopup"
            :columns="getColumns('ladderQuotationHead')"
            :code="getCustomizeCode('ladderQuotationHead')"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank size="mid" theme="fill" />
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="ladderQuotationDataSet"
                  :columns="getColumns('ladderQuotation')"
                  :customize-code="getCustomizeCode('ladderQuotation')"/>
      </div>
      <!-- 报价明细 -->
      <section v-if="quotationVisible">
        <srm-scroll-tab >
          <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
            <ul style="padding: 16px 0 12px 15px">
              <customize
                :data-source="infoPopup"
                :columns="getColumns('quotationHead')"
                :code="getCustomizeCode('quotationHead')"
                type="list"
                :need-padding="false"/>
            </ul>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item :label="getLanguageDefine('quotationDetail')">
            <ul>
              <div v-for="(item, index) of quotationModuleList" :key="index">
                <ul style="padding: 10px 0px 10px 15px; border-bottom: 1px solid var(--background-color-empty-second);">
                  <customize
                    :data-source="item.templateObj"
                    :columns="getColumns('quotationDetailHead')"
                    type="list"
                    :need-padding="false"/>
                </ul>
                <srm-list :scrollable="false"
                          height="auto"
                          style="height: auto"
                          :data-set="item.quotationDetailDataSet"
                          :columns="item.quotationColumns"
                          :customize-code="getCustomizeCode('quotationDetailPopup')"/>
                <srm-blank v-if="index !== quotationModuleList.length - 1" size="large" theme="fill"/>
              </div>
            </ul>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </section>
      <!-- 筛选物料 -->
      <srm-list v-if="filterMaterialVisible"
                :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="filterMaterialDataSet"
                :columns="getColumns('filterMaterial')"
                :customize-code="getCustomizeCode('filterMaterial')"/>
      <!-- 评分要素细项 -->
      <srm-list v-if="scoringElementShowVisible"
                :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="scoringElementShowDataSet"
                :columns="getColumns('scoringElementShow')"
                :customize-code="getCustomizeCode('scoringElementShow')"/>
      <!-- 专家分配 -->
      <srm-list v-if="expertAllocationVisible"
                :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="expertAllocationDataSet"
                :columns="getColumns('expertAllocation')"
                :customize-code="getCustomizeCode('expertAllocation')"/>
    </srm-popup>

    <!-- 详情弹框 -->
    <srm-popup :visible.sync="visibleDetailPopup"
               :show-header="false"
               height="100%">
      <customize-detail
        :need-padding="true"
        :code="infoDetailPopup.code"
        :data-source="infoDetailPopup.data"
        :columns="infoDetailPopup.columns"/>
    </srm-popup>
  </section>
</template>

<script>
import { getHeaderApi, getRfxExperts, getRfxIndics, queryMonitor, getQuotationDetailApi } from "../api/ReleasePreparation";
import { sectionItemDs, supplierInfoDs, expertInfoDs, scoreIndicDs, indicsInfoDs, technologyIndicDs, businessIndicDs, expertAllocationDs, scoringElementShowDs, filterMaterialDs, ladderQuotationDs, quotationDetailDs } from "../datasource/ReleasePreparationDs";
import { $T, DataSet, SrmUtil } from "srm-mobile-ui";
import { formatMinutes } from "@/utils/filter";
import IframePopup from "./IframePopup";
import RiskResultPanel from "../../../components/RiskResultPanel/Result.vue";
import { getUomName, getQtyName } from "../../../utils/doubleUnit";
export default {
  modules: [ "sdat.riskTroubleshoot", "ssrc.queryRfq", "ssrc.inquiryHall", "hipspfm.common", "ssrc.common", "smbl.common", "hipspfm.expertScoring" ],
  name: "ReleasePreparation",
  components: { IframePopup, RiskResultPanel },
  props: {
    rfxHeaderId: {
      type: String,
    },
    doubleUnitFlag: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      // 基础信息
      headInfo: {},
      lang: SrmUtil.getLanguage(),
      organizationId: SrmUtil.getTenantId(),
      // 询价标的物
      sectionItemDataSet: new DataSet(),
      // 供应商列表
      supplierInfoDataSet: new DataSet(),
      // 专家
      expertInfoDataSet: new DataSet(),
      // 符合性检查
      scoreIndicDataSet: new DataSet(),
      // 评分要素 - 总
      indicsInfoDataSet: new DataSet(),
      // 评分要素 - 技术
      technologyIndicDataSet: new DataSet(),
      // 评分要素 - 商务
      businessIndicDataSet: new DataSet(),
      // 弹框
      visiblePopup: false,
      infoPopup: {},
      // 专家分配
      expertAllocationDataSet: new DataSet(),
      expertAllocationVisible: false,
      // 评分要素细项
      scoringElementShowDataSet: new DataSet(),
      scoringElementShowVisible: false,
      // 筛选物料
      filterMaterialDataSet: new DataSet(),
      filterMaterialVisible: false,
      // 阶梯报价
      ladderQuotationDataSet: new DataSet(),
      ladderQuotationVisible: false,
      // 报价明细
      quotationVisible: false,
      quotationModuleList: [],
      // 下级报价明细
      nextQuotationDetailsDataSet: new DataSet(quotationDetailDs()),
      quotationColumns: [],
      // 风险扫描
      riskScanPopup: false,
      riskScanUrl: "",
      // 详情弹框
      visibleDetailPopup: false,
      infoDetailPopup: false,
    };
  },
  // 获取字段
  computed: {
    getColumns() {
      return (title) => {
        let nameList = [];
        const roundQuotationRule = this.headInfo.roundQuotationRule;
        const autoRoundQuotationFlag =
          roundQuotationRule === "AUTO" ||
          roundQuotationRule === "AUTO_CHECK" ||
          roundQuotationRule === "AUTO_SCORE";
        const biddingPriceFlag = this.headInfo.sourceCategory === "RFA"; // 竞价标识
        // 主页面
        switch (title) {
        case "refBasicInfo" :
          nameList = [ "rfxNumHead", "sourceProjectNum", "sourceProjectName", "sectionName", "templateName", "rfxRemark", "budgetAmount", "totalEstimatedAmount" ];
          break;
        case "refBasicInfoDetail":
          nameList = [ "rfxNum", "sourceProjectNum", "sourceProjectName", "sectionName", "templateName", "rfxRemark", "budgetAmount", "totalEstimatedAmount" ];
          break;
        case "demandSide" :
          nameList = [ "demandSideHead", "companyName", "unitName" ];
          break;
        case "procureExec" :
          nameList = [ "procureExecHead", "purOrganizationName", "purchaserName", "purName", "purPhone", "purEmail", "rfxByName", "checkedByName" ];
          break;
        case "sectionItem" :
          nameList = [ "rfxLineItemNum", "sectionItemHead", "prLineNum", "ouName", "invOrganizationName", "specs", "itemCategoryName", this.doubleUnitFlag ? "secondaryQuantity" : "", this.doubleUnitFlag ? "secondaryUomName" : "", "rfxQuantity", "uomName", "netPrice", "netEstimatedAmount", "taxIncludedFlag",
            "taxRate", "demandDate", "attachmentUuid", "ladderInquiryFlag", "ladderQuotationBtn", "quotationTemplateName", "quotationDetailBtn", "floatTypeMeaning" ].filter(Boolean);
          break;
        case "sectionItemDetail" :
          nameList = [ "rfxLineItemNum", "prLineNum", "itemCode", "itemName", "ouName", "invOrganizationName", "specs", "itemCategoryName", this.doubleUnitFlag ? "secondaryQuantity" : "", this.doubleUnitFlag ? "secondaryUomName" : "", "rfxQuantity", "uomName", "netPrice", "netEstimatedAmount", "taxIncludedFlag",
            "taxRate", "demandDate", "attachmentUuid", "ladderInquiryFlag", "ladderQuotationBtn", "quotationTemplateName", "quotationDetailBtn", "floatTypeMeaning" ].filter(Boolean);
          break;
        case "supplierRequireHead" :
          nameList = [ "sourceMethodMeaning", "noticeTitle", "noticeDays", "noticeAttachment", "allowSourceSupplierStages" ];
          break;
        case "supplierList" :
          nameList = [ "supplierHead", "supplierCompanyNum", "priceCoefficient", "stageDescription", "riskScan", "contactName", "contactMobilephone", "contactMail", "allocatedItemBtn" ];
          break;
        case "supplierListDetail" :
          nameList = [ "supplierCompanyName", "supplierCompanyNum", "priceCoefficient", "stageDescription", "riskScan", "contactName", "contactMobilephone", "contactMail", "allocatedItemBtn" ];
          break;
        case "rfxPrepare" :
          nameList = [ "rfxPrepareHead", "sourceCategoryMeaning" ];
          break;
        case "quotation" :
          nameList = [ "quotationHead", "startFlagHead", this.headInfo.quotationEndDateFlag && !biddingPriceFlag && this.headInfo.startFlag && !autoRoundQuotationFlag && (this.headInfo.quotationRunningDurationFlag === 1 ? "quotationEndDateDuration" : "startQuotationRunningDuration"), !this.headInfo.startFlag && !autoRoundQuotationFlag && "quotationStartDateDuration", this.headInfo.quotationEndDateFlag && !this.headInfo.startFlag && !autoRoundQuotationFlag && "quotationEndDateDuration", biddingPriceFlag && (this.headInfo.quotationRunningDurationFlag === 1 ? "quotationEndDateDuration" : "quotationRunningDuration"), "sealedQuotationFlag", "quotationTypeMeaning", "currencyCode", "allowMuitiCurQuo",
            "quotationScopeMeaning", "paymentTypeName", "paymentTermName", "allowAlterPaymnetTypeTerm", "bidFileExpense", "bidBond", "minQuotedSupplier", "centralPurchaseFlag", "taxChangeFlag",
            "continuousQuotationFlag", "quantityChangeFlag", "diyLadderQuotationFlag", "matterDetailNotice" ].filter(Boolean);
          break;
        case "quotationDetail" :
          nameList = [ "startFlag", "startQuotationRunningDuration", "sealedQuotationFlag", "quotationTypeMeaning", "currencyCode", "allowMuitiCurQuo",
            "quotationScopeMeaning", "paymentTypeName", "paymentTermName", "allowAlterPaymnetTypeTerm", "bidFileExpense", "bidBond", "minQuotedSupplier", "centralPurchaseFlag", "taxChangeFlag",
            "continuousQuotationFlag", "quantityChangeFlag", "diyLadderQuotationFlag", "matterDetailNotice" ];
          break;
        case "autoRoundQuotation":
          nameList = [ "autoRoundQuotationHead", "roundQuotationRankFlag" ];
          break;
        case "autoRoundQuotationLine":
          nameList = [ "autoRoundQuotation" ];
          break;
        case "preQualificationHead" :
          nameList = [ "preQualificationHead", "prequalEndDate", "reviewMethodMeaning", "pretrialGroupMain", "pretrialGroupMember", "prequalAttachmentUuid" ];
          break;
        case "attachment" :
          nameList = [ "businessAttachmentUuid", "techAttachmentUuid", this.headInfo.rfxStatus === "CLOSED" ? "closeAttachmentUuid" : null ].filter(Boolean);
          break;
        case "expertHead" :
          nameList = [ "professionalHead" ];
          break;
        case "expert" :
          nameList = [ "expertHead", "teamMeaning", "expertCategoryMeaning", "phone", "email" ];
          break;
        case "expertDetail" :
          nameList = [ "teamMeaning", "expertCategoryMeaning", "phone", "email" ];
          break;
        case "initialReviewIndicHead" :
          nameList = [ "initialReviewIndicHead" ];
          break;
        case "initialReviewIndic" :
          nameList = [ "initialReviewIndic", "indicateTypeMeaning", "passFlag", "allocatedExpertBtn" ];
          break;
        case "scoringElementsHead" :
          nameList = [ "scoringElements" ];
          break;
        case "scoringTechnicalGroupHead" :
          nameList = [ "scoringTechnicalGroupHead" ];
          break;
        case "scoringBusinessGroupHead" :
          nameList = [ "scoringBusinessGroupHead" ];
          break;
        case "scoringElements" :
          nameList = [ "scoringElementsHead", "calculateTypeMeaning", "scoreTypeMeaning", "weight", "minScore", "maxScore", "detailEnabledFlag", "indicateRemark", "scoringAllocatedExpertBtn" ];
          break;
        case "scoringElementsDetail" :
          nameList = [ "calculateTypeMeaning", "scoreTypeMeaning", "weight", "minScore", "maxScore", "detailEnabledFlag", "indicateRemark", "scoringAllocatedExpertBtn" ];
          break;
        default:
          nameList = [ ];
          break;
        }
        let columns = nameList.map((res) => ({
          ...this.getFieldInfo(res)
        }));
        // 弹框字段
        switch (title) {
        case "expertAllocation" :
          nameList = [ "expertAllocationHead" ];
          break;
        case "scoringElementShow" :
          nameList = [ "scoringElementShow", "indicateRemark", "weight", "minScore", "maxScore", "defaultScore" ];
          break;
        case "filterMaterial":
          nameList = [ "filterMaterialHead", "maxLimitPrice", "minLimitPrice", "inviteFlag" ];
          break;
        case "ladderQuotationHead" :
          nameList = [ "ladderQuotationHead" ];
          break;
        case "ladderQuotation" :
          nameList = [ "rfxLadderLineNum", "remark" ];
          break;
        case "quotationHead" :
          nameList = [ "templateName", "attachmentNeedFlag", "allowCreateFlag", "purchaseAttachmentUuid" ];
          break;
        case "quotationDetailHead" :
          nameList = [ "templateNameHead" ];
          break;
        default:
          nameList = [ ];
          break;
        }
        let popColumns = nameList.map((res) => ({
          ...this.getPopFieldInfo(res)
        }));
        return columns.length > 0 ? columns : popColumns;
      };
    },
  },
  async mounted() {
    if (this.rfxHeaderId) {
      try {
        this.$loading.show();
        await this.fetchData();
      } catch (err) {
        this.$loading.hide();
      }
    }
  },
  methods: {
    // 接口
    async fetchData() {
      try {
        this.sectionItemDataSet = new DataSet(sectionItemDs(this.rfxHeaderId));
        this.sectionItemDataSet.refresh();
        await getHeaderApi(this.rfxHeaderId, {
          path: "/ssrc/inquiry-hall/rfx-detail/:rfxId",
          tenantId: SrmUtil.getTenantId(),
        }).then((res) => {
          this.headInfo = { ...res.rfxHeader };
          // 供应商列表
          if (this.headInfo.sourceMethod === "INVITE") {
            this.supplierInfoDataSet = new DataSet(supplierInfoDs(this.rfxHeaderId));
            this.supplierInfoDataSet.refresh();
          }
          // 资格预审（预审小组组长、预审小组成员）
          this.headInfo["pretrialGroupMember"] = [];
          this.headInfo["pretrialGroupMain"] = "";
          res.preMember && res.preMember.length > 0 && res.preMember.map((v) => {
            if (v.leaderFlag === 1) {
              this.headInfo["pretrialGroupMain"] = v.realName;
            } else {
              this.headInfo["pretrialGroupMember"].push(v.realName);
            }
          });
          this.headInfo["pretrialGroupMember"] = this.headInfo["pretrialGroupMember"].join(",");
        });
        await getRfxExperts({
          customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.EXPERT",
          expertStatus: "SUBMITTED",
          isPubPage: false,
          organizationId: SrmUtil.getTenantId(),
          sourceFrom: "RFX",
          sourceHeaderId: this.rfxHeaderId,
        }).then((res) => {
          this.expertInfoDataSet = new DataSet(expertInfoDs());
          this.expertInfoDataSet.setData([ ...res.evaluateExpertList ]);
        });
        await getRfxIndics({
          customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.SCORE_INDICS,SSRC.INQUIRY_HALL_DETAIL.SCORE_INDICS_TECH",
          indicStatus: "SUBMITTED",
          indicateLevel: "ONE",
          isPubPage: false,
          organizationId: SrmUtil.getTenantId(),
          sourceFrom: "RFX",
          sourceHeaderId: this.rfxHeaderId,
        }).then((res) => {
          this.scoreIndicDataSet = new DataSet(scoreIndicDs());
          this.scoreIndicDataSet.setData([ ...res.initialReviewIndicList ]);
          this.indicsInfoDataSet = new DataSet(indicsInfoDs());
          this.indicsInfoDataSet.setData([ ...res.otherIndicList ]);
          this.technologyIndicDataSet = new DataSet(technologyIndicDs());
          this.technologyIndicDataSet.setData([ ...res.technologyIndicList ]);
          this.businessIndicDataSet = new DataSet(businessIndicDs());
          this.businessIndicDataSet.setData([ ...res.businessIndicList ]);
        });
        this.$loading.hide();
      } catch (error) {
        this.headInfo = {};
        this.$loading.hide();
      }
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "refBasicInfo": $T("ssrc.inquiryHall.view.inquiryHall.rfxBasicInfo").$D("询价基础信息"),
        "purOrganizationAndStaff": $T("ssrc.inquiryHall.view.inquiryHall.purOrganizationAndStaff").$D("采购组织及人员"),
        "sectionItem": $T("ssrc.inquiryHall.view.title.rfxsectionItem").$D("询价标的物"),
        "supplierWithRequest": $T("ssrc.inquiryHall.view.inquiryHall.supplierWithRequest").$D("对供应商要求"),
        "rfxDeamnd": $T("ssrc.inquiryHall.view.inquiryHall.rfxDeamnd").$D("询价要求"),
        "attachment": $T("ssrc.inquiryHall.view.inquiryHall.attachmentUuid").$D("附件"),
        "basicInfo": $T("ssrc.inquiryHall.view.inquiryHall.headerBaseInfo").$D("基础信息"),
        "quotationDetail": $T("ssrc.inquiryHall.view.inquiryHall.quoteInfo").$D("报价信息"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCustomizeCode(code) {
      const codeList = {
      };
      return codeList[code] || "";
    },
    clickSectionItem(record) {
      this.openPopup("sectionItemDetail", { code: "SMBL.INQUIRY_HALL.RP.SECTIONITEM.DETAIL", columns: this.getColumns("sectionItemDetail"), data: record.data });
    },
    clickSupplierList(record) {
      this.openPopup("supplierListDetail", { code: "SMBL.INQUIRY_HALL.RP.SUPPLIERLIST.DETAIL", columns: this.getColumns("supplierListDetail"), data: record.data });
    },
    clickExpert(record) {
      this.openPopup("expertDetail", { code: "SMBL.INQUIRY_HALL.RP.EXPERT.DETAIL", columns: this.getColumns("expertDetail"), data: record.data });
    },
    clickScoringElements(record) {
      this.openPopup("scoringElementsDetail", { code: "SMBL.INQUIRY_HALL.RP.SCORINGELEMENTS.DETAIL", columns: this.getColumns("scoringElementsDetail"), data: record.data });
    },
    openPopup(name, item) {
      switch (name) {
      // 专家分配
      case "expertAllocation":
        this.expertAllocationDataSet = new DataSet(expertAllocationDs({
          evaluateIndicId: item.evaluateIndicId,
          evaluateIndicCategory: item.expertCategory,
          sourceHeaderId: this.rfxHeaderId,
        }));
        this.expertAllocationDataSet.refresh();
        this.visiblePopup = true;
        this.expertAllocationVisible = true;
        break;
      // 寻源事项须知
      case "matterDetailNotice":
        this.$popup({
          title: $T("ssrc.inquiryHall.view.message.tab.matterDetailNotice").$D("寻源事项须知"),
          showHeader: true,
          showClose: true,
          showBack: false,
          position: "bottom",
          rounded: true,
          height: "50vh",
          content: <div style="padding: 16px 15px">
            {}
          </div>,
        });
        break;
      // 评分要素细项
      case "scoringElementShow":
        this.scoringElementShowDataSet = new DataSet(scoringElementShowDs({
          indicateLevel: item.indicateLevel,
          lovChangeFlag: "0",
          parentIndicateId: item.evaluateIndicId,
          sourceIndicateId: item.indicateId,
          sourceType: item.calculateType,
        }));
        this.scoringElementShowDataSet.refresh();
        this.visiblePopup = true;
        this.scoringElementShowVisible = true;
        break;
      // 筛选物料
      case "filterMaterial":
        this.filterMaterialDataSet = new DataSet(filterMaterialDs({
          rfxHeaderId: this.rfxHeaderId,
          rfxLineSupplierId: item.rfxLineSupplierId,
        }));
        this.filterMaterialDataSet.refresh();
        this.visiblePopup = true;
        this.filterMaterialVisible = true;
        break;
      // 阶梯报价
      case "ladderQuotation":
        this.ladderQuotationDataSet = new DataSet(ladderQuotationDs(item.rfxLineItemId));
        this.ladderQuotationDataSet.refresh();
        this.infoPopup = {
          itemCode: item.itemCode,
          itemName: item.itemName,
        };
        this.visiblePopup = true;
        this.ladderQuotationVisible = true;
        break;
      // 报价明细
      case "quotationDetail":
        this.$loading.show();
        getQuotationDetailApi(this.rfxHeaderId, {
          itemId: item.itemId,
          page: 0,
          size: 1000,
          quotationTemplateId: item.quotationTemplateId,
          rfxLineItemId: item.rfxLineItemId,
          sourceFrom: "RFX",
        }).then((res) => {
          this.infoPopup = {
            templateName: res.templateName,
            attachmentNeedFlag: res.attachmentNeedFlag,
            allowCreateFlag: res.allowCreateFlag,
            purchaseAttachmentUuid: res. purchaseAttachmentUuid
          };
          // 多模块
          this.quotationModuleList = [];
          let quotationColumns = [];
          if (res.moduleList) {
            res.moduleList.map((data) => {
              quotationColumns = [
                {
                  fieldCode: "configCode",
                  fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configCode").$D("报价明细编码"),
                  formRow: 0
                },
                {
                  fieldCode: "configName",
                  fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configName").$D("报价明细名称"),
                  formRow: 1
                },
                {
                  fieldCode: "nextQuotationDetails",
                  fieldType: "EMPTY",
                  visible: (val, record) => record.childList && record.childList.length > 0 ? 1 : 0,
                  render: (val, record) => <SrmFlex>
                    <span>{ $T("ssrc.inquiryHall.model.inquiryHall.nextQuotationDetails").$D("下级报价明细") }：</span>
                    {
                      record.childList && record.childList.length > 0 ? <span style="color: var(--color-other-default-b);"
                        on-click={(e) => {
                          e.stopPropagation();
                          this.openPopup("nextQuotationDetails", record.childList);
                        }}>
                        { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
                      </span> : "-"
                    }
                  </SrmFlex>,
                  formRow: 2
                }
              ];
              // 动态 生成报价列
              data.quotationColumns.map((val, i) => {
                quotationColumns.push({
                  fieldCode: val.columnCode,
                  fieldName: $T(`ssrc.inquiryHall.model.inquiryHall.${val.columnCode}`).$D(val.columnName),
                  formRow: i % 2 > 0 ? i + 2 : i + 3,
                });
              });
              // 动态数据值 扁平化
              data.supQuotationDetailPage.content.map((val) => {
                val.quotationColumns.map((j) => {
                  val[j.columnCode] = j.columnDefaultValue;
                });
                if (val.childFlag === 1) {
                  val["childList"] = [];
                }
              });
              // 数据tree
              let list = [];
              data.supQuotationDetailPage.content.map((val) => {
                if (val.childFlag === 1) {
                  list.push(val);
                  data.supQuotationDetailPage.content.map((valTwo) => {
                    if (valTwo.childFlag !== 1 && val.quotationDetailId === valTwo.parentDetailId) {
                      val["childList"].push(valTwo);
                    }
                  });
                } else if (!val.parentDetailId) {
                  list.push(val);
                }
              });
              this.quotationModuleList.push({
                templateObj: { templateName: data.templateName },
                quotationColumns: [ ...quotationColumns ],
                quotationDetailDataSet: new DataSet(quotationDetailDs()),
              });
              this.quotationColumns = [ ...quotationColumns ];
              if (list.length > 0) {
                this.quotationModuleList[0]["quotationDetailDataSet"].setData([ ...list ]);
              }
            });
          } else {
            // 单模块
            quotationColumns = [
              {
                fieldCode: "configCode",
                fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configCode").$D("报价明细编码"),
                formRow: 0
              },
              {
                fieldCode: "configName",
                fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configName").$D("报价明细名称"),
                formRow: 1
              },
              {
                fieldCode: "nextQuotationDetails",
                fieldType: "EMPTY",
                visible: (val, record) => record.childList && record.childList.length > 0 ? 1 : 0,
                render: (val, record) => <SrmFlex>
                  <span>{ $T("ssrc.inquiryHall.model.inquiryHall.nextQuotationDetails").$D("下级报价明细") }：</span>
                  {
                    record.childList && record.childList.length > 0 ? <span style="color: var(--color-other-default-b);"
                      on-click={(e) => {
                        e.stopPropagation();
                        this.openPopup("nextQuotationDetails", record.childList);
                      }}>
                      { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
                    </span> : "-"
                  }
                </SrmFlex>,
                formRow: 2
              }
            ];
            // 动态 生成报价列
            res.quotationColumns.map((val, index) => {
              quotationColumns.push({
                fieldCode: val.columnCode,
                fieldName: $T(`ssrc.inquiryHall.model.inquiryHall.${val.columnCode}`).$D(val.columnName),
                formRow: index % 2 > 0 ? index + 2 : index + 3,
              });
            });
            // 动态数据值 扁平化
            res.supQuotationDetailPage.content.map((val) => {
              val.quotationColumns.map((j) => {
                val[j.columnCode] = j.columnDefaultValue;
              });
              if (val.childFlag === 1) {
                val["childList"] = [];
              }
            });
            // 数据tree
            let list = [];
            res.supQuotationDetailPage.content.map((val) => {
              if (val.childFlag === 1) {
                list.push(val);
                res.supQuotationDetailPage.content.map((valTwo) => {
                  if (valTwo.childFlag !== 1 && val.quotationDetailId === valTwo.parentDetailId) {
                    val["childList"].push(valTwo);
                  }
                });
              } else if (!val.parentDetailId) {
                list.push(val);
              }
            });
            this.quotationModuleList.push({
              templateObj: { templateName: res.templateName },
              quotationColumns: [ ...quotationColumns ],
              quotationDetailDataSet: new DataSet(quotationDetailDs()),
            });
            this.quotationColumns = [ ...quotationColumns ];
            if (list.length > 0) {
              this.quotationModuleList[0]["quotationDetailDataSet"].setData([ ...list ]);
            }
          }
          this.$loading.hide();
          this.visiblePopup = true;
          this.quotationVisible = true;
        }).finally(() => {
          this.$loading.hide();
        });
        break;
      // 下级报价明细
      case "nextQuotationDetails":
        this.nextQuotationDetailsDataSet.setData([ ...item ]);
        this.$popup({
          showHeader: false,
          position: "bottom",
          height: "100vh",
          content: <srm-list scrollable="false"
            height="auto"
            style="height: auto"
            data-set={this.nextQuotationDetailsDataSet}
            columns={this.quotationColumns}
            customize-code={this.getCustomizeCode("quotationDetailPopup")}/>,
        });
        break;
      // 风险扫描
      case "riskScan":
        this.$loading.show();
        queryMonitor(encodeURIComponent(item.supplierCompanyName)).then((res) => {
          this.$loading.hide();
          if (res && res.monitorUrl) {
            const environmentUrl = window.location.origin;
            // const environmentUrl = "https://mobile.dev.isrm.going-link.com";
            // 解析 url参数&&  passport && keyWord && tenantId
            const search = res.monitorUrl.split('?')[1] || '';
            const detailUrl = `/appSour/#/RiskScan?${search}`;
            this.riskScanUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
            this.riskScanPopup = true;
          }
        });
        break;
      default:
        this.visibleDetailPopup = true;
        this.infoDetailPopup = {
          ...item,
        };
        break;
      }
    },
    // 获取字段
    getFieldInfo(name) {
      const columnList = [
        {
          fieldCode: "rfxNumHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, record) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                {$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号")}：{record.rfxNum ? record.rfxNum : "-"}
              </span>
            </SrmListHeader>
        },
        {
          fieldCode: "rfxNum",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号"),
          formRow: 10,
        },
        {
          fieldCode: "sourceProjectNum",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceProjectNum").$D("寻源项目编号"),
          formRow: 20,
          visible: (val, item) => item.mergeType === "SECTION" ? 1 : 0,
        },
        {
          fieldCode: "sourceProjectName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceProjectName").$D("寻源项目名称"),
          formRow: 30,
          visible: (val, item) => item.mergeType === "SECTION" ? 1 : 0,
        },
        {
          fieldCode: "sectionName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sectionName").$D("标段名称"),
          formRow: 40,
          visible: (val, item) => item.mergeType === "SECTION" ? 1 : 0,
        },
        {
          fieldCode: "templateName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.templateName").$D("寻源模版"),
          formRow: 50,
        },
        {
          fieldCode: "rfxRemark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
          formRow: 60,
        },
        {
          fieldCode: "budgetAmount",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          formRow: 70,
        },
        {
          fieldCode: "totalEstimatedAmount",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.totalEstimatedAmount").$D("预估金额(含税)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          formRow: 80,
        },
        {
          fieldCode: "demandSideHead",
          fieldType: "EMPTY",
          render: () =>
            <SrmFlex>
              {$T("ssrc.inquiryHall.view.inquiryHall.demandSide").$D("需求方")}
            </SrmFlex>
        },
        {
          fieldCode: "companyName",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                {$T("ssrc.inquiryHall.model.inquiryHall.companyName").$D("公司")}：{val ? val : "-"}
              </span>
            </SrmListHeader>
        },
        {
          fieldCode: "unitName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.unitName").$D("需求部门"),
        },
        {
          fieldCode: "procureExecHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: () =>
            <SrmFlex>
              {$T("ssrc.inquiryHall.view.inquiryHall.purchaseExecute").$D("采购执行人")}
            </SrmFlex>
        },
        {
          fieldCode: "purOrganizationName",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                {$T("ssrc.inquiryHall.model.inquiryHall.purOrganizationName").$D("采购组织名称")}：{val ? val : "-"}
              </span>
            </SrmListHeader>
        },
        {
          fieldCode: "purchaserName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchaserName").$D("采购员"),
          formRow: 20,
        },
        {
          fieldCode: "purName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purName").$D("采购联系人"),
          formRow: 20,
        },
        {
          fieldCode: "purPhone",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purPhone").$D("联系人电话"),
          render: (val, item) => <span>{`${item.internationalTelCodeMeaning} | ${val}`}</span>,
          formRow: 30,
        },
        {
          fieldCode: "purEmail",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purEmail").$D("联系人邮箱"),
          formRow: 40,
        },
        {
          fieldCode: "rfxByName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.rfxByName").$D("询价员"),
          formRow: 50,
        },
        {
          fieldCode: "checkedByName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.checkedByName").$D("核价员"),
          formRow: 50,
        },
        {
          fieldCode: "sectionItemHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <SrmListHeader>
              {item.itemCode}-{item.itemName}
            </SrmListHeader>
        },
        {
          fieldCode: "rfxLineItemNum",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号"),
          formRow: 10,
        },
        {
          fieldCode: "invOrganizationName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.invOrganizationName").$D("库存组织"),
          formRow: 20,
        },
        {
          fieldCode: "ouName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.ouName").$D("业务实体"),
          formRow: 30,
        },
        {
          fieldCode: "specs",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.specs").$D("规格"),
          formRow: 40,
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
          formRow: 40,
        },
        {
          fieldCode: "itemName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料名称"),
          formRow: 40,
        },
        {
          fieldCode: "itemCategoryName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemCategory").$D("物料类别"),
          formRow: 40,
        },
        {
          fieldCode: "secondaryQuantity",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.rfxQuantity").$D("需求数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 50,
        },
        {
          fieldCode: "secondaryUomName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.uomName").$D("单位"),
          formRow: 50,
        },
        {
          fieldCode: "rfxQuantity",
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 55,
        },
        {
          fieldCode: "uomName",
          fieldName: getUomName(this.doubleUnitFlag),
          formRow: 55,
        },
        {
          fieldCode: "netPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.netEstimatedPrice").$D("预估单价(未税)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          formRow: 60,
        },
        {
          fieldCode: "netEstimatedAmount",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.netEstimatedAmount").$D("预估行金额(未税)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          formRow: 70,
        },
        {
          fieldCode: "taxIncludedFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.taxIncludedFlag").$D("是否含税"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 80,
        },
        {
          fieldCode: "taxRate",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.taxRateCode").$D("税率"),
          formRow: 80,
        },
        {
          fieldCode: "demandDate",
          fieldType: "DATE_PICKER",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.neededDate").$D("需求日期"),
          options: {
            format: "yyyy-MM-dd"
          },
          editor: false,
          formRow: 90,
        },
        {
          fieldCode: "attachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.attachmentUuid").$D("询价单附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 90,
        },
        {
          fieldCode: "ladderInquiryFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.isLadderInquiryFlag").$D("启用阶梯报价"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 100,
        },
        {
          fieldCode: "ladderQuotationBtn",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.model.inquiryHall.ladderInquiry").$D("阶梯报价") }：</span>
            {
              item.ladderInquiryFlag === 1 ? <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.openPopup("ladderQuotation", item);
                }}>
                { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span> : "-"
            }
          </SrmFlex>,
          formRow: 100,
        },
        {
          fieldCode: "quotationTemplateName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationTemplateName").$D("报价模板"),
          formRow: 110,
        },
        {
          fieldCode: "quotationDetailBtn",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.model.inquiryHall.quotationDetail").$D("报价明细") }：</span>
            {
              item.quotationDetailFlag === 1 ? <span style="color: var(--color-other-default-b);" on-click={(e) => {
                e.stopPropagation();
                this.openPopup("quotationDetail", item);
              }}>
                { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span> : "-"
            }
          </SrmFlex>,
          formRow: 120,
        },
        {
          fieldCode: "floatTypeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.floatTypeMeaning").$D("浮动方式"),
          formRow: 120,
        },
        {
          fieldCode: "sourceMethodMeaning",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                {$T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式")}：{val ? val : "-"}
              </span>
            </SrmListHeader>
        },
        {
          fieldCode: "noticeDays",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.noticeDays").$D("公告天数"),
          visible: () => this.headInfo.sourceMethod === "INVITE" ? 0 : 1,
          formRow: 20,
        },
        {
          fieldCode: "noticeTitle",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.noticeTitle").$D("公告标题"),
          visible: () => this.headInfo.sourceMethod === "INVITE" ? 0 : 1,
          formRow: 20,
        },
        {
          fieldCode: "noticeAttachment",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.noticeAttachment").$D("公告附件"),
          visible: () => this.headInfo.sourceMethod === "INVITE" ? 0 : 1,
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 30,
        },
        {
          fieldCode: "allowSourceSupplierStages",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.allowSourceSupplierStages").$D("可参与寻源供应商阶段"),
          formRow: 40,
        },
        {
          fieldCode: "supplierHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.message.supplierCompanyName").$D("供应商名称")}：{item.supplierCompanyName}
            </SrmListHeader>
        },
        {
          fieldCode: "supplierCompanyName",
          fieldName: $T("ssrc.inquiryHall.view.message.supplierCompanyName").$D("供应商名称"),
          formRow: 10,
        },
        {
          fieldCode: "supplierCompanyNum",
          fieldName: $T("ssrc.inquiryHall.view.message.supplierCompanyNum").$D("供应商编码"),
          formRow: 20,
        },
        {
          fieldCode: "priceCoefficient",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.priceCoefficient").$D("价格系数"),
          formRow: 30,
        },
        {
          fieldCode: "stageDescription",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.stageDescription").$D("生命周期阶段"),
          formRow: 40,
        },
        {
          fieldCode: "riskScan",
          fieldType: "EMPTY",
          formRow: 50,
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.model.inquiryHall.riskScan").$D("风险扫描") }：</span>
            {
              item.rfxLineSupplierId && item.supplierCompanyId ?
                <span style="color: var(--color-other-default-b);" on-click={(e) => {
                  e.stopPropagation();
                  this.openPopup("riskScan", item);
                }}>
                  { $T("ssrc.inquiryHall.model.inquiryHall.riskScan").$D("风险扫描") }
                </span> :
                "-"
            }
          </SrmFlex>,
        },
        {
          fieldCode: "contactName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactName").$D("联系人"),
          formRow: 50,
        },
        {
          fieldCode: "contactMobilephone",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMobilephone").$D("联系方式"),
          render: (val, item) => <span>{`${item.internationalTelCodeMeaning} | ${val}`}</span>,
          formRow: 60,
        },
        {
          fieldCode: "contactMail",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMail").$D("电子邮箱"),
          formRow: 70,
        },
        {
          fieldCode: "allocatedItemBtn",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.model.inquiryHall.viewItemLine").$D("筛选物料") }：</span>
            {
              <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.openPopup("filterMaterial", item);
                }}>
                { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span>
            }
          </SrmFlex>,
          formRow: 80,
        },
        {
          fieldCode: "rfxPrepareHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: () =>
            <SrmFlex>
              {$T("ssrc.inquiryHall.view.inquiryHall.rfxPrepare").$D("寻源准备")}
            </SrmFlex>
        },
        {
          fieldCode: "sourceCategoryMeaning",
          fieldType: "EMPTY",
          formRow: 20,
          render: (val) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                {$T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别")}：{ val ? val : "-"}
              </span>
            </SrmListHeader>
        },
        {
          fieldCode: "preQualificationHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: () =>
            <SrmFlex>
              {$T("ssrc.inquiryHall.view.message.tab.preQualification").$D("资格预审")}
            </SrmFlex>
        },
        {
          fieldCode: "prequalEndDate",
          fieldType: "EMPTY",
          formRow: 20,
          render: (val) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                {$T("ssrc.inquiryHall.model.inquiryHall.prequalEndDate").$D("预审截止时间")}：{ val ? val : "-"}
              </span>
            </SrmListHeader>
        },
        {
          fieldCode: "reviewMethodMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.reviewMethodMeaning").$D("审查方法"),
          formRow: 30,
        },
        {
          fieldCode: "qualifiedLimit",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.qualifiedLimit").$D("合格上限"),
          formRow: 30,
        },
        {
          fieldCode: "pretrialGroupMain",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.pretrialGroupMain").$D("预审小组组长"),
          formRow: 40,
        },
        {
          fieldCode: "pretrialGroupMember",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.pretrialGroupMember").$D("预审小组成员"),
          formRow: 50,
        },
        {
          fieldCode: "enableScoreFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.enableScoreFlag").$D("启用评分细项"),
        },
        {
          fieldCode: "prequalAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.prequalAttachmentUuid").$D("资格预审文件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 60,
        },
        // {
        //   fieldCode: "",
        //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.").$D("资质要求"),
        //   formRow: 7,
        // },
        {
          fieldCode: "autoRoundQuotationHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: () =>
            <SrmFlex>
              {$T("ssrc.inquiryHall.view.title.autoRoundQuotation").$D("自动多轮报价")}
            </SrmFlex>
        },
        {
          fieldCode: "roundQuotationRankFlag",
          fieldType: "EMPTY",
          formRow: 20,
          render: (val) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                {$T("ssrc.inquiryHall.model.inquiryHall.allowMuitiCurQuo").$D("允许多币种报价")}：{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}
              </span>
            </SrmListHeader>
        },
        {
          fieldCode: "autoRoundQuotation",
          fieldType: "EMPTY",
          render: (val, item) =>
            <span>
              {$T("ssrc.inquiryHall.view.title.roundQuotationTime", [ item.quotationRound ]).$D("第{quotationRound}轮报价时间")}：{item.roundQuotationStartDate}~{item.roundQuotationEndDate}
            </span>
        },
        {
          fieldCode: "quotationHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: () =>
            <SrmFlex>
              {$T("ssrc.inquiryHall.view.message.tab.quotation").$D("报价")}
            </SrmFlex>
        },
        {
          fieldCode: "startFlagHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                {$T("ssrc.inquiryHall.model.inquiryHall.startFlag").$D("发布即开始")}：{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}
              </span>
            </SrmListHeader>
        },
        {
          fieldCode: "startFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.startFlag").$D("发布即开始"),
          formRow: 10,
          render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldCode: "startQuotationRunningDuration",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotRunningDuration").$D("报价运行时间"),
          formRow: 20,
          render: (val) => formatMinutes(val)
        },
        {
          fieldCode: "quotationEndDateDuration",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.commonqQotationDeadline", [ $T("ssrc.common.model.common.quotation").$D("报价") ]).$D("{quotationName}截止时间"),
          formRow: 20,
          render: (val, record) => record.quotationEndDate,
        },
        {
          fieldCode: "quotationStartDateDuration",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.commonQuotationStartTime", [ $T("ssrc.common.model.common.quotation").$D("报价") ]).$D("{quotationName}开始时间"),
          formRow: 30,
          render: (val, record) => record.quotationStartDate,
        },
        {
          fieldCode: "quotationRunningDuration",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.biddingRunningTime").$D("竞价运行时间"),
          formRow: 30,
          render: (val) => formatMinutes(val),
        },
        {
          fieldCode: "sealedQuotationFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sealedQuotationFlag").$D("密封报价"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 30,
        },
        {
          fieldCode: "quotationTypeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationTypeMeaning").$D("报价方式"),
          formRow: 30,
        },
        {
          fieldCode: "currencyCode",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.currencyCode").$D("币种"),
          formRow: 40,
        },
        {
          fieldCode: "allowMuitiCurQuo",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.allowMuitiCurQuo").$D("允许多币种报价"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 40,
        },
        {
          fieldCode: "quotationScopeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationScopeMeaning").$D("报价范围"),
          formRow: 50,
        },
        {
          fieldCode: "paymentTypeName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.paymentTypeName").$D("付款方式"),
          formRow: 50,
        },
        {
          fieldCode: "paymentTermName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.paymentTermName").$D("付款条款"),
          formRow: 60,
        },
        {
          fieldCode: "allowAlterPaymnetTypeTerm",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.allowAlterPaymentTypeTerm").$D("允许修改付款方式"),
          formRow: 60,
        },
        {
          fieldCode: "bidFileExpense",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.bidFileExpense").$D("招标文件费(元)"),
          formRow: 70,
          render: (val) => val === 0 ? $T("ssrc.common.view.gratis").$D("免费") : `${val ? val : "-"}`
        },
        {
          fieldCode: "bidBond",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.bidBond").$D("保证金(元)"),
          formRow: 70,
          render: (val) => val === 0 ? $T("ssrc.common.view.gratis").$D("免费") : `${val ? val : "-"}`
        },
        {
          fieldCode: "minQuotedSupplier",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.minQuotedSupplier").$D("最少报价供应商数"),
          formRow: 80,
        },
        {
          fieldCode: "centralPurchaseFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.centralPurFlag").$D("是否集采"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 80,
        },
        {
          fieldCode: "taxChangeFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.taxChangeFlag").$D("允许供应商修改税率"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 100,
        },
        {
          fieldCode: "continuousQuotationFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.continuousQuotationFlag").$D("允许供应商连续报价"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 100,
        },
        {
          fieldCode: "quantityChangeFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quantityChangeFlag").$D("允许供应商修改可供数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 110,
        },
        {
          fieldCode: "diyLadderQuotationFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.diyLadderQuotationFlag").$D("允许供应商自定义阶梯报价"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 120,
        },
        {
          fieldCode: "matterDetailNotice",
          fieldType: "EMPTY",
          formRow: 130,
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.view.message.tab.matterDetailNotice").$D("寻源事项须知") }：</span>
            {
              <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.openPopup("matterDetailNotice", item);
                }}>
                { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span>
            }
          </SrmFlex>,
        },
        {
          fieldCode: "professionalHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: () =>
            <SrmFlex>
              {$T("ssrc.inquiryHall.view.message.tab.professional").$D("专家")}
            </SrmFlex>
        },
        {
          fieldCode: "expertHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) => {
            const evaluateLeader = item.evaluateLeaderFlag;
            const statusType = {
              0: "primary",
              1: "success",
            };
            return <SrmListHeader>
              <span>
                {item.expertUserId} - {item.loginName}
              </span>
              <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[evaluateLeader]}>
                {item.evaluateLeaderFlagMeaning}
              </SrmButton>
            </SrmListHeader>;
          }
        },
        {
          fieldCode: "teamMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.teamMeaning").$D("本次评分类别"),
          formRow: 20,
        },
        {
          fieldCode: "expertCategoryMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.expertCategoryMeaning").$D("专家类型"),
          formRow: 20,
        },
        {
          fieldCode: "phone",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMobile").$D("联系电话"),
          render: (val, item) => <span>{`${item.internationalTelCodeMeaning} | ${val}`}</span>,
          formRow: 30,
        },
        {
          fieldCode: "email",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.emailOne").$D("邮箱"),
          formRow: 40,
        },
        {
          fieldCode: "initialReviewIndicHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: () =>
            <SrmFlex>
              {$T("ssrc.inquiryHall.view.message.tab.initialReviewIndic").$D("符合性检查")}
            </SrmFlex>
        },
        {
          fieldCode: "initialReviewIndic",
          fieldType: "EMPTY",
          formRow: 20,
          render: (val, item) =>
            <SrmListHeader>
              {item.indicateCode} - {item.indicateName}
            </SrmListHeader>
        },
        {
          fieldCode: "indicateTypeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.indicateTypeMeaning").$D("要素类型"),
          formRow: 30,
        },
        {
          fieldCode: "passFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.passFlag").$D("必须通过"),
          formRow: 30,
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
        },
        {
          fieldCode: "allocatedExpertBtn",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.expertAllocation").$D("专家分配"),
          // fieldType: "EMPTY",
          formRow: 40,
          render: (_, item) => item.assignedEvaluateExperts,
          // render: (val, item) => <SrmFlex>
          //   <span>{ $T("ssrc.inquiryHall.model.inquiryHall.expertAllocation").$D("专家分配") }：</span>
          //   {
          //     <span style="color: var(--color-other-default-b);"
          //       on-click={(e) => {
          //         e.stopPropagation();
          //         this.openPopup("expertAllocation", item);
          //       }}>
          //       { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
          //     </span>
          //   }
          // </SrmFlex>
        },
        {
          fieldCode: "scoringElements",
          fieldType: "EMPTY",
          fieldName: $T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素"),
          formRow: 10,
          render: () =>
            <SrmFlex>
              {$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}
            </SrmFlex>
        },
        {
          fieldCode: "scoringTechnicalGroupHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmFlex>
              {`${$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}-${$T("ssrc.inquiryHall.view.message.tab.technicalGroup").$D("技术组")} (${$T("ssrc.inquiryHall.model.inquiryHall.weight").$D("权重")}：${item.technologyWeight}%)`}
            </SrmFlex>
        },
        {
          fieldCode: "scoringBusinessGroupHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmFlex>
              {`${$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}-${$T("ssrc.inquiryHall.view.message.tab.businessGroup").$D("商务组")} (${$T("ssrc.inquiryHall.model.inquiryHall.weight").$D("权重")}：${item.businessWeight}%)`}
            </SrmFlex>
        },
        {
          fieldCode: "scoringElementsHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmListHeader>
              {item.indicateCode} - {item.indicateName}
            </SrmListHeader>
        },
        {
          fieldCode: "calculateTypeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.calculateType").$D("计算方式"),
          formRow: 20,
        },
        {
          fieldCode: "scoreTypeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoreType").$D("评分类型"),
          formRow: 20,
        },
        {
          fieldCode: "weight",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.weight").$D("权重"),
          formRow: 30,
        },
        {
          fieldCode: "minScore",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.minScore").$D("最低分"),
          formRow: 30,
        },
        {
          fieldCode: "maxScore",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.maxScore").$D("最高分"),
          formRow: 40,
        },
        {
          fieldCode: "detailEnabledFlag",
          fieldType: "EMPTY",
          formRow: 40,
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.model.inquiryHall.detailEnabledFlag").$D("启用评分要素细项") }：</span>
            {
              item.detailEnabledFlag === 1 ? <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.openPopup("scoringElementShow", item);
                }}>
                { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span> : "-"
            }
          </SrmFlex>
        },
        {
          fieldCode: "indicateRemark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoringRubric").$D("评分细则"),
          formRow: 50,
        },
        {
          fieldCode: "scoringAllocatedExpertBtn",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.expertAllocation").$D("专家分配"),
          // fieldType: "EMPTY",
          formRow: 60,
          render: (_, item) => item.assignedEvaluateExperts,
          // render: (val, item) => <SrmFlex>
          //   <span>{ $T("ssrc.inquiryHall.model.inquiryHall.expertAllocation").$D("专家分配") }：</span>
          //   {
          //     <span style="color: var(--color-other-default-b);"
          //       on-click={(e) => {
          //         e.stopPropagation();
          //         this.openPopup("expertAllocation", item);
          //       }}>
          //       { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
          //     </span>
          //   }
          // </SrmFlex>
        },
        {
          fieldCode: "businessAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 10,
        },
        {
          fieldCode: "techAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 20,
        },
        {
          fieldCode: "closeAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.closeAttachmentUuid").$D("关闭附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 30,
        }
      ];
      return columnList.find((v) => v.fieldCode === name);
    },
    // 获取弹框字段
    getPopFieldInfo(code) {
      const columnList = [
        {
          fieldCode: "expertAllocationHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmFlex>
              <span style="background: #EFF3FE;border-radius: 2px;width: 44px;font-family: PingFangSC-Medium;color: #276EF1;line-height: 20px;margin-right: 8px;">
                {item.assignFlag ? $T("hipspfm.expertScoring.view.message.assigned").$D("已分配") : ""}
              </span>
              <span>
                {item.loginName} - {item.expertName}
              </span>
            </SrmFlex>
        },
        {
          fieldCode: "scoringElementShow",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmFlex>
              <span style="font-weight: bold">
                {item.indicateCode} - {item.indicateName}
              </span>
            </SrmFlex>
        },
        {
          fieldCode: "indicateRemark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.scoringRubric").$D("评分细则"),
          formRow: 10,
        },
        {
          fieldCode: "weight",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.weight").$D("权重"),
          formRow: 20,
        },
        {
          fieldCode: "minScore",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.minScore").$D("最低分"),
          formRow: 20,
        },
        {
          fieldCode: "maxScore",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.maxScore").$D("最高分"),
          formRow: 30,
        },
        {
          fieldCode: "defaultScore",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.defaultScore").$D("缺省分"),
          formRow: 30,
        },
        {
          fieldCode: "filterMaterialHead",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmFlex>
              <span style="font-weight: bold">
                {item.itemCode} - {item.itemName}
              </span>
            </SrmFlex>
        },
        {
          fieldCode: "maxLimitPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.maxLimitPrice").$D("最高限价"),
          formRow: 20,
        },
        {
          fieldCode: "minLimitPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.minLimitPrice").$D("最低限价"),
          formRow: 20,
        },
        {
          fieldCode: "inviteFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.whetherAllot").$D("是否分配"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
          formRow: 30,
        },
        {
          fieldCode: "ladderQuotationHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <SrmFlex>
              {this.$T("ssrc.inquiryHall.model.inquiryHall.itemID").$D("物料ID")}：{item.itemCode}-{item.itemName}
            </SrmFlex>
        },
        {
          fieldCode: "rfxLadderLineNum",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <SrmFlex>
              <span style="font-weight: bold">
                {$T("ssrc.inquiryHall.model.inquiryHall.ladder").$D("阶梯")}{val} - [{item.secondaryLadderFrom}, {item.secondaryLadderTo})
              </span>
            </SrmFlex>
        },
        {
          fieldCode: "secondaryLadderFrom",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.ladderFrom").$D("数量从(>=)"),
          formRow: 20,
        },
        {
          fieldCode: "secondaryLadderTo",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.ladderTo").$D("数量至"),
          formRow: 20,
        },
        {
          fieldCode: "ladderFrom",
          fieldName: $T("ssrc.common.model.inquiryHall.basicLadderFrom>=").$D("基本数量从(>=)"),
          formRow: 25,
        },
        {
          fieldCode: "ladderTo",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.basicLadderTo").$D("数量至"),
          formRow: 25,
        },
        {
          fieldCode: "remark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
          formRow: 30,
        },
        {
          fieldCode: "templateName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.QuotationTemplateName").$D("报价模板名称"),
          formRow: 0,
        },
        {
          fieldCode: "attachmentNeedFlag",
          fieldName: $T("smbl.common.model.supplierAttachmentNeedFlag").$D("供应商附件必传"),
          formRow: 10,
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
        },
        {
          fieldCode: "allowCreateFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.allowCreateFlag").$D("允许供应商新建明细行"),
          formRow: 20,
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
        },
        {
          fieldCode: "purchaseAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachmentUuid").$D("采购方附件上传"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 30,
        },
        {
          fieldCode: "templateNameHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <SrmFlex>
              <span>
                {item.templateName}
              </span>
            </SrmFlex>
        },
      ];
      return columnList.find((v) => v.fieldCode === code);
    },
  }
};
</script>

<style lang="stylus" scoped>
.paddingCommon {
  padding: 16px 15px;
}
</style>