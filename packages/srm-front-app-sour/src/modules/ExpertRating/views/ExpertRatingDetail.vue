<template>
  <div>
    <nav-head :title="$T('hipspfm.common.view.message.details').$D('单据详情')"/>
    <!-- 头信息 -->
    <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
      <div>
        <srm-button fill type="primary" size="small" class="button-right-margin" @click="toBiddingBillDetail">
          <span style="display: flex; align-items: center;">
            <img src="@/assets/icon_doc_white.svg" alt>
          </span>
        </srm-button>
        <srm-button size="small" class="button-right-margin" @click="showFilePop">
          <span style="display: flex; align-items: center;">
            <img src="@/assets/icon_attach.svg" alt>
          </span>
        </srm-button>
        <srm-button size="small" @click="showScoreSummary">
          <span style="display: flex; align-items: center;">
            <img style="margin-right: 2px" src="@/assets/icon_doc.svg" alt>
            {{ $T('ssrc.expertScoring.view.mobile.title.scoreSummary').$D('查看评分汇总') }}
          </span>
        </srm-button>
      </div>
    </srm-detail-head>
    <!-- 头附件弹窗 -->
    <attached-file
      v-model="filePopup"
      :attachment-uuid="expertAttachmentUuid"
      :title="titleFlag"
      :can-upload="canUploadFlag"/>
    <!-- 查看评分汇总弹窗 -->
    <div v-if="scoreSummaryPopup">
      <score-summary
        v-model="scoreSummaryPopup"
        :loading="scoreSumPopupLoading"
        :data-source="scoreSummaryData"
        @handleClose="handleScoreSummaryClose"/>
    </div>
    <!-- 行附件弹窗 -->
    <attached-file v-model="lineFilePopup" :attachment-uuid="lineAttachmentUUID"/>
    <div class="expert-scoring-content-wrapper" :style="{ height: scoreFlag ? 'calc(100vh - 216px)' : 'calc(100vh - 140px)' }">
      <!-- 维度切换 -->
      <div class="srm-content-top">
        <div class="srm-content-top-dimen">
          <srm-button
            :style="dimen === dimenTab.supplier ? 'background: white' : 'background: #F7F8FA; color:#4E5769'"
            type="info"
            @click="handDimenChange(dimenTab.supplier)">
            <span style="font-size: 10px"> {{ $T('ssrc.common.supplier').$D('供应商') }} </span>
          </srm-button>
          <srm-button
            :style="dimen === dimenTab.element ? 'background: white' : 'background: #F7F8FA; color:#4E5769'"
            type="info"
            @click="handDimenChange(dimenTab.element)">
            <span style="font-size: 10px"> {{ $T('ssrc.inquiryHall.view.message.tab.scoringElements').$D('评分要素') }} </span>
          </srm-button>
        </div>
      </div>
      <div class="dimen-tips">
        <div v-if="dimen === dimenTab.supplier">
          <span
            v-if="operate !== 'score'">{{
              $T('hipspfm.expertScoring.validation.message.showAndCheckScore').$D('展开信息可以查看评分')
            }}！</span>
          <span
            v-else>{{ $T('hipspfm.expertScoring.validation.message.showAndmodifyScore').$D('展开信息可评分以及修改评分') }}！</span>
        </div>
        <div v-if="dimen === dimenTab.element">
          <span>{{
            $T('ssrc.expertScoring.view.mobile.message.showAndSwitchSupplier').$D('上传供应商附件或填写供应商备注请切换至供应商维度')
          }}</span>
        </div>
      </div>
      <!-- 供应商信息折叠面板 -->
      <srm-collapse v-if="dimen === dimenTab.supplier" :max-open="1" @change="changeItem">
        <srm-collapse-item v-for="(item,index) in companyArr" :key="index" :name="index" class="collapse-item-wrapper">
          <div class="title">
            <span v-if="item.scoreStatus===null" class="circle green"/>
            <span v-else-if="item.scoreStatus==='SCORED'" class="circle gray"/>
            <span v-else class="circle yellow"/>
            <span v-if="item.companyNum">{{ item.companyNum }}-{{ item.companyName }}</span>
            <span v-if="!item.companyNum">{{ item.companyName }}</span>
          </div>
          <div>
            <srm-tag bordered @click.native.stop="viewAttachment(item)">{{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }} </srm-tag>
          </div>
          <div slot="content" class="rate-container">
            <div
              v-if="!item.scoreStatus || item.scoreStatus===null"
              class="rate start"
              @click="goRaiting(item,'rating')">
              {{ $T('ssrc.expertScoring.view.modal.button.startScore').$D('开始评分') }}
            </div>
            <div
              v-else-if="item.scoreStatus==='NEW'"
              class="rate modify"
              @click="goRaiting(item,'rating')">
              {{ $T('ssrc.expertScoring.model.expertScoring.modifyScore').$D('修改评分') }}
            </div>
            <div
              v-else-if="item.scoreStatus==='SCORED'"
              class="rate look"
              @click="goRaiting(item,'checking')">
              {{ $T('ssrc.expertScoring.view.message.button.checkScore').$D('查看评分') }}
            </div>
            <div
              v-else-if="item.scoreStatus==='RESCORING'"
              class="rate modify"
              @click="goRaiting(item,'rating')">
              {{ $T('ssrc.expertScoring.model.expertScoring.restartScore').$D('重新评分') }}
            </div>
            <div
              v-for="(ele,i) in item.lineInfo"
              :key="i"
              class="infoContent lineInfo"
              @click="showLineDetailPop(i,item)">
              <customize
                code="SMBL.EXPERT_RATING.MATERIAL_LINEINFO_NEW"
                :need-padding="true"
                :columns="getLineinfoColumns(item.scoreStatus)"
                :data-source="{...ele,lineTeam:item.team}"/>
            </div>
          </div>
        </srm-collapse-item>
      </srm-collapse>
      <!-- 评分要素信息滑块 -->
      <div v-if="dimen === dimenTab.element" class="srm-wrap-scoll-card">
        <scoll-card v-if="elementInfo" :data-list="elementInfo" :activite-tab="activiteTab" :score-flag="scoreFlag" @handClick="handCardClick"/>
      </div>
      <!-- 滑块具体内容 -->
      <div v-if="dimen === dimenTab.element" class="srm-wrap-content-wrapper">
        <!-- 评分要素信息 -->
        <div v-if="elementChildrenInfo" class="srm-wrap-content">
          <!-- 一级评分要素内容 -->
          <div v-if="elementChildrenInfo.indicateId" class="srm-wrap-content-one-element">
            <div v-if="elementChildrenInfo.parentIndicateCode" class="one-element-name">{{ elementChildrenInfo.parentIndicateCode }}-{{ elementChildrenInfo.parentIndicateName }}</div>
            <div v-if="!elementChildrenInfo.parentIndicateCode" class="one-element-name">{{ elementChildrenInfo.parentIndicateName }}</div>
            <div class="one-element-remark">{{ $T('ssrc.expertScoring.model.expertScoring.detail').$D('评分细则') }}:{{ elementChildrenInfo.indicateRemark || '-' }}</div>
            <div class="content-divider"/>
          </div>
          <!-- 二级评分要素内容 -->
          <srm-flex style="padding: 16px 16px 0 16px; align-items: baseline" class="srm-wrap-content-two-element">
            <srm-flex-item flex="1">
              <div class="two-element-name">{{ elementChildrenInfo.indicateName }}</div>
              <div class="two-element-code">{{ elementChildrenInfo.indicateCode }}</div>
            </srm-flex-item>
            <!-- 评分类型为权重法且要素类型打分制时显示权重 -->
            <srm-flex-item v-if="(headInfo && headInfo.scoreType === 'WEIGHT') && elementChildrenInfo.indicateType === 'SCORE'" style="max-width: 85px" >
              <srm-tag type="primary">{{ $T("ssrc.inquiryHall.model.inquiryHall.weight").$D("权重") }}:{{ elementChildrenInfo.weight }}%</srm-tag>
            </srm-flex-item>
          </srm-flex>
          <div class="two-element-desc">
            <div class="two-element-remark">
              <srm-tag type="info" style="margin-right: 4px">{{ elementChildrenInfo.indicateTypeMeaning }}</srm-tag>
              {{ $T('ssrc.expertScoring.model.expertScoring.detail').$D('评分细则') }}:{{ elementChildrenInfo.remark || '-' }}
            </div>
          </div>
        </div>
        <!-- 评分信息 -->
        <div class="srm-wrap-content-score">{{ $T('ssrc.expertScoring.view.message.button.score').$D('评分') }}</div>
        <srm-list
          :v-if="elementChildrenInfo"
          :scrollable="false"
          :data-set="eleTabScoreDs"
          :columns="getEleTabScoreColumns()"/>
      </div>
    </div>
    <!-- 行信息详情弹窗 -->
    <div v-if="lineInfoDetail">
      <order-line-detail
        v-model="lineInfoPopup"
        :show-line-file-pop="showLineFilePop"
        :line-info-detail="lineInfoDetail"
        :double-unit-flag="doubleUnitFlag"/>
    </div>
    <srm-bottom-handler v-if="operate==='score'" :btn-arr="getBtnArr" type="action-sheet" />
  </div>
