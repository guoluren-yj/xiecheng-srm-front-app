<template>
  <div :style="{ height: headInfo.currentQuotationRound > 1 && headInfo.bargainStatus !== 'BARGAINING_ONLINE' ? '75vh' : '80vh' }">
    <!-- 头信息 -->
    <!--    <srm-detail-head :columns="getHeaderColumns" :data-source="headInfo" /> -->
    <!-- 内容区域 -->

    <div class="ssrc-apply-quotation-count-down-wrap">
      <count-down
        :now="headInfo.currentDateTime"
        :end="headInfo.quotationEndDate"
        :count-running-title="$T('hipspfm.supplierQuotation.model.supplierQuotation.remainingTime').$D('剩余时间')"
        :count-direction-show-end-title="$T('ssrc.common.view.endTime').$D('截止时间')"
        :gt-day-direct-show="1" />
    </div>

    <srm-scroll-tab content-scroll>
      <srm-scroll-tab-item
        :label="
          $T('ssrc.common.view.message.basicInfos').$D(
            '基础信息'
          )">
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
        <srm-scroll :scrollable="false" @reachBottom="reachBottom">
          <srm-list :data-set="tableLineDataSet"
                    :columns="getQuotationLineColumns"
                    :scrollable="false"
                    :customize-code="getCustomizeUnitCode('table')"
                    @itemClick="viewQuotationDetail" />
        </srm-scroll>
        <!-- 适配iPhoneX -->
        <div class="bottom-space-view" />
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.tab.attachmentList').$D('附件列表')">
        <customize
          :need-padding="true"
          :code="getCustomizeUnitCode('attachment')"
          :data-source="headInfo"
          :columns="getAttachmentForm" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- summary footer -->
    <div :class="footerWrapClass">
      <div v-if="headInfo.currentQuotationRound > 1 && headInfo.bargainStatus !== 'BARGAINING_ONLINE' " class="quotaiton-line-summary-list ssrc-quotation-last-round-wrapper">
        <div v-if="headInfo.roundQuotationRankFlag === 1" class="quotaiton-line-summary-item">
          <span class="quotaiton-line-summary-item-label">
            {{ $T("ssrc.supplierQuotation.model.supQuo.lastRank").$D("上一轮排名") }}:
          </span>
          <span class="quotaiton-line-summary-item-value">
            {{ headInfo.lastRoundQuotationRank }}
          </span>
        </div>

        <div class="quotaiton-line-summary-item">
          <span class="quotaiton-line-summary-item-label">
            {{ $T("ssrc.supplierQuotation.model.supQuo.lastRoundAmount").$D("上一轮金额") }}:
          </span>
          <span>
            <srm-tooltip :title="String(headInfo.lastRoundQuotationAmount || 0)" placement="top">
              <span class="quotaiton-line-summary-item-value round-qutation-bottom-value">
                {{ headInfo.lastRoundQuotationAmount }}
              </span>
            </srm-tooltip>
          </span>
        </div>
      </div>

      <div class="quotaiton-line-summary-list ssrc-quotaiton-summary-wrapper">
        <div class="quotaiton-line-summary-item">
          <span v-if="headInfo.quotationScope === 'PART_QUOTATION'" class="quotaiton-line-summary-item-label">
            {{ !bidFlag ? $T("ssrc.common.view.title.quotationLineNumber").$D("报价行数") : $T("ssrc.common.view.title.quotationLineNumberBidding").$D("投标行数") }}:
          </span>
          <span v-if="headInfo.quotationScope === 'PART_QUOTATION'" class="quotaiton-line-summary-item-value">
            <span>
              <span>{{ headInfo.currentQuotationTotalCountValue || headInfo.currentQuotationTotalCount || 0 }}</span>
              <span>/</span>
              <span>{{ tableLineDataSet.totalCount }}</span>
            </span>
          </span>
        </div>

        <div class="quotaiton-line-summary-item item-total-amount-wrapper">
          <span class="quotaiton-line-summary-item-label">
            {{ $T("ssrc.common.view.title.total").$D("合计") }}:
          </span>
          <span class="quotaiton-line-summary-item-value total-amount">
            <srm-tooltip :title="renderLineTotalAmount()" placement="top">
              <div class="quotaiton-line-summary-item-value total-amount" v-text="renderLineTotalAmount()"/>
            </srm-tooltip>
          </span>
        </div>
      </div>
    </div>

    <!-- bottom buttons -->
    <srm-bottom-handler :btn-arr="getPageBottomBtnArr" type="action-sheet" />

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
import { isEmpty, noop, isArray, isNil, isFunction, } from "lodash";
import BigNumber from "bignumber.js";
import { $T, DataSet, SrmUtil, SrmMath, } from "srm-mobile-ui";

import {
  getValidPriceName,
  getValidNetPriceName,
  getNetPriceName,
  getPriceName,
  getAvailableQtyName,
} from "@/utils/doubleUnit.js";

import {
  submitQuotationNew,
  saveQuotationNew,
  quotationWholeAbandon,
} from "../api";

import plus from "@/assets/icon-plus-circle.svg";
import minus from "@/assets/icon-minus-circle.svg";

import { fetchQuotationHeader, queryEnableDoubleUnit, } from "../api";
import { currentQuotationBasicFormDataSet } from "../datasource/currentQuotationBasicFormDataSet";
import { currentQuotationLineDataSet } from "../datasource/currentQuotationLineDataSet";
import { abandonFormDS } from "../datasource/abandonFormDS";
import { amountCalcType, fetchCurrentPrecision, calculateBasicQty, } from "@/utils/utils";
import CountDown from "./CountDown";
// import { amountCalculation, } from "@/utils/amountCalculation";
import { commonRfxStatusColor } from "../components/commonRfxStatusColor";
import CompleteMethod from "../../CUX_PART/Method/CompleteMethod";

