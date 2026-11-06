<template>
  <div style="height: 100vh">
    <!-- 头信息 -->
    <!--    <srm-detail-head :columns="getHeaderColumns" :data-source="headInfo" /> -->
    <!-- 内容区域 -->
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
        <!--        <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent"> -->
        <!--          <span> -->
        <!--            {{ $T("hipspfm.supplierQuotation.view.title.noItemLineListData").$D("暂无物品明细") }} -->
        <!--          </span> -->
        <!--        </div> -->
        <srm-list :data-set="tableLineDataSet"
                  :columns="getLines"
                  :scrollable="false"
                  :customize-code="getCustomizeUnitCode('table')"
                  @itemClick="viewQuotationDetail" />
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.tab.attachmentList').$D('附件列表')">
        <customize
          :need-padding="true"
          :code="getCustomizeUnitCode('attachment')"
          :data-source="headInfo"
          :columns="getAttachmentForm" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

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
        :need-padding="true"
        :code="getCustomizeUnitCode('item')"
        :data-source="quotaitonDetailDataSource"
        :columns="getQuotationDetail" />
    </srm-popup>
  </div>
</template>

<script>

// const storage = window.localStorage;
import { isEmpty, isArray, isNil, } from "lodash";
import BigNumber from "bignumber.js";
import { $T, DataSet, SrmUtil, SrmMath, } from "srm-mobile-ui";

import {
  getPriceName,
  getNetPriceName,
  getAvailableQtyName,
} from "@/utils/doubleUnit.js";
import { fetchCurrentPrecision, } from "@/utils/utils";

import { fetchQuotationHistoryHeader, queryEnableDoubleUnit, fetchQuotationHistoryHeaderPurchaser } from "../api";
import { queryQuotationBasicFormDataSet } from "../datasource/queryQuotationBasicFormDataSet";
import { queryQuotationLineDataSet } from "../datasource/queryQuotationLineDataSet";
import { commonRfxStatusColor } from "../components/commonRfxStatusColor";