</template>

<script>
import { DataSet, SrmListHeader } from "srm-mobile-ui";
import OrderLineDetail from "../components/OrderLineDetail";
import ScoreSummary from "../components/ScoreSummary";
import ScollCard from "../components/ScollCard";
import { eleTabSupplierDS } from "../datasource/expertRatingDetailDS";
import CompleteMethod from "../../../modules/CUX_PART/Method/CompleteMethod";
import AttachedFile from "@/components/File/AttachedFile";
import { queryDoubleUnit } from "@/utils/utils";
import { numberInputCheck } from "@/utils/index";
import uuid from "uuid";
import { cloneDeep } from "lodash";
import {
  getTransfer,
  getUUIDApi,
  submitScoreApi,
  getRatingDetailApi,
  getRatingDetailLineApi,
  fetchHeaderInfo,
  getApermissionsApi,
  getRatingElementApi,
  saveElementScoreApi,
  getScoreSummaryData,
  submitElementScoreApi,
  submitElementApi,
  fetchNewQuotationConfigSheet,
} from "../api/index";
import { getPriceName, getNetPriceName, getAvailableQtyName, getUomName, getQtyName } from "@/utils/doubleUnit";

const storage = window.localStorage;

export default {
  modules: [ "smbl.common", "hipspfm.expertScoring", "hipspfm.common", "ssrc.expertScoring", "ssrc.bidHall", "ssrc.common", "ssrc.supplierQuotation", "ssrc.inquiryHall", "hipspfm.workFlow", "sslm.purchaserEvaluationDetail", "sslm.common" ],
  name: "ExpertRatingDetail",
  components: {
    AttachedFile,
    OrderLineDetail,
    ScollCard,
    ScoreSummary
  },
  extends: CompleteMethod,
  data() {
    return {
      headInfo: {}, // 头信息
      lineInfo: [], // 行信息
      lineInfoDetail: {},
      expertAttachmentUuid: null,
      lineAttachmentUUID: null,
      filePopup: false, //头附件弹窗
      scoreSummaryPopup: false, // 头查看评分汇总弹框
      scoreSumPopupLoading: false, // 头查看评分汇总弹框加载标志
      scoreSummaryData: {}, // 评分汇总数据信息
      lineFilePopup: false, //行附件弹窗
      activeName: [],
      lineInfoPopup: false, //行信息弹窗
      // promptExist: true,
      companyArr: [],
      scoreStatus: "",
      operate: "",
      canUploadFlag: false,
      titleFlag: "hipspfm.common.message.title.viewAttachment",
      doubleUnitFlag: false, // 判断是否开启双单位
      expertSource: "", // 判断专家来自专家库还是子账户
      transferFlag: 0, // 判断权限集转交按钮是否显示
      openBidOrder: "", // 评标步制 'SYNC' | 'TECH_FIRST' | 'BUSINESS_FIRST'
      bidRuleType: "", // 标书规则 'NONE' | 'DIFF'
      hideBusinessBid: false, // 同PC端 - 隐藏商务标, 商务附件等字段显隐
      dimenTab: { // 维度值
        supplier: "supplier", // 供应商:supplier
        element: "element", // 评分要素：element
      },
      dimen: "supplier", // 默认维度 供应商
      activiteTab: 0, // 要素维度 默认激活的卡片
      elementInfo: [],
      elementChildrenInfo: {},
      scoreFlag: false, // 打分/查看评分
      eleTabScoreDs: new DataSet(eleTabSupplierDS()),
      bidFlag: false, // 新招标标志位
      lineAttachmentInfo: {}, // 行附件信息 勿动 中科合盈
      newQuotationFlag: 0, // 启用新报价标识
    };
  },
  computed:{
    getBtnArr() {
      return [
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          handler: () => this.clickSave({ isBottomSave: true, evaluateScoreDTOS: this.eleTabScoreDs?.toData?.() }),
        },
        {
          title: this.$T("hipspfm.common.button.submit").$D("提交"),
          handler: this.clickSumbit,
          type: "primary",
          fill: true,
        },
        this.transferFlag ? {
          title: this.$T("hipspfm.common.button.tranfer").$D("转交"),
          handler: this.clickTransfer,
          fill: false,
          bordered: true,
          // permissionCode: "expertScoring.update.button.transfer",
        } : null,
      ].filter(Boolean);
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "sourceNum",
        },
        {
          fieldCode: "sourceTitle",
        },
      ];

      return columns;
    },
    getLineinfoColumns() {
      return (scoreStatus) => {
        const columns = [
          {
            formRow: 0,
            fieldCode: "itemName",
            fieldType: "EMPTY",
            render: (val, record) => <SrmListHeader showOpenTag={false}>
              {
                scoreStatus === null ? <span class="block green"/> :
                  scoreStatus === "SCORED" ? <span class="block gray"/> : <span class="block yellow"/>
              }
              <span>{val}</span>
              <span slot="right" style={{ color: "var(--color-font-default-e)" }}>
                {this.$T("ssrc.bidHall.model.bidHall.lineNo").$D("行号") }:{record.sourceLineItemNum}</span>
            </SrmListHeader>
          },
          {
            fieldName:this.$T("ssrc.expertScoring.model.expertScoring.itemCode").$D("物料编码"),
            fieldCode:"itemCode",
          },
          this.doubleUnitFlag ? {
            fieldName:this.$T("ssrc.expertScoring.model.expertScoring.taxIncludedPrice").$D("单价(含税)"),
            fieldCode:"validQuotationSecPrice",
            fieldType: "INPUT_NUMBER",
            editor: false,
            visible:(val, record) => record.lineTeam === "BUSINESS"
          } : null,
          this.doubleUnitFlag ? {
            fieldName:this.$T("ssrc.inquiryHall.model.inquiryHall.netPrice").$D("单价(不含税)"),
            fieldCode:"validNetSecondaryPrice",
            fieldType: "INPUT_NUMBER",
            editor: false,
            visible:(val, record) => record.lineTeam === "BUSINESS"
          } : null,
          {
            fieldName:getPriceName(this.doubleUnitFlag),
            fieldCode:"validQuotationPrice",
            fieldType: "INPUT_NUMBER",
            editor: false,
            visible:(val, record) => record.lineTeam === "BUSINESS"
          },
          {
            fieldName:getNetPriceName(this.doubleUnitFlag),
            fieldCode:"validNetPrice",
            fieldType: "INPUT_NUMBER",
            editor: false,
            visible:(val, record) => record.lineTeam === "BUSINESS"
          },
          this.doubleUnitFlag ? {
            fieldName:this.$T("ssrc.bidHall.modal.inqueryHall.unit").$D("单位"),
            fieldCode:"secondaryUomName",
          } : null,
          {
            fieldName:getUomName(this.doubleUnitFlag),
            fieldCode:"uomName",
          },
          {
            fieldName:this.$T("ssrc.expertScoring.model.expertScoring.totalAmount").$D("总金额"),
            fieldCode:"totalAmount",
            fieldType:"INPUT_NUMBER",
            editor: false,
            precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.quotationCurrencyCode, "financialPrecision")),
            visible:(val, record) => record.lineTeam === "BUSINESS"
          },
          this.doubleUnitFlag ? {
            fieldName:this.$T("ssrc.inquiryHall.model.inquiryHall.rfxQuantity").$D("需求数量"),
            fieldCode:"secondaryQuantity",
            fieldType: "INPUT_NUMBER",
            editor: false,
          } : null,
          this.doubleUnitFlag ? {
            fieldName:this.$T("ssrc.expertScoring.model.expertScoring.validQtationQuantity").$D("可供数量"),
            fieldCode:"validQuotationSecQuantity",
            fieldType: "INPUT_NUMBER",
            editor: false,
          } : null,
          {
            fieldName:getQtyName(this.doubleUnitFlag),
            fieldCode:"sourceQuantity",
            fieldType: "INPUT_NUMBER",
            editor: false,
          },
          {
            fieldName:getAvailableQtyName(this.doubleUnitFlag),
            fieldCode:"validQuotationQuantity",
            fieldType: "INPUT_NUMBER",
            editor: false,
          },
          {
            fieldName:this.$T("ssrc.bidHall.modal.inqueryHall.demandDate").$D("需求日期"),
            fieldCode:"demandDate",
            render: (val) =>
            // eslint-disable-next-line new-cap
              this.$options.filters["CalcDate"](val)
            ,
          },
          {
            fieldName:this.$T("ssrc.bidHall.model.bidHall.currentPromisedDate").$D("承诺交货日期"),
            fieldCode:"validPromisedDate",
            render: (val) =>
            // eslint-disable-next-line new-cap
              this.$options.filters["CalcDate"](val)
            ,
          },
        ];
        return columns;
      };
    },
  },
  async mounted() {
    const {
      ["ExpertRating/getExpertRatingList"]: getExpertRatingList,
      ["ExpertRating/getExpertRatingOperates"]: getExpertRatingOperates,
    } = this.$store.getters;
    this.headInfo = getExpertRatingList;
    console.log("this.headInfo", this.headInfo);
    this.bidFlag = getExpertRatingList?.secondarySourceCategory === "NEW_BID";
    this.operate = getExpertRatingOperates;
    if (this.operate === "score") {
      this.canUploadFlag = true;
      this.titleFlag = "hipspfm.common.message.uploadAttanchment";
      this.scoreFlag = true; // 打分页面
    }
    this.doubleUnitFlag = await queryDoubleUnit({
      businessModule: "RFX",
    });
    if ((this.headInfo || {}).sourceFrom === "RFX") {
      const res = await fetchHeaderInfo({
        sourceHeaderId: (this.headInfo || {}).sourceHeaderId,
      });
      if (res && !res.failed) {
        this.expertSource = res.expertSource;
        this.openBidOrder = res.openBidOrder;
        this.bidRuleType = res.bidRuleType;
        this.hideBusinessBid = res.businessTechSee === "TECH";
      }

      // 查询当前单据 配置表 是否使用新报价 只针对询价、新招标 存在报价/投标详情
      this.newQuotationConfigSheet();
    }
    const result = await getApermissionsApi([ "expertScoring.update.button.transfer" ]);
    if (result && !result.failed) {
      if (result && result[0] && result[0].code === "expertScoring.update.button.transfer") {
        this.transferFlag = result[0].approve;
      }
    }
    await this.getRatingSupplier();
  },
  methods: {
    // 投标查询、报价查询（只做sourceFrom 为 ‘RFX’）
    jumpQuotationDetail(item = {}) {
      const { sourceNum, sourceHeaderId, sourceTitle, sourceStatus } = this.headInfo;
      const { quotationHeaderId, quotationHeaderRecordId, supplierCompanyId, prequalLineStatus, prequalLineStatusMeaning, operationMeaning } = item || {};
      if (!sourceHeaderId || !quotationHeaderId) {
        return;
      }
      let name = "";
      let query = {};
      // 新报价
      if (this.newQuotationFlag) {
        name = "QueryQuotation";
        query = {
          rfxHeaderId: sourceHeaderId,
          quotationHeaderId,
          quotationHeaderRecordId,
          documentType: "RFX",
          switchUrl: 2, // 采购方查看标志
        };
        // 新招标
        if (this.bidFlag) {
          name = "QueryBidding";
          query = {
            rfxHeaderId: sourceHeaderId,
            quotationHeaderId,
            quotationHeaderRecordId,
            documentType: "BID",
            switchUrl: 2, // 采购方查看报价详情标志
          };
        }
      } else { // 老报价
        name = "SupplierQueryQuotationDetail";
        query = {
          rfxHeaderId: sourceHeaderId,
          quotationHeaderId,
          rfxNum: sourceNum,
          rfxTitle: sourceTitle,
          operationMeaning,
          rfxStatus: sourceStatus,
          supplierCompanyId,
          prequalLineStatus,
          prequalLineStatusMeaning,
          // quotationHeaderStatus, 子页面没用到此参数
          switchUrl: 2, // 采购方查看报价详情标志
        };
        // 新招标
        if (this.bidFlag) {
          name = "NewSupplierQueryBiddingDetail";
          query = {
            rfxHeaderId: sourceHeaderId,
            quotationHeaderId,
            rfxNum: sourceNum,
            rfxTitle: sourceTitle,
            operationMeaning,
            rfxStatus: sourceStatus,
            supplierCompanyId,
            prequalLineStatus,
            prequalLineStatusMeaning,
            // quotationHeaderStatus, 子页面没用到此参数
            switchUrl: 2, // 采购方查看标志
          };
        }
      }
      this.$router.push({
        name,
        query,
      });
    },
    // 查询当前单据 配置表 是否使用新报价
    newQuotationConfigSheet() {
      const { sourceHeaderId } = this.headInfo || {};
      if (!sourceHeaderId) {
        return;
      }
      const params = {
        organizationId: storage.getItem("organizationId"),
        rfxHeaderId: sourceHeaderId,
      };
      fetchNewQuotationConfigSheet(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: self.$T("smbl.common.message.request.error").$D("请求失败"),
            description: res.message,
            class: "notification"
          });
        } else if (res === 1) {
          // 新报价
          this.newQuotationFlag = true;
        }
      });
    },
    // 评分要素维度下 评分信息
    getEleTabScoreColumns() {
      // const diffAndFirst = this.bidRuleType === "DIFF" && [ "TECH_FIRST", "BUSINESS_FIRST" ].includes(this.openBidOrder);
      // const noneAndSync = this.bidRuleType === "NONE" && this.openBidOrder === "SYNC";
      // const noneAndFirst = this.bidRuleType === "NONE" && [ "TECH_FIRST", "BUSINESS_FIRST" ].includes(this.openBidOrder);
      const { sourceFrom } = this.headInfo;
      const isRfFlag = [ "RFI", "RFP" ].includes(sourceFrom);
      const showBusinessBidFlag = isRfFlag ? true : !this.hideBusinessBid;
      const columns = [
        {
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          formRow: 10,
          formCol: 10,
          render: (val, item) => <div class="supplier-name-content">
            <div class="supplier-name-style">{item.supplierCompanyName}</div>
            {
              Number(item.suggestInvalidFlag) ?
                <div class="supplier-invalid-style">
                  <srm-tag type="danger">{this.$T("ssrc.expertScoring.view.mobile.suggestInvalid").$D("建议无效")}</srm-tag>
                </div> :
                null
            }
          </div>,
        },
        showBusinessBidFlag && {
          fieldCode: "sectionAmount",
          fieldName: this.bidFlag ? this.$T("ssrc.supplierQuotation.model.supQuo.totalTenderAmount").$D("投标总金额") : this.$T("ssrc.bidHall.model.bidHall.quotationTotalAmount").$D("报价总金额"),
          fieldType: "INPUT_NUMBER",
          formRow: 20,
          formCol: 10,
          editor: false,
          visible: (_, item) => item.team !== "TECHNOLOGY",
        },
        {
          fieldCode: "attachmentUuid",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
          // render: (val, record) => <srm-attachment-button attachmentUuid={record.attachmentUuid} readonly showTotal bucketName={SrmUtil.getDefaultBucketName()} />,
          render: (val, item) => <span style="color: var(--color-other-default-b);"
            on-click={() => this.viewAttachment(item)}>
            { this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
          </span>
        },
        sourceFrom === "RFX" && !this.hideBusinessBid && {
          fieldCode: "quotationDetail",
          fieldName: this.bidFlag ? this.$T("ssrc.inquiryHall.model.inquiryHall.bidDetail").$D("投标详情") : this.$T("hipspfm.expertScoring.view.mobile.quotationDetail").$D("报价详情"),
          fieldType: "TEXT",
          formRow: 30,
          formCol: 20,
          visible: (_, item) => item.team !== "TECHNOLOGY",
          render: (val, item) => <span style="color: var(--color-other-default-b);"
            on-click={() => this.jumpQuotationDetail(item)}>
            { this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
          </span>
        },
        this.elementChildrenInfo?.indicateType === "SCORE" && {
          fieldCode: "indicScore",
          fieldType: this.scoreFlag ? "INPUT" : "TEXT",
          formRow: 40,
          formCol: 10,
          disabled: this.elementChildrenInfo?.calculateType === "AUTO", // 自动计算禁用
          inputChange:(val, record) => numberInputCheck(record, "indicScore"),
          placeholder: `${this.$T("ssrc.inquiryHall.model.inquiryHall.scoringInterval").$D("评分区间")}[${this.elementChildrenInfo?.minScore || this.elementChildrenInfo?.minScore === 0 ? this.elementChildrenInfo?.minScore : "-"}, ${this.elementChildrenInfo?.maxScore || this.elementChildrenInfo?.maxScore === 0 ? this.elementChildrenInfo?.maxScore : "-"}]`,
        },
        this.elementChildrenInfo?.indicateType === "PASS" && {
          fieldCode: "passStatus",
          fieldType: this.scoreFlag ? "SELECT" : "TEXT",
          lovCode: this.scoreFlag ? "SSRC.DETAIL_APPROVED_STATUS" : null,
          formRow: 50,
          formCol: 10,
          render:(val, record) => record.passStatusMeaning
        },
      ].filter(Boolean);
      return columns;
    },
    viewAttachment(line) {
      // 勿动 中科合盈二开用
      this.lineAttachmentInfo = line || {};
      if (this.over$viewAttachment && typeof this.over$viewAttachment === "function") {
        return this.over$viewAttachment();
      }
      this.$showFileList({
        isTab: true,
        fileArr: [
          {
            title: this.$T("ssrc.common.model.bidHall.businessAttachments").$D("商务附件"),
            attachmentUuid: !this.hideBusinessBid ? line.businessAttachmentUuid || uuid() : null,
            readOnly: true,
          },
          {
            title: this.$T("ssrc.common.model.bidHall.techAttachments").$D("技术附件"),
            attachmentUuid: line.techAttachmentUuid || uuid(),
            readOnly: true,
          },
          {
            title: this.$T("ssrc.supplierQuotation.model.supQuo.barginBusiAttach").$D("议价商务附件"),
            attachmentUuid: !this.hideBusinessBid ? line.bargainBusinessAttachmentUuid || uuid() : null,
            readOnly: true,
          },
          {
            title: this.$T("ssrc.supplierQuotation.model.supQuo.barginTechAttach").$D("议价技术附件"),
            attachmentUuid: line.bargainTechAttachmentUuid || uuid(),
            readOnly: true,
          },
          {
            title: this.$T("ssrc.supplierQuotation.model.supQuo.roundBusiAttach").$D("多轮商务附件"),
            attachmentUuid: !this.hideBusinessBid ? line.roundBusinessAttachmentUuid || uuid() : null,
            readOnly: true,
          },
          {
            title: this.$T("ssrc.supplierQuotation.model.supQuo.roundTechAttach").$D("多轮技术附件"),
            attachmentUuid: line.roundTechAttachmentUuid || uuid(),
            readOnly: true,
          },
        ].filter((i) => Boolean(i)),
      });
    },
    //头附件弹窗
    showFilePop() {
      if (!this.expertAttachmentUuid) {
        this.expertAttachmentUuid = uuid();
      }
      this.filePopup = !this.filePopup;
    },
    //评分汇总弹窗-打开
    showScoreSummary() {
      this.scoreSummaryPopup = !this.scoreSummaryPopup;
      const { sourceHeaderId } = this.headInfo;
      const {
        expertUserId,
        expertSequenceNum,
        sourceFrom,
        subjectMatterRule,
        evaluateExpertId
      } = this.headInfo;
      const params = {
        expertUserId,
        sourceFrom,
        expertSequenceNum,
        subjectMatterRule,
        sourceHeaderId,
        evaluateExpertId,
        viewScoreFlag: 0,
      };
      this.scoreSumPopupLoading = true;
      getScoreSummaryData(params).then((resp) => {
        if (resp && resp.failed) {
          this.$notification.open({
            message: self.$T("smbl.common.message.request.error").$D("请求失败"),
            description: resp.message,
            class: "notification"
          });
        } else {
          this.scoreSummaryData = resp;
        }
      }).finally(() => {
        this.scoreSumPopupLoading = false;
      });
    },
    // 评分汇总弹窗-关闭
    handleScoreSummaryClose() {
      this.scoreSummaryPopup = !this.scoreSummaryPopup;
      this.scoreSummaryData = {};
    },
    // 行信息弹窗
    showLineDetailPop(i, item) {
      this.lineInfoDetail = { ...this.lineInfo[i], lineTeam:item.team };
      this.lineInfoPopup = !this.lineInfoPopup;
    },
    //行附件弹窗
    showLineFilePop(lineAttachmentUUID) {
      if (!lineAttachmentUUID) {
        getUUIDApi().then((res) => {
          this.lineAttachmentUUID = res.content;
          this.lineFilePopup = !this.lineFilePopup;
        });
      } else {
        this.lineFilePopup = !this.lineFilePopup;
      }
    },
    //点击知道了
    // handleKnow() {
    //   this.promptExist = false;
    // },
    //获取评分供应商信息
    async getRatingSupplier() {
      const { sourceHeaderId } = this.headInfo;
      const {
        expertUserId,
        expertSequenceNum,
        sourceFrom,
        subjectMatterRule
      } = this.headInfo;
      const params = {
        page: 0,
        size: 10,
        expertUserId,
        sourceFrom,
        expertSequenceNum,
        subjectMatterRule
      };
      this.$loading.show();
      await getRatingDetailApi(params, sourceHeaderId).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: self.$T("smbl.common.message.request.error").$D("请求失败"),
            description: res.message,
            class: "notification"
          });
        } else {
          this.companyArr = res.evaluateScoreDTOS;
          if (this.companyArr.length === 0) {
            this.$notification.open({
              message: this.$T("hipspfm.workFlow.view.message.noAnyIndicsInfoReview").$D("没有任何评分要素可以评分"),
              description: "",
              class: "notification"
            });
          }
          this.expertAttachmentUuid =
            res.evaluateScoreDTOS[0] && res.evaluateScoreDTOS[0].expertAttachmentUuid || uuid();
        }
      }).finally(() => this.$loading.hide());
    },
    //获取评分要素信息
    async getRatingElement(activiteTab = 0) {
      const { sourceHeaderId } = this.headInfo;
      const {
        expertUserId,
        expertSequenceNum,
        sourceFrom,
        subjectMatterRule,
        evaluateExpertId
      } = this.headInfo;
      const params = {
        expertUserId,
        sourceFrom,
        expertSequenceNum,
        subjectMatterRule,
        sourceHeaderId,
        evaluateExpertId,
        viewScoreFlag: 0,
      };
      this.$loading.show();
      await getRatingElementApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: self.$T("smbl.common.message.request.error").$D("请求失败"),
            description: res.message,
            class: "notification"
          });
          this.$loading.hide();
        } else {
          // 每次切换维度，激活第一个卡片
          this.activiteTab = activiteTab || 0;
          this.elementChildrenInfo = res[`${activiteTab}`] || {};
          this.elementInfo = res;
          // 查询评分信息
          const param = this.getEleTabScoreParam();
          this.eleTabScoreDs.setBodyParameter(param);
          this.eleTabScoreDs.reset();
          this.eleTabScoreDs.refresh();
        }
      }).finally(() => this.$loading.hide());
    },
    //获取评分要素维度-评分信息
    getEleTabScoreParam() {
      const { sourceHeaderId } = this.headInfo;
      const { evaluateIndicId, indicateId } = this.elementChildrenInfo || {};
      const {
        expertUserId,
        expertSequenceNum,
        sourceFrom,
        subjectMatterRule,
        evaluateExpertId
      } = this.headInfo;
      const params = {
        expertUserId,
        sourceFrom,
        expertSequenceNum,
        subjectMatterRule,
        sourceHeaderId,
        evaluateExpertId,
        viewScoreFlag: 0,
        evaluateIndicId,
        indicateId,
      };
      return params;
    },
    // 卡片点击回调
    async handCardClick(record, activite) {
      // 判断eleTabSupplierDs有修改 则调用保存
      if (this.scoreFlag && this.eleTabScoreDs?.dirty) {
        // 深拷贝
        // 避免ds.reset 重置数据[{}]
        const evaluateScoreDTOS = cloneDeep(this.eleTabScoreDs?.toData?.());
        this.clickSave({ evaluateScoreDTOS });
      }
      this.elementChildrenInfo = record;
      this.activiteTab = activite;
      // 查询评分信息
      const param = this.getEleTabScoreParam();
      this.eleTabScoreDs.setBodyParameter(param);
      this.eleTabScoreDs.reset();
      this.eleTabScoreDs.refresh();
    },
    //跳转评分详情
    goRaiting(item, sourceType) {
      const {
        evaluateScoreIds,
        supplierCompanyId,
        quotationHeaderId,
        currentSequenceNum
      } = item;
      this.$router.push({
        name: "ExpertRating",
        query: {
          evaluateScoreIds,
          supplierCompanyId,
          quotationHeaderId,
          currentSequenceNum,
          sourceType
        }
      });
    },
    // 跳转询价单详情页
    toBiddingBillDetail() {
      const { sourceFrom, sourceHeaderId, bidOpenDate } = this.headInfo;
      this.$store.commit("ExpertRating/setTenderHallList", this.headInfo);
      if (sourceFrom === "RFX") {
        this.$router.push({
          name: "InquiryBillsDetail"
        });
      } else {
        this.$router.push({ name: "BiddingBillsDetail", query: { bidHeaderId: sourceHeaderId, bidOpenDate } });
      }
    },
    //展开获取数据
    async changeItem(e) {
      // console.log(e, "e");
      if (e.length > 0) {
        let i = e[e.length - 1];
        const { quotationHeaderId, supplierCompanyId } = this.companyArr[i] ?
          this.companyArr[i] :
          [];
        const { sourceFrom } = this.headInfo;
        const params = {
          sourceFrom,
          supplierId: supplierCompanyId,
          customizeUnitCode: "SMBL.EXPERT_RATING.MATERIAL_LINEINFO_NEW,SMBL.EXPERT_RATING.MATERIAL_LINEINFO_DETAIL_NEW",
          sourceMobileEndFlag: 1,
          page: 0,
          size: 10
        };
        this.$loading.show();
        await getRatingDetailLineApi(params, quotationHeaderId).then((res) => {
          this.$loading.hide();
          this.companyArr[i].lineInfo = res.content;
          this.$forceUpdate();
          this.lineInfo = res.content;
        });
      }
    },
    //提交提示
    clickSumbit() {
      // eslint-disable-next-line consistent-this
      const self = this;
      // eslint-disable-next-line rulesdir/no_hips
      this.$hips.dialog.confirm({
        content:
          this.$T(
            "hipspfm.expertScoring.validation.message.comfirmSummitRate"
          ).$D("是否确认提交评分") + "？",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk: () => {
          if (this.dimen === this.dimenTab.supplier) {
            return self.handleSumbit();
          } else if (this.dimen === this.dimenTab.element) {
            return self.handleSubmitElementTab();
          }
        }
      });
    },
    // 转交提示
    clickTransfer() {
      const { sourceFrom = "", sourceHeaderId = "", evaluateExpertId = "", } = this.headInfo || {};
      if (this.expertSource === "EXPERT_LIBRARY") {
        this.$lov("SSRC.EXPERT", async (val) => {
          const record = val[0] || {};
          const { expertId, userId } = record;
          const res = await getTransfer({
            expertId,
            sourceFrom,
            sourceHeaderId,
            evaluateExpertId,
            expertUserId: userId,
          });
          if (!res) {
            this.$router.back();
          } else {
            this.$notification.open({
              message: res.message,
              class: "notification"
            });
          }
        }, {
          queryParams: {
            enabledFlag: 1,
          }
        });
      } else {
        this.$lov("HIAM.TENANT.USER", async (val) => {
          const record = val[0] || {};
          const { id } = record;
          const res = await getTransfer({
            sourceFrom,
            sourceHeaderId,
            expertUserId: id,
            evaluateExpertId,
          });
          if (!res) {
            this.$router.back();
          } else {
            this.$notification.open({
              message: res.message,
              class: "notification"
            });
          }
        });
      }

    },
    //确认提交
    handleSumbit() {
      const {
        expertUserId,
        sourceFrom,
        sourceHeaderId,
        subjectMatterRule,
        expertSequenceNum,
        evaluateExpertId
      } = this.headInfo;
      const params = {
        expertUserId,
        sourceFrom,
        sourceHeaderId,
        expertSequenceNum,
        subjectMatterRule,
        expertAttachmentUuid: this.expertAttachmentUuid,
        elementFlag: 0,
        evaluateExpertId
      };
      submitScoreApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          this.$router.push({
            name: "ExpertRatingList"
          });
        }
      });
    },
    //确认提交-评分要素维度
    handleSubmitElementTab() {
      const {
        expertUserId,
        sourceFrom,
        sourceHeaderId,
        subjectMatterRule,
        expertSequenceNum,
        evaluateExpertId
      } = this.headInfo || {};
      const { evaluateIndicId, indicateId, indicateType } = this.elementChildrenInfo || {};
      const params = {
        expertUserId,
        sourceFrom,
        sourceHeaderId,
        expertSequenceNum,
        subjectMatterRule,
        elementFlag: 1,
        evaluateExpertId,
        evaluateIndicId,
        indicateId,
        indicateType,
        evaluateScoreDTOS: this.eleTabScoreDs?.toData?.(),
        tenantId: storage.getItem("organizationId"),
      };
      this.$loading.show();
      submitElementScoreApi(params).then(async (res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          const result = await submitElementApi(res);
          if (result && result.failed) {
            this.$notification.open({
              message: result.message,
              description: "",
              class: "notification",
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
            this.$router.push({
              name: "ExpertRatingList"
            });
          }
        }
      }).finally(() => this.$loading.hide());
    },
    clickSave({ isBottomSave = false, evaluateScoreDTOS = [] }) {
      // 保存只针对评分要素维度有效
      if (this.dimen === this.dimenTab.supplier) {
        return;
      }
      // 不是必填，保存也不校验，但是提交(后端)要校验 此表格不支持个性化
      // const validationFlag = this.eleTabScoreDs.validate();
      // if (!validationFlag) {
      //   this.$notification.open({
      //     duration: 1000,
      //     message: this.$T("ssrc.common.view.title.pleaseInputCorrectContent").$D("请输入正确内容"),
      //   });
      //   return;
      // }

      const {
        expertUserId,
        sourceFrom,
        sourceHeaderId,
        expertSequenceNum,
        evaluateExpertId,
        subjectMatterRule
      } = this.headInfo || {};
      const { evaluateIndicId, indicateId, indicateType } = this.elementChildrenInfo || {};
      const params = {
        evaluateExpertId,
        expertUserId,
        evaluateIndicId,
        indicateId,
        sourceHeaderId,
        sourceFrom,
        expertSequenceNum,
        evaluateScoreDTOS,
        subjectMatterRule,
        indicateType,
        tenantId: storage.getItem("organizationId"),
      };
      this.$loading.show();
      saveElementScoreApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          const { evaluateIndicMobileViewDTOS = [] } = res || {};
          // 保存后 替换要素信息 跟新要素评估进度
          this.elementChildrenInfo = evaluateIndicMobileViewDTOS[`${this.activiteTab}`] || {};
          this.elementInfo = evaluateIndicMobileViewDTOS;

          if (isBottomSave) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
            // 查询评分信息
            const param = this.getEleTabScoreParam();
            this.eleTabScoreDs.setBodyParameter(param);
            this.eleTabScoreDs.reset();
            this.eleTabScoreDs.refresh();
          }
        }
      }).finally(() => {
        this.$loading.hide();
      });

    },
    // 评分维度回调
    handDimenChange(val) {
      // 查询供应商
      if (val === this.dimenTab.supplier) {
        // 判断eleTabSupplierDs有修改 则调用保存
        if (this.scoreFlag && this.eleTabScoreDs?.dirty) {
          this.clickSave({ evaluateScoreDTOS: this.eleTabScoreDs?.toData?.() });
        }
        this.getRatingSupplier();
      }
      // 查询要素
      if (val === this.dimenTab.element) {
        this.getRatingElement();
      }
      // 维度赋值
      this.dimen = val;
    },
  }
};
</script>

