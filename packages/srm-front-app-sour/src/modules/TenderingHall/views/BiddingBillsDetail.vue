<template>
  <div style="height: 100vh; overflow: auto">
    <div class="main-info">
      <!-- 导航 -->
      <nav-head
        :title="
          $T('ssrc.bidHall.view.title.bidDetails').$D('招标书明细')
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
            $T('ssrc.bidHall.view.tab.baseInfos').$D('基础信息')
          ">
          <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <customize
            v-else
            code="SMBL.TENDERING.HALL.BASIC_INFO"
            :need-padding="true"
            :data-source="headInfo"
            :columns="getBasicInfoColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
          :label="
            $T('ssrc.bidHall.view.title.itemLine').$D('物料明细')
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
              code="SMBL.TENDERING.HALL.ITEM_DETAILS"
              :columns="getItemDetailsColumns"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="headInfo.preQualificationFlag"
                             :label="
                               $T('ssrc.bidHall.view.tab.preQualification').$D('资格预审')
                             ">
          <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <customize
            v-else
            :need-padding="true"
            :data-source="headInfo"
            code="SMBL.TENDERING.HALL.PREQUALIFICATION"
            :columns="getPrequalificationColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="headInfo.expertScoreType === 'ONLINE'"
                             :label="
                               $T('ssrc.bidHall.view.tab.professional').$D('专家')
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
              :columns="getProfessionalColumns"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item v-if="headInfo.expertScoreType === 'ONLINE'"
                             :label="
                               $T('ssrc.bidHall.view.tab.scoringElements').$D('评分要素')
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
                class="percent" :style="Number(scoringElements.businessIndicList[0].businessWeight) > 40 ? 'color:var(--color-other-default-b)':''">{{ $T("ssrc.score.model.score.businessWeight").$D("评分权重") }}: {{ scoringElements.businessIndicList[0].businessWeight }}%</span>
            </div>
            <div v-for="(item,index) in scoringElements.businessIndicList" :key="index">
              <customize
                :need-padding="true"
                :data-source="item"
                :columns="getIndicListColumns"/>
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
                :columns="getIndicListColumns"/>
            </div>
          </div>
          <div
            v-if="scoringElements&&JSON.stringify(scoringElements.otherIndicList) !== '[]'"
            class="card">
            <div v-for="(item,index) in scoringElements.otherIndicList" :key="index">
              <customize
                :need-padding="true"
                :data-source="item"
                :columns="getIndicListColumns"/>
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
              code="SMBL.TENDERING.HALL.SUPPLIER_LIST"
              :columns="getSupplierColumns"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
          :label="
            $T('ssrc.bidHall.view.tab.tenderNotice').$D('招标公告')
          ">
          <div v-if="JSON.stringify(headInfo) === '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <customize
            :need-padding="true"
            :data-source="headInfo"
            code="SMBL.TENDERING.HALL.TENDER_NOTICE"
            :columns="getTenderNoticeColumns"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
      <!-- 操作记录弹窗 -->
      <operation-record
        v-model="operationPopup"
        :operation-arr="operationArr"
        :load-refresh="getOperationRecords"
        :loading="oploading"/>
      <!-- 开标弹窗 -->
      <open-tender v-model="tenderPopup" :tender-arr="tenderArr" :bid-header-id="bidHeaderId" />
      <!-- 专家信息详情弹窗 -->
      <supplier-info v-model="expertInfoPop" date-type="expert" :experts-assign-info="expertsAssignInfo" />
      <!-- 供应商信息详情弹窗 -->
      <supplier-info v-model="supplierInfoPop" date-type="supplier" :supplier-assign-info="supplierInfo" />
    </div>
    <div v-if="getOpenFlag(bidOpenDate)">
      <bottom-handler :btn-arr="btnArr" />
    </div>
  </div>
</template>

