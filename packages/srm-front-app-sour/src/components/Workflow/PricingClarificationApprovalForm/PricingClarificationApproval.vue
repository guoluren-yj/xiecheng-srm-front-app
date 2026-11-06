<template>
  <div class="pricing-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item code="rfxTitle" :show-title="true" :label="$T('ssrc.inquiryHall.view.tab.allDetails').$D('基本信息')">
        <div>
          <srm-form
            style="padding: 16px 15px"
            :data-set="baseInfoDS"
            :columns="getHeaderInfoColumns()"
            :customize-code="getCustomizeUnitCode('base')" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="lines" :label="$T('ssrc.inquiryHall.view.inquiryHall.priceClarificationInfo').$D('价格澄清信息')">
        <srm-list :data-set="lineDS"
                  :clickable="false"
                  :columns="getLineInfoColumns()" :scrollable="false" height="auto" style="height: auto" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 阶梯报价 -->
    <!-- <srm-popup height="100%" :visible.sync="pricingPop" :show-header="false">
      <div v-if="ladderLevelPop">
        <ul style="padding: 16px 0 12px 15px">
          <customize
            :data-source="ladderLevels"
            :columns="getLadderLevelColumns"
            code="SMBL.WORKFLOW.PRICING_APPROVAL.PRICE_LADDER_LEVEL_HEAD_INFO"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank size="mid" theme="fill" />
        <srm-list :scrollable="false"
                  height="auto"
                  customize-code="SMBL.WORKFLOW.PRICING_APPROVAL.PRICE_LADDER_LEVEL_LINE_INFO"
                  style="height: auto"
                  :data-set="ladderLevelDetailData"
                  :columns="getLadderLevelDetailColumns"/>
      </div>
    </srm-popup> -->

    <!-- 报价行明细 -->
    <srm-popup
      position="right"
      height="100%"
      :show-back="true"
      :visible.sync="quotationDetailVisible"
      :title="$T('ssrc.inquiryHall.view.tab.barginPriceDetail').$D('议价明细')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail
          :need-padding="true"
          :data-source="quotationDetailData"
          :columns="getQuotationDetailColumns"
          :code="getCustomizeUnitCode('quotationDetail')"/>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { isEmpty, } from "lodash";
import { DataSet, SrmTag, SrmUtil } from "srm-mobile-ui";

import { queryDoubleUnit } from "@/utils/utils";
import { getPriceName, getNetPriceName, } from "@/utils/doubleUnit";
import IsOverFlow from "../PricingApprovalForm/component/IsOverflow.vue";

import { fetchPriceClarificationDetailSupplierList, getRfxHeader, } from "./api/index.js";
import {
  lineDataSet,
  baseInfoDataSet,
  quotationLineDataSet,
} from "./datasource/ds.js";
// import HistoryRecord from "@/components/HistoryRecord";
// import QuotationDetail from "@/components/QuotationDetailNew/Detail/index.vue";

