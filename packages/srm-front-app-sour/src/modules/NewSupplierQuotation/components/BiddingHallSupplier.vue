<template>
  <div
    :style="{ height: pageEditAndSummary ? '76vh' : '90vh' }">

    <div class="ssrc-apply-quotation-count-down-wrap">
      <bidding-count-down
        :now="updateHeaderTimer.currentTime"
        :end="updateHeaderTimer.endTime"
        :end-title="updateHeaderTimer.endTitle"
        :run-title="updateHeaderTimer.runningTitle"
        :paused-flag="updateHeaderTimer.pausedFlag"
        :others="updateHeaderTimer" />
    </div>

    <srm-scroll-tab content-scroll>
      <srm-scroll-tab-item
        :label="
          $T('ssrc.common.view.message.basicInfos').$D(
            '基础信息'
          )"
        :show-title="false" >
        <status-tag-render
          v-if="headInfo.rfxHeaderId && currentStatusHeader"
          :key="pageKey"
          :head="headInfo"
          :status="currentStatusHeader"
          :supplier-status="headInfo.supplierStatus"
          type="status" />
        <supplier-plat-num
          :label="
            $T('ssrc.common.view.message.basicInfos').$D(
              '基础信息'
            )"
          :left="renderSupplierNumberPlate"
          :left-title="$T('ssrc.biddingHall.view.title.myNumberPlate').$D('我的牌号')" />
        <div v-if="!headInfo.rfxHeaderId" class="noContent">
          <span>
            {{ $T("ssrc.common.view.title.noBasicInfos").$D("暂无基础信息") }}
          </span>
        </div>

        <srm-form
          v-else
          :data-set="headerFormDS"
          :customize-code="getCustomizeUnitCode('base')"
          :columns="getBaseForm" />
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('ssrc.common.quotationLineInfomations').$D('报价行信息')">
<!--        <srm-scroll :scrollable="false" @reachBottom="reachBottom">-->
          <srm-list
            :data-set="tableLineDataSet"
            :columns="getQuotationLineColumns"
            :scrollable="false"
            :customize-code="getCustomizeUnitCode('table')" />
<!--        </srm-scroll>-->
        <!-- 适配iPhoneX -->
        <div class="bottom-space-view" />
      </srm-scroll-tab-item>

      <srm-scroll-tab-item v-if="headInfo.displayBiddingSupHeaderStatus !== 'SIGN_IN'" :label="$T('ssrc.inquiryHall.view.message.tab.attachmentList').$D('附件列表')">
        <srm-form
          v-if="headInfo.rfxHeaderId"
          :key="pageKey"
          style="padding: 0;"
          :row-col-to-seq="true"
          :need-padding="true"
          :data-set="headerFormDS"
          :customize-code="getCustomizeUnitCode('attachment')"
          :columns="getAttachmentForm" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <div>
      <defer-info
        v-if="ruleInfo.autoDeferFlag && currentStatusHeader"
        :head="headInfo"
        :rule="ruleInfo"
        :status="currentStatusHeader" />
    </div>

    <!-- summary footer -->
    <div v-if="pageEditAndSummary" class="ssrc-quotation-line-summary-bar">
      <div class="quotaiton-line-summary-list">
        <div>
          <div class="quotaiton-line-summary-item">
            <span class="quotaiton-line-summary-item-label">
              {{ $T("ssrc.biddingHall.view.title.priceCurrentLines").$D("出价行数") }}:
            </span>
            <span class="quotaiton-line-summary-item-value">
              {{ getQuotationLines() }}
            </span>
          </div>

          <div v-if="Boolean(getRemainderQuoted())" class="quotaiton-line-summary-item" style="margin-left: 16px;">
            <span class="quotaiton-line-summary-item-label">
              {{ $T("ssrc.biddingHall.view.label.theRemainderQuotationNumbers").$D("剩余可出价数") }}:
            </span>
            <span>
              <srm-tooltip :title="getRemainderQuoted()" placement="top">
                <span class="quotaiton-line-summary-item-value">
                  {{ getRemainderQuoted() }}
                </span>
              </srm-tooltip>
            </span>
          </div>
        </div>

        <div class="quotaiton-line-summary-item">
          <span class="quotaiton-line-summary-item-label">
            {{ $T("ssrc.common.view.title.total").$D("合计") }}:
          </span>
          <span>
            <srm-tooltip :title="renderLineTotalAmount()" placement="top">
              <div class="quotaiton-line-summary-item-value total-amount" v-text="renderLineTotalAmount()"/>
            </srm-tooltip>
          </span>
        </div>
      </div>
    </div>

    <!-- bottom buttons -->
    <srm-bottom-handler v-if="pageEditAndSummary" :btn-arr="getPageBottomBtnArr" type="action-sheet" />

    <!-- 物料明细表 -->
    <srm-popup
      :visible="quotationDetailVisible"
      height="100%"
      position="bottom"
      :show-back="true"
      :show-close="true"
      :show-header="true"
      :title="$T('ssrc.inquiryHall.model.inquiryHall.itemDetailTable').$D('物料明细表')"
      @onClose="itemDetailTableClosePopup">
      <customize-detail
        v-if="quotationDetailVisible"
        :need-padding="true"
        :code="getCustomizeUnitCode('item')"
        :data-source="quotaitonDetailDataSource"
        :columns="getQuotationDetail" />
    </srm-popup>
  </div>
</template>

<script>

const storage = window.localStorage;
import { isEmpty, noop, isArray, isNil, isFunction, debounce, } from "lodash";
import BigNumber from "bignumber.js";
import { $T, DataSet, SrmUtil, SrmMath, } from "srm-mobile-ui";
import moment from "moment";

import {
  getValidPriceName,
  getValidNetPriceName,
} from "@/utils/doubleUnit.js";
import { amountCalcType, fetchCurrentPrecision, batchQueryBusinessRules, queryDoubleUnit, calculateBasicQty, } from "@/utils/utils";
import {
  getWorker,
  getCountDown,
} from "../utils/MonitorWork";

import { getLovApi, } from "@/utils/api";
import {
  fetchSupplierBiddingRules,
  fetchSupplierBiddingHeader,
  quotationUnitPriceSubmit,
  quotationPriceSave,
  userNetSignalInfo,
  supplierProcessBar,
  quotationRefreshLine,
  fetchUnitPriceList,
} from "../api";
import {
  headerDataSet,
  ruleDataSet,
  quotationLineDataSet,
} from "../datasource/biddingDS";

import {
  biddingStatusRenderTag,
  getQuotationRangeLabel,
} from "../utils/renderer";
import { getTimer } from "../utils/timer";


import SupplierPlatNum from "../components/SupplierPlatNum";
import StatusTagRender from "../components/StatusTagRender";
import DeferInfo from "../components/DeferInfo";

import rightArray from "@/assets/icon_list_right_grey_normal@3x.png";

import { abandonFormDS } from "../datasource/abandonFormDS";
import BiddingCountDown from "./BiddingCountDown";
// import { amountCalculation, } from "@/utils/amountCalculation";
// import { commonRfxStatusColor } from "../components/commonRfxStatusColor";
import webSocketManagener from "../../../utils/webSocketManagener";

const USER_INFO_TIME = 15_000;
const TimeoutTime = 2_000;
const CHANGE_TAG_REFRESH_TIMER = 2;