<style lang="stylus" scoped>
.title{
width:200px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.button-right-margin{
  margin-right: 8px;
}

.prompt {
  height: 36px;
  font-size: 14px;
  color: var(--color-font-default-d);
  opacity: 0.7;
  background: #000000;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0px 20px;
  justify-content: space-between;

  div:nth-child(1) {
    display: flex;
    align-items: center;
    line-height: 20px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: var(--color-font-default-d);

    img {
      height: 18.3px;
      width: 18.3px;
      margin-right: 4.9px;
    }
  }

  div:nth-child(2) {
    font-family: PingFangSC-Medium;
    font-size: 10px;
    color: var(--color-other-default-b);
    line-height: 18px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--color-other-default-b);
    border-radius: 2px;
    border-radius: 2px;
    padding: 1px 4px;
  }

  span:nth-child(2) {
    width: 241px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 8px;
  }

  span:nth-child(3) {
    font-family: PingFangSC-Medium;
    font-size: 10px;
    color: var(--color-other-default-b);
    line-height: 18px;
    border: 1px solid var(--color-other-default-b);
    border-radius: 2px;
    padding: 1px 4px;
  }
}
.block {
            display: inline-block;
            height: 14px;
            width: 6px;
            border-radius: 1px;
            margin: 4px 10px 0 0;
          }