export default {
  modules: [ "ssrc.common", "hipspfm.workFlow", "ssrc.biddingOpen", "ssrc.bidHall", "ssrc.inquiryHall", "smbl.common", "hipspfm.supplierQuotation", "ssrc.supplierQuotation", "hzero.common", "hipspfm.common", "ssrc.queryQuotation", "ssrc.biddingHall", ],
  name: "QuoeryDetail",
  props:{
    documentType: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      organizationId: SrmUtil.getOrganizationId(),
      headInfo: {},
      headerFormDS: new DataSet(queryQuotationBasicFormDataSet({
        documentType: this.documentType,
      })),
      tableLineDataSet: new DataSet(queryQuotationLineDataSet({
        documentType: this.documentType,
        switchUrl: this.$route.query.switchUrl || 0,
      })),
      bidFlag: this.documentType === "BID",
      doubleUnitFlag: false, // 双单位是否开启标志
      bucketName: SrmUtil.getDefaultBucketName(),
      pageType: "", // 页面标识，参与/明细
      quotationDetailVisible: false, // 报价明细表 visible
      quotaitonDetailDataSource: {}, //  报价明细表 record
      currencyPrecision: null, // 手动查询的币种精度
      financialPrecision: null, // 手动查询的财务精度
    };
  },
  computed: {
    getBaseForm() {
      const rfa = this.getRfa();

      const fields = [
        {
          formRow: 0,
          fieldCode: "rfxTitle",
          render: (val, record) => {
            const { secondarySourceCategoryMeaning, rfxTitle, currentQuotationRound, bargainStatus, quotationOrderTypeMeaning, } = record || {};
            const currentBargainFlag = bargainStatus === "BARGAINING_ONLINE"; // 议价
            const roundFlag = currentQuotationRound > 1 && !currentBargainFlag;
            const titleClass = roundFlag ? "ssrc-header-title" : "ssrc-header-title no-round-quotation-title";
            return (
              <SrmListHeader>
                <div class={titleClass}>
                  <srm-tooltip title={rfxTitle} placement="bottom">
                    <span>{rfxTitle}</span>
                  </srm-tooltip>
                </div>
                <div class="ssrc-header-source-category">
                  {secondarySourceCategoryMeaning}
                </div>
                {rfa ? <div class="ssrc-header-source-category">
                  {quotationOrderTypeMeaning}
                </div> : ""}
                {roundFlag ?
                  <div class="ssrc-header-source-category">
                    {this.$T("ssrc.common.model.inquiryHall.currentRoundQuotationRound", [ currentQuotationRound ]).$D("第{round}轮")}
                  </div> : ""}
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
          fieldType: "TEXT",
        },
        {
          formRow: 400,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.paymentTerms").$D("付款方式"),
          fieldCode: "paymentTypeName",
          fieldType: "TEXT",
        },
        {
          formRow: 500,
          formCol: 1,
          fieldName: this.$T("ssrc.common.model.common.termsOfPayment").$D("付款条款"),
          fieldCode: "paymentTermName",
        },
        {
          fieldName: this.bidFlag ? $T("ssrc.bidHall.model.bidHall.quotationStartDate").$D("投标开始时间") : $T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
          visible: rfa,
          formRow: 600,
          formCol: 1,
        },
        {
          fieldName: this.bidFlag ? $T("ssrc.bidHall.model.bidHall.quotationEndDate").$D("投标截止时间") : $T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
          fieldCode: "quotationEndDate",
          visible: rfa,
          formRow: 700,
          formCol: 1,
        },
      ];
      return fields;
    },
    // 物料明细弹窗
    getQuotationDetail() {
      const doubleUnitFlag = this.doubleUnitFlag;
      const {
        rfxStatus,
        priceTypeCode,
      } = this.headInfo || {};

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
            } = item;
            let quantity = rfxQuantity;
            let uom = uomName;
            if (doubleUnitFlag) {
              quantity = secondaryQuantity;
              uom = secondaryUomName;
            }
            let quantityAndUomCombine = quantity && uom ? `${SrmUtil.getNumberLocalized(quantity)}${uom}` : quantity || uom;
            return <div class="ssrc-table-line-customize-header-wrapper ssrc-item-detail-customize-header-wrapper">
              <SrmListHeader>
                <div class="ssrc-table-line-customize-header-titles">
                  {val ?? ""}
                  {quantityAndUomCombine ? `-${quantityAndUomCombine}` : ""}
                </div>
                <span slot="right">
                  <span class="ssrc-table-line-status-wrap ssrc-item-detail-status-wrap">
                    {commonRfxStatusColor(displayQuotationLineStatus, displayQuotationLineStatusMeaning)}
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
          formRow: 100,
          formCol: 1,
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
        },
        {
          formRow: 200,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachment").$D("采购方附件"),
          fieldCode: "rfxAttachmentUuid",
          fieldType: "UPLOAD",
          showCount: true,
          readonly: true,
          bucketName: this.bucketName,
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        },
        {
          fieldName: this.$T("ssrc.common.model.common.bidQuantity").$D("中标数量"),
          fieldCode: "allottedQuantity",
          formRow: 300,
          formCol: 1,
          visible: rfxStatus === "FINISHED",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: priceTypeCode === "NET_PRICE" ? this.$T("ssrc.queryQuotation.model.queryQuotation.successfulBidAmountNet").$D("中标金额(不含税)") : this.$T("ssrc.queryQuotation.model.queryQuotation.successfulBidAmountTaxIn").$D("中标金额(含税)"),
          fieldCode: "bidPrice",
          formRow: 300,
          formCol: 2,
          visible: rfxStatus === "FINISHED",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 400,
          formCol: 1,
          fieldName: getPriceName(doubleUnitFlag),
          fieldCode: "quotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          // visible: doubleUnitFlag,
        },
        {
          formRow: 410,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPriceTax").$D("单价(含税)"),
          fieldCode: "quotationSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        },
        {
          formRow: 600,
          formCol: 1,
          fieldName: getNetPriceName(doubleUnitFlag),
          fieldCode: "validNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          // visible: doubleUnitFlag,
        },
        {
          formRow: 610,
          formCol: 1,
          fieldName: this.$T("ssrc.common.model.common.netPrice").$D("单价(不含税)"),
          fieldCode: "validNetSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        },
        {
          formRow: 700,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxQuotationAmount").$D("行金额(含税)"),
          fieldCode: "totalAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 800,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmountWithoutTax").$D("行金额(不含税)"),
          fieldCode: "netAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierLineAttachment").$D("供应商行附件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          showCount: true,
          readonly: true,
          formRow: 2000,
          formCol: 1,
          bucketName: this.bucketName,
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        },
      ];

      return Fields;
    },
    // 报价行表格
    getLines() {
      const doubleUnitFlag = this.doubleUnitFlag;
      const {
        rfxStatus,
        priceTypeCode,
      } = this.headInfo || {};
      const rfa = this.getRfa();

      const columns = [
        {
          formRow: 10,
          formCol: 1,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => {
            const {
              specs,
              secondaryUomName,
              secondaryQuantity,
              uomName,
              rfxQuantity,
              displayQuotationLineStatus,
              displayQuotationLineStatusMeaning,
            } = item;
            let quantity = rfxQuantity;
            let uom = uomName;
            if (doubleUnitFlag) {
              quantity = secondaryQuantity;
              uom = secondaryUomName;
            }
            let quantityAndUomCombine = quantity && uom ? `${SrmUtil.getNumberLocalized(quantity)}${uom}` : quantity || uom;
            return <div class="ssrc-table-line-customize-header-wrapper">
              <SrmListHeader>
                <div class="ssrc-table-line-customize-header-titles">
                  {val ?? ""}
                  {quantityAndUomCombine ? `-${quantityAndUomCombine}` : ""}
                </div>
                <span slot="right">
                  <span class="ssrc-table-line-status-wrap">
                    {commonRfxStatusColor(displayQuotationLineStatus, displayQuotationLineStatusMeaning)}
                  </span>
                </span>
                {specs ? <div class="ssrc-table-line-header-specs-wrap">
                  <div>
                    {this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格")}
                  </div>
                  <srm-tooltip title={specs} placement="bottom">
                    <div class="ssrc-table-line-header-specs-cotent" onClick={(e) => e.stopPropagation() }>
                      {specs}
                    </div>
                  </srm-tooltip>
                </div> : ""}
              </SrmListHeader>
            </div>;
          },
        },

        {
          fieldName: this.$T("ssrc.common.model.common.bidQuantity").$D("中标数量"),
          fieldCode: "allottedQuantity",
          formRow: 100,
          formCol: 1,
          visible: rfxStatus === "FINISHED",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: priceTypeCode === "NET_PRICE" ? this.$T("ssrc.queryQuotation.model.queryQuotation.successfulBidAmountNet").$D("中标金额(不含税)") : this.$T("ssrc.queryQuotation.model.queryQuotation.successfulBidAmountTaxIn").$D("中标金额(含税)"),
          fieldCode: "bidPrice",
          formRow: 100,
          formCol: 2,
          visible: rfxStatus === "FINISHED",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 200,
          formCol: 1,
          fieldName: getPriceName(doubleUnitFlag),
          fieldCode: "quotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          // visible: doubleUnitFlag,
        },
        {
          formRow: 200,
          formCol: 2,
          fieldName: getNetPriceName(doubleUnitFlag),
          fieldCode: "validNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          editLimit: true,
          // visible: doubleUnitFlag,
        },
        {
          formRow: 300,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPriceTax").$D("单价(含税)"),
          fieldCode: "quotationSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        },
        {
          formRow: 300,
          formCol: 2,
          fieldName: this.$T("ssrc.common.model.common.netPrice").$D("单价(不含税)"),
          fieldCode: "validNetSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率"),
          fieldCode: "taxRate",
          formRow: 400,
          formCol: 1,
        },
        {
          formRow: 400,
          formCol: 2,
          fieldCode: "quotationQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName: getAvailableQtyName(doubleUnitFlag),
          editLimit: true,
          editor: false,
          // visible: doubleUnitFlag,
        },
        {
          formRow: 400,
          formCol: 2,
          fieldCode: "quotationSecondaryQuantity",
          fieldType: "INPUT_NUMBER",
          fieldName: this.$T("ssrc.common.model.common.availableQuantity").$D("可供数量"),
          editLimit: true,
          editor: false,
          visible: doubleUnitFlag,
        },
        {
          fieldName: this.bidFlag ? $T("ssrc.bidHall.model.bidHall.quotationStartDate").$D("投标开始时间") : $T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
          visible: rfa,
          formRow: 500,
          formCol: 1,
        },
        {
          fieldName: this.bidFlag ? $T("ssrc.bidHall.model.bidHall.quotationEndDate").$D("投标截止时间") : $T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
          fieldCode: "quotationEndDate",
          visible: rfa,
          formRow: 600,
          formCol: 1,
        },
      ];
      return columns.filter(Boolean);
    },
    getAttachmentForm() {
      return [
        {
          fieldCode: "businessAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 1,
          bucketName: "private-bucket",
          bucketDirectory: "ssrc-rfx-quotationheader",
          disabled: true,
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        },
        {
          fieldCode: "techAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 2,
          bucketName: "private-bucket",
          bucketDirectory: "ssrc-rfx-quotationheader",
          disabled: true,
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        },
      ];
    },
  },
  mounted() {
    const { pageType, switchUrl = 0 } = this.$route.query;
    this.bidFlag = this.documentType === "BID";
    // if (quotationHeaderId) {
    //   const storeField = !this.bidFlag ? "quotationQueryNewPageQuotationHeaderId" : "biddingNewPageQuotationHeaderId";
    //   storage.setItem(storeField, quotationHeaderId);
    // }
    this.pageType = pageType;
    this.switchUrl = switchUrl;
    this.queryHeaderAndLine();
    this.intiConfigs();
  },
  methods: {
    intiConfigs() {
      this.queryDoubleUnit();
    },
    // query page header and line
    queryHeaderAndLine() {
      const { quotationHeaderId, rfxHeaderId, quotationHeaderRecordId = null, } = this.$route.query;
      if (!rfxHeaderId) {
        return;
      }
      this.getHeadInfo();
      this.tableLineDataSet.addPathParameter("quotationHeaderId", quotationHeaderId);
      this.tableLineDataSet.addPathParameter("rfxHeaderId", rfxHeaderId);
      this.tableLineDataSet.addPathParameter("quotationHeaderRecordId", quotationHeaderRecordId);
      this.tableLineDataSet.addPathParameter("customizeUnitCode", this.getCustomizeUnitCode([ "table", "item" ]));
      this.tableLineDataSet.addPathParameter("sourceMobileEndFlag", 1);

      this.tableLineDataSet.reset();
      this.tableLineDataSet.query();
    },
    getCustomizeUnitCode(type) {
      if (!type || isEmpty(type)) {
        return null;
      }

      const RfxCodeMap = new Map([
        [ "base", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.QUERY_QUOTATION_BASE_FORM_INFO" ], // 基础信息
        [ "table", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.QUERY_QUOTATION_QUOTATION_LINE" ], // 报价行表格
        [ "item", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.QUERY_QUOTATION_QUOTATION_ITEM_LINE_DETAIL" ], // 附件,
        [ "attachment", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.QUERY_QUOTATION_QUOTATION_ATTACHMENT" ],
      ]);

      const BidCodeMap = new Map([
        [ "base", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUERY_QUOTATION_BASE_FORM_INFO" ], // 基础信息
        [ "table", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUERY_QUOTATION_QUOTATION_LINE" ], // 报价行表格
        [ "item", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUERY_QUOTATION_QUOTATION_ITEM_LINE_DETAIL" ], // 附件,
        [ "attachment", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUERY_QUOTATION_QUOTATION_ATTACHMENT" ],
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
    async getHeadInfo() {
      const { quotationHeaderId, rfxHeaderId, quotationHeaderRecordId, } = this.$route.query;
      const params = {
        customizeUnitCode: this.getCustomizeUnitCode([ "base", "attachment" ]),
        quotationHeaderId,
        rfxHeaderId,
        quotationHeaderRecordId,
        organizationId: this.organizationId,
        sourceMobileEndFlag: 1,
      };

      this.$loading.show();
      let res = "";
      if (Number(this.switchUrl) === 2) {
        res = await fetchQuotationHistoryHeaderPurchaser(params);
      } else {
        res = await fetchQuotationHistoryHeader(params);
      }
      this.$loading.hide();
      if (res && !res.failed) {
        const headerData = res || {};
        this.headInfo = headerData;
        this.headerFormDS.create(headerData, 0);
        this.fetchCurrentPrecision(headerData);
      }
    },
    getRfa() {
      const { secondarySourceCategory } = this.headInfo;
      return secondarySourceCategory === "RFA";
    },
    // 跳转列表
    directionList(tabName = null) {
      let nextPageName = "ListApply";
      if (this.bidFlag) {
        nextPageName = "ListBidding";
      }

      const query = {};
      if (tabName) {
        query.tabName = tabName;
      }

      this.$router.push({
        name: nextPageName,
        query,
      });
    },
    viewQuotationDetail(item) {
      const { data } = item;
      this.quotationDetailVisible = true;
      this.quotaitonDetailDataSource = data || {};
    },
    itemDetailTableClosePopup() {
      this.quotationDetailVisible = false;
      this.quotaitonDetailDataSource = {};
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
  }
};
</script>

<style lang="stylus" scoped>

>>> .srm-list-item-card-head-left {
  max-width: 75% !important;
}

.ssrc-header-title {
  display: inline-block;
  max-width: 64%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
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
    max-width: 80vw;
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

.ssrc-table-line-status-wrap {
  font-size: 14px;
  color: #FF6937;
  text-align: right;
  line-height: 20px;
  font-weight: 600;
  display: inline-flex;
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

</style>