<script>
import {
  getExpertAssignedApi,
  getBiddingSupplierApi,
  getOperationRecordApi,
  getBiddingHeadInfoApi,
  getSupplierAssignedApi,
  getBiddingExpertsInfoApi,
  getBiddingMaterialDetailApi,
  getBiddingScoringElementsApi,
} from "../api/index";
//oldBidDetail import { getTenderApi } from "@/common/BidDetail/api";
import { getTenderApi } from "../api";
import OpenTender from "../components/OpenTender";
import BottomHandler from "@/components/BottomHandler";
import OperationRecord from "@/components/New/OperationRecord";
import SupplierInfo from "@/components/BidDetail/SupplierInfo";
import uuid from "uuid";
import moment from "moment";
import { SrmListHeader } from "srm-mobile-ui";
export default {
  modules: [ "ssrc.bidHall", "ssrc.inquiryHall", "hipspfm.common", "ssrc.score", "hipspfm.bidHall" ],
  name: "BiddingBillsDetail",
  components: {
    OperationRecord,
    SupplierInfo,
    OpenTender,
    BottomHandler
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
      bidHeaderId: null,
      tenderArr: [],
      btnArr: [
        {
          title: this.$T("ssrc.bidHall.model.bidHall.openingBid").$D("开标"),
          color: "var(--color-other-default-b)",
          handler: () => this.showTenderPop()
        }
      ],
      bidOpenDate: null,
      tenderPopup: false, // 开标弹窗
    };
  },
  computed: {
    getOpenFlag() {
      return (bidOpenDate) => {
        let NowTime = moment().format("YYYY-MM-DD HH:mm:ss");
        return moment(bidOpenDate).isSameOrBefore(NowTime);
      };
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "bidNum",
        },
        {
          fieldCode: "bidTitle",
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
          fieldName: this.$T("ssrc.bidHall.model.bidHall.roundNumber").$D("轮次"),
          fieldCode: "roundNumber",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.versionNumber").$D("版本"),
          fieldCode: "versionNumber",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.currencyType").$D("币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.exchangeRate").$D("汇率"),
          fieldCode: "exchangeRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationType").$D("报价方式"),
          fieldCode: "quotationTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.bidType").$D("招标类型"),
          fieldCode: "bidTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sourcingApproach").$D("寻源方式"),
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
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sourcingTemplate").$D("寻源模版"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.businessAttachments").$D("商务附件"),
          fieldCode: "businessAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T("ssrc.bidHall.model.bidHall.businessAttachments").$D("商务附件")}
                desc-title={this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}
              />
            </div>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.techAttachments").$D("技术附件"),
          fieldCode: "techAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T("ssrc.bidHall.model.bidHall.techAttachments").$D("技术附件")}
                desc-title={this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}
              />
            </div>
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
                {this.$T("ssrc.bidHall.model.bidHall.lineNo").$D("行号")}：{record.bidLineItemNum}
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
          fieldType:"INPUT_NUMBER",
          editor:false
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
          fieldCode: "prLineNum",
          fieldType:"EMPTY",
          render:(val, record) => <SrmListHeader showOpenTag={false}>
            <span style="font-weight:initial">{this.$T("ssrc.bidHall.model.bidHall.lineNum").$D("采购申请行号") }：{ record.prLineNum}</span>
            <span
              slot="right"
              class="card-btn"
              onClick={() => this.getSupplierAssigned(this.bidHeaderId, record.bidLineItemId)}>
              {this.$T("ssrc.bidHall.model.bidHall.viewSupplier").$D("查看供应商")}
              <img
                class="image-blue-default"
                src={require("@/assets/icon_list_right_highlight@3x.png")}/>
            </span>
          </SrmListHeader>
        },
      ];
      return columns;
    },
    //资格预审
    getPrequalificationColumns() {
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
          fieldName:this.$T("ssrc.bidHall.model.bidHall.prequalFile").$D("资格预审文件"),
          fieldCode: "prequalAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T("ssrc.bidHall.model.bidHall.prequalFile").$D("资格预审文件")}
                desc-title={this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}
              />
            </div>
          ,
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
    //要素列表
    getIndicListColumns() {
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
    //招标公告
    getTenderNoticeColumns() {
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
          fieldName:this.$T("ssrc.bidHall.model.bidHall.noticeAttachment").$D("附件"),
          fieldCode: "noticeAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T("ssrc.bidHall.model.bidHall.noticeAttachment").$D("附件")}
                desc-title={this.$T("ssrc.bidHall.view.message.button.view").$D("查看")}
              />
            </div>
          ,
        },
        {
          fieldName: this.$T("ssrc.bidHall.view.message.tab.otherInfos").$D("其他信息"),
          fieldCode: "remark",
        },
      ];
      return columns;
    },
  },
  async mounted() {
    const { bidOpenDate, bidHeaderId, sourceHeaderId } = this.$route.query;
    this.bidHeaderId = bidHeaderId || sourceHeaderId;
    this.bidOpenDate = bidOpenDate;
    this.$loading.show();
    await this.getBiddingHeadInfo();
    await this.getBiddingMaterialDetail();
    await this.getBiddingSupplier();
    await this.getBiddingExpertsInfo();
    await this.getBiddingScoringElements();
    await this.getOperationRecords();
    this.finishLoad = true;
    this.$loading.hide();
  },
  methods: {
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    //显示开标弹窗
    showTenderPop() {
      this.tenderPopup = !this.tenderPopup;
      if (this.tenderPopup === true) {
        this.getTender();
      }
    },
    // 获取开标信息
    getTender() {
      this.$loading.show();
      getTenderApi(this.bidHeaderId).then((res) => {
        this.tenderArr = res;
        this.$loading.hide();
      });
    },
    showLineFilePop(attachmentUUID) {
      if (typeof attachmentUUID === "string") {
        this.attachmentUUID = attachmentUUID;
      }
      this.lineFilePopup = !this.lineFilePopup;
    },
    // 获取招投标头表明细信息
    async getBiddingHeadInfo() {
      // this.rfxHeaderId
      await getBiddingHeadInfoApi(this.bidHeaderId).then((res) => {
        this.headInfo = res || {};
        this.preQualificationFlag = this.headInfo.preQualificationFlag;
        this.expertScoreType = this.headInfo.expertScoreType;
        this.attachmentUuid = this.headInfo.attachmentUuid || uuid();
      });
    },
    //获取招投标物料明细信息
    async getBiddingMaterialDetail() {
      await getBiddingMaterialDetailApi(this.bidHeaderId).then((res) => {
        this.materialDetail = res;
      });
    },
    //获取招投标供应商信息
    async getBiddingSupplier() {
      await getBiddingSupplierApi(this.bidHeaderId).then(({ content = [] }) => {
        this.supplierInfo = content;
      });
    },
    //获取招投标专家信息
    async getBiddingExpertsInfo() {
      await getBiddingExpertsInfoApi(this.bidHeaderId).then((res) => {
        this.expertsInfo = res.evaluateExpertList;
      });
    },
    //获取招投标专家分配信息
    async showExpertInfo(team, evaluateIndicId) {
      await getExpertAssignedApi(team, evaluateIndicId, this.bidHeaderId).then((res) => {
        this.expertsAssignInfo = res;
        this.expertInfoPop = true;
      });
    },
    //获取招投标供应商分配信息
    getSupplierAssigned(bidHeaderId, bidLineItemId) {
      getSupplierAssignedApi(bidHeaderId, bidLineItemId).then((res) => {
        this.supplierAssignInfo = res;
        this.supplierInfoPop = true;
      });
    },
    // 获取招投标评分要素信息
    async getBiddingScoringElements() {
      await getBiddingScoringElementsApi(this.bidHeaderId).then((res) => {
        this.scoringElements = res;
      });
    },
    // 获取操作记录
    async getOperationRecords() {
      this.oploading = true;
      await getOperationRecordApi(this.bidHeaderId).then((res) => {
        this.oploading = false;
        this.operationArr = res.content;
      });
    },
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
</style>