export default {
  modules: [ "ssrc.queryQuotation", "ssrc.common", "hipspfm.workFlow", "ssrc.biddingOpen", "ssrc.bidHall", "ssrc.inquiryHall", "smbl.common", "hipspfm.supplierQuotation", "ssrc.supplierQuotation", "hzero.common", "hipspfm.common", "ssrc.biddingHall", ],
  name: "QuotationNew",
  components: { CountDown },
  props:{
    documentType: {
      type: String,
      default: "",
    }
  },
  extends: CompleteMethod,
  data() {
    return {
      loading: false,
      organizationId: SrmUtil.getOrganizationId(),
      headInfo: {},
      headerFormDS: new DataSet(currentQuotationBasicFormDataSet({
        documentType: this.documentType,
      })),
      tableLineDataSet: new DataSet(currentQuotationLineDataSet({
        documentType: this.documentType,
      })),
      abandonFormDs: new DataSet(abandonFormDS()),
      bidFlag: this.documentType === "BID",
      doubleUnitFlag: false, // 双单位是否开启标志
      bucketName: SrmUtil.getDefaultBucketName(),
      validationModalVisible: false, // submit validate modal visible
      querys: {},
      pageType: "", // 页面标识
      quotationDetailVisible: false, // 报价明细表 visible
      quotaitonDetailDataSource: {}, //  报价明细表 record
      caclRule: null, // 业务规则定义-金额计算方式
      currencyPrecision: null, // 手动查询的币种精度
      financialPrecision: null, // 手动查询的财务精度
      mLeftTime: {},
      countTimer: null,
      footerWrapClass: "ssrc-quotation-line-summary-bar",
      doubleQuantityCalculating: false, // 双单位数量接口计算中
      cuxQuotationLineFields: [], // cux fields
    };
  },
  computed: {
    // bottom buttons
    getPageBottomBtnArr() {
      const { quotationHeaderId, supplierStatus, bargainStatus, quotationStatus, } = this.headInfo || {};
      if (!quotationHeaderId) {
        return [];
      }

      const currentBargainFlag = bargainStatus === "BARGAINING_ONLINE"; // 议价
      const wholeAbandonFlag =
        supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识

      return [
        {
          title: this.$T("hzero.common.button.save").$D("保存"),
          fill: false,
          bordered: true,
          disabled: wholeAbandonFlag || this.doubleQuantityCalculating,
          handler: () => {
            this.saveQuotation();
          },
        },
        {
          title: this.$T("hzero.common.button.submit").$D("提交"),
          type: "primary",
          fill: true,
          bordered: true,
          disabled: wholeAbandonFlag || this.doubleQuantityCalculating,
          handler: () => {
            this.submitQuotation();
          },
        },
        {
          title: this.$T("ssrc.supplierQuotation.view.message.wholeGiveUp").$D("整单放弃"),
          fill: false,
          bordered: true,
          disabled: wholeAbandonFlag || currentBargainFlag || !quotationStatus,
          handler: () => {
            this.handleWholeAbandon();
          },
        },
      ];
    },
    getBaseForm() {
      const {
        systemVersion, // systemVersion代表此单子走的新模板
      } = this.headInfo;
      const rfa = this.getRfa();

      const fields = [
        {
          formRow: 0,
          fieldCode: "rfxTitle",
          render: (val, record) => {
            const { secondarySourceCategoryMeaning, rfxTitle, currentQuotationRound, bargainStatus, bargainTimes, quotationOrderTypeMeaning, } = record || {};
            const currentBargainFlag = bargainStatus === "BARGAINING_ONLINE"; // 议价
            const bargainTimesShowFlag = currentBargainFlag && bargainTimes;
            const roundFlag = currentQuotationRound > 1 && !currentBargainFlag;
            const titleClass = roundFlag ? "ssrc-header-title" : "ssrc-header-title no-round-quotation-title";
            return (
              <SrmListHeader>
                <div class="ssrc-apply-base-form-header-wrapper">
                  <div class={titleClass}>
                    <srm-tooltip title={rfxTitle} placement="bottom">
                      <span class="ssrc-header-title-value">{rfxTitle}</span>
                    </srm-tooltip>
                  </div>
                  <div>
                    <div class="ssrc-header-source-category">
                      {secondarySourceCategoryMeaning}
                    </div>
                    {rfa ? <div class="ssrc-header-source-category">
                      {quotationOrderTypeMeaning}
                    </div> : ""}
                    {roundFlag ?
                      <div class="ssrc-header-source-category">
                        {this.$T("ssrc.common.the").$D("第")}
                        {currentQuotationRound}
                        {this.$T("ssrc.common.round").$D("轮")}
                      </div> : "" }
                    {bargainTimesShowFlag ?
                      <div class="ssrc-header-source-category">
                        { this.$T("ssrc.common.theRoundBargainNum", [ bargainTimes ]).$D("第{bargainTimes}次议价") }
                      </div> : "" }
                  </div>
                </div>
              </SrmListHeader>
            );
          },
        },
        {
          formRow: 100,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuot.companyName").$D("客户"),
          fieldCode: "companyName",
        },
        {
          formRow: 200,
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
              <SrmUpload
                isTab={false}
                showIcon={false}
                bucketName={this.bucketName}
                descTitle={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
                title={this.$T("ssrc.supplierQuotation.model.supQuo.companyNameAttachmentBusTec").$D("客户商务/技术附件")}
                queryParams={{
                  directory: "ssrc-rfx-rfxheader",
                }}
                fileArr={this.fileArrs(item)} />
            );
          },
        },
        {
          formRow: 300,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currency").$D("币种"),
          fieldCode: "currencyCode",
          fieldType: "LOV",
          lovCode: "SMDM.EXCHANGE_RATE.CURRENCY",
          required: (val, item) => {
            const {
              supplierStatus,
              multiCurrencyFlag,
            } = item || {};
            const wholeAbandonFlag =
              supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
            return multiCurrencyFlag === 1 && !wholeAbandonFlag;
          },
          disabled: (val, item) => {
            const {
              supplierStatus,
              multiCurrencyFlag,
            } = item || {};
            const wholeAbandonFlag =
              supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
            return multiCurrencyFlag !== 1 || wholeAbandonFlag;
          },
          options: {
            displayField: "currencyCode",
            callback: (val) => {
              const [ data ] = val || [];
              const { defaultPrecision, financialPrecision, } = data || {};
              this.currencyPrecision = defaultPrecision;
              this.financialPrecision = financialPrecision;
              this.quotationLineAllRecalculate();
              this.calcQuotationTableSummaryQuotationAmount();
            },
            onClear: (ds) => {
              const currentRecord = ds.current;
              if (!currentRecord) {
                return;
              }
              currentRecord.set("currencyCode", null);
              this.currencyPrecision = 10;
              this.financialPrecision = 10;
              this.quotationLineAllRecalculate();
              this.calcQuotationTableSummaryQuotationAmount();
            },
          },
        },
        {
          formRow: 400,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.paymentTerms").$D("付款方式"),
          fieldCode: "paymentTypeId",
          fieldType: "LOV",
          displayField: "paymentTypeName",
          options: {
            displayField: "typeName",
            subDisplayField: "typeCode",
            queryParams: {
              enabledFlag: 1,
            },
          },
          editor: (val, item) => {
            if (Number(systemVersion) === 2) {
              return true;
            }
            return item.paymentTermFlag === 1;
          },
          lovCode: "SMDM.PAYMENTTYPE",
          required: (val, item) => {
            const {
              supplierStatus,
              paymentTermFlag,
            } = item || {};
            const wholeAbandonFlag =
              supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
            if (Number(systemVersion) === 2) { // 走新模板，去掉paymentTermFlag限制
              return !wholeAbandonFlag;
            }
            return paymentTermFlag === 1 && !wholeAbandonFlag;
          },
          disabled: (val, item) => {
            const {
              supplierStatus,
              paymentTermFlag,
            } = item || {};
            const wholeAbandonFlag =
              supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
            if (Number(systemVersion) === 2) { // 走新模板，去掉paymentTermFlag限制
              return wholeAbandonFlag;
            }
            return paymentTermFlag !== 1 || wholeAbandonFlag;
          },
        },
        {
          formRow: 500,
          formCol: 1,
          fieldName: this.$T("ssrc.common.model.common.termsOfPayment").$D("付款条款"),
          fieldCode: "paymentTermId",
          fieldType: "LOV",
          displayField: "paymentTermName",
          lovCode: "SMDM.PAYMENT.TERM",
          options: {
            displayField: "termName",
            subDisplayField: "paymentTermName",
            queryParams: {
              enabledFlag: 1,
            },
          },
          editor: (val, item) => {
            if (Number(systemVersion) === 2) {
              return true;
            }
            return item.paymentTermFlag === 1;
          },
          required: (val, item) => {
            const {
              supplierStatus,
              paymentTermFlag,
            } = item || {};
            const wholeAbandonFlag =
              supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
            if (Number(systemVersion) === 2) { // 走新模板，去掉paymentTermFlag限制
              return !wholeAbandonFlag;
            }
            return paymentTermFlag === 1 && !wholeAbandonFlag;
          },
          disabled: (val, item) => {
            const {
              supplierStatus,
              paymentTermFlag,
            } = item || {};
            const wholeAbandonFlag =
              supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
            if (Number(systemVersion) === 2) { // 走新模板，去掉paymentTermFlag限制
              return wholeAbandonFlag;
            }
            return paymentTermFlag !== 1 || wholeAbandonFlag;
          },
        },
      ];
      return fields;
    },
    // 物料明细弹窗
    getQuotationDetail() {
      const doubleUnitFlag = this.doubleUnitFlag;

      const Fields = [
        {
          formRow: 10,
          formCol: 1,
          fieldCode: "itemName",
          fieldType: "TEXT",
          render: (val, item) => {
            const {
              // rfxLineItemNum,
              specs,
              secondaryUomName,
              secondaryQuantity,
              uomName,
              rfxQuantity,
              displayQuotationLineStatus,
              displayQuotationLineStatusMeaning,
            } = item || {};
            let quantity = rfxQuantity;
            let uom = uomName;
            if (doubleUnitFlag) {
              quantity = secondaryQuantity;
              uom = secondaryUomName;
            }
            const quantityAndUomCombine = quantity && uom ? `${SrmUtil.getNumberLocalized(quantity)}${uom}` : quantity || uom;
            const lineBaseInfo = `${val ?? ""}${val && quantityAndUomCombine ? `-${quantityAndUomCombine}` : ""}`;
            return <div class="ssrc-table-line-customize-header-wrapper ssrc-item-detail-customize-header-wrapper">
              <SrmListHeader>
                <div>
                  <srm-tooltip title={lineBaseInfo} placement="bottom">
                    <span class="ssrc-table-line-customize-header-titles">
                      {lineBaseInfo}
                    </span>
                  </srm-tooltip>
                </div>
                <span slot="right">
                  <span class="ssrc-table-line-status-wrap ssrc-item-detail-status-wrap">
                    <srm-tooltip title={displayQuotationLineStatusMeaning} placement="bottom">
                      <span>
                        {commonRfxStatusColor(displayQuotationLineStatus, displayQuotationLineStatusMeaning)}
                      </span>
                    </srm-tooltip>
                  </span>
                </span>
                {specs ? <div class="ssrc-table-line-header-specs-wrap">
                  <div>
                    {this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格")}
                  </div>
                  <srm-tooltip title={specs} placement="bottom">
                    <div class="ssrc-table-line-header-specs-cotent">
                      {specs}
                    </div>
                  </srm-tooltip>
                </div> : ""}
              </SrmListHeader>
            </div>;
          },
        },

        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          formRow: 200,
          formCol: 1,
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachment").$D("采购方附件"),
          fieldCode: "rfxAttachmentUuid",
          fieldType: "UPLOAD",
          showCount: true,
          readonly: true,
          formRow: 300,
          formCol: 1,
          bucketName: this.bucketName,
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        },
        {
          formRow: 400,
          formCol: 1,
          fieldName: getValidPriceName(doubleUnitFlag),
          fieldCode: "validQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 405,
          formCol: 1,
          fieldName: getValidNetPriceName(doubleUnitFlag),
          fieldCode: "validNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 410,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validLadderTaxPrice").$D("有效含税报价"),
          fieldCode: "validQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        },
        {
          formRow: 415,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validLadderTaxPrice").$D("有效报价(不含税)"),
          fieldCode: "validNetSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        },
        {
          formRow: 600,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxQuotationAmount").$D("行金额(含税)"),
          fieldCode: "currentLnTotalAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 700,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmountWithoutTax").$D("行金额(不含税)"),
          fieldCode: "currentLnNetAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
      ];

      return Fields;
    },
    // 报价行表格
    getQuotationLineColumns() {
      const doubleUnitFlag = this.doubleUnitFlag;

      const {
        existBargainedFlag,
        supplierStatus,
        quotationScope,
        systemVersion, // systemVersion代表此单子走的新模板
      } = this.headInfo || {};

      const cuxFields = this.cuxQuotationLineFields;

      const columns = [
        {
          formRow: 10,
          formCol: 1,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => {
            const {
              // rfxLineItemNum,
              specs,
              secondaryUomName,
              secondaryQuantity,
              uomName,
              rfxQuantity,
              displayQuotationLineStatus,
              displayQuotationLineStatusMeaning,
              abandonedFlag,
              eliminateRoundNumber,
            } = item || {};
            let quantity = rfxQuantity;
            let uom = uomName;
            if (doubleUnitFlag) {
              quantity = secondaryQuantity;
              uom = secondaryUomName;
            }
            const abandonDisableFlag = this.abandonDisabled(item);
            const partQuotationFlag = quotationScope === "PART_QUOTATION";
            const wholeAbandonFlag = supplierStatus === "QUOTATION_ABANDONED" || supplierStatus === "ABANDONED"; // 报价-整单放弃标识
            const abandonVisibleFlag = !wholeAbandonFlag && partQuotationFlag && !abandonDisableFlag;
            const quantityAndUomCombine = quantity && uom ? `${SrmUtil.getNumberLocalized(quantity)}${uom}` : quantity || uom;
            const lineBaseInfo = `${val ?? ""}${val && quantityAndUomCombine ? `-${quantityAndUomCombine}` : ""}`;
            // 单据发起了议价，当前行未发起议价
            // 置灰显示用
            const currentLineUnBargainFlag = this.currentLineNotStartBargain(item);
            const disabledInfoFlag = currentLineUnBargainFlag || abandonedFlag === 1 || Boolean(eliminateRoundNumber);
            return <div class="ssrc-table-line-customize-header-wrapper">
              <SrmListHeader>
                <div onClick={(e) => e.stopPropagation()}>
                  <srm-tooltip title={lineBaseInfo} placement="bottom">
                    <span class={disabledInfoFlag ? "ssrc-table-line-customize-header-titles table-line-not-start-bargain-disabled-color" : "ssrc-table-line-customize-header-titles"}>
                      {lineBaseInfo}
                    </span>
                  </srm-tooltip>
                </div>
                <span slot="right">
                  <span class="ssrc-table-line-status-wrap">
                    <srm-tooltip title={displayQuotationLineStatusMeaning} placement="bottom">
                      <span>
                        {commonRfxStatusColor(displayQuotationLineStatus, displayQuotationLineStatusMeaning)}
                      </span>
                    </srm-tooltip>
                    {abandonVisibleFlag ? <span class="ssrc-table-line-abandon-icon">
                      {!abandonedFlag ? <img src={minus} alt="icon" on-click={(e) => this.currentLineAbandon(e, item)} /> : <img src={plus} alt="icon" on-click={(e) => this.currentLineCancelAbandon(e, item)} /> }
                    </span> : ""}
                  </span>
                </span>
                {specs ? <div class={disabledInfoFlag ? "ssrc-table-line-header-specs-wrap table-line-not-start-bargain-disabled-color" : "ssrc-table-line-header-specs-wrap"}>
                  <div>
                    {this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格")}
                  </div>
                  <srm-tooltip title={specs} placement="bottom">
                    <div
                      class={disabledInfoFlag ? "ssrc-table-line-header-specs-cotent table-line-not-start-bargain-disabled-color" : "ssrc-table-line-header-specs-cotent"}
                      onClick={(e) => e.stopPropagation() } >
                      {specs}
                    </div>
                  </srm-tooltip>
                </div> : ""}
              </SrmListHeader>
            </div>;
          },
        },

        {
          formRow: 100,
          formCol: 1,
          visible: !isNil(existBargainedFlag),
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validBargainPrice").$D("还价-单价"),
          fieldCode: "validBargainPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          disabled: true,
        },
        {
          formRow: 100,
          formCol: 2,
          visible: !isNil(existBargainedFlag),
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.counterOfferReason").$D("还价理由"),
          fieldCode: "validBargainRemark",
          fieldType: "TEXT",
          editor: false,
          disabled: true,
        },

        {
          formRow: 190,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxPrice").$D("单价(含税)"),
          fieldCode: "currentQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: doubleUnitFlag,
          visible: doubleUnitFlag,
          editLimit: true,
          precision: () =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                this.headInfo?.currencyCode,
                "defaultPrecision"
              )
            ),
          required: (val, item) => {
            const { priceTypeCode, quotationStatus, quotationChange, } = this.headInfo || {};
            const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
            const { ladderQuotationFlag } = item || {};
            const RequiredFlag = this.commonRequired(item);
            const Result =
              !isUnTaxPriceFlag &&
              RequiredFlag &&
              !(quotationStatus !== "NEW" && quotationChange === "ORDER") &&
              ladderQuotationFlag !== 1; // 当前价格是否在阶梯报价区间内
            return doubleUnitFlag && Boolean(Result);
          },
          disabled: (val, item) => {
            const { priceTypeCode, quotationStatus, quotationChange, } = this.headInfo || {};
            const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
            const { ladderQuotationFlag } = item || {};
            const DisabledFlag = this.commonDisabled(item);
            const Result =
              DisabledFlag ||
              isUnTaxPriceFlag ||
              quotationStatus !== "NEW" && quotationChange === "ORDER" ||
              ladderQuotationFlag === 1; // 当前价格是否在阶梯报价区间内
            return !doubleUnitFlag || Boolean(Result);
          },
          inputChange: (val, item, field, record) => {
            this.changeQuotationPrice(val, item, field, record);
          },
        },
        {
          formRow: 190,
          formCol: 2,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.netPrice").$D("未税单价"),
          fieldCode: "netSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: doubleUnitFlag,
          visible: doubleUnitFlag,
          editLimit: true,
          precision: () =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                this.headInfo?.currencyCode,
                "defaultPrecision"
              )
            ),
          required: (val, item) => {
            const { priceTypeCode, quotationStatus, quotationChange, } = this.headInfo || {};
            const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
            const { ladderQuotationFlag } = item || {};
            const RequiredFlag = this.commonRequired(item);
            const Result =
              RequiredFlag &&
              isUnTaxPriceFlag &&
              !(quotationStatus !== "NEW" && quotationChange === "ORDER") &&
              ladderQuotationFlag !== 1;
            return doubleUnitFlag && Result;
          },
          disabled: (val, item) => {
            const { priceTypeCode, quotationStatus, quotationChange, } = this.headInfo || {};
            const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
            const { ladderQuotationFlag } = item || {};
            const DisabledFlag = this.commonDisabled(item);
            const Result =
              DisabledFlag ||
              !isUnTaxPriceFlag ||
              quotationStatus !== "NEW" && quotationChange === "ORDER" ||
              ladderQuotationFlag === 1;
            return !doubleUnitFlag || Boolean(Result);
          },
          inputChange: (val, item, field, record) => {
            this.changeQuotataionNetPrice(val, item, field, record);
          },
        },
        {
          formRow: 200,
          formCol: 1,
          fieldName: getPriceName(doubleUnitFlag),
          fieldCode: "currentQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: !doubleUnitFlag,
          editLimit: true,
          precision: () =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                this.headInfo?.currencyCode,
                "defaultPrecision"
              )
            ),
          required: (val, item) => {
            const { priceTypeCode, quotationStatus, quotationChange, } = this.headInfo || {};
            const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
            const { ladderQuotationFlag } = item || {};
            const RequiredFlag = this.commonRequired(item);
            const Result =
              !isUnTaxPriceFlag &&
              RequiredFlag &&
              !(quotationStatus !== "NEW" && quotationChange === "ORDER") &&
              ladderQuotationFlag !== 1; // 当前价格是否在阶梯报价区间内
            return !this.doubleUnitFlag && Boolean(Result);
          },
          disabled: (val, item) => {
            const { priceTypeCode, quotationStatus, quotationChange, } = this.headInfo || {};
            const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
            const { ladderQuotationFlag } = item || {};
            const DisabledFlag = this.commonDisabled(item);
            const Result =
              DisabledFlag ||
              isUnTaxPriceFlag ||
              quotationStatus !== "NEW" && quotationChange === "ORDER" ||
              ladderQuotationFlag === 1; // 当前价格是否在阶梯报价区间内
            return this.doubleUnitFlag || Boolean(Result);
          },
          inputChange: (val, item, field, record) => {
            this.changeQuotationPrice(val, item, field, record);
          },
        },
        {
          formRow: 200,
          formCol: 2,
          fieldName: getNetPriceName(doubleUnitFlag),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          editor: !doubleUnitFlag,
          editLimit: true,
          precision: () =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                this.headInfo?.currencyCode,
                "defaultPrecision"
              )
            ),
          required: (val, item) => {
            const { priceTypeCode, quotationStatus, quotationChange, } = this.headInfo || {};
            const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
            const { ladderQuotationFlag } = item || {};
            const RequiredFlag = this.commonRequired(item);
            const Result =
              RequiredFlag &&
              isUnTaxPriceFlag &&
              !(quotationStatus !== "NEW" && quotationChange === "ORDER") &&
              ladderQuotationFlag !== 1;
            return !this.doubleUnitFlag && Result;
          },
          disabled: (val, item) => {
            const { priceTypeCode, quotationStatus, quotationChange, } = this.headInfo || {};
            const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
            const { ladderQuotationFlag } = item || {};
            const DisabledFlag = this.commonDisabled(item);
            const Result =
              DisabledFlag ||
              !isUnTaxPriceFlag ||
              quotationStatus !== "NEW" && quotationChange === "ORDER" ||
              ladderQuotationFlag === 1;
            return this.doubleUnitFlag || Boolean(Result);
          },
          inputChange: (val, item, field, record) => {
            this.changeQuotataionNetPrice(val, item, field, record);
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率"),
          fieldCode: "taxId",
          formRow: 400,
          formCol: 1,
          // fieldType: "LOV",
          // displayField: "taxRate",
          // lovCode: "SMDM.TAX",
          options: {
            // displayField: "taxRate",
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
          // required: (val, item) => {
          //   const {
          //     taxChangeFlag,
          //   } = item || {};
          //   const RequiredFlag = this.commonRequired(item);
          //   const result = RequiredFlag && taxChangeFlag === 1;
          //   return result;
          // },
          disabled: (val, item) => {
            const {
              taxChangeFlag,
            } = item || {};
            const DisabledFlag = this.commonDisabled(item);
            const result = DisabledFlag || taxChangeFlag === 0;
            if (Number(systemVersion) === 2) { // 走新模板，去掉taxChangeFlag限制
              return DisabledFlag;
            }
            return Boolean(result);
          },
        },
        {
          formRow: 400,
          formCol: 2,
          fieldCode: "currentQuotationQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName: getAvailableQtyName(doubleUnitFlag),
          editLimit: true,
          editor: !doubleUnitFlag,
          precision: (val, item) =>
            Number(
              item?.uomPrecision,
            ),
          required: (val, item) => {
            const {
              quantityChangeFlag,
            } = item || {};
            const RequiredFlag = this.commonRequired(item);
            const Result = quantityChangeFlag === 1 && RequiredFlag;
            if (Number(systemVersion) === 2) { // 走新模板，去掉quantityChangeFlag限制
              return !this.doubleUnitFlag && RequiredFlag;
            }
            return !this.doubleUnitFlag && Result;
          },
          disabled: (val, item) => {
            const {
              quantityChangeFlag,
            } = item || {};
            const DisabledFlag = this.commonDisabled(item);
            const Result = !quantityChangeFlag || DisabledFlag;
            if (Number(systemVersion) === 2) { // 走新模板，去掉quantityChangeFlag限制
              return this.doubleUnitFlag || Boolean(DisabledFlag);
            }
            return this.doubleUnitFlag || Boolean(Result);
          },
          inputChange: (val, item, field, record) => {
            if (!item || SrmMath.equals(val, item?.previewCurrentQuotationQuantityValue)) {
              return;
            }
            this.dynamicChangeLinePrice(record);
            item.updatedFlag = 1;
            item.previewCurrentQuotationQuantityValue = val;
            this.calcQuotationTableSummaryQuotationAmount();
          },
        },
        {
          formRow: 401,
          formCol: 1,
          fieldCode: "currentQuotationSecQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validQuotationQuantity").$D("可供数量"),
          editLimit: true,
          editor: doubleUnitFlag,
          visible: doubleUnitFlag,
          precision: (val, item) =>
            Number(
              item?.uomPrecision,
            ),
          required: (val, item) => {
            const {
              quantityChangeFlag,
            } = item || {};
            const RequiredFlag = this.commonRequired(item);
            const Result = quantityChangeFlag === 1 && RequiredFlag;
            if (Number(systemVersion) === 2) { // 走新模板，去掉quantityChangeFlag限制
              return this.doubleUnitFlag && RequiredFlag;
            }
            return this.doubleUnitFlag && Result;
          },
          disabled: (val, item) => {
            const {
              quantityChangeFlag,
            } = item || {};
            const DisabledFlag = this.commonDisabled(item);
            const Result = !quantityChangeFlag || DisabledFlag;
            if (Number(systemVersion) === 2) { // 走新模板，去掉quantityChangeFlag限制
              return !this.doubleUnitFlag || Boolean(DisabledFlag);
            }
            return !this.doubleUnitFlag || Boolean(Result);
          },
          inputChange: (val, item, field, record) => {
            if (!item || SrmMath.equals(val, item?.previewCurrentQuotationSecQuantityValue)) {
              return;
            }
            this.handleChangeQuotationQuantity({ val, item, record });
            this.dynamicChangeLinePrice(record);
            item.updatedFlag = 1;
            item.previewCurrentQuotationSecQuantityValue = val;
            this.calcQuotationTableSummaryQuotationAmount();
          },
        },
        ...cuxFields,
      ];
      return columns.filter(Boolean);
    },
    // supplier attachment
    getAttachmentForm() {
      return [
        {
          fieldCode: "businessAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 100,
          bucketName: "private-bucket",
          bucketDirectory: "ssrc-rfx-quotationheader",
          disabled: false,
        },
        {
          fieldCode: "techAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 200,
          bucketName: "private-bucket",
          bucketDirectory: "ssrc-rfx-quotationheader",
          disabled: false,
        },
      ];
    },
  },
  mounted() {
    const { quotationHeaderId, pageType } = this.$route.query || {};
    if (quotationHeaderId) {
      const storeField = !this.bidFlag ? "quotationNewPageQuotationHeaderId" : "biddingNewPageQuotationHeaderId";
      storage.setItem(storeField, quotationHeaderId);
    }
    this.pageType = pageType;
    this.queryHeaderAndLine();
    this.intiConfigs();

    this.getCuxFields();
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
    async getCuxFields() {
      let cuxFields = [];
      if (this.over$getCuxFieldsWithNewSupplierQuotation && typeof this.over$getCuxFieldsWithNewSupplierQuotation === "function") {
        cuxFields = await this.over$getCuxFieldsWithNewSupplierQuotation(1, 1, 1, 2) || [];
        this.cuxQuotationLineFields = cuxFields;
      }
    },
    reachBottom() {
      if (!this.tableLineDataSet) {
        return;
      }

      this.tableLineDataSet.loadMore();
    },
    intiConfigs() {
      this.queryDoubleUnit();
    },
    // query page header and line
    queryHeaderAndLine() {
      const { quotationHeaderId, } = this.$route.query;
      this.getHeadInfo({ quotationHeaderId, sourceMobileEndFlag: 1, });
      this.tableLineDataSet.addPathParameter("quotationHeaderId", quotationHeaderId);
      this.tableLineDataSet.addPathParameter("customizeUnitCode", this.getCustomizeUnitCode([ "table", "item" ]));
      this.tableLineDataSet.addPathParameter("sourceMobileEndFlag", 1);
      // this.tableLineDataSet.reset();
      this.tableLineDataSet.refresh();
    },
    getCustomizeUnitCode(type) {
      if (!type || isEmpty(type)) {
        return null;
      }

      const RfxCodeMap = new Map([
        [ "base", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.QUOTATION_BASE_FORM_INFO" ], // 基础信息
        [ "table", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.QUOTATION_LINE" ], // 报价行表格
        [ "item", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.QUOTATION_ITEM_LINE_DETAIL" ], // 物料明细,
        [ "attachment", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.QUOTATION_ATTACHMENT" ], // 附件
      ]);

      const BidCodeMap = new Map([
        [ "base", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUOTATION_BASE_FORM_INFO" ], // 基础信息
        [ "table", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUOTATION_LINE" ], // 报价行表格
        [ "item", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUOTATION_ITEM_LINE_DETAIL" ],
        [ "attachment", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUOTATION_ATTACHMENT" ],
      ]);

      const CodeDataMap = !this.bidFlag ? RfxCodeMap : BidCodeMap;
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
    // 双单位
    queryDoubleUnit() {
      queryEnableDoubleUnit({
        businessModule: "RFX",
        tenantId: SrmUtil.getTenantId(),
      }).then((res) => {
        if (res === 1 || res === "1" || res === true) {
          this.doubleUnitFlag = true;
        }
      });
    },
    async queryCalcType() {
      if (this.caclRule) {
        return;
      }
      const { tenantId, } = this.headInfo || {};
      const result = await amountCalcType({
        purTenantId: tenantId,
        organizationId: SrmUtil.getOrganizationId(),
        supplierFlag: 1,
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
        rfxBusinessAttachmentUuid,
        rfxTechAttachmentUuid,
      } = item || {};

      return [
        {
          title: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件"),
          attachmentUuid: rfxBusinessAttachmentUuid,
          readOnly: true,
        },
        {
          title: $T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件"),
          attachmentUuid: rfxTechAttachmentUuid,
          readOnly: true,
        },
      ];
    },
    //获取询价单头信息
    async getHeadInfo(data = {}) {
      const params = {
        customizeUnitCode: this.getCustomizeUnitCode([ "base", "attachment" ]),
        ...data,
        organizationId: this.organizationId,
      };

      this.$loading.show();
      const res = await fetchQuotationHeader(params);
      this.$loading.hide();
      if (res && !res.failed) {
        const headerData = res || {};
        const { currentQuotationRound, bargainStatus } = headerData;
        // 多轮报价
        if (currentQuotationRound > 1 && bargainStatus !== "BARGAINING_ONLINE") {
          this.footerWrapClass += " ssrc-quotation-add-round-footer";
        }

        this.headInfo = headerData;
        this.headerFormDS.create(headerData, 0);
        this.queryCalcType();
        this.fetchCurrentPrecision(headerData);
      }
    },
    // get page all data
    getCurrentPageSubmitData() {
      let validationFlag = false;
      let formData = null;
      let tableData = [];
      let headerValidateFlag = false;
      let quotaitonLineValidateFlag = true;

      headerValidateFlag = this.headerFormDS.validate();

      this.tableLineDataSet.records?.forEach((record = {}) => {
        if (!record) {
          return;
        }

        const skipValidate = record.get("abandonedFlag") === 1;
        if (!skipValidate) {
          const currentLineValidateFlag = record.validate();

          if (!currentLineValidateFlag) {
            quotaitonLineValidateFlag = false;
          }
        }

        if (record.dirty) {
          record.set("updatedFlag", 1);
        }
      });

      validationFlag = headerValidateFlag && quotaitonLineValidateFlag;
      formData = this.headerFormDS?.current?.toData();
      tableData = this.tableLineDataSet.toData();

      const quotationHeaderIdList = [ formData?.quotationHeaderId ];

      const { quotationHeaderId, tenantId, } = formData || {};
      if (!quotationHeaderId) {
        return;
      }

      return {
        organizationId: SrmUtil.getOrganizationId(),
        validationFlag,
        tenantId,
        quotationHeaderId,
        rfxQuotationHeaderCurDTO: formData,
        rfxQuotationLineCurDTOList: tableData,
        quotationHeaderIdList,
        query: {
          customizeUnitCode: this.getCustomizeUnitCode([ "base", "table", "attachment" ]),
        },
        sourceMobileEndFlag: 1,
      };
    },
    getAbandonFormFields() {
      return [
        {
          formRow: 10,
          fieldCode: "abandonRemark",
          fieldType: "EMPTY",
          render: (val) => {
            const record = this.abandonFormDs.current;
            return (
              <div style={{ width: "96vw", height: "26vh" }}>
                <div>
                  <SrmTextarea
                    value={val}
                    bordered={false}
                    editButton={false}
                    clearButton={false}
                    editor={true}
                    height={300}
                    placeholder={$T("ssrc.supplierQuotation.view.title.pleaseInputgiveUpReason").$D("请输入放弃理由")}
                    // autoSize={{ minRows: 2, maxRows: 8 }}
                    onInputChange={(value) => {
                      if (record) {
                        record.set("abandonRemark", value);
                      }
                    }}
                  />
                </div>
              </div>
            );
          },
        },
      ];
    },
    // whole abandon
    handleWholeAbandon(otherProps = {}) {
      if (!this.headInfo?.quotationHeaderId) {
        return;
      }

      this.abandonFormDs.create({}, 0);

      this.abandonModalRef = this.$popup({
        title: !this.bidFlag ? this.$T("ssrc.common.view.title.abandonQuotaiton").$D("放弃报价") : this.$T("ssrc.common.view.title.abandonBidding").$D("放弃投标"),
        headerAlign: "center",
        height: "60%",
        showHeader: true,
        showClose: true,
        rounded: true,
        onClose: () => {
          this.abandonFormDs.reset();
        },
        content:
          <div class="ssrc-apply-detail-validation-form">
            <div class="ssrc-participate-validation-modal-content-wrap">
              <srm-form theme="fill" dataSet={this.abandonFormDs} columns={this.getAbandonFormFields()} />
            </div>
            <div class="ssrc-apply-button-list-wrap">
              <srm-button fill={false} style="border-radius: 24px; height: 48px; width: 40%; margin-right: 12px;"
                on-click={() => {
                  this.closeAbandonModal();
                }}
              >
                { this.$T("hzero.common.button.close").$D("关闭") }
              </srm-button>
              <srm-button fill style="border-radius: 24px; height: 48px; width: 40%;" on-click={() => this.handleAbandon(otherProps)}>
                { this.$T("hzero.common.button.confirm").$D("确认") }
              </srm-button>
            </div>
          </div>
        ,
      });
    },
    // 放弃
    async handleAbandon(otherProps = {}) {
      const { from, submitData } = otherProps || {};
      const {
        rfxHeaderId,
        quotationHeaderId,
      } = this.headInfo || {};
      const validationFlag = await this.abandonFormDs.validate();

      if (!validationFlag || !quotationHeaderId) {
        this.$notification.open({
          duration: 1000,
          message: this.$T("ssrc.common.view.title.pleaseInputCorrectContent").$D("请输入正确内容"),
        });
        return false;
      }

      const formData = this.abandonFormDs.toData();
      const currentFormData = formData?.[0];

      if (isEmpty(currentFormData)) {
        return false;
      }

      const abandonedData = {
        ...submitData || {},
        ...currentFormData,
        rfxQuotationWholeAbandonDTOS: [
          {
            rfxHeaderId,
            quotationHeaderId,
          },
        ],
        from, // 标识整单放弃的途径
      };

      const newData = {
        organizationId: this.organizationId,
        data: abandonedData,
        query: {
          customizeUnitCode: this.getCustomizeUnitCode([ "base", "table", "attachment" ]),
        },
      };

      this.closeAbandonModal();

      if (from === "SUBMIT_WARNING_ALL_LINES_ABANDONED") {
        const SubmitOptions = { outSubmitPassFlag: 1, from };
        this.submitQuotation(abandonedData, SubmitOptions);
        this.closeAbandonModal();
        return;
      }

      let result = await this.abandonQuotation(newData);
      await this.handleValidationResult({
        result,
        afterSuccessSubmit: () => {
          this.delayDirectionList("onGoing");
        },
        wanringCancel: () => {
          this.closeAbandonModal();
        },
        // headerId: quotationHeaderId,
      });
    },
    // 关闭放弃弹窗
    closeAbandonModal() {
      if (this.abandonModalRef) {
        this.abandonModalRef.closePopup();
      }
    },
    // 关闭验证弹窗
    closeValidationModal() {
      if (this.validationModalRef) {
        this.validationModalRef.closePopup();
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
        // validationStageFlag = 0, // 校验阶段标识
      } = allData || {};
      const currentPagequotationHeaderId = this.headInfo?.quotationHeaderId;

      if (isEmpty(result) || !currentPagequotationHeaderId) {
        return;
      }

      const resultErrorFlag = result && result.failed;
      if (resultErrorFlag) {
        this.$notification.open({
          message: result.message,
          description: "",
          class: "notification"
        });
        return;
      }

      const { validateResults = [], rfxQuotationHeaderCurDTOS = [] } = result;

      if (isEmpty(validateResults)) {
        const currentHeader = (rfxQuotationHeaderCurDTOS || []).find(
          (resultLine) => resultLine.quotationHeaderId === currentPagequotationHeaderId
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
          modalTitle = this.$T("ssrc.common.view.title.errorInfo").$D("'提交失败，以下内容验证不通过");
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
                }}>
                  { this.$T("hzero.common.button.confirm").$D("确认") }
                </srm-button>}
              </div>
            </div>
          ,
        });
      }
    },
    // save
    async saveQuotation() {
      if (this.doubleQuantityCalculating) {
        return;
      }

      const data = await this.getCurrentPageSubmitData();

      if (!data) {
        return;
      }

      let result = null;
      try {
        this.$loading.show();
        result = await saveQuotationNew(data);
        this.$loading.hide();
        if (result.failed) {
          this.$notification.open({
            message: result.message,
            description: "",
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          this.queryHeaderAndLine();
        }
      } finally {
        this.$loading.hide();
      }
    },
    // submit
    async submitQuotation(outData = {}, otherOptions = {}) {
      const { outSubmitPassFlag = null } = otherOptions || {};

      if (this.doubleQuantityCalculating) {
        return;
      }

      const { validationFlag = false, ...data } =
        await this.getCurrentPageSubmitData() || {};

      if (!validationFlag) {
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

      const passFlag = outSubmitPassFlag ?? 0;
      const newData = {
        ...data,
        ...outData || {},
        passFlag,
      };

      // 二次提交确认
      const confirmSubmit = async (submitOutterData = {}) => {
        let result = null;
        const submitInnerData = { passFlag: 1 }; // 通过passFlag确定是校验还是提交
        const submitData = { ...data, ...submitInnerData, ...submitOutterData };
        result = await this.handleQuotationSubmit(submitData);

        if (result && result.failed) {
          this.notificationError(result);
          return;
        }

        this.handleValidationResult({
          result,
          submitData,
          validationStageFlag: 0,
          afterSuccessSubmit: (res) => {
            this.successSubmit(res, otherOptions);
          },
        });
      };

      let result = await this.handleQuotationSubmit(newData);
      this.handleValidationResult({
        result,
        submitData: newData,
        validationStageFlag: 1,
        confirmSubmit: (newSubmitData) => confirmSubmit(newSubmitData),
        afterSuccessSubmit: (res) => {
          this.successSubmit(res, otherOptions);
        },
        overrideSubmitWarninOkOperate: this.overrideSubmitWarninOkOperate,
      });
    },
    // 提交处理特定错误，处理整单放弃逻辑
    overrideSubmitWarninOkOperate(validateResults, options) {
      const { submitData } = options || {};
      let continueWarningFlag = 1;
      if (isEmpty(validateResults)) {
        return continueWarningFlag;
      }

      const wholeAbandonMessage = validateResults.filter(
        (item) => item?.code === "error.rfx_quotation_whole_submit_warning_info"
      );
      if (!isEmpty(wholeAbandonMessage)) {
        if (validateResults?.length === 1) {
          continueWarningFlag = 0;
        }

        this.handleWholeAbandon({
          from: "SUBMIT_WARNING_ALL_LINES_ABANDONED",
          passFlag: 1,
          submitData,
        });
      }

      return continueWarningFlag;
    },
    // submit api
    async handleQuotationSubmit(data) {
      let result = null;
      try {
        this.$loading.show();
        result = await submitQuotationNew(data);
        this.$loading.hide();
        if (result && result.failed) {
          result = false;
          return result;
        }
      } finally {
        this.$loading.hide();
      }

      return result;
    },
    //整单放弃api
    async abandonQuotation(data) {
      let result = null;
      try {
        this.$loading.show();
        result = await quotationWholeAbandon(data);
        this.$loading.hide();
        if (result && result.failed) {
          result = false;
          return result;
        }
      } finally {
        this.$loading.hide();
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
    delayDirectionList(listPageDefaultTabName) {
      this.timer = setTimeout(() => {
        this.directionList(listPageDefaultTabName);
      }, 350);
    },
    // 跳转列表
    directionList(listPageDefaultTabName = null) {
      let nextPageName = "ListApply";
      if (this.bidFlag) {
        nextPageName = "ListBidding";
      }

      const listParams = {};
      if (listPageDefaultTabName) {
        listParams.tabName = listPageDefaultTabName; // 跳转到列表，默认进行中tab
      }

      this.$router.push({
        name: nextPageName,
        params: listParams, // 使用param是希望跳出去默认tab只生效一次
      });
    },
    // 报价成功后
    successSubmit(_, otherOptions) {
      const { sourceCategory, } = this.headInfo || {};
      const { from } = otherOptions || {};

      if (sourceCategory === "RFA") {
        this.queryHeaderAndLine();

        if (from === "SUBMIT_WARNING_ALL_LINES_ABANDONED") {
          this.directionList("onGoing");
        }
        return;
      }

      this.directionList("onGoing");
    },
    // table line common required calculate
    commonRequired(record) {
      const {
        abandonedFlag,
        bargainFlag,
        eliminateFlag,
        displayQuotationLineStatus,
        bargainStatus,
        continuousQuotationFlag,
        headerBargainFlag,
        currentDateTime,
        rfxHeaderQuotationEndDate,
      } = record || {};

      const statusResult =
        displayQuotationLineStatus !== "NOT_START" &&
        displayQuotationLineStatus !== "ABANDONED" &&
        displayQuotationLineStatus !== "FINISHED";
      const continueResult =
        continuousQuotationFlag ||
        !continuousQuotationFlag && displayQuotationLineStatus !== "SUBMITTED";
      const bargainResult =
        headerBargainFlag === 1 &&
        bargainStatus === "BARGAINING_ONLINE" &&
        currentDateTime < rfxHeaderQuotationEndDate &&
        bargainFlag !== 1;

      const baseResult =
        !abandonedFlag && !eliminateFlag && statusResult && continueResult && !bargainResult;

      // if (bargainFlag === 1) {
      //   // 还价
      //   return baseResult;
      // }

      return baseResult;
    },
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
    abandonDisabled(record) {
      const {
        quotationScope,
        quotationLineStatus,
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

      const Result =
        statusResult ||
        continueResult ||
        quotationScope === "ALL_QUOTATION" ||
        eliminateFlag ||
        quotationLineStatus === "ABANDONED" ||
        bargainResult;

      return Result;
    },
    // 当前行 放弃 清空字段值
    quotaitonLineAbandonClearFieldsValue(item) {
      if (!item) {
        return;
      }

      item.netPrice = null;
      item.netSecondaryPrice = null;
      // item.brand = null;
      // item.origin = null;
      // item.biUomId = null;
      // item.uomConversionRate = null;
      // item.minPackageQuantitytPrice = null;
      // item.minPurchaseQuantity = null;
      // item.currentPromisedDate = null;
      // item.currentExpiryDateTo = null;
      // item.currentDeliveryCycle = null;
      item.currentQuotationPrice = null;
      item.currentQuotationSecPrice = null;
      // item.currentExpiryDateFrom = null;
      // item.currentQuotationRemark = null;
      // item.currentAttachmentUuid = null;
      // item.quotationStartDate = null;
      // item.quotationEndDate = null;
      item.currentLnTotalAmount = null;
      item.currentLnNetAmount = null;
      item.abandonedFlag = 1;
      item.updatedFlag = 1;
      // item.currentQuotationSecQuantity = null;
      // item.currentQuotationQuantity = null;
    },
    // 当前行点击放弃
    currentLineAbandon(e, item) {
      if (!item) {
        return;
      }

      e.stopPropagation();

      this.$dialog({
        content: <div class="ssrc-abaondon-line-dialog-warning-text">
          { $T("ssrc.inquiryHall.model.inquiryHall.areYouSureAbandonCurrentLItemsQuotation").$D("您确定要放弃该行物料吗?") }
        </div>,
        onOk: () => {
          this.quotaitonLineAbandonClearFieldsValue(item);
        },
        onCancel: () => {}
      });
    },
    // 当前行取消放弃
    currentLineCancelAbandon(e, item) {
      if (!item) {
        return;
      }
      e.stopPropagation();

      item.abandonedFlag = 0;
      item.updatedFlag = 1;
    },
    // 报价明细
    viewQuotationDetail(item) {
      const { data } = item;
      this.quotationDetailVisible = true;
      this.quotaitonDetailDataSource = data || {};
    },
    itemDetailTableClosePopup() {
      this.quotationDetailVisible = false;
      this.quotaitonDetailDataSource = {};
    },
    async handleChangeQuotationQuantity({ val, item, record }) {
      const {
        itemId,
        secondaryUomId,
        currentQuotationSecQuantity,
        uomId,
        rfxLineItemId,
        tenantId,
      } = item || {};

      if (itemId && this.doubleUnitFlag) {
        if (secondaryUomId && val) {
          this.doubleQuantityCalculating = true;
          const res = await calculateBasicQty({
            secondaryQuantity: currentQuotationSecQuantity,
            itemId,
            businessKey: rfxLineItemId || record.id,
            doublePrimaryUomId: uomId,
            secondaryUomId,
            tenantId,
          });
          record.set("currentQuotationQuantity", res ?? "");
          this.doubleQuantityCalculating = false;
        } else if (val === 0) {
          record.set("currentQuotationQuantity", 0);
        }
      } else {
        record.set("currentQuotationQuantity", val);
      }
    },
    changeQuotataionNetPrice(val, item, field, record) {
      if (!item || SrmMath.equals(val, item?.previewNetPriceValue)) {
        return;
      }
      const { priceTypeCode, } = this.headInfo || {};
      const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
      item.updatedFlag = 1;
      item.previewNetPriceValue = val;
      if (isUnTaxPriceFlag) {
        this.dynamicChangeLinePrice(record);
        this.calcQuotationTableSummaryQuotationLine();
        this.calcQuotationTableSummaryQuotationAmount();
      }
    },
    changeQuotationPrice(val, item, field, record) {
      if (!item || SrmMath.equals(val, item?.previewCurrentQuotationPriceValue)) {
        return;
      }
      const { priceTypeCode, } = this.headInfo || {};
      const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
      item.updatedFlag = 1;
      item.previewCurrentQuotationPriceValue = val;
      if (!isUnTaxPriceFlag) {
        this.dynamicChangeLinePrice(record);
        this.calcQuotationTableSummaryQuotationLine();
        this.calcQuotationTableSummaryQuotationAmount();
      }
    },
    getUnitPriceFieldName() {
      const { priceTypeCode } = this.headInfo || {};
      const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
      let linePriceField = "currentQuotationPrice";

      if (!this.doubleUnitFlag) {
        if (isUnTaxPriceFlag) {
          linePriceField = "netPrice";
        }
      }

      if (this.doubleUnitFlag) {
        linePriceField = "currentQuotationSecPrice";

        if (isUnTaxPriceFlag) {
          linePriceField = "netSecondaryPrice";
        }
      }

      return linePriceField;
    },
    // 金额字段
    getAmountFieldsName() {
      const { priceTypeCode } = this.headInfo || {};
      const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";

      let lineAmountField = "currentLnTotalAmount";
      let currentShowTotalAmountField = "quotationCurrentTotalAmountValue";
      let queryQuotationCurrentTotalAmountField = "quotationCurrentTotalAmount"; // 查询的当前金额

      if (isUnTaxPriceFlag) {
        lineAmountField = "currentLnNetAmount";
        queryQuotationCurrentTotalAmountField = "quotationCurrentNetAmount";
        currentShowTotalAmountField = "quotationCurrentNetAmountValue";
      }

      return {
        lineAmountField,
        currentShowTotalAmountField,
        queryQuotationCurrentTotalAmountField,
      };
    },
    // 计算报价行数
    calcQuotationTableSummaryQuotationLine() {
      const {
        quotationScope,
        currentQuotationTotalCount: originCount,
      } = this.headInfo || {};
      const partQuotationFlag = quotationScope === "PART_QUOTATION";
      if (!partQuotationFlag || !quotationScope) {
        return;
      }

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

      Object.keys(values).forEach((key) => {
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
        taxRateType,
      } =
        this.getFieldsValueFromRecord([
          "taxRate",
          "currentQuotationQuantity",
          "currentQuotationSecQuantity",
          "priceBatchQuantity",
          "taxRateType",
        ], record) || {};

      // const pristineTaxRate = record.getPristineValue('taxRate');
      const COMMONS = {
        hasTax: !isUnTaxPriceFlag,
        hasMount: true,
        financialPrecision: currentFinancialPrecision,
        defaultPrecision: currentCurrencyPrecision,
        caclRule: this.caclRule,
        each: priceBatchQuantity,
        taxRateType,
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
    // 改变含税后，计算价格
    handleChangeQuotationPrice(record) {
      if (!record) {
        return;
      }

      let currentQuotationPrice = record.get("currentQuotationPrice");
      if (this.doubleUnitFlag) {
        currentQuotationPrice = record.get("currentQuotationSecPrice");
      }

      const CurrentPriceCOMMONS = {};
      CurrentPriceCOMMONS.taxUnitPrice = currentQuotationPrice;
      const CommonProps = this.changePriceGetCommonProps(record) || {};
      const COMMONS = { ...CommonProps, ...CurrentPriceCOMMONS };
      const { calcNetUnitPrice, calcTaxAmount, calcNetAmount } = this.$options.filters["amountCalculation"](COMMONS) || {};

      const priceValueObject = {
        netPrice: calcNetUnitPrice,
        currentLnTotalAmount: calcTaxAmount,
        currentLnNetAmount: calcNetAmount,
      };

      if (this.doubleUnitFlag) {
        priceValueObject.netSecondaryPrice = calcNetUnitPrice;
      }

      this.updateFieldFieldsValueFromRecord(priceValueObject, record);
    },
    // 改变未税含税后，计算价格
    handleChangeNetPrice(record) {
      if (!record) {
        return;
      }

      let netPrice = record.get("netPrice");
      if (this.doubleUnitFlag) {
        netPrice = record.get("netSecondaryPrice");
      }

      const CurrentPriceCOMMONS = {};
      const CommonProps = this.changePriceGetCommonProps(record) || {};
      const COMMONS = { ...CommonProps, ...CurrentPriceCOMMONS };
      COMMONS.netUnitPrice = netPrice;
      const { calcTaxUnitPrice, calcTaxAmount, calcNetAmount } = this.$options.filters["amountCalculation"](COMMONS) || {};

      const priceValueObject = {
        currentQuotationPrice: calcTaxUnitPrice,
        currentLnTotalAmount: calcTaxAmount,
        currentLnNetAmount: calcNetAmount,
      };

      if (this.doubleUnitFlag) {
        priceValueObject.currentQuotationSecPrice = calcTaxUnitPrice;
      }

      this.updateFieldFieldsValueFromRecord(priceValueObject, record);
    },
    // 按照基准价动态计算价格
    dynamicChangeLinePrice(record = {}) {
      const { priceTypeCode, } = this.headInfo || {};
      const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";

      if (!isUnTaxPriceFlag) {
        this.handleChangeQuotationPrice(record);
      } else {
        this.handleChangeNetPrice(record);
      }
    },
    // render 报价行当前金额总计
    renderLineTotalAmount() {
      const {
        quotationCurrentTotalAmount,
        quotationCurrentNetAmount,
        quotationCurrentTotalAmountValue,
        quotationCurrentNetAmountValue,
        priceTypeCode,
      } = this.headInfo || {};
      const isUnTaxPriceFlag = priceTypeCode && priceTypeCode === "NET_PRICE";
      let amount = quotationCurrentTotalAmountValue ?? quotationCurrentTotalAmount;

      if (isUnTaxPriceFlag) {
        amount = quotationCurrentNetAmountValue ?? quotationCurrentNetAmount;
      }

      const amountFormat = this.formatFinicial(amount);
      return amountFormat;
    },
    formatFinicial(amount) {
      if (isNil(amount)) {
        return "-";
      }
      return SrmMath.toFormat(amount, this.financialPrecision, BigNumber.ROUND_HALF_CEIL);
    },
    formatPrice(amount) {
      if (isNil(amount)) {
        return "-";
      }
      return SrmMath.toFormat(amount, this.currencyPrecision, BigNumber.ROUND_HALF_CEIL);
    },
    getRfa() {
      const { secondarySourceCategory } = this.headInfo;
      return secondarySourceCategory === "RFA";
    },
  }
};
</script>

<style lang="stylus" scoped>

>>> .srm-list-item-card-head-left {
  max-width: 75% !important;
}

>>> .srm-list-item-card-head {
  display: flex;
  align-items: flex-start !important;
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
}

.ssrc-header-title {
  display: inline-block;
  max-width: 64%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}

.ssrc-header-title-value {
  max-width: 100%;
  display: inline-block
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-round-quotation-title {
  max-width: 90%;
};

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
  padding-bottom: 12px;
  border-bottom: 1px dashed #F0F2F5;
  position: relative;

  .ssrc-table-line-customize-header-titles {
    font-family: PingFangSC-Medium;
    font-weight: 600;
    max-width: 100%;
    display: inline-block
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ssrc-table-line-header-specs-wrap {
    background: var(--background-color-empty-second);
    border: 1px solid var(--background-color-empty-second);
    border-radius: 2px;
    font-size: 10px;
    transform: scale(0.86);
    transform-origin: 0 0;
    color: var(--font-color-default);
    line-height: 16px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    max-width: 270px;
    padding: 0 4px;
    margin-top: 4px;
  }

  .ssrc-table-line-header-specs-cotent {
    display: inline-block;
    max-width: 240px;
    min-width: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 4px;
    vertical-align: middle;
  }

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
  display: inline-flex;
}

.ssrc-table-line-abandon-icon {
  margin-left: 14px;
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

.ssrc-abandon-quotaiton-modal-content-field-label {
  font-size: 14px;
  color: #1B1E2B;
  line-height: 20px;
  font-weight: 500;
  margin-bottom: 8px;
}

.ssrc-item-detail-status-wrap {
  margin-right: 15px;
}

.ssrc-item-detail-customize-header-wrapper {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.srm-list-item-card-head {
  align-items: baseline;
}

.ssrc-abaondon-line-dialog-warning-text {
  font-size: 16px;
  color: var(--font-color-disable);
  text-align: center;
  line-height: 22px;
  font-weight: 400;
}

.ssrc-quotation-line-summary-bar {
  height: 9vh;
  line-height: 20px;
}

.ssrc-quotation-add-round-footer {
  height: 9vh;
  line-height: 20px;
}

.ssrc-quotation-last-round-wrapper {
  font-size: 14px;
  color: var(--font-color-second);
  font-weight: 400;
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

  .item-total-amount-wrapper {
    font-size: 14px;
    display: inline-flex;
    align-items: center;
  }

  .quotaiton-line-summary-item {
    display: inline-flex;
    align-items: center;
  }

  .quotaiton-line-summary-item-value {
    padding-left: 4px;
    max-width: 50vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
  }

  .round-qutation-bottom-value {
    font-size: 14px;
    color: var(--font-color-second);
    font-weight: 400;
  }

  .total-amount {
    font-size: 20px;
    color: var(--color-danger);
    font-weight: 600;
  }
}

</style>
