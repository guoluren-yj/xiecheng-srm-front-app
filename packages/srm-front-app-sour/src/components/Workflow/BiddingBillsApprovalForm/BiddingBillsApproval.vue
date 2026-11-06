<template>
  <section v-if="headInfo" class="mainDetail">
    <div class="contentWrap wrapper">
      <srm-scroll-tab class="content">
        <!-- 基础信息 -->
        <srm-scroll-tab-item class="infoContent" :label="$T('ssrc.bidHall.view.tab.baseInfos').$D('基础信息')">
          <div>
            <!-- 个性化组件替换后的代码 -->
            <customize :need-padding="true" :columns="getBasicInfoColumns" :data-source="headInfo" code="SMBL.WORKFLOW.BIDDING_BILLS_APPROVAL.BASIC_INFO"/>
          </div>
        </srm-scroll-tab-item>
        <!-- 物料明细 -->
        <srm-scroll-tab-item class="infoContent"
                             :label="$T('ssrc.bidHall.view.message.tab.itemDetails').$D('物料明细')">
          <div v-if="JSON.stringify(materialDetail) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in materialDetail" v-else :key="index">
            <!-- 个性化组件替换后的代码 -->
            <customize :need-padding="true" :columns="getItemsInfoColumns" :data-source="item" code="SMBL.WORKFLOW.BIDDING_BILLS_APPROVAL.ITEMS_INFO"/>
          </div>
        </srm-scroll-tab-item>
        <!-- 资格预审 -->
        <srm-scroll-tab-item v-if="headInfo.preQualificationFlag" class="infoContent" :label="$T('ssrc.bidHall.view.tab.preQualification').$D('资格预审')">
          <div>
            <!-- 个性化组件替换后的代码 -->
            <customize :need-padding="true" :columns="getPrequalificationInfoColumns" :data-source="headInfo" code="SMBL.WORKFLOW.BIDDING_BILLS_APPROVAL.PREQUALIFICATION_INFO"/>
          </div>
        </srm-scroll-tab-item>
        <!-- 专家 -->
        <srm-scroll-tab-item v-if="headInfo.expertScoreType === 'ONLINE'" class="infoContent"
                             :label="$T('ssrc.bidHall.view.tab.professional').$D('专家')">
          <div v-if="expertsInfo">
            <div v-for="(item,index) in expertsInfo" :key="index" class="card-context">
              <!-- 个性化组件替换后的代码 -->
              <customize :need-padding="true" :columns="getExpertsInfoColumns" :data-source="item" code="SMBL.WORKFLOW.BIDDING_BILLS_APPROVAL.EXPERTS_INFO"/>
            </div>
          </div>
          <div v-else class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
        </srm-scroll-tab-item>
        <!-- 评分要素 -->
        <srm-scroll-tab-item v-if="headInfo.expertScoreType === 'ONLINE'" class="infoContent"
                             :label="$T('ssrc.bidHall.view.tab.scoringElements').$D('评分要素')">
          <div>
            <div
              v-if="scoringElements&&(JSON.stringify(scoringElements.businessIndicList) === '[]'&&JSON.stringify(scoringElements.technologyIndicList) === '[]'&&JSON.stringify(scoringElements.otherIndicList) === '[]')"
              class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
            </div>
            <div
              v-if="scoringElements&&JSON.stringify(scoringElements.businessIndicList) !== '[]'"
              class="card">
              <div class="sub-single-title">
                <div>{{ $T("ssrc.bidHall.model.bidHall.businessTeam").$D("商务组") }}</div>
                <span
                  class="percent"
                  :style="Number(scoringElements.businessIndicList&&scoringElements.businessIndicList[0].businessWeight) > 40 ? 'color:var(--color-other-default-b)':''">{{ $T("ssrc.score.model.score.businessWeight").$D("评分权重") }}: {{ scoringElements.businessIndicList&&scoringElements.businessIndicList[0].businessWeight }}%</span>
              </div>
              <ul v-for="(item,index) in scoringElements.businessIndicList" :key="index">
                <!-- 个性化组件替换后的代码 -->
                <customize :need-padding="true" :columns="getScoreElementsInfoColumns" :data-source="item" code="SMBL.WORKFLOW.BIDDING_BILLS_APPROVAL.SCORE_ELEMENT_INFO"/>
              </ul>
            </div>
            <div
              v-if="scoringElements&&JSON.stringify(scoringElements.technologyIndicList) !== '[]'"
              class="card">
              <div class="sub-single-title">
                <div>{{ $T("ssrc.bidHall.model.bidHall.technologyTeam").$D("技术组") }}</div>
                <span
                  class="percent"
                  :style="Number(scoringElements.technologyIndicList&&scoringElements.technologyIndicList[0].technologyWeight) > 40 ? 'color:var(--color-other-default-b)':''">{{ $T("ssrc.score.model.score.technologyWeight").$D("评分权重") }}: {{ scoringElements.technologyIndicList&&scoringElements.technologyIndicList[0].technologyWeight }}%</span>
              </div>
              <ul v-for="(item,index) in scoringElements.technologyIndicList" :key="index">
                <!-- 个性化组件替换后的代码 -->
                <customize :need-padding="true" :columns="getScoreElementsInfoColumns" :data-source="item" code="SMBL.WORKFLOW.BIDDING_BILLS_APPROVAL.SCORE_ELEMENT_INFO"/>
              </ul>
            </div>
            <div
              v-if="scoringElements&&JSON.stringify(scoringElements.otherIndicList) !== '[]'">
              <div v-for="(item,index) in scoringElements.otherIndicList" :key="index" class="card-context">
                <!-- 个性化组件替换后的代码 -->
                <customize :need-padding="true" :columns="getScoreElementsInfoColumns" :data-source="item" code="SMBL.WORKFLOW.BIDDING_BILLS_APPROVAL.SCORE_ELEMENT_INFO"/>
              </div>
            </div>
          </div>
        </srm-scroll-tab-item>
        <!-- 供应商 -->
        <srm-scroll-tab-item class="infoContent"
                             :label="$T('ssrc.bidHall.view.message.tab.supplierList').$D('供应商列表')">
          <div v-if="JSON.stringify(supplierInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in supplierInfo" :key="index">
            <li class="name-title">
              <div class="item-name noWrap">{{ item.supplierCompanyName }}</div>
              <div v-if="item.stageDescription" class="name-tag">{{ item.stageDescription }}</div>
            </li>
            <!-- 个性化组件替换后的代码 -->
            <customize :need-padding="true" :columns="getSupplierInfoColumns" :data-source="item" code="SMBL.WORKFLOW.BIDDING_BILLS_APPROVAL.SUPPLIER_INFO"/>
          </div>
        </srm-scroll-tab-item>
        <!-- 招标公告 -->
        <srm-scroll-tab-item class="infoContent" :label="$T('ssrc.bidHall.view.tab.tenderNotice').$D('招标公告')">
          <div>
            <!-- 个性化组件替换后的代码 -->
            <customize :need-padding="true" :columns="getNoticeInfoColumns" :data-source="headInfo" code="SMBL.WORKFLOW.BIDDING_BILLS_APPROVAL.NOTICE_INFO"/>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <!-- 行附件弹窗 -->
    <attached-file
      v-model="filePopup"
      :attachment-uuid="attachmentUuid"
      :bucket-name="bucketName"
      :query-params="{tenantId}"/>
    <!-- 专家信息详情弹窗 -->
    <supplier-info v-model="expertInfoPop" date-type="expert" :experts-assign-info="expertsAssignInfo" />
    <!-- 供应商信息详情弹窗 -->
    <supplier-info
      v-model="supplierInfoPop"
      date-type="supplier"
      :supplier-assign-info="supplierAssignInfo"/>
    <tendering-group v-model="tenderPop" :tendering-group-info="tenderingGroupInfo" />
  </section>