.circle {
  display: inline-block;
  height: 8px;
  width: 8px;
  border-radius: 4px;
  border-radius: 4px;
  margin-right: 8px;
}

.green {
  background: var(--color-other-default-b);
}

.yellow {
  background: var(--color-other-default-c);
}

.gray {
  background: #82879E;
}

.collapse-item-wrapper {
  >>> .srm-collapse-content-active {
    max-height: 100%;
  }
}

.rate-container{
  width:100%;
.rate {
  padding: 10px 0px;
  margin: 12px 20px;
  text-align: center;
  border-radius: 2px;
  font-family: PingFangSC-Medium;
  font-size: 16px;
}

.look {
  color: var(--color-font-default-b);
  border: 1px dashed #82879E;
}
}

.start {
  color: var(--color-other-default-b);
  border: 1px dashed var(--color-other-default-b);
}

.modify {
  color: var(--color-other-default-c);
  border: 1px dashed var(--color-other-default-c);
}

.infoContent {
  border-bottom: 8px solid var(--color-border-default);
}
>>> .srm-collapse{
  height:calc(100vh - 300px);
  overflow:scroll;
}

.expert-scoring-content-wrapper {
  overflow-y: scroll;
  overflow-x: hidden;
}

.srm-content-top {
  display: flex;
  height: 52px;
  justify-content: space-between;
  align-items: center;
  padding: 16px 15px 1px;
  .srm-content-top-dimen {
    line-height: 27px;
    background: #F7F8FA;
    border-radius: 14px;
    padding: 2px;
    >>>.srm-button-mid {
      padding: 4px 8px;
    }
    >>>.srm-button-text {
      font-size: 10px;
    }
  }
}
.dimen-tips {
  font-size: 12px;
  color: #AFAFAF;
  font-weight: 400;
  margin: 8px 0 4px 16px;
}
.srm-wrap-scoll-card {
  position: sticky;
  top: -1px;
  z-index: 999;
  background: var(--color-bg-default);
}
.srm-wrap-content-wrapper {
  .srm-wrap-content {
    &-one-element {
      padding: 16px 16px 0 16px;
      .one-element-name {
        font-weight: 500;
        font-size: 12px;
        color: var(--color-font-default-c);
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 18px;
      }
      .one-element-remark {
        font-size: 12px;
        color: var(--color-font-default-b);
        line-height: 18px;
        display: -webkit-box;
        -webkit-line-clamp: 4; /* 限制显示的行数 */
        -webkit-box-orient: vertical; /* 设置盒子的子元素的排列方式 */
        overflow: hidden; /* 隐藏超出的内容 */
        text-overflow: ellipsis; /* 在文本溢出时显示省略号 */
      }
      .content-divider {
        height: 1px;
        margin: 12px 0 0 0;
        flex-shrink: 0;
        border: 0.5px solid #E5E7EC;
      }
    }
    .srm-wrap-content-two-element {
      padding: 16px 16px 0 16px;
      margin-bottom: 12px;
      .two-element-name {
        font-weight: 500;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .two-element-code {
        margin-top: 4px;
        color: var(--color-font-default-b)
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .two-element-desc {
      padding: 0 16px 16px 16px;
      .two-element-remark {
        font-size: 14px;
        line-height: 18px;
        display: -webkit-box;
        -webkit-line-clamp: 4; /* 限制显示的行数 */
        -webkit-box-orient: vertical; /* 设置盒子的子元素的排列方式 */
        overflow: hidden; /* 隐藏超出的内容 */
        text-overflow: ellipsis; /* 在文本溢出时显示省略号 */
      }
    }
  }
  .srm-wrap-content-score {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: var(--background-color-empty-tab-title);
    color: var(--font-color-default);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 4.267vw;
    font-weight: 700;
    height: 14.4vw;
    padding-left: 4vw;
    padding-right: 4vw;
  }
}
.supplier-name-content {
  display: flex;
  font-size: 16px;
  font-weight: 600;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
  .supplier-name-style {
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 限制显示的行数 */
    -webkit-box-orient: vertical; /* 设置盒子的子元素的排列方式 */
    overflow: hidden; /* 隐藏超出的内容 */
    text-overflow: ellipsis; /* 在文本溢出时显示省略号 */
  }
  .supplier-invalid-style {
    max-width: 100px;
  }
}
</style>