export default {
  modules: [ "hipspfm.common", "ssrc.queryQuotation", "ssrc.common", "hipspfm.workFlow", "ssrc.biddingOpen", "ssrc.bidHall", "ssrc.inquiryHall", "smbl.common", "hipspfm.supplierQuotation", "ssrc.supplierQuotation", "hzero.common", "hipspfm.common", "ssrc.biddingHall", ],
  name: "BiddingHallSupplier",
  components: { BiddingCountDown, SupplierPlatNum, StatusTagRender, DeferInfo },
  mixins: [ ],
  props:{
    documentType: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      headerCountTime: {},
      fetchLoadingFlag: 1,
      organizationId: SrmUtil.getOrganizationId(),
      headInfo: {},
      ruleInfo: {},
      headerFormDS: new DataSet(headerDataSet()),
      ruleDS: new DataSet(ruleDataSet()),
      tableLineDataSet: new DataSet(quotationLineDataSet()),
      abandonFormDs: new DataSet(abandonFormDS()),
      doubleUnitFlag: false, // 双单位是否开启标志
      bucketName: SrmUtil.getDefaultBucketName(),
      validationModalVisible: false, // submit validate modal visible
      quotationDetailVisible: false, // 报价明细表 visible
      quotaitonDetailDataSource: {}, //  报价明细表 record
      caclRule: null, // 业务规则定义-金额计算方式
      currencyPrecision: null, // 手动查询的币种精度
      financialPrecision: null, // 手动查询的财务精度
      mLeftTime: {},
      countTimer: null,
      useOnlineTimerRef: null,
      pageLoading: false,
      pageReadOnlyFlag: false, // 页面只读标识
      headerInfo: {}, // header
      headerRule: {}, // 竞价规则
      offerPriceViewFlag: 0, // 出价详情标识,单价排名是否打开的是详情视图
      biddingSupLineCurId: null, // 出价详情list id
      lovs: {},
      supplementUnitPriceFlag: 0, // 补充单价 节点
      chatRoomVisible: false, // 聊天室显示
      processCurrentNodeData: {}, // 流程节点
      unitPriceLineFloatType: null,
      countDownShowAllZeroFlag: 0, // 倒计时显示 00:00:00
      quotationInputAutoCalculateFlag: 1, // 出价输入框输入值后自动计算
      updateHeaderTimer: {},
      socketCreateLinkCount: 0,
      socketRef: null,
      socketData: {}, // socket result data
      headerSocketUrl: "",
      lineSocketUrl: "",
      socketId: "ssrc-bidding-hall-socket-mobile",
      startFormalBiddingAndNotificationList: [ "biddingStartFlag", "biddingDeferStartFlag" ], // start formal / delay bidding and notification - 优先级最高
      // refresh all page key
      allFlagLists: [
        "refreshAllFlag",
        "refreshProhibitFlag",
        "refreshFiringFlag",
        "refreshBiddingCloseFlag",
        "refreshTimeFlag",
      ],
      // refresh content page key
      contentFlagLists: [ "refreshBiddingHeaderFlag", "refreshBiddingLineFlag" ],
      // refresh rule page key
      ruleFlagList: [ "refreshBiddingRuleFlag" ],
      // refresh form page key (only unit price collected)
      formFlagList: [ "refreshCollectionFlag" ],
      // refresh all Page and modal warning
      refreshAllPageAndWarningList: [ "refreshSuspendFlag", "adjustTimeSuspendFlag" ],
      // only refresh partial fields
      refreshPartialFieldsList: [ "refreshQuotationInfoFlag" ],
      lastTimeSocketMessageTimerRecordMap: new Map(),
      currentStatusHeader: null,
      pageEditAndSummary: false,
      openedModel: 0,
      afterSocketHandleDebounce: null,
      monitorWork: null,
      pageKey: 0,
      changeTabLeaveTimer: null,
    };
  },
  computed: {
    renderSupplierNumberPlate() {
      const { supplierNumberPlate = "" } = this.headInfo || {};
      return supplierNumberPlate || "";
    },
    // bottom buttons
    getPageBottomBtnArr() {
      const { rfxLineSupplierId, displayBiddingSupHeaderStatus, supplierStatus, } = this.headInfo || {};
      if (!rfxLineSupplierId) {
        return [];
      }

      const remainQuotationNum = this.getRemainderQuoted(); // 剩余可出价
      const zeroQuotationLast = remainQuotationNum === 0 || remainQuotationNum === "0";
      const showButton = displayBiddingSupHeaderStatus === "IN_PROGRESS" || displayBiddingSupHeaderStatus === "PAUSED";
      if (!showButton) {
        return [];
      }

      const disabled = displayBiddingSupHeaderStatus === "PAUSED" || supplierStatus === "PROHIBIT_QUOTATION" || this.pageLoading || zeroQuotationLast;

      return [
        {
          title: this.$T("hzero.common.button.save").$D("保存"),
          fill: false,
          bordered: true,
          disabled,
          loading: this.pageLoading,
          handler: debounce(() => {
            this.saveQuotation();
          }, 1000),
        },
        {
          title: this.$T("hzero.common.button.submit").$D("提交"),
          type: "primary",
          fill: true,
          bordered: true,
          disabled,
          loading: this.pageLoading,
          handler: debounce(() => {
            this.submitQuotation();
          }, 1000),
        },
      ];
    },
    getBaseForm() {
      const {
        displayBiddingSupHeaderStatus,
        displayBiddingSupHeaderStatusMeaning,
      } = this.headInfo;

      const fields = [
        {
          formRow: 0,
          fieldCode: "rfxTitle",
          fieldType: "EMPTY",
          render: (val, record, field, currentRecord) => {
            const { secondarySourceCategoryMeaning, rfxTitle, quotationOrderTypeMeaning, } = record || {};
            const { nodeNameMeaning, nodeName, } = this.processCurrentNodeData || {};
            let meaning = nodeNameMeaning;
            if (nodeName === "BIDDING") {
              meaning = this.$T("ssrc.biddingHall.view.title.formBidding").$D("正式竞价");
            }

            return (
              <div style="display: flex; justify-content: space-between; width: 100%;">
                <div class="ssrc-apply-base-form-header-wrapper">
                  <div class="ssrc-header-title ssrc-bidding-hall-header-title-wrap">
                    <srm-tooltip title={rfxTitle} placement="bottom">
                      <span class="ssrc-header-title-value">{rfxTitle}</span>
                    </srm-tooltip>
                  </div>
                  <div style="width: 138px;">
                    <div class="ssrc-header-source-category">
                      {secondarySourceCategoryMeaning}
                    </div>
                    <div class="ssrc-header-source-category">
                      {quotationOrderTypeMeaning}
                    </div>
                    {meaning ? <div class="ssrc-header-source-category">
                      {meaning}
                    </div> : null}
                  </div>
                </div>
                <div>
                  {biddingStatusRenderTag({ status: displayBiddingSupHeaderStatus, statusMeaning: displayBiddingSupHeaderStatusMeaning, })}
                </div>
              </div>
            );
          },
        },
        {
          formRow: 100,
          forCol: 1,
          fieldCode: "companyName",
        },
        {
          formRow: 200,
          forCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.companyNameAttachmentBusTec").$D("客户商务/技术附件"),
          fieldCode: "companyNameUuid",
          render: (_, item) => {
            const {
              tenderFeeFlag,
              bidFileExpense,
            } = item || {};
            const bidFileFlag = tenderFeeFlag === 1 && !isNil(bidFileExpense);
            if (bidFileFlag) {
              return "-";
            }
            return (
              <srm-upload
                isTab={false}
                showIcon={false}
                readOnly={true}
                bucketName={this.bucketName}
                descTitle={$T('hipspfm.common.button.viewAttachments').$D('查看附件')}
                title={this.$T("ssrc.supplierQuotation.model.supQuo.companyNameAttachmentBusTec").$D("客户商务/技术附件")}
                queryParams={{
                  directory: "ssrc-rfx-rfxheader",
                  organizationId: this.organizationId,
                }}
                fileArr={this.fileArrs(item)} />
            );
          },
        },
        {
          formRow: 300,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currency").$D("币种"),
          fieldCode: "currencyCode",
          // fieldType: "LOV",
          lovCode: "SMDM.EXCHANGE_RATE.CURRENCY",
          editor: false,
          // required: (val, item) => {
          //   const {
          //     supplierStatus,
          //     multiCurrencyFlag,
          //   } = item || {};
          //   const wholeAbandonFlag =
          //     supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
          //   return multiCurrencyFlag === 1 && !wholeAbandonFlag;
          // },
          // disabled: (val, item) => {
          //   const {
          //     supplierStatus,
          //     multiCurrencyFlag,
          //   } = item || {};
          //   const wholeAbandonFlag =
          //     supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
          //   return multiCurrencyFlag !== 1 || wholeAbandonFlag;
          // },
          // options: {
          //   displayField: "currencyCode",
          //   callback: (val) => {
          //     const [ data ] = val || [];
          //     const { defaultPrecision, financialPrecision, } = data || {};
          //     this.currencyPrecision = defaultPrecision;
          //     this.financialPrecision = financialPrecision;
          //     this.quotationLineAllRecalculate();
          //     this.calcQuotationTableSummaryQuotationAmount();
          //   },
          //   onClear: (ds) => {
          //     const currentRecord = ds.current;
          //     if (!currentRecord) {
          //       return;
          //     }
          //     currentRecord.set("currencyCode", null);
          //     this.currencyPrecision = 10;
          //     this.financialPrecision = 10;
          //     this.quotationLineAllRecalculate();
          //     this.calcQuotationTableSummaryQuotationAmount();
          //   },
          // },
        },
        {
          formRow: 300,
          formCol: 2,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.paymentTerms").$D("付款方式"),
          fieldCode: "paymentTypeId",
          // fieldType: "LOV",
          displayField: "paymentTypeName",
          options: {
            displayField: "typeName",
            subDisplayField: "typeCode",
            queryParams: {
              enabledFlag: 1,
            },
          },
          render: (_, item) => {
            const { paymentTypeName } = item || {};
            return paymentTypeName;
          },
          // editor: (val, item) => {
          //   if (Number(systemVersion) === 2) {
          //     return true;
          //   }
          //   return item.paymentTermFlag === 1;
          // },
          // lovCode: "SMDM.PAYMENTTYPE",
          // required: (val, item) => {
          //   const {
          //     supplierStatus,
          //     paymentTermFlag,
          //   } = item || {};
          //   const wholeAbandonFlag =
          //     supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
          //   if (Number(systemVersion) === 2) { // 走新模板，去掉paymentTermFlag限制
          //     return !wholeAbandonFlag;
          //   }
          //   return paymentTermFlag === 1 && !wholeAbandonFlag;
          // },
          // disabled: (val, item) => {
          //   const {
          //     supplierStatus,
          //     paymentTermFlag,
          //   } = item || {};
          //   const wholeAbandonFlag =
          //     supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
          //   if (Number(systemVersion) === 2) { // 走新模板，去掉paymentTermFlag限制
          //     return wholeAbandonFlag;
          //   }
          //   return paymentTermFlag !== 1 || wholeAbandonFlag;
          // },
          editor: false,
        },
        {
          formRow: 500,
          formCol: 1,
          fieldName: this.$T("ssrc.common.model.common.termsOfPayment").$D("付款条款"),
          fieldCode: "paymentTermId",
          // fieldType: "LOV",
          displayField: "paymentTermName",
          lovCode: "SMDM.PAYMENT.TERM",
          options: {
            displayField: "termName",
            subDisplayField: "paymentTermName",
            queryParams: {
              enabledFlag: 1,
            },
          },
          editor: false,
          render: (_, item) => {
            const { paymentTermName } = item || {};
            return paymentTermName;
          },
          // editor: (val, item) => {
          //   if (Number(systemVersion) === 2) {
          //     return true;
          //   }
          //   return item.paymentTermFlag === 1;
          // },
          // required: (val, item) => {
          //   const {
          //     supplierStatus,
          //     paymentTermFlag,
          //   } = item || {};
          //   const wholeAbandonFlag =
          //     supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
          //   if (Number(systemVersion) === 2) { // 走新模板，去掉paymentTermFlag限制
          //     return !wholeAbandonFlag;
          //   }
          //   return paymentTermFlag === 1 && !wholeAbandonFlag;
          // },
          // disabled: (val, item) => {
          //   const {
          //     supplierStatus,
          //     paymentTermFlag,
          //   } = item || {};
          //   const wholeAbandonFlag =
          //     supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
          //   if (Number(systemVersion) === 2) { // 走新模板，去掉paymentTermFlag限制
          //     return wholeAbandonFlag;
          //   }
          //   return paymentTermFlag !== 1 || wholeAbandonFlag;
          // },
        },
        {
          formRow: 500,
          formCol: 2,
          fieldCode: "biddingMode",
          render: (_, item) => {
            const { biddingModeMeaning } = item || {};
            return biddingModeMeaning;
          },
        },
        {
          formRow: 600,
          formCol: 1,
          fieldCode: "biddingTarget",
          render: (_, item) => {
            const { biddingTargetMeaning } = item || {};
            return biddingTargetMeaning;
          },
        },
        {
          formRow: 600,
          formCol: 2,
          fieldCode: "biddingStrategy",
          render: (_, item) => {
            const { biddingStrategyMeaning } = item || {};
            return biddingStrategyMeaning;
          },
        },
      ];
      return fields;
    },
    // 物料明细弹窗
    getQuotationDetail() {
      const doubleUnitFlag = this.doubleUnitFlag;

      const hiddenPriceAmount = this.biddingHiddenPriceAndAmount();

      const Fields = [
        {
          formRow: 10,
          formCol: 1,
          fieldCode: "itemName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料描述"),
          fieldType: "TEXT",
          render: (val) => val,
        },
        {
          formRow: 150,
          formCol: 1,
          fieldName: this.$T("ssrc.common.quantityAndUomCombine").$D("数量-单位"),
          fieldCode: "rfxQuantity",
          editor: false,
          render: (val, item) => {
            const {
              secondaryUomName,
              secondaryQuantity,
              uomName,
              rfxQuantity,
            } = item || {};
            let quantity = rfxQuantity;
            let name = uomName;
            if (doubleUnitFlag) {
              quantity = secondaryQuantity;
              name = secondaryUomName;
            }

            const formatQuantity = this.numberFormat(quantity);
            const currentValue = !isNil(quantity) && name ? `${formatQuantity}-${name}` : formatQuantity || name || "";

            return currentValue;
          },
        },

        {
          fieldName: this.$T("ssrc.common.model.common.specs").$D("规格"),
          fieldCode: "specs",
          formRow: 200,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.common.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          formRow: 250,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachment").$D("采购方附件"),
          fieldCode: "rfxAttachmentUuid",
          fieldType: "TEXT",
          showCount: true,
          readonly: true,
          formRow: 300,
          formCol: 1,
          bucketName: this.bucketName,
          editor: false,
          // title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                // show-count={false}
                show-icon={false}
                readonly
                title={this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachment").$D("采购方附件")}
                desc-title={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              />
            </div>
          ,
        },
        {
          formRow: 400,
          formCol: 1,
          fieldName: getValidPriceName(doubleUnitFlag),
          fieldCode: "validQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: !hiddenPriceAmount,
        },
        {
          formRow: 500,
          formCol: 1,
          fieldName: getValidNetPriceName(doubleUnitFlag),
          fieldCode: "validNetSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: !hiddenPriceAmount,
        },
        {
          formRow: 600,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxQuotationAmount").$D("行金额(含税)"),
          fieldCode: "totalAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: !hiddenPriceAmount,
        },
        {
          formRow: 700,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmountWithoutTax").$D("行金额(不含税)"),
          fieldCode: "netAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: !hiddenPriceAmount,
        },
      ];

      return Fields;
    },
    // 报价行表格
    getQuotationLineColumns() {
      const doubleUnitFlag = this.doubleUnitFlag;
      const {
        biddingQuotationMethod,
      } = this.headInfo || {};
      // hidden quotation Field flag
      const hiddenQuotationFieldColumnFlag = this.biddingHiddenPriceAndAmount();

      const columns = [
        {
          formRow: 10,
          formCol: 1,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item, field, record) => {
            const {
              // displayBiddingSupLineStatus,
              // displayBiddingSupLineStatusMeaning,
              biddingQuotationRank,
              itemName,
            } = item || {};
            const displayBiddingSupLineStatus = record.get("displayBiddingSupLineStatus");
            const displayBiddingSupLineStatusMeaning = record.get("displayBiddingSupLineStatusMeaning");

            return (
              <div style="width: 100%;" class="ssrc-table-line-customize-header-wrapper">
                <div style="display: flex; justify-content: space-between; align-items: top;">
                  <div onClick={(e) => e.stopPropagation()}>
                    <srm-tooltip title={itemName} placement="bottom">
                      <span class="ssrc-header-title-value">{itemName}</span>
                    </srm-tooltip>
                  </div>

                  <div class="ssrc-table-line-status-wrap">
                    {biddingQuotationRank ? (
                      <srm-tag size="small" type="info" style="margin-right: 4px;">
                        {this.$T("ssrc.biddingHall.model.biddingQuotationRank").$D("排名")}
                        {biddingQuotationRank}
                      </srm-tag>
                    ) : ""}
                    <span>
                      {biddingStatusRenderTag({ status: displayBiddingSupLineStatus, statusMeaning: displayBiddingSupLineStatusMeaning, })}
                    </span>
                    <img class="right-icon-wrap" on-click={() => this.viewQuotationDetail(item)} src={rightArray} />
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          formRow: 100,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.rfxQuantity").$D("需求数量"),
          fieldCode: "rfxQuantity",
          editor: false,
          render: (val, item) => {
            const {
              secondaryUomName,
              secondaryQuantity,
              uomName,
              rfxQuantity,
            } = item || {};
            let quantity = rfxQuantity;
            let name = uomName;

            if (this.doubleUnitFlag) {
              quantity = secondaryQuantity;
              name = secondaryUomName;
            }

            const formatQuantity = this.numberFormat(quantity);
            const currentValue = !isNil(quantity) && name ? `${formatQuantity}-${name}` : formatQuantity || name || "";

            return currentValue;
          },
        },
        {
          formRow: 100,
          formCol: 2,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格"),
          fieldCode: "specs",
          editor: false,
        },
        {
          formRow: 200,
          formCol: 1,
          fieldName: biddingQuotationMethod !== "AUCTION" ? this.$T("ssrc.biddingHall.model.startingBiddingPrice").$D("起竞价") : this.$T("ssrc.biddingHall.model.startingAuctionBiddingPrice").$D("起拍价"),
          fieldCode: "startingBiddingPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          disabled: true,
        },
        {
          formRow: 200,
          formCol: 2,
          fieldName: getQuotationRangeLabel({ biddingQuotationMethod, }),
          fieldCode: "quotationRange",
          fieldType: "TEXT",
          editor: false,
          disabled: true,
          render: (val, item) => {
            const { floatType, quotationRange, } = item || {};
            if (isNil(quotationRange)) {
              return "";
            }

            let currentQuotationRangeValue = this.numberFormat(quotationRange);
            if (floatType === "ratio") {
              currentQuotationRangeValue += "%";
            }

            return currentQuotationRangeValue;
          },
        },
        {
          formRow: 300,
          formCol: 1,
          fieldName: this.getAuctionFlag() ? this.$T("ssrc.inquiryHall.model.inquiryHall.maxPrice").$D("最高价") : this.$T("ssrc.inquiryHall.model.inquiryHall.minPrice").$D("最低价"),
          fieldCode: "lowestQuotationPrice",
          fieldType: "TEXT",
          visible: !hiddenQuotationFieldColumnFlag,
          editor: true,
          disabled: true,
          render: (val, item) => {
            const { lowestDisplaySupplierName, lowestQuotationPrice, displayBiddingSupLineStatus, } = item || {};

            if (displayBiddingSupLineStatus === "NOT_START") {
              return (
                <span>
                  {this.$T("ssrc.inquiryHall.model.inquiryHall.lineNotStartPleaseWaiting").$D("尚未开始,请耐心等待")}
                </span>
              );
            }

            let priceAndName = "";
            if (!isNil(lowestQuotationPrice)) {
              const lowestQuotationPriceValue = this.formatPrice(lowestQuotationPrice);
              priceAndName = `${lowestQuotationPriceValue} | ${lowestDisplaySupplierName}`;
            } else {
              priceAndName = lowestDisplaySupplierName;
            }

            return priceAndName;
          },
        },
        {
          formRow: 400,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.myQuotaitons").$D("我的报价"),
          fieldCode: "biddingQuotationRank",
          fieldType: "TEXT",
          editor: false,
          disabled: true,
          editLimit: true,
          visible: !hiddenQuotationFieldColumnFlag,
          render: (val, item) => {
            const { biddingQuotationRank, displayQuotationPrice, } = item || {};
            if (!biddingQuotationRank) {
              return "";
            }

            const rankString = this.$T("ssrc.inquiryHall.model.inquiryHall.theRankLevel", [ biddingQuotationRank ]).$D("第{rank}名");
            const price = this.formatPrice(displayQuotationPrice);
            const priceAndName = `${rankString} | ${price} || -`;

            return priceAndName;
          },
        },
        {
          formRow: 500,
          formCol: 1,
          fieldType: "TEXT",
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.priceQuantity").$D("价格批量"),
          fieldCode: "priceBatchQuantity",
          editor: false,
          visible: !hiddenQuotationFieldColumnFlag,
        },
        {
          formRow: 500,
          formCol: 2,
          fieldCode: "currentQuotationSecQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validQuotationQuantity").$D("可供数量"),
          editLimit: true,
          editor: true,
          visible: !hiddenQuotationFieldColumnFlag,
          precision: (val, item) =>
            Number(
              item?.uomPrecision,
            ),
          // inputChange: (val, item, field, record) => {
          //   if (!item || SrmMath.equals(val, item?.previewCurrentQuotationQuantityValue)) {
          //     return;
          //   }
          //   item.previewCurrentQuotationQuantityValue = val;
          //   this.changeQuantity(val, item, field, record);
          // },
          onBlur: (val, item, field, record) => {
            this.changeQuantity(val, item, field, record);
          },
          disabled: (val, item) => {
            const pageReadOnlyFlag = this.pageReadOnlyFlag;
            const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
            const readonlyOrPausedFlag = this.readonlyOrPaused();

            const flag =
              pageReadOnlyFlag ||
              !unitPriceBatchQuotationFlag ||
              this.getBiddingRemainingCountFieldValue({ record: item }) === 0 ||
              readonlyOrPausedFlag;

            return flag;
          },
        },
        {
          formRow: 700,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          fieldType: "SWITCH",
          editor: true,
          visible: !hiddenQuotationFieldColumnFlag,
          disabled: (val, item) => {
            const pageReadOnlyFlag = this.pageReadOnlyFlag;
            const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
            const readonlyOrPausedFlag = this.readonlyOrPaused();
            const remainQuotationNum = this.getBiddingRemainingCountFieldValue({ record: item });

            const flag =
                pageReadOnlyFlag ||
                !unitPriceBatchQuotationFlag ||
                remainQuotationNum === 0 ||
                readonlyOrPausedFlag;

            return flag;
          },
          inputChange: (val, item, field, record) => {
            item.updatedFlag = 1;
            record.set("taxIncludedFlag", val);
            record.set("taxId", null);
            record.set("taxRate", null);
            item.taxId = null;
            item.taxRate = null;
            this.dynamicChangeLinePrice(record);
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率"),
          fieldCode: "taxId",
          formRow: 700,
          formCol: 2,
          fieldType: "LOV",
          editor: true,
          displayField: "taxRate",
          lovCode: "SMDM.TAX",
          visible: !hiddenQuotationFieldColumnFlag,
          options: {
            queryParams: {
              organizationId: this.headInfo?.tenantId,
            },
            onClear: (ds) => {
              const currentRecord = ds.current;
              if (!currentRecord) {
                return;
              }
              currentRecord.set("updatedFlag", 1);
              currentRecord.set("taxId", null);
              currentRecord.set("taxRate", null);
              this.dynamicChangeLinePrice(currentRecord);
              this.calcQuotationTableSummaryQuotationAmount();
            },
            callback: (val, valueField, displayField, ds) => {
              const currentRecord = ds.current;
              if (!currentRecord) {
                return;
              }
              const { taxId, taxRate } = (val || [])[0] || {};
              currentRecord.set("taxId", taxId);
              currentRecord.set("taxRate", taxRate);
              currentRecord.set("updatedFlag", 1);
              this.dynamicChangeLinePrice(currentRecord);
              this.calcQuotationTableSummaryQuotationAmount();
            },
          },
          required: (val, item, field, record) => {
            const pageReadOnlyFlag = this.pageReadOnlyFlag;
            const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
            const readonlyOrPausedFlag = this.readonlyOrPaused();
            const remainQuotationNum = this.getBiddingRemainingCountFieldValue({ record: item });
            const taxIncludedFlag = record.get("taxIncludedFlag");

            const flag =
                !pageReadOnlyFlag &&
                taxIncludedFlag === 1 &&
                unitPriceBatchQuotationFlag &&
                !readonlyOrPausedFlag &&
                remainQuotationNum !== 0;

            return flag;
          },
          disabled: (val, item, field, record) => {
            const pageReadOnlyFlag = this.pageReadOnlyFlag;
            const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
            const readonlyOrPausedFlag = this.readonlyOrPaused();
            const remainQuotationNum = this.getBiddingRemainingCountFieldValue({ record: item });
            const taxIncludedFlag = record.get("taxIncludedFlag");

            const flag =
                pageReadOnlyFlag ||
                !unitPriceBatchQuotationFlag ||
                remainQuotationNum === 0 ||
                readonlyOrPausedFlag ||
                taxIncludedFlag !== 1;

            return flag;
          },
        },
        {
          formRow: 800,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidPrice").$D("出价"),
          fieldCode: "currentQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: true,
          visible: !hiddenQuotationFieldColumnFlag && this.getTaxOrUntax(),
          editLimit: true,
          precision: () =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                this.headInfo?.currencyCode,
                "defaultPrecision"
              )
            ),
          required: (val, item) => {
            const pageReadOnlyFlag = this.pageReadOnlyFlag;
            const taxFlag = this.getTaxOrUntax();
            const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
            const readonlyOrPausedFlag = this.readonlyOrPaused();

            const flag =
              !pageReadOnlyFlag &&
              taxFlag &&
              unitPriceBatchQuotationFlag &&
              !readonlyOrPausedFlag &&
              this.getBiddingRemainingCountFieldValue({ record: item }) !== 0;

            return flag;
          },
          disabled: (val, item) => {
            const pageReadOnlyFlag = this.pageReadOnlyFlag;
            const taxFlag = this.getTaxOrUntax();
            const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
            const readonlyOrPausedFlag = this.readonlyOrPaused();

            const flag =
              pageReadOnlyFlag ||
              !taxFlag ||
              !unitPriceBatchQuotationFlag ||
              this.getBiddingRemainingCountFieldValue({ record: item }) === 0 ||
              readonlyOrPausedFlag;

            return flag;
          },
          // inputChange: (val, item, field, record) => {
          //   this.changeQuotationPrice(val, item, field, record);
          // },
          onBlur: (val, item, field, record) => {
            this.changeQuotationPrice(val, item, field, record);
          },
        },
        {
          formRow: 810,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidPrice").$D("出价"),
          fieldCode: "netSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: true,
          visible: !hiddenQuotationFieldColumnFlag && !this.getTaxOrUntax(),
          precision: () =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                this.headInfo?.currencyCode,
                "defaultPrecision"
              )
            ),
          required: (val, item) => {
            const pageReadOnlyFlag = this.pageReadOnlyFlag;
            const taxFlag = this.getTaxOrUntax();
            const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
            const readonlyOrPausedFlag = this.readonlyOrPaused();

            const flag =
              !pageReadOnlyFlag &&
              !taxFlag &&
              unitPriceBatchQuotationFlag &&
              !readonlyOrPausedFlag &&
              this.getBiddingRemainingCountFieldValue({ record: item }) !== 0;

            return flag;
          },
          disabled: (val, item) => {
            const pageReadOnlyFlag = this.pageReadOnlyFlag;
            const taxFlag = this.getTaxOrUntax();
            const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
            const readonlyOrPausedFlag = this.readonlyOrPaused();

            const flag =
              pageReadOnlyFlag ||
              taxFlag ||
              !unitPriceBatchQuotationFlag ||
              this.getBiddingRemainingCountFieldValue({ record: item }) === 0 ||
              readonlyOrPausedFlag;

            return flag;
          },
          // inputChange: (val, item, field, record) => {
          //   this.changeQuotataionNetPrice(val, item, field, record);
          // },
          onBlur: (val, item, field, record) => {
            this.changeQuotataionNetPrice(val, item, field, record);
          },
        },

        // // doubleUnitFlag currentQuotationSecPrice netSecondaryPrice
      ];
      return columns.filter(Boolean);
    },
    // supplier attachment
    getAttachmentForm() {
      const { displayBiddingSupHeaderStatus, biddingPausedRealTimeStatus, } = this.headInfo;

      const remainQuotationNum = this.getRemainderQuoted(); // 剩余可出价
      const zeroQuotationLast = remainQuotationNum === 0 || remainQuotationNum === "0";
      const attahmentDisabled = this.pageReadOnlyFlag || displayBiddingSupHeaderStatus === "PAUSED" || zeroQuotationLast;
      // const attachmentTitle = attahmentDisabled ?
      //   $T('hipspfm.common.button.viewAttachments').$D('查看附件')
      //   :
      //   this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件");

      const hiddenFile = displayBiddingSupHeaderStatus === "SIGN_IN" || biddingPausedRealTimeStatus === "SIGN_IN" || !displayBiddingSupHeaderStatus;

      if (hiddenFile) {
        return [];
      }

      return [
        {
          formRow: 100,
          formCol: 1,
          fieldCode: "businessAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
          fieldType: "UPLOAD",
          showCount: true,
          bucketName: this.bucketName,
          bucketDirectory: "ssrc-rfx-quotationheader",
          // disabled: this.pageReadOnlyFlag,
          editor: true,
          readonly: attahmentDisabled,
          readOnly: attahmentDisabled,
          canUpload: !attahmentDisabled,
          canDelete: !attahmentDisabled,
          // title: attachmentTitle, // 附件标题需要变更
        },
        {
          formRow: 200,
          formCol: 1,
          fieldCode: "techAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
          fieldType: "UPLOAD",
          showCount: true,
          bucketName: this.bucketName,
          bucketDirectory: "ssrc-rfx-quotationheader",
          editor: true,
          readonly: attahmentDisabled,
          readOnly: attahmentDisabled,
          canUpload: !attahmentDisabled,
          canDelete: !attahmentDisabled,
        },
      ];
    },
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.chromeTabVisibilityChange);
    // this.closeSocket();
  },
  mounted() {
    const { rfxLineSupplierId, biddingTarget } = this.getParamsObjFromUrl();
    if (!rfxLineSupplierId || !biddingTarget) {
      return;
    }

    if (rfxLineSupplierId) {
      const storeField = "supplierBiddingHallPageId";
      storage.setItem(storeField, rfxLineSupplierId);
    }

    this.pageInit();
    this.addListener();
  },
  deactivated() {
    clearTimeout(this.timer);
    clearInterval(this.countTimer);
  },
  destroyed() {
    clearInterval(this.timer);
    clearInterval(this.countTimer);
  },
  methods: {
    addListener() {
      // 浏览器切换事件
      document.addEventListener('visibilitychange', this.chromeTabVisibilityChange);
    },
    // chrome change tab event handle
    async chromeTabVisibilityChange() {
      // const { offerPriceViewFlag, biddingSupLineCurId, headerInfo } = this.state;
      const HiddenChromeTabFlag = document?.hidden;

      if (!HiddenChromeTabFlag) {
        const { displayBiddingSupHeaderStatus, supplierStatus } = this.headInfo || {};

        await this.startUserMonitor();

        // 单据完成切入页面不做查询
        const DisabledFetchFlag =
            displayBiddingSupHeaderStatus === 'CLOSED' ||
            displayBiddingSupHeaderStatus === 'FINISHED' ||
            supplierStatus === 'PROHIBIT_QUOTATION';

        if (DisabledFetchFlag) {
          return;
        }

        await this.fetchHeaderInfo({ showStatusMessage: 0, reEntryFlag: 1 });
        // this.fetchBiddingRules();

        if (this.biddingUnitWholeBatchPriceFlag()) {
          const currentTimer = this.getCurrentDateTimeSecond();
          const lessTheOneMinute = currentTimer
            && this.changeTabLeaveTimer
            && currentTimer > this.changeTabLeaveTimer
            && SrmMath.gte(SrmMath.minus(currentTimer, this.changeTabLeaveTimer), CHANGE_TAG_REFRESH_TIMER);

          if (lessTheOneMinute) {
            await this.unitPriceBatchUpdateLineFields();
            await this.queryRefreshLineData();
          }

          await this.buildWebsocket();
        }

        // if (this.getUnitPriceFlag()) {
        //   if (offerPriceViewFlag && biddingSupLineCurId) {
        //     this.queryUnitPriceDetailViewList();
        //     this.queryPriceDetailViewFormInfoAndUpdatePartialFields();
        //   }
        // }

        // if (this.getTotalPriceFlag()) {
        //   this.queryPriceDetailViewFormInfoAndUpdatePartialFields();
        // }
      } else {
        // 离开
        // this.clearTimeoutTimer();
        this.clearMonitorWebwork();

        this.changeTabLeaveTimer = this.getCurrentDateTimeSecond(); // 记录离开时间
      }
    },
    async pageInit() {
      await this.initConfigs();
      await this.initAllPage();

      await this.buildWebsocket();
    },
    async buildWebsocket() {
      await this.initWebSoketConnect(); // init socket
      await this.registerSocketConnect(); // connect socket
    },
    async initWebSoketConnect() {
      if (webSocketManagener.socketStatus !== 32) {
        webSocketManagener.initWebSocket();
      }
    },
    closeSocket() {
      webSocketManagener.removeAllListeners(this.headerSocketUrl);
      webSocketManagener.removeAllListeners(this.lineSocketUrl);

      if (webSocketManagener?.destroyWebSocket) {
        webSocketManagener.destroyWebSocket();
      }
    },
    // socket data reorganization
    updateSocketData(data) {
      this.socketData = {
        ...(this.socketData || {}),
        ...(data || {}),
      };
    },
    // 注册发布列表连接
    registerSocketConnect() {
      // 采购方对供应商的操作
      webSocketManagener.addListener(this.headerSocketUrl, this.socketMessageSupplierEvent);

      // // 供应商当前单据头/行的操作
      webSocketManagener.addListener(
        this.lineSocketUrl,
        (messageData) => {
          const data = JSON.parse(messageData?.message);
          console.log(this.lineSocketUrl, "1", messageData, data);
          this.updateSocketData(data);

          // this.handleWebsocketMessageReceive();
          this.afterSocketHandleDebounceHandle();
        }
      );

      this.socketCreateLinkCount = 0;
    },
    // 接受到socket, 需要对处理程序做防抖,防止重复
    afterSocketHandleDebounceHandle() {
      if (!this.afterSocketHandleDebounce) {
        this.afterSocketHandleDebounce = debounce(this.handleWebsocketMessageReceive, TimeoutTime, { trailing: true });
      }
      this.afterSocketHandleDebounce();
    },
    socketMessageSupplierEvent(messageData) {
      if (!messageData) {
        return;
      }
      const data = JSON.parse(messageData?.message);
      console.log("/topic/monitor/bidding-hall-sup/", "1", messageData, data);
      this.updateSocketData(data);

      this.afterSocketHandleDebounceHandle();
    },
    handleWebsocketMessageReceive() {
      this.recordNeddRefreshFlagCurrentTime();
      this.handleSocketMessage();
    },
    recordEffectKeyAtMap(key, value, handle) {
      this.lastTimeSocketMessageTimerRecordMap.set(key, {
        flag: value,
        handle,
      });
    },
    /**
     * socket message manager
     * 依据 lastTimeSocketMessageTimerRecordMap 中的refreshEffect做key，
     * 刷新页面,并在执行完对应刷新效果后清空对应的map->key
     * */
    handleSocketMessage() {
      if (!this.lastTimeSocketMessageTimerRecordMap?.size) {
        return;
      }

      this.socketData = {};

      this.lastTimeSocketMessageTimerRecordMap.forEach((value, key, map) => {
        const { flag, handle } = value || {};
        if (!flag || !key || !handle || !map.size) {
          return;
        }

        if (key === "startFormalAndDelayBidding") {
          handle();
          map.clear();
          return;
        }

        // refresh all Page must clear map
        if (key === "all") {
          handle();
          map.clear();
          return;
        }

        if (key === "rule") {
          handle();
          map.delete(key);
        }

        if (key === "content") {
          handle();
          map.delete(key);
          map.delete("form");
        }

        if (key === "form") {
          handle();
          map.delete(key);
        }

        // refresh all Page must clear map
        if (key === "biddingPausedSaveAndRefresh") {
          handle();
          map.clear();
        }

        // 刷新部分字段值
        if (key === "refreshPartialFields") {
          handle();
          map.delete(key);
        }
      });
    },
    updateOpenedModalNum(num = 0) {
      this.openedModel = num;
    },
    // 记录返回标识为1的，并归纳为刷新效果存储在map中
    recordNeddRefreshFlagCurrentTime() {
      const { displayBiddingSupHeaderStatus } = this.headInfo || {};
      const data = this.socketData;

      if (isEmpty(data)) {
        return;
      }

      for (const key in data) {
        if (!key) {
          break;
        }

        const value = data[key];

        let refreshEffect = "";
        let handle = null;

        if (this.startFormalBiddingAndNotificationList.includes(key)) {
          refreshEffect = "startFormalAndDelayBidding";

          let modalTitle = this.$T("ssrc.biddingHall.view.message.formalBiddingStartPleaseQuotate").$D("正式竞价已开始，请抓紧时间出价");
          if (key === "biddingDeferStartFlag" && value === 1) {
            modalTitle = this.$T("ssrc.biddingHall.view.message.delayBiddingStartPleaseQuotate").$D("延时竞价已开始，请抓紧时间出价");
          }

          handle = () => {
            this.countDownShowAllZeroFlag = 1;
            if (this.openedModel) {
              return;
            }
            this.updateOpenedModalNum(1);
            this.$dialog({
              title: this.$T("ssrc.common.message.tip").$D("提示"),
              headerAlign: "center",
              height: "60%",
              showHeader: true,
              showClose: true,
              rounded: true,
              onCancel: () => {
                this.clearHeaderData();
                this.updateCurrentStatusRender();
                this.updateOpenedModalNum(0);
                this.countDownShowAllZeroFlag = 0;
                this.initAllPage();
              },
              content: <div style="font-size: 14px; color: '#4E5769';">{modalTitle}</div>,
              onOk: async () => {
                await this.clearHeaderData();
                await this.updateCurrentStatusRender();
                this.updateOpenedModalNum(0);
                this.countDownShowAllZeroFlag = 0;
                await this.initAllPage();
                this.$forceUpdate();
              },
            });
          };
          this.lastTimeSocketMessageTimerRecordMap.clear();
          this.recordEffectKeyAtMap(refreshEffect, value, handle);
          break;
        }

        if (this.allFlagLists.includes(key)) {
          refreshEffect = "all";
          handle = () => {
            this.clearAllDataAndRefershAllPage();
          };
          if (key === "refreshBiddingCloseFlag") {
            handle = async () => {
              this.clearAllDataAndRefershAllPage();

              // const text = intl.get("ssrc.biddingHall.view.message.biddingIsClosed").d("竞价单已关闭");
            };
          }
        }

        if (this.ruleFlagList.includes(key)) {
          refreshEffect = "rule";
          handle = this.fetchBiddingRules;
        }

        // refresh content
        if (this.contentFlagLists.includes(key)) {
          refreshEffect = "content";
          handle = this.refreshContent;
        }

        if (this.formFlagList.includes(key)) {
          refreshEffect = "form";

          handle = this.refreshContent;
        }

        if (this.refreshAllPageAndWarningList.includes(key)) {
          refreshEffect = "biddingPausedSaveAndRefresh";

          handle = () => {
            if (this.openedModel) {
              return;
            }
            this.updateOpenedModalNum(1);
            const modalVisibleFlag =
              displayBiddingSupHeaderStatus !== "SIGN_IN" &&
              displayBiddingSupHeaderStatus !== "NOT_START";

            const pausedModalOpenFlag = this.biddingUnitWholeBatchPriceFlag();
            // const pausedModalOpenFlag =
            //   (this.getUnitPriceFlag() && offerPriceViewFlag) ||
            //   this.biddingUnitWholeBatchPriceFlag() ||
            //   this.getTotalPriceFlag(); // 单价竞价-外边列表页不需要提示

            // 弹窗
            if (key === "adjustTimeSuspendFlag" && pausedModalOpenFlag && modalVisibleFlag) {
              // 调整时间刷新标识

              this.$dialog({
                title: this.$T("ssrc.common.message.tip").$D("提示"),
                headerAlign: "center",
                height: "60%",
                showHeader: true,
                showClose: true,
                rounded: true,
                content: (
                  <div style="font-size: 14px; color: '#4E5769';">
                    {this.$T("ssrc.biddingHall.view.warning.biddingHasAdjusttedTimedWarningSave")
                      .$D("您的竞价单已调整时间，是否需要保存页面")}
                  </div>
                ),
                onCancel: async () => {
                  await this.clearAllDataAndRefershAllPage();
                  this.updateOpenedModalNum(0);
                },
                onOk: async () => {
                  await this.updateOpenedModalNum(0);
                  await this.saveQuotation();
                },
              });
            } if (key === "refreshSuspendFlag" && pausedModalOpenFlag && modalVisibleFlag) {
              // 暂停刷新标识

              this.$dialog({
                title: this.$T("ssrc.common.message.tip").$D("提示"),
                headerAlign: "center",
                height: "60%",
                showHeader: true,
                showClose: true,
                rounded: true,
                content: (
                  <div style="font-size: 14px; color: '#4E5769';">
                    {this.$T("ssrc.biddingHall.view.warning.biddingHasPausedWarningSave")
                      .$D("您的竞价单已暂停，是否需要保存页面")}
                  </div>
                ),
                onCancel: async () => {
                  await this.clearAllDataAndRefershAllPage();
                  this.updateOpenedModalNum(0);
                },
                onOk: async () => {
                  await this.updateOpenedModalNum(0);
                  await this.saveQuotation();
                },
              });
            } else {
              const onlyReadPageFlag = this.pageReadOnlyFlag || displayBiddingSupHeaderStatus === "PAUSED";
              if (onlyReadPageFlag) {
                this.initAllPage();
                this.updateOpenedModalNum(0);
              }
            }
          };
          this.recordEffectKeyAtMap(refreshEffect, value, handle);
          break;
        }

        if (this.refreshPartialFieldsList.includes(key)) {
          refreshEffect = "refreshPartialFields";
          handle = () => {
            this.queryRefreshLineData();
          };
        }

        if (refreshEffect) {
          this.lastTimeSocketMessageTimerRecordMap.set(refreshEffect, {
            flag: value,
            handle,
          });
        }
      }
    },
    // 清空页面数据并且重新查询变更
    async clearAllDataAndRefershAllPage() {
      await this.clearHeaderData();
      await this.updateCurrentStatusRender();
      this.updateOpenedModalNum(0);
      await this.initAllPage();
      this.$forceUpdate();
    },
    // 任何供应商提交后，socket 推送flag，单价竞价-需要部分刷新前端字段
    async queryRefreshLineData() {
      const queryData = this.getRefreshQueryParamData();
      // let queryBiddingHistoryFlag = true;
      if (isEmpty(queryData)) {
        return;
      }

      let result = null;
      if (this.getUnitPriceFlag()) {
        result = await quotationRefreshLine(queryData);
      }
      if (result && result.failed) {
        return;
      }

      if (this.getUnitPriceFlag()) {
        // if (offerPriceViewFlag) {
        //   this.refreshLineDataAfterQuery(result, this.detailViewFormDS);
        //   this.refreshLineDataAfterQuery(result, this.quotationDetailViewListDS);
        //   await this.afterFetchRecalculate({ record: this.detailViewFormDS?.current });
        // } else {
        //   // queryBiddingHistoryFlag = false; // 单价-列表视图-不需要查询竞价历史
        //   this.refreshLineDataAfterQuery(result, this.quotationLineDS);
        //   await this.unitPriceWholeBatchPriceRecalculateTablePrice();
        // }
        await this.refreshLineDataAfterQuery(result, this.tableLineDataSet);
        // await this.unitPriceWholeBatchPriceRecalculateTablePrice();
      }
    },
    unitPriceWholeBatchPriceRecalculateTablePrice() {
      if (this.biddingUnitWholeBatchPriceFlag()) {
        this.tableLineDataSet.records?.forEach((record) => {
          // this.afterFetchRecalculate({ record }); // 产品要求单价批量不做自动计算，11-28
          this.unitPriceWholeBatchPriceRecalculateTableLineAmount({ record });
        });
      }
    },
    clearHeaderData() {
      this.currentStatusHeader = null;
      this.headInfo = {};
      this.headerFormDS.setData([]);
      this.headerFormDS.reset();
    },
    // 整单批量出价-列表视图重新计算每行行金额
    unitPriceWholeBatchPriceRecalculateTableLineAmount(data) {
      const { record } = data || {};
      if (!record) {
        return;
      }
      this.dynamicChangeLinePrice(record);
    },
    /**
     * 任何供应商提交后，socket 推送flag，总价竞价-需要部分刷新前端字段
     * */
    refreshLineDataAfterQuery(result, currentDS) {
      const {
        biddingSupLineCurDTOS,
        minOrMaxBiddingSupLineMap,
        biddingSupHeaderDTO,
        biddingHeaderRule,
        currentDateTime,
        allSupplierQuotedCount = null,
        allSupplierQuotedCountMap = null,
      } = result || {};
      const { quotationStartDate, quotationEndDate } = biddingHeaderRule || {};
      let headerQuotationEndDate = null;

      // 延时阶段，需要更新头延时时间
      if (quotationEndDate) {
        this.updateHeaderTimerHandle({
          headData: { headerQuotationEndDate: null, currentDateTime: null, },
        });

        headerQuotationEndDate = quotationEndDate;
      }

      const emptyFlag = !result || !currentDS?.records?.length;
      if (emptyFlag) {
        return;
      }

      let currentDTOS = biddingSupLineCurDTOS || biddingSupHeaderDTO;
      if (!Array.isArray(currentDTOS)) {
        currentDTOS = [ currentDTOS || {} ];
      }

      let currentQuotationCount = allSupplierQuotedCount;

      currentDS.records.forEach((record) => {
        const lineData = record.toData();
        const rfxLineItemId = record.get("rfxLineItemId") || {};

        if (!rfxLineItemId) {
          return;
        }

        const { lowestQuotationPrice = null, lowestDisplaySupplierName = null } =
          minOrMaxBiddingSupLineMap?.[rfxLineItemId] || {};

        let currentHeaderDto = null;
        if (!isEmpty(currentDTOS)) {
          currentHeaderDto = currentDTOS.find((item) => item.rfxLineItemId === rfxLineItemId);
        }

        if (allSupplierQuotedCountMap) {
          currentQuotationCount = allSupplierQuotedCountMap[rfxLineItemId];
        }

        const { biddingQuotationRank, supplierDeferCount } = currentHeaderDto || {};

        const {
          prequalEndDate,
          lineTrialQuotationStartDate,
          lineTrialQuotationEndDate,
          lineQuotationStartDate,
          lineQuotationEndDate,
          startingTrialBiddingEndDate,
          startingTrialBiddingStartDate,
          signInEndDate,
          checkFinishedDate,
        } = lineData || {};

        const currentLineQuotationEndDate = quotationEndDate || lineQuotationEndDate;
        const currentLineQuotationStartDate = quotationStartDate || lineQuotationStartDate;

        let fields = [];

        if (this.getUnitPriceFlag()) {
          fields = [
            [ "lowestQuotationPrice", lowestQuotationPrice ],
            [ "lowestDisplaySupplierName", lowestDisplaySupplierName ],
            [ "biddingQuotationRank", biddingQuotationRank ],
            [ "prequalEndDate", prequalEndDate ],
            [ "signInEndDate", signInEndDate ],
            [ "currentDateTime", currentDateTime ],
            [ "lineTrialQuotationStartDate", lineTrialQuotationStartDate ],
            [ "lineTrialQuotationEndDate", lineTrialQuotationEndDate ],
            [ "lineQuotationStartDate", currentLineQuotationStartDate ],
            [ "lineQuotationEndDate", currentLineQuotationEndDate ],
            [ "startingTrialBiddingEndDate", startingTrialBiddingEndDate ],
            [ "startingTrialBiddingStartDate", startingTrialBiddingStartDate ],
            [ "checkFinishedDate", checkFinishedDate ],
            [ "allSupplierQuotedCount", currentQuotationCount ],
            [ "supplierDeferCount", supplierDeferCount ],
          ];
        }

        if (quotationEndDate) {
          this.updateHeaderTimerHandle({
            headData: { headerQuotationEndDate, currentDateTime, },
          });
        }

        this.updateRecordValidValue(record, fields);
        this.calculateLineStatusAndEstimatedStartDate(record);
      });
    },
    updateRecordValidValue(record, list = []) {
      if (!record || isEmpty(list)) {
        return;
      }

      list.forEach((item = []) => {
        const [ name, value ] = item || [];
        if (isNil(value) || !name) {
          return;
        }

        record.set(name, value);
      });
      record.set("status", "update");
    },
    calculateLineStatusAndEstimatedStartDate(record) {
      const { lineStatus } = this.lovs || {};
      if (!record || isEmpty(lineStatus)) {
        return;
      }

      const lineData = record.toData();

      let status = "";
      let statusMeaning = "";
      const {
        prequalEndDate = null,
        currentDateTime = null,
        lineTrialQuotationStartDate = null,
        lineTrialQuotationEndDate = null,
        lineQuotationStartDate = null,
        lineQuotationEndDate = null,
        estimatedStartDate = null,
        startingTrialBiddingEndDate = null,
        checkFinishedDate = null,
      } = lineData || {};

      let currentEstimatedStartDate = estimatedStartDate;

      /**
       * 资格预审截止时间<当前时间<试竞价开始时间
       * 资格预审截止时间<试竞价结束时间<当前时间<竞价开始时间
       *
       * 没有资格预审、试竞价时:
       * 比如没有资格预审，判断条件变为：1.当前时间<试竞价开始时间；2.试竞价结束时间<当前时间<竞价开始时间
       *
       */
      const notStartTrialWithPrequalFlag =
        prequalEndDate < currentDateTime && currentDateTime < lineTrialQuotationStartDate;
      const notStartBiddingWithPrequalFlag =
        prequalEndDate < lineTrialQuotationEndDate &&
        lineTrialQuotationEndDate < currentDateTime &&
        currentDateTime < lineQuotationStartDate;
      const notStartTrialNotPrequalFlag = currentDateTime < lineTrialQuotationStartDate;
      const notStartBiddingNotPrequalFlag =
        lineTrialQuotationEndDate < currentDateTime && currentDateTime < lineQuotationStartDate;

      const notStartFlag =
        (prequalEndDate && (notStartTrialWithPrequalFlag || notStartBiddingWithPrequalFlag)) ||
        (!prequalEndDate && (notStartTrialNotPrequalFlag || notStartBiddingNotPrequalFlag));

      if (notStartFlag) {
        status = "NOT_START";
        if (notStartTrialWithPrequalFlag) {
          currentEstimatedStartDate = lineTrialQuotationStartDate;
        }
        if (notStartBiddingWithPrequalFlag) {
          currentEstimatedStartDate = lineQuotationStartDate;
        }
      }

      /**
       * 1.试竞价开始时间<当前时间<试竞价结束时间
       * 2.竞价开始时间<当前时间<竞价结束时间
       */
      const processTrialFlag =
        lineTrialQuotationStartDate < currentDateTime && currentDateTime < lineTrialQuotationEndDate;
      const processBiddingFlag =
        lineQuotationStartDate < currentDateTime && currentDateTime < lineQuotationEndDate;

      const progressFlag = processTrialFlag || processBiddingFlag;
      if (progressFlag) {
        status = "IN_PROGRESS";
        if (processTrialFlag) {
          currentEstimatedStartDate = lineTrialQuotationEndDate;
        }
        if (processBiddingFlag) {
          currentEstimatedStartDate = lineQuotationEndDate;
        }
      }

      /**
       * 竞价单中的【试竞价截止时间】未到，物料行的试竞价结束时间<当前时间。

        物料行的竞价结束时间<当前时间<完成时间，完成时间指的是核价完成时间。
      */
      let biddingEndHeaderAndLineFlag = false;
      let biddingEndLineEndWithFinishFlag = false;
      if (currentDateTime && startingTrialBiddingEndDate && lineTrialQuotationEndDate) {
        biddingEndHeaderAndLineFlag =
          currentDateTime < startingTrialBiddingEndDate &&
          startingTrialBiddingEndDate < lineTrialQuotationEndDate &&
          lineTrialQuotationEndDate < currentDateTime;
      }

      if (lineQuotationEndDate && currentDateTime) {
        biddingEndLineEndWithFinishFlag = lineQuotationEndDate < currentDateTime;

        if (checkFinishedDate) {
          biddingEndLineEndWithFinishFlag =
            lineQuotationEndDate < currentDateTime && currentDateTime < checkFinishedDate;
        }
      }

      const biddingEndFlag = biddingEndHeaderAndLineFlag || biddingEndLineEndWithFinishFlag;
      if (biddingEndFlag) {
        status = 'BIDDING_END';
        if (biddingEndHeaderAndLineFlag) {
          currentEstimatedStartDate = lineTrialQuotationEndDate;
        }
        if (biddingEndLineEndWithFinishFlag) {
          currentEstimatedStartDate = lineQuotationEndDate;
        }
      }

      if (status) {
        const statusObj = lineStatus.find((current) => current?.value === status);
        if (statusObj) {
          statusMeaning = statusObj?.meaning || null;
        }
      }

      status = status || null;
      statusMeaning = statusMeaning || null;
      currentEstimatedStartDate = currentEstimatedStartDate || null;

      let StatusAndEstimatedField = [];

      if (this.getUnitPriceFlag()) {
        StatusAndEstimatedField = [
          [ "displayBiddingSupLineStatus", status ],
          [ "displayBiddingSupLineStatusMeaning", statusMeaning ],
          [ "estimatedStartDate", currentEstimatedStartDate ],
        ];
      }
      if (this.getTotalPriceFlag()) {
        StatusAndEstimatedField = [
          [ "displayBiddingSupHeaderStatus", status || null ],
          [ "displayBiddingSupHeaderStatusMeaning", statusMeaning ],
          [ "estimatedStartDate", currentEstimatedStartDate ],
        ];
      }

      this.updateRecordValidValue(record, StatusAndEstimatedField);
    },
    // 排名刷新接口查询-组装参数
    getRefreshQueryParamData(data = {}) {
      const {
        trialBiddingFlag,
        biddingQuotationMethod,
        benchmarkPriceType,
        openRule,
        rfxHeaderId,
        tenantId,
        roundNumber,
        biddingSupHeaderId,
        biddingHeaderRuleId,
      } = this.headInfo || {};
      const {
        biddingUnitPriceRule,
        biddingTarget,
      } = this.ruleInfo;
      const { rfxLineSupplierId, } = this.getParamsObjFromUrl() || {};
      const { otherData = {} } = data || {};

      const anyEmptyFlag =
        isNil(trialBiddingFlag) ||
        !biddingQuotationMethod ||
        !benchmarkPriceType ||
        !openRule ||
        !rfxHeaderId ||
        !rfxLineSupplierId;
      if (anyEmptyFlag) {
        return;
      }

      const headerData = {
        trialBiddingFlag,
        biddingQuotationMethod,
        benchmarkPriceType,
        openRule,
        rfxHeaderId,
        rfxLineSupplierId,
        tenantId,
        organizationId: this.organizationId,
        roundNumber,
        biddingSupHeaderId,
        biddingHeaderRuleId,
      };

      const rfxLineItemIds = [];
      if (this.getUnitPriceFlag()) {
        let currentListDS = [];

        // if (offerPriceViewFlag) {
        //   currentListDS = this.quotationDetailViewListDS;
        // } else {
        //   currentListDS = this.quotationLineDS;
        // }

        currentListDS = this.tableLineDataSet;

        // 从对应的列表中取每行的数据组装
        currentListDS.records.forEach((lineRecord) => {
          if (!lineRecord) {
            return;
          }

          const rfxLineItemId = lineRecord.get("rfxLineItemId");
          const validateId = !rfxLineItemId;
          if (validateId) {
            return;
          }

          rfxLineItemIds.push(rfxLineItemId);
        });

        if (isEmpty(rfxLineItemIds)) {
          return;
        }
      }

      return {
        ...otherData,
        ...headerData,
        rfxLineItemIds,
        biddingUnitPriceRule,
        biddingTarget,
      };
    },
    destroyWithSocket() {
      this.socketRef.destroySocket();
    },
    pageUnmount() {
      clearInterval(this.useOnlineTimerRef);
      clearInterval(this.timer);
      clearInterval(this.countTimer);
      this.destroyWithSocket();
    },
    getParamsObjFromUrl() {
      const params = this.$route.query || {};
      return params;
    },
    // reachBottom() {
    //   if (!this.tableLineDataSet) {
    //     return;
    //   }
    //
    //   this.tableLineDataSet.loadMore();
    // },
    initConfigs() {
      this.queryDoubleUnit();
      this.batchQueryAndOperateBusinessRules();
      this.queryLovs();
      this.queryCalcType(); // 查询金额计算方式
    },
    async initAllPage() {
      await this.fetchHeaderInfo();
      await this.fetchBiddingRules();
      this.refreshContent();
      await this.queryProcessNodeData();

      await this.startUserMonitor();
    },
    async queryLovs() {
      const lovCodes = {
        // headerStatus: "SSRC.REVIEW_METHOD", // 审查方式
        lineStatus: "SSRC.DISPLAY_BIDDING_SUP_LINE_STATUS",
      };

      let data = null;

      data = await getLovApi(lovCodes);
      if (!data) {
        return;
      }
      this.lovs = data;
    },
    startUserMonitor() {
      this.fetchUserSignal();
      this.clearMonitorWebwork();
      this.monitorWork = getWorker(getCountDown, { name: 'BIDDING_HALL_MONITOR_WORKER_MOBILE' });

      this.startMonitoryWebwork();
    },
    // 开启定时器
    startMonitoryWebwork() {
      if (!this.monitorWork) {
        return;
      }

      this.monitorWork.postMessage({ type: "RESTART", interval: USER_INFO_TIME });
      this.monitorWork.onmessage = e => {
        const { type, workCount } = e?.data || {};

        if (workCount > 10000) {
          this.fetchUserSignal();
          this.monitorWork.postMessage({ type: "RESTART", interval: USER_INFO_TIME });
        }

        if (type === 'NEXT') {
          this.fetchUserSignal();
        }

        if (type === 'END' || workCount > 10000) {
          this.clearMonitorWebwork();
        }
      };
    },
    // 清除定时器
    clearMonitorWebwork() {
      // clearTimeout(timeRef.current);
      // timeRef.current = null;
      if (!this.monitorWork) {
        return;
      }
      this.monitorWork.postMessage({ type: "END" });
      this.monitorWork.terminate();
    },
    fetchUserSignal() {
      const {
        tenantId,
        rfxHeaderId,
        roundNumber,
        rfxLineSupplierId,
      } = this.headInfo || {};
      let requestPrams = null;
      if (tenantId && rfxHeaderId && roundNumber && rfxLineSupplierId) {
        requestPrams = { tenantId, rfxHeaderId, roundNumber, rfxLineSupplierId, organizationId: this.organizationId, };
      }

      if (!requestPrams) {
        return;
      }

      userNetSignalInfo(requestPrams);
    },
    async queryProcessNodeData() {
      const { rfxHeaderId } = this.headInfo || {};
      if (!rfxHeaderId || !this.organizationId) {
        return;
      }

      const data = {
        organizationId: this.organizationId,
        rfxHeaderId,
      };

      let result = await supplierProcessBar(data);
      if (!result) {
        return;
      }

      const { biddingNodeDTOS, } = result || {};
      if (isEmpty(biddingNodeDTOS)) {
        return;
      }

      const currentNode = biddingNodeDTOS.find(item => item.currentFlag === 1);

      this.processCurrentNodeData = currentNode || {};
    },
    // 切换或者熄屏重新进来，查询行状态更新
    async unitPriceBatchUpdateLineFields() {
      const quotationLineRecords = this.tableLineDataSet.records;
      if (!quotationLineRecords?.length) {
        return;
      }

      const result = await this.queryUnitPriceList();
      const { content } = result || {};
      if (isEmpty(content)) {
        return;
      }

      quotationLineRecords.forEach((record) => {
        const rfxLineItemId = record?.get("rfxLineItemId");
        if (!rfxLineItemId) {
          return;
        }
        const currentLine = content.find((line) => line?.rfxLineItemId === rfxLineItemId);
        if (!currentLine) {
          return;
        }

        const {
          displayBiddingSupLineStatus,
          displayBiddingSupLineStatusMeaning,
          biddingQuotationRank,
        } = currentLine || {};

        const values = [
          [ 'displayBiddingSupLineStatus', displayBiddingSupLineStatus ],
          [ 'displayBiddingSupLineStatus', displayBiddingSupLineStatusMeaning ],
          [ 'biddingQuotationRank', biddingQuotationRank ],
        ];
        this.updateRecordValidValue(record, values);
      });
    },
    async queryUnitPriceList() {
      const { rfxLineSupplierId, } = this.$route.query;
      if (!rfxLineSupplierId) {
        return;
      }

      const params = {
        organizationId: this.organizationId,
        querys: {
          sourceMobileEndFlag: 1,
          customizeUnitCode: this.getCustomizeUnitCode([ "table", "item" ]),
          organizationId: this.organizationId,
        },
        rfxLineSupplierId,
      };
      try {
        let result = await fetchUnitPriceList(params);
        if (result && result.failed) {
          return;
        }
        return result;
      } catch (e) {
        throw e;
      }
    },
    // query page header and line
    queryUnitPriceLine() {
      const { rfxLineSupplierId, } = this.$route.query;
      if (!rfxLineSupplierId) {
        return;
      }

      this.tableLineDataSet.addPathParameter("organizationId", this.organizationId);
      this.tableLineDataSet.setBodyParameter({ rfxLineSupplierId, });
      this.tableLineDataSet.setQueryParameter({
        sourceMobileEndFlag: 1,
        customizeUnitCode: this.getCustomizeUnitCode([ "table", "item" ]),
        organizationId: this.organizationId,
      });

      if (this.pageLoading) {
        return;
      }

      this.pageLoading = true;
      this.tableLineDataSet.refresh();
      this.pageLoading = false;
    },
    getCustomizeUnitCode(type) {
      if (!type || isEmpty(type)) {
        return null;
      }

      const RfxCodeMap = new Map([
        [ "base", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.BIDDING_QUOTATION_BASE_FORM_INFO" ], // 基础信息
        [ "rule", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.BIDDING_QUOTATION_RULE_INFO" ], // 附件
        [ "table", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.BIDDING_QUOTATION_LINE" ], // 报价行表格
        [ "item", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.BIDDING_QUOTATION_ITEM_LINE_DETAIL" ], // 物料明细,
        [ "attachment", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.BIDDING_QUOTATION_ATTACHMENT" ], // 附件
      ]);

      const CodeDataMap = RfxCodeMap;
      let currentUnitCode = null;

      if (typeof type === "string") {
        currentUnitCode = CodeDataMap.get(type);
      }

      if (isArray(type)) {
        const codeSet = new Set();
        type.forEach((unitCode) => {
          codeSet.add(CodeDataMap.get(unitCode));
        });

        currentUnitCode = codeSet.size ? [ ...codeSet ].join(",") : null;
      }

      return currentUnitCode;
    },
    // 批量查询业务规则定义
    async batchQueryAndOperateBusinessRules() {
      const param = {
        data: [
          {
            fullPathCode: "SITF.SSRC.QUOTATION_BIDDING_REFRESH_PRICE",
            cnfParamDTOs: [ {} ],
          },
        ],
        currentOrganizationId: this.organizationId,
      };

      const result = await batchQueryBusinessRules(param) || [];
      if (isEmpty(result)) {
        return;
      }

      const value = result["SITF.SSRC.QUOTATION_BIDDING_REFRESH_PRICE"]?.[0];
      const quotationInputAutoCalculateFlag = value === "1" || value === 1 ? 1 : 0;

      this.quotationInputAutoCalculateFlag = quotationInputAutoCalculateFlag;
    },
    // 双单位
    async queryDoubleUnit() {
      const res = await queryDoubleUnit({
        businessModule: "RFX",
        tenantId: SrmUtil.getTenantId(),
      });

      if (res === 1 || res === "1" || res === true) {
        this.doubleUnitFlag = 1;
      }
    },
    async queryCalcType() {
      const { tenantId, } = this.headInfo || {};
      const result = await amountCalcType({
        purTenantId: tenantId,
        organizationId: SrmUtil.getOrganizationId(),
        supplierFlag: 0,
      });

      if (isEmpty(result)) {
        return;
      }
      this.caclRule = result[0] || null;
    },
    // query precision
    async fetchCurrentPrecision(headData) {
      const {
        currencyCode,
        tenantId,
      } = headData || {};
      if (!currencyCode) {
        return;
      }

      const Precisions = await fetchCurrentPrecision({
        currencyCodes: currencyCode,
        purTenantId: tenantId,
      });
      if (!Precisions) {
        return;
      }
      const { currency, financial } = Precisions || {};
      this.currencyPrecision = currency;
      this.financialPrecision = financial;
    },
    // 单据发起了议价，当前行未发起议价
    currentLineNotStartBargain(item) {
      const {
        bargainFlag,
        headerBargainFlag,
        bargainStatus,
      } = item || {};
      const currentLineUnBargainFlag = bargainFlag !== 1 && headerBargainFlag === 1 && bargainStatus === "BARGAINING_ONLINE";
      return currentLineUnBargainFlag;
    },
    // 基本信息-商务/技术附件
    fileArrs(item) {
      const {
        rfxBusinessAttachmentUuid = null,
        rfxTechAttachmentUuid = null,
      } = item || {};

      return [
        {
          title: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件"),
          attachmentUuid: rfxBusinessAttachmentUuid,
          bucketName: this.bucketName,
          readOnly: true,
        },
        {
          title: $T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件"),
          attachmentUuid: rfxTechAttachmentUuid,
          bucketName: this.bucketName,
          readOnly: true,
        },
      ];
    },
    //获取询价单头信息
    async fetchHeaderInfo(otherData = {}) {
      const { showStatusMessage, reEntryFlag = 0, ...others } = otherData || {};
      const { rfxLineSupplierId, biddingTarget } = this.getParamsObjFromUrl() || {};
      if (!rfxLineSupplierId || !biddingTarget) {
        return;
      }

      if (this.pageLoading) {
        return;
      }

      const params = {
        querys: {
          customizeUnitCode: this.getCustomizeUnitCode([ "base", "attachment" ]),
        },
        rfxLineSupplierId,
        organizationId: this.organizationId,
        sourceMobileEndFlag: 1,
      };

      if (!reEntryFlag) {
        this.headInfo = {
          ...this.headInfo,
          currentQuotationTotalCountValue: null,
          quotationCurrentTotalAmountValue: null,
          quotationCurrentNetAmountValue: null,
        };
      }

      this.beforeFetchHeaderUpdate();

      this.fetchLoadingFlag = 1;
      this.$loading.show();
      this.pageLoading = true;

      const res = await fetchSupplierBiddingHeader(params);

      this.$loading.hide();
      this.pageLoading = false;
      this.fetchLoadingFlag = 0;
      if (res && !res.failed) {

        let headerData = res || {};

        if (reEntryFlag) {
          const {
            currentQuotationTotalCount,
            currentQuotationTotalCountValue,
            qtnTotalAmount,
            qtnNetAmount,
            quotationCurrentTotalAmountValue,
            quotationCurrentNetAmountValue,
          } = this.headInfo || {};
          headerData = Object.assign({}, headerData, {
            currentQuotationTotalCount,
            currentQuotationTotalCountValue,
            qtnTotalAmount,
            qtnNetAmount,
            quotationCurrentTotalAmountValue,
            quotationCurrentNetAmountValue,
          });
        }

        this.headInfo = headerData;
        this.pageKey += 1;

        if (!reEntryFlag) {
          if (!this.headerFormDS.current) {
            this.headerFormDS.create(headerData, 0);
          } else {
            this.headerFormDS.setData([ headerData ]);
          }
        } else {
          this.headerFormDS?.setData([ headerData ]);
        }

        this.fetchCurrentPrecision(headerData);
        this.pageReadOnlyFlag = this.getHeaderBasicInfoModalReadOnlyFlag(headerData);

        this.updateHeaderTimerHandle();
        this.getSocketUrl();
        this.getCurrentStatusRender(headerData);
        this.getPageEditAndSummary();

        this.$forceUpdate();
      }
    },
    beforeFetchHeaderUpdate() {
      this.updateHeaderTimer = {};
      this.currentStatusHeader = null;
    },
    getSocketUrl() {
      const { tenantId, rfxNum = null, roundNumber = null, rfxHeaderId, rfxLineSupplierId } = this.headInfo || {};
      const mainFieldLackFlag =
        !rfxNum || !rfxHeaderId || !rfxLineSupplierId || !roundNumber || !tenantId;
      if (mainFieldLackFlag) {
        return;
      }

      if (!this.headerSocketUrl) {
        this.headerSocketUrl = `/topic/monitor/bidding-hall-sup/${tenantId}/${rfxHeaderId}/${roundNumber}`;
      }
      if (!this.lineSocketUrl) {
        this.lineSocketUrl = `/topic/monitor/bidding-hall-sup/${tenantId}/${rfxHeaderId}/${roundNumber}/${rfxLineSupplierId}`;
      }
    },
    // 是否未开始 || 签到中
    biddingHiddenPriceAndAmount() {
      const { displayBiddingSupHeaderStatus, biddingPausedRealTimeStatus, } = this.headInfo;
      const hiddenQuotationFieldColumnFlag =
        !displayBiddingSupHeaderStatus ||
        displayBiddingSupHeaderStatus === "NOT_START" ||
        displayBiddingSupHeaderStatus === "SIGN_IN" ||
        biddingPausedRealTimeStatus === "NOT_START" ||
        biddingPausedRealTimeStatus === "SIGN_IN";
      return hiddenQuotationFieldColumnFlag;
    },
    // 页面是否在进行中,或者进行中暂停,显示一些关键信息.类似保存,提交,汇总
    getPageEditAndSummary() {
      const { displayBiddingSupHeaderStatus, biddingPausedRealTimeStatus, } = this.headInfo;
      const flag =
        displayBiddingSupHeaderStatus === "IN_PROGRESS" ||
        (displayBiddingSupHeaderStatus === "PAUSED" && biddingPausedRealTimeStatus !== "NOT_START" && biddingPausedRealTimeStatus !== "SIGN_IN");
      this.pageEditAndSummary = flag;
    },
    getCurrentStatusRender(head = null) {
      const header = head || this.headInfo || {};
      const { displayBiddingSupHeaderStatus } = header;
      this.updateCurrentStatusRender(displayBiddingSupHeaderStatus);
    },
    updateCurrentStatusRender(status = null) {
      this.currentStatusHeader = status;
    },
    updateHeaderTimerHandle(options = {}) {
      const { headData = {}, } = options || {};
      const header = this.headInfo || {};
      const newHeader = {
        ...(header || {}),
        ...(headData || {}),
      };
      const data = getTimer({
        data: newHeader,
        countDownShowAllZeroFlag: this.countDownShowAllZeroFlag,
        type: "header",
        unitPriceFlag: this.getUnitPriceFlag(),
      });
      this.updateHeaderTimer = data || {};
      // this.updateHeaderTimer = {
      //   currentTime:  "2024-07-10 17:15:28",
      //   emptyEndLabel: "待定",
      //   endTime: "2024-07-10 17:17:00",
      //   endTitle: "距试竞价结束时间仅剩",
      //   onlyShowTime: false,
      //   pausedFlag: 0,
      //   runningTitle: "试竞价结束时间",
      // };
    },
    // ruler
    async fetchBiddingRules() {
      const urlData = this.getParamsObjFromUrl() || {};
      const params = {
        customizeUnitCode: this.getCustomizeUnitCode([ "rule", ]),
        ...urlData,
        organizationId: this.organizationId,
        sourceMobileEndFlag: 1,
      };

      const res = await fetchSupplierBiddingRules(params);
      if (res && !res.failed) {
        const ruleData = res || {};
        this.ruleInfo = ruleData;
        this.ruleDS.setData([ ruleData ], 0);
      }
    },
    // content
    refreshContent() {
      if (this.getUnitPriceFlag()) {
        this.queryUnitPriceLine();
      }
    },
    // 单价-列表视图-表格-整单批量出价 数据整理
    async validateAndReorganizeUnitPriceListViewTableDs(options = {}) {
      const { submitValidateFlag = 0 } = options || {};

      let formData = null;
      let tableData = [];
      let headerValidateFlag = true;
      let lineValidateFlag = true;

      const ds = this.tableLineDataSet;
      if (!ds) {
        return;
      }

      const updatedLines = []; // 更新

      ds.records.forEach((record = {}) => {
        if (!record) {
          return;
        }

        const updatedFlag = record.get("updatedFlag");
        const currentQuotationSecPrice = record.get("currentQuotationSecPrice");
        const netSecondaryPrice = record.get("netSecondaryPrice");

        /**
         * 提交策略
         * record updatedFlag === 1, 基准价有值
         * */
        const basePriceValue = this.getTaxOrUntax() ? currentQuotationSecPrice : netSecondaryPrice;
        const updatedAndHasPrice =
          updatedFlag === 1 && !isNil(basePriceValue) && submitValidateFlag === 1;
        if (updatedAndHasPrice) {
          updatedLines.push(record);
          record.set("status", "update");
        }

        // if (record.dirty) {
        //   record.set("updatedFlag", 1);
        // }
      });

      if (submitValidateFlag) {
        headerValidateFlag = this.headerFormDS.validate();
        if (!isEmpty(updatedLines)) {
          lineValidateFlag = await this.getUnitPriceTableValidateResult(updatedLines);
        }
      }

      formData = this.headerFormDS?.current?.toData();
      tableData = ds.toData();

      if (!isEmpty(tableData)) {
        tableData = tableData.map((line) => {
          const { taxId, taxRate, } = line || {};

          return {
            ...line,
            taxRate: isNil(taxId) ? null : taxRate,
          };
        });
      }

      const newHeaderData = {
        ...(formData || {}),
        biddingSupHeaderDTO: formData,
      };

      return {
        validateFlag: headerValidateFlag && lineValidateFlag, // 单价整单-允许校验未通过提交
        querys: {
          customizeUnitCode: this.getCustomizeUnitCode([ "base", "table", "attachment" ]),
        },
        sourceMobileEndFlag: 1,
        organizationId: this.organizationId,
        biddingSupLineCurDTOList: tableData,
        ...(newHeaderData || {}),
      };
    },
    // 单价-整单-检验变更行
    async getUnitPriceTableValidateResult(updatedLines = []) {
      const recordValidate = updatedLines.map((record) => record.validate());
      let validateResult = await Promise.all(recordValidate);
      validateResult = validateResult.every((flag) => flag === true);

      // let firstLineValidateResult = '';

      // if (!validateResult) {
      //   updatedLines.forEach((line) => {
      //     const currentLineValidate = line.getValidationErrors();

      //     if (!firstLineValidateResult) {
      //       firstLineValidateResult = getErrors({
      //         data: [
      //           {
      //             errors: currentLineValidate,
      //           },
      //         ],
      //         groupCategory: intl.get('ssrc.biddingHall.view.title.biddingSite').d('竞价现场'),
      //         groupFieldName: 'itemName',
      //         primaryKey: 'biddingSupLineCurId',
      //         consoleTitle: 'Bidding Hall Unit Whole Table',
      //       });
      //     }
      //   });
      // }

      return validateResult;
    },
    // 关闭验证弹窗
    closeValidationModal() {
      if (this.validationModalRef) {
        this.validationModalRef.closePopup();
        this.cancelPageLoading();
      }
    },
    // 页面数据组合
    handleValidationResult(allData) {
      const {
        result = {},
        confirmSubmit = noop,
        afterSuccessSubmit = noop,
        wanringCancel = noop,
        submitData = {},
        overrideSubmitWarninOkOperate,
        errorHandle = noop,
        // validationStageFlag = 0, // 校验阶段标识
      } = allData || {};
      const currentPagerfxLineSupplierId = this.headInfo?.rfxLineSupplierId;

      if (isEmpty(result) || !currentPagerfxLineSupplierId) {
        return;
      }

      const resultErrorFlag = result && result.failed;
      if (resultErrorFlag) {
        this.$notification.open({
          message: result.message,
          description: "",
          class: "notification"
        });
        errorHandle();
        return;
      }

      const { validateResults = [], rfxQuotationHeaderCurDTOS = [] } = result;

      if (isEmpty(validateResults)) {
        const currentHeader = (rfxQuotationHeaderCurDTOS || []).find(
          (resultLine) => resultLine.rfxLineSupplierId === currentPagerfxLineSupplierId
        );
        this.$notification.open({
          message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
          description: "",
          class: "notification"
        });
        afterSuccessSubmit(currentHeader);
        return;
      }

      if (!isEmpty(validateResults)) {
        const errors = [];
        const warnings = [];
        let allErrorList = null;

        let modalTitle = this.$T("ssrc.common.view.title.warningInfo").$D("以下验证未通过，确认发布吗？");

        validateResults.forEach((validateLine = {}) => {
          const { type } = validateLine;
          if (type === "ERROR") {
            // 校验失败
            errors.push(validateLine);
          }

          if (type === "WARNING") {
            warnings.push(validateLine);
          }
        });

        if (errors.length) {
          allErrorList = [ ...errors, ...warnings ];
          modalTitle = this.$T("ssrc.common.view.title.errorInfo").$D("提交失败，以下内容验证不通过");
        }

        if (warnings.length && !errors.length) {
          // validateDS.loadData(warningsMap.lists);
          allErrorList = warnings;
        }

        let newMessage = [];
        let continueWarningFlag = 1; // 是否继续后边的提示

        allErrorList.forEach((item, index) => {
          const { message } = item || {};

          if (message) {
            newMessage.push(
              <div>{index + 1}. {message}</div>
            );
          }
        });

        if (!newMessage.length) {
          return;
        }

        errorHandle();

        this.validationModalRef = this.$popup({
          title: modalTitle,
          headerAlign: "left",
          height: "60%",
          showHeader: true,
          showClose: true,
          rounded: true,
          content:
            <div class="ssrc-apply-detail-validation-form">
              <div class="ssrc-participate-validation-modal-content-wrap">
                { newMessage || modalTitle }
              </div>
              <div class="ssrc-apply-button-list-wrap">
                <srm-button fill={false} style="border-radius: 24px; height: 48px; width: 40%; margin-right: 12px;" on-click={() => {
                  wanringCancel();
                  this.closeValidationModal();
                }}>
                  { this.$T("hzero.common.button.close").$D("关闭") }
                </srm-button>
                {!errors.length && <srm-button fill style="border-radius: 24px; height: 48px; width: 40%;" on-click={async () => {
                  if (isFunction(overrideSubmitWarninOkOperate)) {
                    const warningResult = await overrideSubmitWarninOkOperate(validateResults, {
                      submitData,
                    });
                    continueWarningFlag = warningResult === 1 ? 1 : 0;
                  }
                  if (continueWarningFlag === 0) {
                    return;
                  }
                  confirmSubmit();
                  this.closeValidationModal();
                }}>
                  { this.$T("hzero.common.button.confirm").$D("确认") }
                </srm-button>}
              </div>
            </div>
          ,
        });
      }
    },
    cancelPageLoading () {
      this.$loading.hide();
      this.pageLoading = false;
    },
    // save
    async saveQuotation(options = {}) {
      const { afterSaveApiRefreshPageFlag = 1, } = options || {};

      const { ...data } = await this.validateAndReorganizeUnitPriceListViewTableDs() || {};

      let saveFlag = true;

      if (isEmpty(data)) {
        return;
      }

      if (this.pageLoading) {
        return;
      }

      let result = null;
      this.$loading.show();
      this.pageLoading = true;
      result = await quotationPriceSave(data);
      this.pageLoading = false;
      this.$loading.hide();
      if (result && result.failed) {
        result = false;
        return result;
      }

      if (afterSaveApiRefreshPageFlag === 1) {
        await this.initAllPage(options);
      }

      return saveFlag;
    },
    // submit
    async submitQuotation(outData = {}, otherOptions = {}) {
      const { outSubmitPassFlag = null } = otherOptions || {};

      const { validateFlag = false, ...data } = await this.validateAndReorganizeUnitPriceListViewTableDs({ submitValidateFlag: 1 }) || {};

      if (!validateFlag) {
        this.$notification.open({
          message: this.$T("ssrc.inquiryHall.view.inquiryHall.inputSubmitRfxUpdate").$D("提交前请填写完整相关信息"),
          description: "",
          class: "notification"
        });
        return;
      }

      if (isEmpty(data)) {
        return;
      }

      if (this.pageLoading) {
        return;
      }

      const passFlag = outSubmitPassFlag ?? 0;
      const newData = {
        ...data,
        ...outData || {},
        passFlag,
      };

      // 二次提交确认
      const confirmSubmit = async (submitOutterData = {}) => {
        let result = null;
        const { operationCode } = submitOutterData || {};
        const submitInnerData = { passFlag: 1 }; // 通过passFlag确定是校验还是提交
        const apiData = this.getValidateFieldsFromApi(operationCode);
        const submitData = { ...data, ...submitInnerData, ...apiData, };

        result = await this.handleQuotationSubmit(submitData);

        if (result && result.failed) {
          this.cancelPageLoading();
          this.notificationError(result);
          return;
        }

        this.handleValidationResult({
          result,
          submitData,
          validationStageFlag: 0,
          afterSuccessSubmit: (res) => {
            this.successSubmit(res);
            this.cancelPageLoading();
          },
          errorHandle: () => {
            this.cancelPageLoading();
          },
        });
      };

      this.pageLoading = true;
      this.$loading.show();

      let result = await this.handleQuotationSubmit(newData);

      this.handleValidationResult({
        result,
        submitData: newData,
        validationStageFlag: 1,
        confirmSubmit: () => confirmSubmit(result),
        afterSuccessSubmit: (res) => {
          this.successSubmit(res);
          this.cancelPageLoading();
        },
        errorHandle: () => {
            this.cancelPageLoading();
          },
      });
    },
    // 字段组织
    getValidateFieldsFromApi(operationCode = '') {
      const fields = {};
      if (!operationCode) {
        return fields;
      }

      let biddingSubmitBeforePassFlag = 0;
      let biddingSubmitAfterPassFlag = 0;
      if (operationCode === "BIDDING_QUOTATION_SUBMIT_BEFORE") {
        biddingSubmitBeforePassFlag = 1;
      }
      if (operationCode === "BIDDING_QUOTATION_SUBMIT_AFTER") {
        biddingSubmitAfterPassFlag = 1;
      }

      return {
        operationCode,
        biddingSubmitBeforePassFlag,
        biddingSubmitAfterPassFlag,
      };
    },
    // submit api
    async handleQuotationSubmit(data) {
      let result = null;

      try {
        result = await quotationUnitPriceSubmit(data);
        if (result && result.failed) {
          this.$loading.hide();
          this.pageLoading = false;
          result = false;
          return result;
        }
      } catch(e) {
        result = false;
        this.$loading.hide();
        this.pageLoading = false;
      }

      return result;
    },
    notificationError(result) {
      this.$notification.open({
        message: result?.message,
        description: "",
        class: "notification"
      });
    },
    // 跳转列表
    // directionList(listPageDefaultTabName = null) {
    //   let nextPageName = "ListApply";

    //   const listParams = {};
    //   if (listPageDefaultTabName) {
    //     listParams.tabName = listPageDefaultTabName; // 跳转到列表，默认进行中tab
    //   }

    //   this.$router.push({
    //     name: nextPageName,
    //     params: listParams, // 使用param是希望跳出去默认tab只生效一次
    //   });
    // },
    // 报价成功后
    successSubmit() {
      this.initAllPage();
    },
    // table line common required calculate
    // commonRequired(record) {
    //   const {
    //     abandonedFlag,
    //     bargainFlag,
    //     eliminateFlag,
    //     displayQuotationLineStatus,
    //     bargainStatus,
    //     continuousQuotationFlag,
    //     headerBargainFlag,
    //     currentDateTime,
    //     rfxHeaderQuotationEndDate,
    //   } = record || {};

    //   const statusResult =
    //     displayQuotationLineStatus !== "NOT_START" &&
    //     displayQuotationLineStatus !== "ABANDONED" &&
    //     displayQuotationLineStatus !== "FINISHED";
    //   const continueResult =
    //     continuousQuotationFlag ||
    //     !continuousQuotationFlag && displayQuotationLineStatus !== "SUBMITTED";
    //   const bargainResult =
    //     headerBargainFlag === 1 &&
    //     bargainStatus === "BARGAINING_ONLINE" &&
    //     currentDateTime < rfxHeaderQuotationEndDate &&
    //     bargainFlag !== 1;

    //   const baseResult =
    //     !abandonedFlag && !eliminateFlag && statusResult && continueResult && !bargainResult;

    //   // if (bargainFlag === 1) {
    //   //   // 还价
    //   //   return baseResult;
    //   // }

    //   return baseResult;
    // },
    // table line common disabled calculate
    commonDisabled(record) {
      const {
        abandonedFlag,
        bargainFlag,
        eliminateFlag,
        displayQuotationLineStatus,
        bargainStatus,
        continuousQuotationFlag,
        headerBargainFlag,
      } = record || {};

      const statusResult =
        displayQuotationLineStatus === "NOT_START" ||
        displayQuotationLineStatus === "ABANDONED" ||
        displayQuotationLineStatus === "FINISHED";
      const continueResult =
        continuousQuotationFlag !== 1 && displayQuotationLineStatus === "SUBMITTED";
      const bargainResult =
        bargainFlag !== 1 && headerBargainFlag === 1 && bargainStatus === "BARGAINING_ONLINE";

      const baseResult =
        abandonedFlag || eliminateFlag || statusResult || continueResult || bargainResult;

      return baseResult;
    },
    // 当前行 放弃 清空字段值
    // quotaitonLineAbandonClearFieldsValue(item) {
    //   if (!item) {
    //     return;
    //   }

    //   item.netPrice = null;
    //   item.netSecondaryPrice = null;
    //   item.brand = null;
    //   item.origin = null;
    //   item.biUomId = null;
    //   item.uomConversionRate = null;
    //   item.minPackageQuantitytPrice = null;
    //   item.minPurchaseQuantity = null;
    //   item.currentPromisedDate = null;
    //   item.currentExpiryDateTo = null;
    //   item.currentDeliveryCycle = null;
    //   item.currentQuotationPrice = null;
    //   item.currentQuotationSecPrice = null;
    //   item.currentExpiryDateFrom = null;
    //   item.currentQuotationRemark = null;
    //   item.currentAttachmentUuid = null;
    //   item.quotationStartDate = null;
    //   item.quotationEndDate = null;
    //   item.currentLnTotalAmount = null;
    //   item.currentLnNetAmount = null;
    //   item.abandonedFlag = 1;
    //   item.updatedFlag = 1;
    // },
    // 报价明细
    viewQuotationDetail(item) {
      this.quotationDetailVisible = true;
      this.quotaitonDetailDataSource = item || {};
    },
    itemDetailTableClosePopup() {
      this.quotationDetailVisible = false;
      this.quotaitonDetailDataSource = {};
    },
    // 可供数量-secondary
    async handleChangeQuotationQuantity({ record }) {
      const { tenantId } = this.headInfo || {};
      const {
        // netSecondaryPrice,
        // currentSecondaryQuotationPrice,
        itemId,
        secondaryUomId,
        currentQuotationSecQuantity,
        uomId,
        rfxLineItemId,
      } = record?.toData() || {};

      if (itemId && this.doubleUnitFlag) {
        if (secondaryUomId && currentQuotationSecQuantity) {
          const res = await calculateBasicQty({
            secondaryQuantity: currentQuotationSecQuantity,
            itemId,
            businessKey: rfxLineItemId,
            doublePrimaryUomId: uomId,
            secondaryUomId,
            tenantId,
          });
          record.set('currentQuotationQuantity', res ?? null);
        } else if (currentQuotationSecQuantity === 0) {
          record.set('currentQuotationQuantity', 0);
        }
      } else {
        record.set('currentQuotationQuantity', currentQuotationSecQuantity);
      }
    },
    async changeQuantity(val, item, field, record) {
      await this.handleChangeQuotationQuantity({ record });
      item.updatedFlag = 1;
      this.dynamicChangeLinePrice(record);
      this.calcQuotationTableSummaryQuotationLine();
      this.calcQuotationTableSummaryQuotationAmount();
    },
    changeQuotataionNetPrice(val, item, field, record) {
      if (!item) {
        return;
      }

      const { fieldCode } = field || {};

      const taxFlag = this.getTaxOrUntax();
      item.updatedFlag = 1;
      item.previewNetPriceValue = val;
      if (!taxFlag) {
        record.set(fieldCode, val);
        this.dynamicChangeLinePrice(record);
        this.calcQuotationTableSummaryQuotationLine();
        this.calcQuotationTableSummaryQuotationAmount();
      }
    },
    changeQuotationPrice(val, item, field, record) {
      if (!item) {
        return;
      }

      const { fieldCode } = field || {};
      const taxFlag = this.getTaxOrUntax();
      item.updatedFlag = 1;
      item.previewCurrentQuotationPriceValue = val;
      if (taxFlag) {
        record.set(fieldCode, val);
        item[fieldCode] = val;
        this.dynamicChangeLinePrice(record);
        this.calcQuotationTableSummaryQuotationLine();
        this.calcQuotationTableSummaryQuotationAmount();
      }
    },
    getUnitPriceFieldName() {
      const taxFlag = this.getTaxOrUntax();

      let linePriceField = "netSecondaryPrice";

      if (taxFlag) {
        linePriceField = "currentQuotationSecPrice";
      }

      return linePriceField;
    },
    getDifferenceUnitPriceFieldName() {
      const taxFlag = this.getTaxOrUntax();

      const linePriceField = taxFlag ? "netSecondaryPrice" : "currentQuotationSecPrice";

      return linePriceField;
    },
    // 计算报价行数
    calcQuotationTableSummaryQuotationLine() {
      const {
        currentQuotationTotalCount: originCount,
      } = this.headInfo || {};

      const linePriceField = this.getUnitPriceFieldName();
      let currentCount = 0;

      const calcLineCount = (data) => {
        if (!data?.records?.length) {
          return;
        }

        data.records.forEach((record) => {
          if (!record) {
            return;
          }

          const temporaryData = record.get("temporaryData");
          const currentLinePrice = record.get(linePriceField);

          const {
            [ linePriceField ]: originLinePrice,
          } = temporaryData || {};

          const priceQuotedFlag = !isNil(currentLinePrice) && isNil(originLinePrice);
          const priceQuotedCancelFlag = !isNil(originLinePrice) && isNil(currentLinePrice);

          if (priceQuotedFlag) {
            currentCount = SrmMath.plus(currentCount, 1);
          }

          if (priceQuotedCancelFlag) {
            currentCount = SrmMath.minus(currentCount, 1);
          }
        });
      };

      calcLineCount(this.tableLineDataSet);

      currentCount = SrmMath.plus(currentCount, originCount || 0);

      if (currentCount < 0) {
        currentCount = null;
      }

      this.headInfo = {
        ...this.headInfo,
        currentQuotationTotalCountValue: currentCount
      };
    },
    // 计算报价金额
    calcQuotationTableSummaryQuotationAmount() {
      const { lineAmountField, currentShowTotalAmountField, queryQuotationCurrentTotalAmountField } =
        this.getAmountFieldsName() || {};

      const { [queryQuotationCurrentTotalAmountField]: originCount } = this.headInfo || {};

      let originTotalAmount = 0;
      let currentTotalAmount = 0;

      const calcLineAmount = (data) => {
        if (!data?.records?.length) {
          return;
        }

        data.records.forEach((record) => {
          if (!record) {
            return;
          }

          const temporaryData = record.get("temporaryData");
          const currentLineAmount = record.get(lineAmountField);

          const {
            [ lineAmountField ]: originLineAmount,
          } = temporaryData || {};

          originTotalAmount = SrmMath.plus(originTotalAmount || 0, originLineAmount || 0);
          currentTotalAmount = SrmMath.plus(currentTotalAmount || 0, currentLineAmount || 0);
        });
      };

      calcLineAmount(this.tableLineDataSet);

      let currentQuotationTotalCountValue = SrmMath.plus(
        SrmMath.minus(currentTotalAmount || 0, originTotalAmount || 0),
        originCount || 0
      );

      if (currentQuotationTotalCountValue < 0) {
        currentQuotationTotalCountValue = null;
      }

      this.headInfo = {
        ...this.headInfo,
        [ currentShowTotalAmountField ]: currentQuotationTotalCountValue
      };
    },
    // quotaion line all recalculate
    quotationLineAllRecalculate() {
      const quotationLineRecords = this.tableLineDataSet.records;
      if (!quotationLineRecords?.length) {
        return;
      }

      quotationLineRecords.forEach((line) => {
        this.dynamicChangeLinePrice(line);
      });
    },
    getFieldsValueFromRecord(fields, record) {
      const values = {};
      if (isEmpty(fields) || !record) {
        return values;
      }

      fields.forEach((field) => {
        const value = record.get(field);
        values[field] = value;
      });

      return values;
    },
    updateFieldFieldsValueFromRecord(values, record) {
      if (isEmpty(values) || !record) {
        return values;
      }

      Object.keys(values || []).forEach((key) => {
        if (!key) {
          return;
        }

        const value = values[key];
        record.set(key, value);
      });
    },
    // 改变价格后统一数据处理
    changePriceGetCommonProps(record) {
      if (!record) {
        return;
      }

      const { priceTypeCode, } = this.headInfo || {};
      const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";

      const currentCurrencyPrecision = record.get("defaultPrecision") ?? this.currencyPrecision;
      const currentFinancialPrecision = record.get("financialPrecision") ?? this.financialPrecision;

      const {
        priceBatchQuantity,
        taxRate,
        currentQuotationQuantity,
        currentQuotationSecQuantity,
      } =
        this.getFieldsValueFromRecord([
          "taxRate",
          "currentQuotationQuantity",
          "currentQuotationSecQuantity",
          "priceBatchQuantity",
        ], record) || {};

      // const pristineTaxRate = record.getPristineValue("taxRate");
      const COMMONS = {
        hasTax: !isUnTaxPriceFlag,
        hasMount: true,
        financialPrecision: currentFinancialPrecision,
        defaultPrecision: currentCurrencyPrecision,
        caclRule: this.caclRule,
        each: priceBatchQuantity,
      };

      let taxRateNew = null;
      // override ui bug
      if (taxRate !== null && taxRate !== "null" && taxRate !== "undefined" && !isNil(taxRate)) {
        taxRateNew = taxRate;
      }
      const currentQuantity = !this.doubleUnitFlag ? currentQuotationQuantity : currentQuotationSecQuantity;
      COMMONS.quantity = currentQuantity;
      COMMONS.taxRate = taxRateNew ?? 0;
      // 数量不存在，修改计算场景
      if (!currentQuantity) {
        COMMONS.stageRule = "noQuantity";
      }

      return COMMONS;
    },
    dynamicChangeLinePrice(record) {
      const { defaultPrecision, financialPrecision } = this.headInfo || {};
      const isTaxPriceFlag = this.getTaxOrUntax();

      const price = this.getUnitPriceFieldName();
      // const { lineAmountField } = this.getAmountFieldsName();

      const {
        [price]: currentPriceValue,
        priceBatchQuantity,
        currentQuotationSecQuantity,
        taxIncludedFlag,
        taxRate,
        taxRateType,
      } = record.toData() || {};

      const COMMONS = {
        hasTax: isTaxPriceFlag,
        hasMount: true,
        financialPrecision,
        defaultPrecision,
        caclRule: this.caclRule,
        each: priceBatchQuantity,
        taxRateType,
      };

      const unitPrice = isTaxPriceFlag ? "taxUnitPrice" : "netUnitPrice";
      const calcPrice = isTaxPriceFlag ? "calcNetUnitPrice" : "calcTaxUnitPrice";
      const setPrice = this.getDifferenceUnitPriceFieldName();
      // const baseUnitPriceName = this.getBaseUnitPriceFieldName(isTaxPriceFlag); // 基准价的基本单价
      // const unBaseUnitPriceName = this.getBaseUnitPriceFieldName(!isTaxPriceFlag); // 非基准价的基本单价

      // const currentQuantity = !doubleUnitFlag ? rfxQuantity : secondaryQuantity;
      const currentQuantity = currentQuotationSecQuantity; // 竞价大厅暂时没有双单位，先去辅助数量

      COMMONS.quantity = currentQuantity;
      COMMONS.taxRate = taxIncludedFlag ? taxRate ?? 0 : 0;
      COMMONS[unitPrice] = currentPriceValue;

      // 数量不存在，修改计算场景
      if (!currentQuantity) {
        COMMONS.stageRule = "noQuantity";
      }

      const { [calcPrice]: currentCalcPrice, calcTaxAmount, calcNetAmount } = this.$options.filters["amountCalculation"](COMMONS) || {};

      const priceValueObject = {
        [setPrice]: currentCalcPrice,
        currentLnTotalAmount: calcTaxAmount,
        currentLnNetAmount: calcNetAmount,
      };

      this.updateFieldFieldsValueFromRecord(priceValueObject, record);
    },
    // 金额字段
    getAmountFieldsName() {
      let lineAmountField = "currentLnTotalAmount"; // 表格-当前行金额
      let currentShowTotalAmountField = "quotationCurrentTotalAmountValue"; // 实时计算行金额-字段
      let queryQuotationCurrentTotalAmountField = "qtnTotalAmount"; // 查询的有效当前金额

      // 未税
      if (!this.getTaxOrUntax()) {
        lineAmountField = "currentLnNetAmount";
        currentShowTotalAmountField = "quotationCurrentNetAmountValue";
        queryQuotationCurrentTotalAmountField = "qtnNetAmount";
      }

      return {
        lineAmountField,
        currentShowTotalAmountField,
        queryQuotationCurrentTotalAmountField,
      };
    },
    // render 报价行当前金额总计
    renderLineTotalAmount() {
      const {
        qtnTotalAmount,
        qtnNetAmount,
        quotationCurrentTotalAmountValue,
        quotationCurrentNetAmountValue,
        // currencyCode,
      } = this.headInfo || {};
      const isUnTaxPriceFlag = !this.getTaxOrUntax();
      let amount = quotationCurrentTotalAmountValue ?? qtnTotalAmount;

      if (isUnTaxPriceFlag) {
        amount = quotationCurrentNetAmountValue ?? qtnNetAmount;
      }

      if (isNil(amount)) {
        return "-";
      }

      const amountFormat = this.formatFinicial(amount);
      return amountFormat;
    },
    formatFinicial(amount) {
      if (isNil(amount)) {
        return;
      }
      return SrmMath.toFormat(amount, this.financialPrecision, BigNumber.ROUND_HALF_CEIL);
    },
    formatPrice(amount) {
      if (isNil(amount)) {
        return "";
      }
      return SrmMath.toFormat(amount, this.currencyPrecision, BigNumber.ROUND_HALF_CEIL);
    },
    validatePageBiddingTarget() {
      const urlData = this.getParamsObjFromUrl() || {};
      const { biddingTarget } = urlData || {};
      if (biddingTarget !== "UNIT_PRICE" && biddingTarget !== "TOTAL_PRICE") {
        throw new ReferenceError("biddingTarget value is not UNIT_PRICE or TOTAL_PRICE !");
      }
    },
    getTotalPriceFlag() {
      const urlData = this.getParamsObjFromUrl() || {};
      const { biddingTarget } = urlData || {};
      return biddingTarget === "TOTAL_PRICE";
    },
    // 单价竞价标识
    getUnitPriceFlag() {
      const urlData = this.getParamsObjFromUrl() || {};
      const { biddingTarget } = urlData || {};
      return biddingTarget === "UNIT_PRICE";
    },
    // 判断含税或者不函数逻辑 1=含税，否则未税
    getTaxOrUntax() {
      const { benchmarkPriceType } = this.headInfo || {};
      const taxFlag = benchmarkPriceType === "TAX_INCLUDED_PRICE";

      return taxFlag;
    },
    // 竞价
    getBiddingFlag() {
      const { biddingQuotationMethod } = this.headInfo || {};
      const flag = biddingQuotationMethod === "BIDDING";

      return flag;
    },
    // 拍卖
    getAuctionFlag() {
      const { biddingQuotationMethod } = this.headInfo || {};
      const flag = biddingQuotationMethod === "AUCTION";

      return flag;
    },
    numberFormat(value) {
      if (isNil(value)) {
        return value;
      }

      const formatValue = SrmUtil.getNumberLocalized(value);

      return formatValue;
    },
    // 单价-整单标识
    biddingUnitWholeBatchPriceFlag() {
      const { biddingUnitPriceRule, quotationOrderType, } = this.headInfo || {};
      // 单价+并行+整单批量出价
      const unitWholeBatchPriceFlag =
        biddingUnitPriceRule === "WHOLE_BATCH" &&
        quotationOrderType === "PARALLEL" &&
        this.getUnitPriceFlag();
      return unitWholeBatchPriceFlag;
    },
    // 页面只读 + 暂停标识
    readonlyOrPaused() {
      const { displayBiddingSupHeaderStatus } = this.headInfo || {};

      const flag = this.pageReadOnlyFlag || displayBiddingSupHeaderStatus === "PAUSED";
      return flag;
    },
    // 单据只读状态标识 - 单独处理暂停
    getHeaderBasicInfoModalReadOnlyFlag(head = null) {
      const { displayBiddingSupHeaderStatus, supplierStatus } = head || this.headInfo || {};

      // 竞价单不可编辑状态集
      const ReadOnlyFlag =
        !displayBiddingSupHeaderStatus ||
        displayBiddingSupHeaderStatus === "SIGN_IN" ||
        displayBiddingSupHeaderStatus === "NOT_START" ||
        displayBiddingSupHeaderStatus === "CLOSED" ||
        displayBiddingSupHeaderStatus === "FINISHED" ||
        // displayBiddingSupHeaderStatus === "PAUSED" ||
        displayBiddingSupHeaderStatus === "BIDDING_END" ||
        displayBiddingSupHeaderStatus === "SUGGESTED" ||
        supplierStatus === "PROHIBIT_QUOTATION";

      return ReadOnlyFlag;
    },
    getBiddingRemainingCountFieldValue(currentData) {
      if (isEmpty(currentData)) {
        return null;
      }
      const { biddingRemainingCount } = this.getBiddingRemainingQuotationCount(currentData) || {};
      return biddingRemainingCount;
    },
    // 获取当前允许可出价次数和剩余可出价次数
    getBiddingRemainingQuotationCount(options) {
      const { record } = options || {};
      const {
        biddingAllowedQuotationCount: headBiddingAllowedQuotationCount,
        deferBiddingAllowedQuotationCount: headDeferBiddingAllowedQuotationCount,
        deferBiddingFlag: headDeferBiddingFlag,
        biddingRemainingQuotationCount: headBiddingRemainingQuotationCount,
        deferBiddingRemainingQuotationCount: headDeferBiddingRemainingQuotationCount,
      } = this.headInfo || {};

      // 单价的整单维护/总价 - 使用头字段
      const headerLogicFlag = this.biddingUnitWholeBatchPriceFlag() || this.getTotalPriceFlag();
      const values = {};

      if (headerLogicFlag) {
        values.biddingAllowCount = headBiddingAllowedQuotationCount; // 延时次数
        values.biddingRemainingCount = headBiddingRemainingQuotationCount; // 剩余可出价次数

        if (headDeferBiddingFlag) {
          values.biddingAllowCount = headDeferBiddingAllowedQuotationCount;
          values.biddingRemainingCount = headDeferBiddingRemainingQuotationCount;
        }
        return values;
      }

      const {
        deferBiddingFlag,
        biddingAllowedQuotationCount,
        deferBiddingAllowedQuotationCount,
        biddingRemainingQuotationCount,
        deferBiddingRemainingQuotationCount,
      } = record || {};

      // !headerLogicFlag 单价的物料维护用行字段
      values.biddingAllowCount = biddingAllowedQuotationCount; // 延时次数
      values.biddingRemainingCount = biddingRemainingQuotationCount; // 剩余可出价次数

      if (deferBiddingFlag) {
        values.biddingAllowCount = deferBiddingAllowedQuotationCount;
        values.biddingRemainingCount = deferBiddingRemainingQuotationCount;
      }

      return values;
    },
    getQuotationLines() {
      const {
        currentQuotationTotalCount,
        currentQuotationTotalCountValue,
        rfxLineItemCount,
      } = this.headInfo || {};
      const currentTableQuotedNumber = currentQuotationTotalCountValue ?? currentQuotationTotalCount;

      return `${currentTableQuotedNumber ?? 0} / ${rfxLineItemCount || 0}`;
    },
    getRemainderQuoted() {
      // const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
      const { biddingRemainingCount: biddingRemainingQuotationCount } = this.getBiddingRemainingQuotationCount({ record: this.headInfo, }) || {};

      const number = biddingRemainingQuotationCount ?? "";
      return this.numberFormat(number);
    },
    renderQuotationNumberPart() {
      const {
        displayBiddingSupHeaderStatus,
        currentQuotationTotalCount,
        currentQuotationTotalCountValue,
      } = this.headInfo || {};

      const unitPriceFieldStatusVisibleFlag =
        displayBiddingSupHeaderStatus === "IN_PROGRESS" ||
        // displayBiddingSupHeaderStatus === "FINISHED" ||
        // displayBiddingSupHeaderStatus === "CLOSED" ||
        displayBiddingSupHeaderStatus === "PAUSED";

      const currentTableQuotedNumber = currentQuotationTotalCountValue ?? currentQuotationTotalCount;

      const { biddingRemainingCount: biddingRemainingQuotationCount } = this.getBiddingRemainingQuotationCount({ record: this.headInfo }) || {};
      if (isNil(biddingRemainingQuotationCount)) {
        return "";
      }

      const unitPriceBatchQuotationFlag = this.biddingUnitWholeBatchPriceFlag();
      // 单价-整单-显示价格信息
      const unitWholePriceVisibleFlag = unitPriceBatchQuotationFlag && unitPriceFieldStatusVisibleFlag;

      const remainCountShow = !isNil(biddingRemainingQuotationCount) && unitWholePriceVisibleFlag;

      if (!remainCountShow) {
        return;
      }

      return remainCountShow ?
        <div class="quotaiton-line-summary-item">
          <span class="quotaiton-line-summary-item-label">
            {this.$T("ssrc.biddingHall.view.title.biddingAllowedQuotationCount", [ biddingRemainingQuotationCount ]).$D("剩余可出价{count}次")}
          </span>
          <span class="quotaiton-line-summary-item-value">
            {currentTableQuotedNumber}
          </span>
        </div> : "";
    },
    // 当前时间-转为秒
    getCurrentDateTimeSecond() {
      return moment().second();
    },
  }
};
</script>

<style
  lang="stylus"
  scoped
>

>>> .srm-list-item-card-head-left {
  max-width: 75% !important;
}

>>> .srm-list-item-card-head {
  display: flex;
  align-items: flex-start !important;
}

>>> .srm-scroll-tab-item-title {
  font-size: 14px;
  font-weight: 500;
}

.bottom-space-view {
  height: 0px;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}

.ssrc-apply-quotation-count-down-wrap {
  font-family: PingFangSC-Medium;
  background: rgba(255, 107, 107, 0.05);
  font-size: 14px;
  color: var(--color-img-default-c);
  line-height: 30px;
  font-weight: 500;
  text-align: center;
}

.ssrc-apply-base-form-header-wrapper {
  display: flex;
  width: calc(100% - 50px);
}

.ssrc-header-title {
  display: inline-block;
  max-width: 64%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
  width: calc(100% - 120px);
}

.ssrc-header-title-value {
  font-weight: 600;
  max-width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ssrc-header-source-category {
  font-family: PingFangSC-Medium;
  background: #F0F2F5;
  border: 1px solid #F0F2F5;
  border-radius: 2px;
  font-size: 10px;
  transform: scale(0.86);
  transform-origin: 0 0;
  color: var(--font-color-default);
  line-height: 16px;
  font-weight: 500;
  display: inline-block;
  text-align: center;
  margin-left: 4px;
  padding: 0 4px;
}

.ssrc-table-line-customize-header-wrapper {
  width: 100%;
  //padding-bottom: 12px;
  //border-bottom: 1px dashed #F0F2F5;
  position: relative;

  .open-tag[data-v-498063c2]:before {
    top: 25% !important;
  }
}

.ssrc-table-line-number-wrap {
  font-size: 14px;
  color: var(--color-primary);
  line-height: 20px;
  font-weight: 400;
  position: absolute;
  top: 0;
  right: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-line-not-start-bargain-disabled-color {
  color: #CBCBCB !important;
}

.ssrc-table-line-status-wrap {
  font-size: 14px;
  color: #FF6937;
  text-align: right;
  line-height: 20px;
  font-weight: 600;

  .right-icon-wrap {
    height: 16px;
    width: 16px;
    margin-left: 8px;
    vertical-align: middle;
  }
}

.ssrc-apply-detail-validation-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
}

.ssrc-participate-validation-modal-content-wrap {
  height: 280px;
  overflow-y: auto;
  padding: 12px;
  padding-top: 0;
}

.ssrc-apply-button-list-wrap {
  display: flex;
  justify-content: center;
}

.srm-list-item-card-head {
  align-items: baseline;
}

.ssrc-quotation-line-summary-bar {
  height: 5vh;
  line-height: 2.2;
}

.ssrc-quotaiton-summary-wrapper {
  margin-top: 4px;
  font-size: 14px;
  color: var(--font-color-default);
  font-weight: 400;
}

.quotaiton-line-summary-list {
  font-family: PingFangSC-Regular;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 14px;
  padding-right: 14px;
  font-size: 12px;

  .quotaiton-line-summary-item {
    display: inline-flex;
    align-items: center;
  }

  .quotaiton-line-summary-item-label {
    color: #868D9C;
  }

  .quotaiton-line-summary-item-value {
    padding-left: 4px;
    max-width: 50vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
    color: var(--color-info);
  }

  .total-amount {
    color: var(--color-danger);
    font-weight: 600;
  }
}

.ssrc-bidding-hall-header-title-wrap {
  width: calc(100% - 140px);
}

</style>
