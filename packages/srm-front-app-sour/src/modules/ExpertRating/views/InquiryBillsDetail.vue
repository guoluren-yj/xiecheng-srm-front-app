<template>
  <div style="height: 100vh; overflow: auto">
    <div class="main-info">
      <!-- 导航 -->
      <nav-head
        :title="
          $T('ssrc.inquiryHall.view.message.title.RFQDetail').$D('询价单明细')
        "/>
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
        <div class="button-right-margin">
          <srm-button
            size="small"
            type="warn"
            icon="icon-clock"
            @click="showOperationPop">
            <span>{{
              $T("hipspfm.common.message.title.operationRecord").$D("操作记录")
            }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <srm-scroll-tab class="content" content-scroll>
        <srm-scroll-tab-item
          :label="
            $T('ssrc.inquiryHall.view.message.panel.baseInfos').$D('基础信息')
          ">
          <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <customize
            v-else
            code="SMBL.EXPERT_RATING.INQUIRY_BILLS_BASIC_INFO"
            :need-padding="true"
            :data-source="headInfo"
            :columns="getBasicInfoColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
          :label="
            $T('ssrc.inquiryHall.view.inquiryHall.rfxItemLines').$D('询价标的物')
          ">
          <div v-if="JSON.stringify(materialDetail) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div
            v-for="(item, index) in materialDetail"
            v-else
            :key="index">
            <customize
              :need-padding="true"
              :data-source="item"
              code="SMBL.EXPERT_RATING.ITEM_DETAIL"
              :columns="getItemDetailsColumns"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="headInfo.preQualificationFlag"
                             :label="
                               $T('ssrc.inquiryHall.view.message.button.preQualification').$D('资格预审')
                             ">
          <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <customize
            v-else
            :need-padding="true"
            code="SMBL.EXPERT_RATING.INQUERY_BILLS_PREQUALIFICATION"
            :data-source="headInfo"
            :columns="getPrequalificationColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="headInfo.expertScoreType === 'ONLINE'"
                             :label="
                               $T('ssrc.inquiryHall.view.message.tab.professional').$D('专家')
                             ">
          <div v-if="JSON.stringify(expertsInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div
            v-for="(item, index) in expertsInfo"
            v-else
            :key="index">
            <customize
              :need-padding="true"
              :data-source="item"
              code="SMBL.EXPERT_RATING.INQUIRY_BILLS_PROFESSIONAL"
              :columns="getProfessionalColumns"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="headInfo.expertScoreType === 'ONLINE'"
                             :label="
                               $T('ssrc.bidHall.model.bidHall.indicateName').$D('评分要素')
                             ">
          <div v-if="scoringElements&&(JSON.stringify(scoringElements.businessIndicList) === '[]'&&JSON.stringify(scoringElements.technologyIndicList) === '[]'&&JSON.stringify(scoringElements.otherIndicList) === '[]')" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div
            v-if="scoringElements&&JSON.stringify(scoringElements.businessIndicList) !== '[]'"
            class="card">
            <div class="sub-single-title">
              <span>{{ $T("ssrc.bidHall.model.bidHall.businessTeam").$D("商务组") }}</span>
              <span
                class="percent">{{ $T("ssrc.score.model.score.businessWeight").$D("评分权重") }}: {{ scoringElements.businessIndicList[0].businessWeight }}%</span>
            </div>
            <div v-for="(item,index) in scoringElements.businessIndicList" :key="index">
              <customize
                :need-padding="true"
                :data-source="item"
                code="SMBL.EXPERT_RATING.INQUIRY_BILLS_BUSINESS_TEAM"
                :columns="getBusinessTeamColumns"/>
            </div>
          </div>
          <div
            v-if="scoringElements&&JSON.stringify(scoringElements.technologyIndicList) !== '[]'"
            class="card">
            <div class="sub-single-title">
              <span>{{ $T("ssrc.bidHall.model.bidHall.technologyTeam").$D("技术组") }}</span>
              <span
                class="percent">{{ $T("ssrc.score.model.score.technologyWeight").$D("评分权重") }}: {{ scoringElements.technologyIndicList[0].technologyWeight }}%</span>
            </div>
            <div v-for="(item,index) in scoringElements.technologyIndicList" :key="index">
              <customize
                :need-padding="true"
                :data-source="item"
                code="SMBL.EXPERT_RATING.INQUIRY_BILLS_TECHNOLOGY_TEAM"
                :columns="getTechnologyTeamColumns"/>
            </div>
          </div>
          <div
            v-if="scoringElements&&JSON.stringify(scoringElements.otherIndicList) !== '[]'"
            class="card">
            <div v-for="(item,index) in scoringElements.otherIndicList" :key="index">
              <customize
                :need-padding="true"
                :data-source="item"
                code="SMBL.EXPERT_RATING.INQUIRY_BILLS_OTHERINDICLIST"
                :columns="getOtherIndicListColumns"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
          :label="
            $T('ssrc.bidHall.view.message.tab.supplierList').$D('供应商列表')
          ">
          <div v-if="JSON.stringify(supplierInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div
            v-for="(item, index) in supplierInfo"
            v-else
            :key="index">
            <customize
              :need-padding="true"
              :data-source="item"
              code="SMBL.EXPERT_RATING.INQUITY_BILLS_SUPPLIER_LIST"
              :columns="getSupplierColumns"/>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
      <!-- 操作记录弹窗 -->
      <operation-record
        v-model="operationPopup"
        :operation-arr="operationArr"
        :load-refresh="getOperationRecords"
        :loading="oploading"/>
      <!-- 专家信息详情弹窗 -->
      <supplier-info v-model="expertInfoPop" date-type="expert" :experts-assign-info="expertsAssignInfo" />
      <!-- 供应商信息详情弹窗 -->
      <supplier-info v-model="supplierInfoPop" date-type="supplier" :supplier-assign-info="supplierInfo" />
    </div>
  </div>
</template>

<script>
import {
  getExpertAssignedApi,
  getInquiryHeadInfoApi,
  getInquirySupplierApi,
  getOperationRecordsApi,
  getInquiryExpertsInfoApi,
  getInquiryMaterialDetailApi,
  getInquiryScoringElementsApi
} from "../api/index";
import OperationRecord from "@/components/New/OperationRecord";
import SupplierInfo from "../components/SupplierInfo";
import uuid from "uuid";
import { SrmListHeader } from "srm-mobile-ui";
export default {
  modules: [ "ssrc.bidHall", "ssrc.inquiryHall", "sfin.invoiceBill", "sfin.common", "sfin.supplierChargeEntry", "hipspfm.common", "hipspfm.invoiceBill", "ssrc.score", "hipspfm.expertScoring", "hipspfm.bidHall", "sprm.common" ],
  name: "InquiryBillsDetail",
  components: {
    OperationRecord,
    SupplierInfo
  },
  data() {
    return {
      headInfo: {}, // 头信息
      operationPopup: false,
      operationArr: [], //操作记录
      materialDetail: [],
      rfxHeaderId: null,
      scoringElements: {},
      expertsInfo: [],
      expertsAssignInfo: [], //专家分配信息
      supplierInfo: [],
      oploading: false,
      expertInfoPop: false,
      supplierInfoPop: false,
    };
  },
  computed: {
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "rfxNum",
        },
        {
          fieldCode: "rfxTitle",
        },
      ];

      return columns;
    },
    //基本信息
    getBasicInfoColumns() {
      const columns = [
        {
          fieldCode: "companyName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val) =>
            <SrmListHeader>
              <span>{val}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.purceOrgName").$D("采购组织名称"),
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingType").$D("寻源类型"),
          fieldCode: "sourceCategoryMeaning",
          render: (_, record) => record.secondarySourceCategoryMeaning || record.sourceCategoryMeaning || "-"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationType").$D("报价方式"),
          fieldCode: "quotationTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.biddingDirection").$D("报价方向"),
          fieldCode: "auctionDirectionMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.currency").$D("币种"),
          fieldCode: "currencyCodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.exchangeRate").$D("汇率"),
          fieldCode: "exchangeRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
          fieldCode: "budgetAmount",
          fieldType:"INPUT_NUMBER",
          editor:false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingTemplate").$D("寻源模板"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.remarks").$D("备注"),
          fieldCode: "rfxRemark",
        },
      ];

      return columns;
    },
    // 询价标的物
    getItemDetailsColumns() {
      const columns = [
        {
          fieldCode: "itemName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{this.$T("ssrc.bidHall.model.bidHall.itemName").$D("物料名称")}:{val}</span>
              <span slot="right"
                class="item-num">
                {this.$T("ssrc.bidHall.model.bidHall.lineNo").$D("行号")}：{record.rfxLineItemNum}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.itemCategory").$D("物料类别"),
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
          ,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quantity").$D("需求数量"),
          fieldCode: "rfxQuantity",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.businessUnit").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.inventoryOrg").$D("库存组织"),
          fieldCode: "invOrganizationName",
        },
      ];
      return columns;
    },
    //资格预审
    getPrequalificationColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.applicationDeadline").$D("预审截止时间"),
          fieldCode: "prequalEndDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.reviewMethod").$D("审查方法"),
          fieldCode: "reviewMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.qualifiedLimit").$D("合格上限"),
          fieldCode: "qualifiedLimit",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalUser").$D("审查员"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalLocation").$D("申请提交地点"),
          fieldCode: "prequalLocation",
        },
        {
          fieldName:this.$T("ssrc.inquiryHall.model.inquiryHall.prequalAttachment").$D("资格预审文件"),
          fieldCode: "prequalAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T("ssrc.inquiryHall.model.inquiryHall.prequalAttachment").$D("资格预审文件")}
                desc-title={this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}
              />
            </div>
          ,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalRemark").$D("资格预审备注"),
          fieldCode: "prequalApprovedRemark",
        },
      ];

      return columns;
    },
    //专家
    getProfessionalColumns() {
      const columns = [
        {
          fieldCode: "expertName",
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader>
              <span>{this.$T("ssrc.bidHall.model.scoring.expertName").$D("姓名")}：{record.expertName}</span>
              {
                record.evaluateLeaderFlagMeaning && <span slot="right"
                  class="name-tag">
                  { record.evaluateLeaderFlagMeaning}
                </span>
              }
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.userName").$D("用户名"),
          fieldCode: "loginName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.expertType").$D("专家类型"),
          fieldCode: "expertTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.expertLevel").$D("专家级别"),
          fieldCode: "expertLevelMeaning",
        },
      ];
      return columns;
    },
    //商务组
    getBusinessTeamColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.indicateDetail").$D("要素细项"),
          fieldCode: "indicateName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.scoringInterval").$D("评分区间"),
          fieldCode: "scoringInterval",
          render:(val, record) => `[${record.minScore ?? "-"}, ${record.maxScore ?? "-"}]`
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.weight").$D("权重"),
          fieldCode: "weight",
        },
        {
          fieldCode: "expertAssign",
          fieldType:"EMPTY",
          render:(val, record) => <SrmListHeader showOpenTag={false}>
            <span style="font-weight:initial">{this.$T("ssrc.bidHall.model.bidHall.expertAssign").$D("专家分配")} : </span>
            <span
              style={ { color:"var(--color-other-default-b)" } }
              class="fileBtn"
              onClick={() => this.showExpertInfo(record.team, record.evaluateIndicId)}>{this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}</span>
          </SrmListHeader>
        },
      ];
      return columns;
    },
    //技术组
    getTechnologyTeamColumns() {
      const columns = [
        {
          fieldCode: "indicateTypeMeaning",
          formRow:0,
          fieldType:"EMPTY",
          render:(val) => <SrmListHeader>
            <span>{this.$T("ssrc.bidHall.model.bidHall.indicateType").$D("要素类型")}:{val}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.indicateCode").$D("要素编码"),
          fieldCode: "indicateCode",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.maxScore").$D("最高分"),
          fieldCode: "maxScore",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.minScore").$D("最低分"),
          fieldCode: "minScore",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.elements.detail").$D("评分要素细项"),
          fieldCode: "indicateName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.scoringInterval").$D("评分区间"),
          fieldCode: "scoringInterval",
          render:(val, record) => `[${record.minScore ?? "-"}, ${record.maxScore ?? "-"}]`
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.weight").$D("权重"),
          fieldCode: "weight",
        },
        {
          fieldCode: "expertAssign",
          fieldType:"EMPTY",
          render:(val, record) => <SrmListHeader showOpenTag={false}>
            <span style="font-weight:initial">{this.$T("ssrc.bidHall.model.bidHall.expertAssign").$D("专家分配")} : </span>
            <span
              style={ { color:"var(--color-other-default-b)" } }
              class="fileBtn"
              onClick={() => this.showExpertInfo(record.team, record.evaluateIndicId)}>{this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}</span>
          </SrmListHeader>
        },
      ];
      return columns;
    },
    getOtherIndicListColumns() {
      const columns = [
        {
          fieldCode: "indicateTypeMeaning",
          formRow:0,
          fieldType:"EMPTY",
          render:(val) => <SrmListHeader>
            <span>{this.$T("ssrc.bidHall.model.bidHall.indicateType").$D("要素类型")}:{val}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.indicateCode").$D("要素编码"),
          fieldCode: "indicateCode",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.maxScore").$D("最高分"),
          fieldCode: "maxScore",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.minScore").$D("最低分"),
          fieldCode: "minScore",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.weight").$D("权重"),
          fieldCode: "weight",
        },
        {
          fieldCode: "expertAssign",
          fieldType:"EMPTY",
          render:(val, record) => <SrmListHeader showOpenTag={false}>
            <span style="font-weight:initial">{this.$T("ssrc.bidHall.model.bidHall.expertAssign").$D("专家分配")} : </span>
            <span
              style={ { color:"var(--color-other-default-b)" } }
              class="fileBtn"
              onClick={() => this.showExpertInfo(record.team, record.evaluateIndicId)}>{this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.indicateName").$D("评分要素"),
          fieldCode: "indicateName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.remark").$D("评分细则"),
          fieldCode: "indicateRemark",
        },
      ];
      return columns;
    },
    //供应商列表
    getSupplierColumns() {
      const columns = [
        {
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{val}</span>
              {
                record.stageDescription && <span slot="right" class="name-tag">{record.stageDescription}</span>
              }
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.supplierCode").$D("编码"),
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.contacts").$D("联系人"),
          fieldCode: "contactName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.contactPhone").$D("手机号"),
          fieldCode: "contactMobilephone",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.contactMail").$D("邮箱"),
          fieldCode: "contactMail",
        },
      ];
      return columns;
    },
  },
  async mounted() {
    const { sourceHeaderId } = this.$store.getters["ExpertRating/getTenderHallList"];
    this.rfxHeaderId = sourceHeaderId;
    await this.getInquiryScoringElements();
    await this.getInquiryHeadInfo();
    await this.getInquiryExpertsInfo();
    await this.getInquiryMaterialDetail();
    await this.getInquirySupplier();
  },
  methods: {
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 获取询价单头表明细信息
    async getInquiryHeadInfo() {
      await getInquiryHeadInfoApi(this.rfxHeaderId).then((res) => {
        console.log("headinfo test ...", res);
        this.headInfo = res || {};
        this.preQualificationFlag = this.headInfo.preQualificationFlag;
        this.expertScoreType = this.headInfo.expertScoreType;
        this.attachmentUuid = this.headInfo.attachmentUuid || uuid();
      });
    },
    //获取询价单物料明细信息
    async getInquiryMaterialDetail() {
      await getInquiryMaterialDetailApi(this.rfxHeaderId).then(
        ({ content = [] } = res) => {
          this.materialDetail = content;
        }
      );
    },
    //获取询价单专家信息
    async getInquiryExpertsInfo() {
      await getInquiryExpertsInfoApi(this.rfxHeaderId).then((res) => {
        this.expertsInfo = res.evaluateExpertList;
        console.log(this.expertsInfo, "info");
      });
    },
    // 获取询价单评分要素信息
    async getInquiryScoringElements() {
      await getInquiryScoringElementsApi(this.rfxHeaderId).then((res) => {
        this.scoringElements = res;
      });
    },
    //获取询价单专家分配信息
    async showExpertInfo(team, evaluateIndicId) {
      await getExpertAssignedApi(team, evaluateIndicId, this.rfxHeaderId).then(
        (res) => {
          this.expertsAssignInfo = res;
          this.expertInfoPop = true;
          console.log(res, "expertsAssignInfo......");
        }
      );
    },
    //获取询价单供应商信息
    async getInquirySupplier() {
      await getInquirySupplierApi(this.rfxHeaderId).then(
        ({ content = [] } = res) => {
          this.supplierInfo = content;
          console.log(this.supplierInfo, "supplierinfo");
        }
      );
    },
    async getInquiryLineSupplier() {
      await getInquirySupplierApi(this.rfxHeaderId).then(
        ({ content = [] } = res) => {
          this.supplierInfo = content;
          this.supplierInfoPop = !this.supplierInfoPop;
          console.log(this.supplierInfo, "supplierinfo");
        }
      );
    },
    // 获取操作记录
    async getOperationRecords() {
      this.oploading = true;
      await getOperationRecordsApi(this.rfxHeaderId).then((res) => {
        this.oploading = false;
        this.operationArr = res.content;
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}
.card-btn {
    font-size: 12px;
    color: var(--color-other-default-b);
    float: right;
    text-align: right;

    img {
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }
  .name-tag {
        font-size: 10px;
        color: var(--color-other-default-b);
        height: 20px;
        line-height: 20px;
        padding: 0 4px;
        display: inline-block;
        background: var(--color-bg-default-c);
        border-radius: 2px;
        margin-right: 8px;

        &:nth-child(2) {
          margin-left: 12px;
        }
      }
  .sub-single-title {
    height:50px;
    padding: 0 20px;
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 24px;
    display: flex;
    justify-content:space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border-default);

    .percent {
      font-size: 16px;
      color: var(--color-other-default-c);
      text-align: right;
    }
  }
  .line-body {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .line-code {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    padding: 0 4px;
    font-size: 10px;
    color: var(--color-font-default-c);
    border-radius: 2px;
    background: var(--color-bg-default-d, rgba(65, 70, 96, 0.1));
  }

  .line-number {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    margin-left: 8px;
    padding: 0 4px;
    font-size: 10px;
    color: var(--color-other-default-b);
    line-height: 18px;
    border-radius: 2px;
    background: var(--color-bg-default-c);
  }
}
>>> .srm-collapse-title{
  padding-left:0;
}
</style>