</template>

<script>
// 招投标详情页
import uuid from "uuid";
import AttachedFile from "@/components/File/AttachedFile";
import SupplierInfo from "../../BidDetail/SupplierInfo";
import TenderingGroup from "./components/TenderingGroup";
//oldBidDetail import {
//   getExpertAssignedApi,
//   getBiddingSupplierApi,
//   getBiddingHeadInfoApi,
//   getSupplierAssignedApi,
//   getBiddingExpertsInfoApi,
//   getBiddingMaterialDetailApi,
//   getBiddingScoringElementsApi
// } from "../../../common/BidDetail/api";

import {
  getExpertAssignedApi,
  getBiddingSupplierApi,
  getBiddingHeadInfoApi,
  getSupplierAssignedApi,
  getBiddingExpertsInfoApi,
  getBiddingMaterialDetailApi,
  getBiddingScoringElementsApi,
  getTenderingGroupApi
} from "./api";
// import { getTenderingGroupApi } from "../api/Jin";
import { SrmListHeader } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.common", "ssrc.bidHall", "hipspfm.workFlow", "hipspfm.bidHall", "ssrc.score", "hipspfm.expertScoring", "ssrc.planToInquiry", "ssrc.inquiryHall", "smodr.frightLine" ],
  name: "BiddingBillsApproval",
  components: {
    SupplierInfo,
    AttachedFile,
    TenderingGroup,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    }
  },
  data() {
    return {
      headInfo: {}, // 头信息
      materialDetail: [],
      supplierInfo: [],
      expertsInfo: {},
      scoringElements: {},
      expertsAssignInfo: [], //专家分配信息
      supplierAssignInfo: [], //专家分配信息
      operationArr: [], //操作记录
      scroll: "",
      navScroll: "",
      activeNames: [],
      filePopup: false,
      bucketName: "private-bucket",
      offsetX: 0,
      show: false,
      ouInfoPop: false,
      supplierInfoPop: false,
      expertInfoPop: false,
      attachmentUuid: "",
      contentLenArr: [],
      lengthArr: [],
      tenantId: window.localStorage.tenantId,
      tenderPop: false,
      tenderingGroupInfo: []
    };
  },
  computed: {
    getBasicInfoColumns() {
      const columns = [
        {
          fieldCode: "companyName",
          fieldType:"EMPTY",
          formRow:0,
          render:(val) => <SrmListHeader>{val}</SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidNum").$D("招标编号"),
          fieldCode: "bidNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidTitle").$D("招标事项"),
          fieldCode: "bidTitle",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quotationType").$D("报价方式"),
          fieldCode: "quotationTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidType").$D("招标类型"),
          fieldCode: "bidTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sourceMethod").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sourceStage").$D("招标阶段"),
          fieldCode: "sourceStageMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.subjectMatterRule").$D("标的规则"),
          fieldCode: "subjectMatterRuleMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.maxBidNumber").$D("最大中标数"),
          fieldCode: "maxBidNumber",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.purchaseOrgName").$D("采购组织名称"),
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sourcingTemplate").$D("寻源模版"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quotationStartTime").$D("投标开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quotationDeadline").$D("投标截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidOpenDate").$D("开标时间"),
          fieldCode: "bidOpenDate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.clarifyEndTime").$D("澄清截止时间"),
          fieldCode: "clarifyEndTime",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.purchaseAgentName").$D("采购员"),
          fieldCode: "purchaserName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.totalBudget").$D("预算金额"),
          fieldCode: "totalBudget",
          fieldType:"INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("ssrc.bidHall.view.modal.title.bidMembers").$D("招标小组"),
          fieldCode: "",
          render: () => <span style="color: blue">{this.$T("hipspfm.common.button.view").$D("查看")}</span>,
          callBack:() => {
            this.getTenderingGroup();
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.businessAttachments").$D("商务附件"),
          fieldCode: "businessAttachmentUuid",
          render: () => <span style="color: blue">{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>,
          callBack:(val) => {
            this.showFilePop(val.businessAttachmentUuid || uuid);
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.techAttachments").$D("技术附件"),
          fieldCode: "techAttachmentUuid",
          render: () => <span style="color: blue">{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>,
          callBack:(val) => {
            this.showFilePop(val.techAttachmentUuid || uuid);
          }
        },
      ];
      return columns;
    },
    getItemsInfoColumns() {
      const columns = [
        {
          fieldCode: "itemName",
          fieldType:"EMPTY",
          formRow:0,
          render:(val, record) => <SrmListHeader>
            <span>{val}</span>
            <span
              slot="right"
              class="item-num">
              {this.$T("ssrc.bidHall.model.bidHall.lineNo").$D("行号") }：{record.bidLineItemNum}
            </span>
          </SrmListHeader>
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
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.needNum").$D("需求数量"),
          fieldCode: "bidQuantity",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inqueryHall.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.costPrice").$D("标底单价"),
          fieldCode: "costPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
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
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prNum").$D("采购申请号"),
          fieldCode: "prNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.lineAttachmentUuid").$D("行附件"),
          fieldCode: "lineAttachmentUuid",
          render: () => <span style="color: blue">{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>,
          callBack:(val) => {
            this.showFilePop(val.lineAttachmentUuid || uuid);
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.lineNum").$D("采购申请行号"),
          fieldCode: "sectionName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商"),
          fieldCode: "",
          render: () => <span style="color: blue">{this.$T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商")}</span>,
          callBack:(val) => {
            this.getSupplierAssigned(val.bidLineItemId);
          }
        },
      ];
      return columns;
    },
    getPrequalificationInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prequalEndDate").$D("预审截止时间"),
          fieldCode: "prequalEndDate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.reviewMethod").$D("审查方法"),
          fieldCode: "reviewMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.qualifiedLimit").$D("合格上限"),
          fieldCode: "qualifiedLimit",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prequalLocation").$D("申请提交地点"),
          fieldCode: "prequalLocation",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.prequalAttachment").$D("资格预审文件"),
          fieldCode: "prequalAttachmentUuid",
          render: () => <span style="color: blue">{this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}</span>,
          callBack:(val) => {
            this.showFilePop(val.prequalAttachmentUuid || uuid);
          }
        }
      ];
      return columns;
    },
    getSupplierInfoColumns() {
      const columns = [
        {
          fieldType:"EMPTY",
          fieldCode:"supplierCompanyName",
          formRow:0,
          render:(val, record) => <SrmListHeader>
            <span>{val}</span>
            {
              record.stageDescription &&
               <span class="name-tag">{ record.stageDescription }</span>
            }
          </SrmListHeader>
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
        }
      ];
      return columns;
    },
    getExpertsInfoColumns() {
      const columns = [
        {
          fieldCode: "loginName",
          fieldType:"EMPTY",
          formRow:0,
          render:(val, record) => <SrmListHeader>
            <span>{this.$T("ssrc.bidHall.model.scoring.expertName").$D("姓名") }：{val}</span>
            {
              record.evaluateLeaderFlagMeaning &&
               <span
                 slot="right"
                 class="name-tag">
                 {record.evaluateLeaderFlagMeaning}
               </span>
            }
          </SrmListHeader>
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
        }
      ];
      return columns;
    },
    getScoreElementsInfoColumns() {
      const columns = [
        {
          fieldType:"EMPTY",
          formRow:0,
          render:(val, record) => <SrmListHeader>
            <span>{this.$T("ssrc.bidHall.model.bidHall.indicateType").$D("要素类型")}：{record.indicateTypeMeaning}</span>
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
          fieldName: this.$T("ssrc.bidHall.model.bidHall.expertAssign").$D("专家分配"),
          fieldCode: "",
          render: () => <span style="color: blue">{this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}</span>,
          callBack:(val) => {
            this.showExpertInfo(val.team, val.evaluateIndicId);
          }
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
    getNoticeInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.noticeNum").$D("编号"),
          fieldCode: "noticeNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.noticeStatus").$D("状态"),
          fieldCode: "noticeStatusMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.noticeAttachment").$D("附件"),
          fieldCode: "noticeAttachmentUuid",
          render: () => <span style="color: blue">{this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}</span>,
          callBack:(val) => {
            this.showFilePop(val.noticeAttachmentUuid || uuid, "notice");
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.view.message.tab.otherInfos").$D("其他信息"),
          fieldCode: "remark",
        },
      ];
      return columns;
    },
  },
  watch: {
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getBiddingHeadInfo();
        await this.getBiddingMaterialDetail();
        await this.getBiddingSupplier();
        await this.getBiddingExpertsInfo();
        await this.getBiddingScoringElements();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.view.message.title.biddingBillsApproval").$D(
        "招标书发布审批"
      )
    );
  },
  methods: {
    // 打开附件弹窗
    showFilePop(attachmentUuid, mark) {
      this.attachmentUuid = attachmentUuid || uuid();
      this.filePopup = !this.filePopup;
      this.bucketName = "private-bucket";
      if (mark === "notice") {
        this.bucketName = "public-bucket";
      }
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    },
    // 获取招标单发布审批头信息
    async getBiddingHeadInfo() {
      await getBiddingHeadInfoApi(this.changeReqId).then((res) => {
        this.headInfo = res;
        console.log("header", res);
      });
    },
    //获取招投标物料明细信息
    async getBiddingMaterialDetail() {
      await getBiddingMaterialDetailApi(this.changeReqId).then((res) => {
        this.materialDetail = res;
        console.log("materialDetail", this.materialDetail);
      });
    },
    //获取招投标供应商信息
    async getBiddingSupplier() {
      await getBiddingSupplierApi(this.changeReqId).then(
        ({ content = [] } = res) => {
          console.log("supplier", content);
          this.supplierInfo = content;
        }
      );
    },
    //获取招投标专家信息
    async getBiddingExpertsInfo() {
      await getBiddingExpertsInfoApi(this.changeReqId).then((res) => {
        this.expertsInfo = res.evaluateExpertList;
      });
    },
    //获取招投标专家分配信息
    async showExpertInfo(team, evaluateIndicId) {
      await getExpertAssignedApi(team, evaluateIndicId, this.changeReqId).then(
        (res) => {
          this.expertsAssignInfo = res;
          this.expertInfoPop = true;
          console.log(res, "expertsAssignInfo......1111111111");
        }
      );
    },
    //获取招投标供应商分配信息
    async getSupplierAssigned(bidLineItemId) {
      await getSupplierAssignedApi(this.changeReqId, bidLineItemId).then(
        (res) => {
          this.supplierAssignInfo = res;
          this.supplierInfoPop = true;
          console.log(this.supplierAssignInfo, "supplierAssignInfo......");
        }
      );
    },
    //获取招标小组信息
    async getTenderingGroup() {
      await getTenderingGroupApi(this.changeReqId).then((res) => {
        this.tenderingGroupInfo = res;
        this.tenderPop = true;
        console.log("zzzz", res);
      });
    },
    // 获取招投标评分要素信息
    async getBiddingScoringElements() {
      await getBiddingScoringElementsApi(this.changeReqId).then((res) => {
        console.log("scoringElements", res);
        this.scoringElements = res;
      });
    }
  }
};
</script>

<style scoped  lang="stylus">
  .item-num {
      height: 20px;
      padding: 0 6px;
      font-size: 10px;
      color: var(--color-other-default-b);
      line-height: 20px;
      border-radius: 2px;
      background: var(--color-bg-default-c);
    }
    .name-tag {
      font-size: 10px;
      color: var(--color-other-default-b);
      height: 20px;
      line-height: 20px;
      padding: 0 4px;
      display: inline-block;
      background: var(--color-bg-default-c);
      border-radius: 2px;;
    }
    .noContent {
        height: 78px;
        padding-left: 20px;

        span {
          position: relative;
          top: 16px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: var(--color-font-default-b);
          letter-spacing: 0;
          line-height: 22px;
        }
      }
.card {
  width: 100%;
  color: #666666;
  .sub-single-title {
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    padding: 0 0 8px 15px;
    align-items: center;
    border-bottom: 1px solid var(--color-border-default);

    .percent {
      font-size: 16px;
      color: var(--color-other-default-c);
      text-align: right;
    }
  }
}
</style>