export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.pricingApproval", "ssrc.common", "hipspfm.common", "smbl.common", "spfm.dashboard", "hzero.button", "sscux.common", "ssrc.queryQuotation", "hzero.common", "ssrc.bidHall", "sscux.ssrc", "ssrc.projectSetup", "ssrc.priceComparison", "ssrc.resultsQuery", "ssrc.supplierQuotation", "sscux.ssrc" ],
  name: "PricingClarificationApproval",
  components: {},
  props: {
    showFilePop: {
      type: Function
    },
    topHeight: {
      type: Number,
      default: 0,
    },
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      sourceFrom: "RFX",
      bidFlag: false,
      headInfo: {},
      lineDS: new DataSet(lineDataSet({
        bidFlagJudge: this?.bidFlagJudge,
      })),
      baseInfoDS: new DataSet(baseInfoDataSet()),
      quotationLineDSObj: {},
      sourceHeaderId: null,
      basePop: false, // 基础信息pop
      headDetailInfo:{},
      doubleUnitFlag: false, // 判断是否开启双单位
      ladderLevelPop: false, //阶梯报价弹窗
      ladderLevelDetailData: new DataSet(), //阶梯报价明细信息
      ladderLevels: {}, //阶梯报价基础信息
      pricingPop: false, //报价弹窗
      quotationDetailVisible: false,
      quotationDetailData: {},
      showDetailValue: {},
    };
  },
  computed: {
    //阶梯报价基础信息
    // getLadderLevelColumns() {
    //   return [
    //     {
    //       formRow: 10,
    //       fieldCode: "supplierCompanyName",
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称"),
    //     },
    //     {
    //       formRow: 20,
    //       fieldCode: "itemCode",
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码")
    //     },
    //     {
    //       formRow: 20,
    //       fieldCode: "itemName",
    //       fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.itemName").$D("物料名称"),
    //     },
    //   ].filter(Boolean);
    // },
    //阶梯报价行信息
    // getLadderLevelDetailColumns() {
    //   return [
    //     {
    //       fieldCode: "rfxLadderLineNum",
    //       fieldType: "EMPTY",
    //       formRow: 10,
    //       render: (val) =>
    //         <span style="font-weight: bold">
    //           {this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号")}{val}
    //         </span>
    //     },
    //     this.doubleUnitFlag ? {
    //       formRow: 20,
    //       fieldCode: "secondaryLadderFrom",
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderFrom").$D("数量从"),
    //     } : null,
    //     this.doubleUnitFlag ? {
    //       formRow: 20,
    //       fieldCode: "secondaryLadderTo",
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderTo").$D("数量至"),
    //     } : null,
    //     {
    //       formRow: 30,
    //       fieldCode: "ladderFrom",
    //       fieldName:getLadderFrom(this.doubleUnitFlag),
    //     },
    //     {
    //       formRow: 30,
    //       fieldCode: "ladderTo",
    //       fieldName: getLadderTo(this.doubleUnitFlag),
    //     },
    //     this.doubleUnitFlag ? {
    //       formRow: 40,
    //       fieldCode: "validLadderSecPrice",
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPriceTax").$D("单价(含税)"),
    //     } : null,
    //     this.doubleUnitFlag ? {
    //       formRow: 50,
    //       fieldCode: "validNetLadderSecPrice",
    //       fieldName: this.$T("ssrc.queryQuotation.model.queryQuotation.netPrice").$D("单价(不含税)"),
    //     } : null,
    //     {
    //       formRow: 60,
    //       fieldCode: "validLadderPrice",
    //       fieldName: getPriceName(this.doubleUnitFlag),
    //     },
    //     {
    //       formRow: 70,
    //       fieldCode: "validNetLadderPrice",
    //       fieldName: getNetPriceName(this.doubleUnitFlag),
    //     },
    //     {
    //       formRow: 80,
    //       fieldCode: "cumulativeFlag",
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.isCumulativeFlag").$D("是否累计阶梯"),
    //       render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
    //     },
    //     {
    //       formRow: 90,
    //       fieldCode: "validBargainPrice",
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validBargainPrice").$D("有效还价单价"),
    //     },
    //     {
    //       formRow: 100,
    //       fieldCode: "remark",
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
    //     },
    //   ].filter(Boolean);
    // },
    // 议价明细
    getQuotationDetailColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineNo.").$D("行号"),
          fieldCode: "rfxLineItemNum",
          formRow: 1,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCategory").$D("物料类别"),
          fieldCode: "categoryName",
          fieldType: "TEXT",
          formRow: 5,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "TEXT",
          formRow: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "TEXT",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.specs").$D("规格"),
          fieldCode: "specs",
          fieldType: "TEXT",
          formRow: 40,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludePrice").$D("含税单价"),
          fieldCode: "validQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 70,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validNetPrice").$D("未税单价"),
          fieldCode: "newNetSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 80,
        } : null,
        {
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldCode: "validQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 90,
        },
        {
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldCode: "validNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 100,
        },
      ].filter(Boolean);
    },
  },
  beforeMount() {
    this.initRfxBid();
  },
  async mounted() {
    try {
      this.$loading.show();
      this.doubleUnitFlag = await queryDoubleUnit({
        businessModule: "RFX",
      });
      this.fetchHeader();
      this.fetchSuppliers();
    } finally {
      this.$loading.hide();
    }
  },
  methods: {
    getCustomizeUnitCode(type) {
      if (!type || isEmpty(type)) {
        return null;
      }

      const RfxCodeMap = new Map([
        [ "base", "SMBL.WORKFLOW.PRICING_CLARIFICATION_APPROVAL.BASE_FORM_INFO" ], // 基础信息
        [ "quotationTable", "SMBL.WORKFLOW.PRICING_CLARIFICATION_APPROVAL.QUOTATION_TABLE" ], // supplier tab form
        [ "quotationDetail", "SMBL.WORKFLOW.PRICING_CLARIFICATION_APPROVAL.QUOTATION_DETAIL" ], // supplier tab form
      ]);

      const BidCodeMap = new Map([
        [ "base", "SMBL.WORKFLOW.PRICING_CLARIFICATION_APPROVAL_BID.BASE_FORM_INFO" ], // 基础信息
        [ "quotationTable", "SMBL.WORKFLOW.PRICING_CLARIFICATION_APPROVAL_BID.QUOTATION_TABLE" ], // supplier tab form
        [ "quotationDetail", "SMBL.WORKFLOW.PRICING_CLARIFICATION_APPROVAL_BID.QUOTATION_DETAIL" ],
      ]);

      const CodeDataMap = !this.bidFlag ? RfxCodeMap : BidCodeMap;
      let currentUnitCode = null;

      if (typeof type === "string") {
        currentUnitCode = CodeDataMap.get(type);
      }

      if (Array.isArray(type)) {
        const codeSet = new Set();
        type.forEach((unitCode) => {
          codeSet.add(CodeDataMap.get(unitCode));
        });

        currentUnitCode = codeSet.size ? [ ...codeSet ].join(",") : null;
      }

      return currentUnitCode;
    },
    // 初始判定询价/新招标 多语言等
    initRfxBid() {
      this.bidFlag = this.bidFlagJudge();
    },
    bidFlagJudge() {
      const { secondarySourceCategory = null, } = this.parameters || {};
      let bidFlag = false;

      if (secondarySourceCategory === "NEW_BID") {
        bidFlag = true; // 页面是
      }

      return bidFlag;
    },
    showBaseDetail() {
      // this.headDetailInfo = this.headInfo || {};
      // this.basePop = !this.basePop;
    },
    getMainDataFromUrlSearch() {
      const { clarifyNotifyId, sourceHeaderId, secondarySourceCategory = null, } = this.parameters || {};
      if (!clarifyNotifyId || !sourceHeaderId) {
        return;
      }

      return {
        clarifyNotifyId,
        sourceHeaderId,
        secondarySourceCategory,
      };
    },
    // 获取核价单头信息
    async fetchHeader() {
      const data = this.getMainDataFromUrlSearch();
      if (!data) {
        return;
      }
      const params = {
        organizationId: this.organizationId,
        customizeUnitCode: this.getCustomizeUnitCode("base"),
        sourceFrom: this.sourceFrom,
        sourceMobileEndFlag: 1,
        ...data,
      };
      let head = await getRfxHeader(params);
      if (head && head.failed) {
        return;
      }

      head = head || {};
      this.headInfo = head;
      this.baseInfoDS.create(head, 0);
    },
    async fetchSuppliers() {
      const data = this.getMainDataFromUrlSearch();
      if (!data) {
        return;
      }

      const params = {
        ...data,
        sourceFrom: this.sourceFrom,
        page: 0,
        size: 10000,
        existsClarifyFlag: 1,
        sourceMobileEndFlag: 1,
      };
      this.quotationLineDSObj = {};
      let result = await fetchPriceClarificationDetailSupplierList(params);
      if (result && result.failed) {
        return;
      }

      const { content = [] } = result || {};
      if (isEmpty(content)) {
        this.lineDS.setData([]);
        this.quotationLineDSObj = {};
        this.showDetailValue = {};
        this.
          return;
      }

      const dataList = content || [];
      this.lineDS.setData(dataList);

      const listPromise = dataList.map((item) => {
        const { quotationHeaderId } = item || {};
        if (!quotationHeaderId) {
          return;
        }

        return this.fetchQuotationLineBySupplier(item);
      });

      let allData = await Promise.all(listPromise) || [];
      allData.forEach((item) => {
        const { key, ds } = item || {};
        this.$set(this.quotationLineDSObj, key, ds);
      });
    },
    async fetchQuotationLineBySupplier(item) {
      const { quotationHeaderId } = item || {};

      if (!quotationHeaderId) {
        return;
      }

      const data = this.getMainDataFromUrlSearch();
      const currentTableDS = new DataSet(quotationLineDataSet({
        bidFlagJudge: this?.bidFlagJudge,
      }));

      const queryParams = {
        sourceFrom: this.sourceFrom,
        ...data,
        customizeUnitCode: this.getCustomizeUnitCode([ "quotationTable", "quotationDetail" ]),
        quotationHeaderId,
      };

      currentTableDS.addPathParameter("tenantId", SrmUtil.getTenantId());
      currentTableDS.addPathParameter("quotationHeaderId", quotationHeaderId);

      currentTableDS.setQueryParameter(queryParams);
      await currentTableDS.refresh();

      return {
        key: quotationHeaderId,
        ds: currentTableDS,
      };
    },
    viewQuotationDetail(record) {
      this.quotationDetailData = record || {};
      this.quotationDetailVisible = true;
    },
    getLineInfoColumns() {
      const tableUnitCode = this.getCustomizeUnitCode("quotationTable");

      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => {
            const {
              supplierCompanyName,
              // supplierTotalAmount,
              quotationHeaderId,
            } = item || {};
            const columns = this.getQuotationTableColumns();
            const currentDS = this.quotationLineDSObj[quotationHeaderId];
            const currentTableShow = !this.showDetailValue[quotationHeaderId];
            return <SrmFlex direction="column" class="ssrc-price-clarification-line-info-wrapper">
              <SrmFlex
                justify="between"
                nativeOnClick={() => {
                  this.$set(this.showDetailValue, quotationHeaderId, !this.showDetailValue[quotationHeaderId]);
                }}
              >
                <IsOverFlow style={{ width: "80%" }}>
                  <template slot='title'>
                    <span class="title-bold">
                      {supplierCompanyName}
                    </span>
                  </template>
                </IsOverFlow>
              </SrmFlex>
              <srm-blank v-show={currentTableShow} style="margin: 10px 0;" size="1px" theme="fill"/>
              {currentDS ?
                <SrmList
                  v-show={currentTableShow}
                  scrollable={false}
                  dataSet={currentDS}
                  columns={columns}
                  customizeCode={tableUnitCode}
                /> :
                ""}
            </SrmFlex>;
          },
          formRow: 0,
        },
      ];
    },
    getQuotationTableColumns() {
      return [
        {
          fieldCode: "rfxLineItemNum",
          fieldType: "EMPTY",
          render: (_, record) => {
            const { rfxLineItemNum, itemName, } = record || {};
            return (
              <div style={{ width: "100%", }} onClick={() => this.viewQuotationDetail(record)}>
                <SrmFlex justify="between" align="center">
                  <IsOverFlow style={{ width: "80%" }}>
                    <template slot='title'>
                      <span class="title-bold">
                        {itemName}
                      </span>
                    </template>
                  </IsOverFlow>
                  <div>
                    <SrmFlex justify="between" align="center">
                      <div>{this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号")}：{rfxLineItemNum}</div>
                      <img
                        style={{
                          width: "14px",
                          height: "14px",
                          marginLeft: "8px",
                        }}
                        src={require("@/assets/icon_list_right_highlight@3x.png")}
                        alt="arrow"
                      />
                    </SrmFlex>
                  </div>
                </SrmFlex>
              </div>
            );
          },
          formRow: 0,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCategory").$D("物料类别"),
          fieldCode: "categoryName",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 1,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludePrice").$D("含税单价"),
          fieldCode: "validQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 40,
          formCol: 1,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validNetPrice").$D("未税单价"),
          fieldCode: "newNetSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 40,
          formCol: 2,
        } : null,
        {
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldCode: "validQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 50,
          formCol: 1,
        },
        {
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldCode: "validNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 50,
          formCol: 2,
        },
      ].filter(Boolean);
    },
    // 基础信息
    getHeaderInfoColumns() {
      return [
        {
          fieldCode: "sourceNumTitle",
          fieldType: "EMPTY",
          formRow: 1,
          render: (_, record) => {
            const { clarifyNotifyTitle, clarifyNotifyNum, clarifyNotifyTypeMeaning, } = record || {};
            const titleNum = clarifyNotifyTitle && clarifyNotifyNum ? `${clarifyNotifyTitle}-${clarifyNotifyNum}` : clarifyNotifyNum || clarifyNotifyNum;
            return (
              <srm-list-header show-open-tag={true}>
                <span>{ titleNum || "-" }</span>
                <div slot="right">
                  <SrmTag type="info">{ clarifyNotifyTypeMeaning || "-" }</SrmTag>
                </div>
              </srm-list-header>
            );
          },
        },
        {
          fieldCode: "sourceNum",
          formRow: 40,
        },
        {
          formRow: 50,
          fieldCode: "sourceTitle",
        },
        {
          formRow: 80,
          fieldCode: "initiationAndAllSupplierCount",
        },
        {
          formRow: 90,
          fieldCode: "companyName",
        },
        {
          formRow: 100,
          fieldCode: "replyEndDate",
        },
        {
          formRow: 150,
          fieldCode: "submittedDate",
        },
        {
          formRow: 160,
          fieldCode: "replyRequirement",
        },
        {
          formRow: 170,
          fieldCode: "initiationReason",
        },
      ].filter(Boolean);
    },
    calcMicrometer(value) {
      if (typeof value !== "undefined" && typeof value !== "object") {
        return String(value).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      }
    },
    //获取阶梯报价信息
    getLadderLevelInfo() {
      // this.ladderLevelPop = false;
      // // eslint-disable-next-line no-unused-vars
      // this.ladderLevelDetailData = new DataSet(ladderLevelDetailDs(item.quotationLineId));
      // this.ladderLevelDetailData.refresh();
      // this.ladderLevels = item || {};
      // this.pricingPop = true;
      // this.ladderLevelPop = true;
    },
  }
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl"

.srm-flex {
  .customize {
    margin-top: 4px;
  }
}

.ssrc-quotation-line-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-bold {
  width: 89%;
  color #333;
  font-weight 700;
  font-family: PingFangSC-Regular;
  word-break: break-all;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.ssrc-price-clarification-line-info-wrapper {
  >>> .srm-list-item-card {
    border-bottom: none;
  }
}

</style>
