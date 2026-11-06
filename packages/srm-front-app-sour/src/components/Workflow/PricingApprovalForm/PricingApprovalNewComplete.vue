<template>
  <div class="pricing-approval-complete">
    <srm-scroll-tab>
      <!-- project -->
      <div v-if="projectSection.length" class="tab" :style="{whiteSpace: showAllTabs ? 'normal' : 'nowrap'}">
        <div class="tab-container">
          <div v-for="(section, index) in projectSection" :key="index" class="tab-item-box">
            <touch-feedback active-class-name="tab-item-active">
              <span :class="['tab-item', {
                'tab-item-active': index === tabIndex
              }]" @click="changeTab(section, index)">
                {{ section.sectionName }}
              </span>
            </touch-feedback>
          </div>
        </div>
        <touch-feedback active-class-name="tab-trigger-active">
          <div class="tab-trigger" @click="triggerTab">
            <em class="srm-icon icon-grid"/>
          </div>
        </touch-feedback>
      </div>

      <srm-scroll-tab-item code="rfxTitle" :show-title="false" :label="formTabTitle">
        <srm-form
          style="padding: 16px 15px"
          :data-set="baseInfoDS"
          :columns="getHeaderInfoColumns"
          :customize-code="getCustomizeUnitCode('base')" />
      </srm-scroll-tab-item>

      <div class="pricing-approval-complete-detail-content">
        <div class="pricing-approval-complete-detail-selection">
          <!-- 维度切换 -->
          <div class="srm-content-top pricing-approval-complete-detail-left">
            <div class="srm-content-top-dimen">
              <srm-button
                :style="currentTab === 'supplier' ? 'background: white; color: #1D2129; font-family: PingFangSC-Semibold; font-weight: 600;' : 'background: #F7F8FA; color:#4E5769; font-family: PingFangSC-Regular; font-weight: 400; '"
                type="info"
                @click="handDimenChange('supplier')">
                <span style="font-size: 10px"> {{ $T('ssrc.common.supplier').$D('供应商') }} </span>
              </srm-button>
              <srm-button
                v-if="projectSection.length === 0"
                :style="currentTab === 'item' ? 'background: white; color: #1D2129; font-family: PingFangSC-Semibold; font-weight: 600;' : 'background: #F7F8FA; color:#4E5769; font-family: PingFangSC-Regular; font-weight: 400; '"
                type="info"
                @click="handDimenChange('item')">
                <span style="font-size: 10px"> {{ $T("ssrc.inquiryHall.model.inquiryHall.item").$D("物料") }} </span>
              </srm-button>
            </div>
          </div>

          <!-- 选择下拉 :text 这边不能随着供应商/物料按钮变更，所以暂时用v-show解决，且用了两套dom -->
          <div class="pricing-approval-complete-detail-right">
            <div v-show="currentTab === 'supplier'">
              <srm-dropdown :value="getCurrentTabSelectValue()" :text="getCurrentTabSelectValueText()" type="tooltip" @select="onApproveStatusSelect">
                <srm-dropdown-item value="0" :text="getSuggestedText(0)" />
                <srm-dropdown-item value="1" :text="getSuggestedText(1)" />
              </srm-dropdown>
            </div>
            <div v-if="currentTab === 'item'">
              <srm-dropdown :value="getCurrentTabSelectValue()" :text="getCurrentTabSelectValueText()" type="tooltip" @select="onApproveStatusSelect">
                <srm-dropdown-item value="0" :text="getSuggestedText(0)" />
                <srm-dropdown-item value="1" :text="getSuggestedText(1)" />
              </srm-dropdown>
            </div>
          </div>
        </div>

        <div class="srm-wrap-scoll-card">
          <scoll-card
            :data-list="currentTab === 'supplier' ? currentSupplierTabList : currentItemTabList"
            :tab-name="currentTab"
            :activite-tab="currentTab === 'supplier' ? currentSupplierTabIndex : currentItemTabIndex"
            :is-tax="isTax()" @handClick="handCardClick" @handleSelect="handleTabSelect" />
        </div>
      </div>

      <srm-scroll-tab-item :show-title="false" :label="formTabTitle" >
        <div class="ssrc-scroll-tab-item-customize-title">
          {{ getTabFormLabel }}
        </div>
        <div v-if="getCurrentTabListDataLength() === 0" style="height: 10vh;" />
        <srm-form
          v-else
          style="padding: 16px 15px"
          :columns="getTabFormColumns"
          :data-set="currentTabFormDS"
          :customize-code="getCustomizeUnitCode(currentTab === 'supplier' ? 'supplierForm' : 'itemForm')" />
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :show-title="false" :label="formTabTitle">
        <div class="ssrc-scroll-tab-item-customize-title">
          {{ getTabListLabel }}
        </div>
        <srm-list
          :data-set="getCurrentTableDS()"
          :clickable="false"
          :customize-code="getCurrentTabTableUnitCode()"
          :columns="getLineInfoColumns()" :scrollable="false" height="auto" style="height: auto" />
      </srm-scroll-tab-item>
      <!-- 附件列表 -->
      <srm-scroll-tab-item v-if="fileTemplateManageFlag" :show-title="false" :label="formTabTitle" code="attachmentList">
        <file-temp-attachment ref="fileTempAttachmentRef" :head-info="headInfo" :editor-flag="false" :bid-flag="bidFlag" unit-code-symbol="fileTempAttach-approval-overview"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import uuid from "uuid";
import { DataSet, SrmUtil, SrmMath, SrmList, $T, } from "srm-mobile-ui";
import {
  getProjectSection,
  getRfxHeaderCheckPrice,
  getProcessFileApi,
  getPurchaseApi,
  getBiddingSupplier,
  fetchSupplierLine,
  fetchItemLine,
  fetchSupplierData,
  fetchItemData,
  checkPriceComparePriceDownloadZip,
  getUrl,
} from "@/components/Workflow/PricingApprovalForm/api/index.js";
import { isNil, isEmpty, throttle, } from "lodash";
import BigNumber from "bignumber.js";
import { downloadFile } from "srm-mobile-ui/src/utils/jsBridge";

import itemIcon from "@/assets/checkItem.svg";
import supplierIcon from "@/assets/checkSupplier.svg";

import { queryDoubleUnit } from "@/utils/utils";
import {
  baseInfoDataSet,
  currentTabFormDataSet,
  currentSupplierTabTableDataSet,
  currentItemTabTableDataSet,
  selectTabSupplierListDataSet,
  selectTabItemListDataSet,
} from "./datasource/baseInfoDataSet";
import rfxItemsDS from "./datasource/items";
import ladderLevelDetailDs from "./datasource/ladderLevelDetailDs";
import HistoryRecord from "@/components/HistoryRecord";
import FileTempAttachment from "@/components/FileTempAttachment";
import { queryBidFileTemplateConfig } from "@/components/FileTempAttachment/utils";

// import QuotationDetail from "@/components/QuotationDetailNew/Detail/index.vue";
import ScollCard from "./component/ScollCard";
import FileGroup from "./component/FileGroup";
import { getCheckPriceName, getQuotationName, } from "./utils/globalVariable";
import { getQuotationPrice, getAllottedQuantity, getQtyName } from "@/utils/doubleUnit";

export default {
  modules: [ "ssrc.resultsQuery", "ssrc.bidHall", "ssrc.supplierQuotation", "smbl.inquiryHall", "ssrc.inquiryHall", "hipspfm.pricingApproval", "ssrc.common", "hipspfm.common", "smbl.common", "spfm.dashboard", "hzero.button", "sscux.common", "ssrc.queryQuotation", "hzero.common", "ssrc.common", "hipspfm.expertScoring", "ssrc.expertScoring", "sscux.ssrc" ],
  name: "PricingApprovalNewComplete",
  components: {
    HistoryRecord,
    ScollCard,
    FileGroup,
    FileTempAttachment,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
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
      organizationId: SrmUtil.getOrganizationId(),
      bucketName: SrmUtil.getDefaultBucketName(),
      bidFlag: false,
      headInfo: {},
      itemLines: [], //供应商分类信息
      experLinesInfo:[], // 专家评分信息
      tabIndex: 0,
      projectSection: [],
      uuid: uuid(),
      showAllTabs: false,
      selectTabItemModalVisible: false,
      baseInfoDS: new DataSet(baseInfoDataSet()),
      dataSet: new DataSet(rfxItemsDS({})),
      currentTabFormDS: new DataSet(currentTabFormDataSet()),
      currentSupplierTabTableDS: new DataSet(currentSupplierTabTableDataSet({
        currentTab: this.currentTab,
      })),
      currentItemTabTableDS: new DataSet(currentItemTabTableDataSet({
        currentTab: this.currentTab,
      })),
      //fileListDataSet: new DataSet(fileListDs(this.sourceHeaderId)),
      sourceHeaderId: null,
      headPopupVisible: false,
      sourceProject: {},
      multipleLanguage: {
        taxIncluded: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncluded").$D("含税"),
        nonTaxIncluded: this.$T("ssrc.inquiryHall.model.inquiryHall.noTaxRate").$D("不含税"),
      },
      showDetailValue: {},
      fileListFlag: false,
      fileListData: [],
      fileListNum:0,
      basePop:false, // 基础信息pop
      headDetailInfo:{},
      doubleUnitFlag: false, // 判断是否开启双单位
      biddingSupplierList: [],
      ladderLevelPop: false, //阶梯报价弹窗
      ladderLevelDetailData: new DataSet(), //阶梯报价明细信息
      ladderLevels: {}, //阶梯报价基础信息
      pricingPop: false, //报价弹窗
      currentTab: "supplier", // supplier / item
      currentSupplierTabList: [],
      currentSupplierTabData: {},
      currentSupplierTabIndex: 0,
      currentItemTabList: [],
      currentItemTabData: {},
      currentItemTabIndex: 0,
      supplierSuggested: window.localStorage.getItem("tenantNum") === "SRM-SANNING" ? 0 : 1,
      itemSuggested: window.localStorage.getItem("tenantNum") === "SRM-SANNING" ? 0 : 1,
      selectTabItemModalRef: null,
      selectTabSupplierListDS: new DataSet(
        selectTabSupplierListDataSet(),
      ),
      selectTabItemListDS: new DataSet(
        selectTabItemListDataSet(),
      ),
      formTabTitle: "",
      fileTemplateManageFlag: false, // 是否开启招标文件模板管理
    };
  },
  computed: {
    getTabFormLabel() {
      const currentTitle = this.currentTab === "supplier" ?
        $T("ssrc.inquiryHall.view.tab.supplierInfo").$D("供应商信息") : $T("ssrc.inquiryHall.view.tab.itemInfo").$D("物料信息");
      return currentTitle;
    },
    getTabListLabel() {
      const currentTitle = this.currentTab === "supplier" ? $T("ssrc.inquiryHall.view.tab.itemDetialInfo").$D("物料详情") : $T("ssrc.inquiryHall.view.tab.supplierDetialInfo").$D("供应商详情");
      return currentTitle;
    },
    // 基础信息
    getHeaderInfoColumns() {
      const {
        auctionDirection,
        expertScoreFlag,
      } = this.headInfo;

      return [
        {
          fieldCode: "rfxTitle",
          fieldType: "EMPTY",
          formRow: 1,
          formCol: 1,
          render: (val, record) =>
            <srm-flex>
              <span class="ssrc-rfx-title">{ val }</span>
            </srm-flex>,
        },
        {
          formRow: 100,
          formCol: 1,
          fieldCode: "rfxNum",
          fieldName: this.bidFlag ? this.$T("smbl.inquiryHall.model.inquiryHallBidNum").$D("招标书编号") : this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号"),
        },
        {
          formRow: 200,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonTotalPrice", [ getCheckPriceName(this.bidFlag) ]).$D("{checkPriceName}总金额"),
          fieldCode: "totalPrice",
          render: (val, record) => {
            const {
              totalPrice,
            } = record || {};
            const amount = totalPrice;
            return this.formatFinicial(amount);
          },
        },
        {
          formRow: 300,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.title.minAndMaxAmount").$D("最高金额/最低金额"),
          fieldCode: "minSuggestedAmount",
          editor: false,
          render: (_, record) => {
            const {
              minSuggestedAmount,
              maxSuggestedAmount,
            } = record || {};
            return this.multiplyFormAmountAndCombile([ maxSuggestedAmount, minSuggestedAmount ]);
          },
        },
        {
          formRow: 400,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.title.suggestedAllSupplier").$D("中标/未中标/全部供应商"),
          fieldCode: "suggested",
          editor: false,
          render: (_, record) => {
            const {
              suggestedSupCount,
              notSuggestedSupCount,
              allSupCount,
            } = record || {};
            return this.multiplyFormAmountAndCombile([ suggestedSupCount, notSuggestedSupCount, allSupCount ]);
          },
        },
        {
          formRow: 600,
          formCol: 1,
          fieldName: auctionDirection !== "FORWARD" ? this.$T("ssrc.inquiryHall.title.suggestSupplierDetail").$D("选用最低价/本次选用/标的数") : this.$T("ssrc.inquiryHall.title.suggestMaxSupplierDetail").$D("选用最高价/本次选用/标的数"), // auctionDirection === 'FORWARD'
          fieldCode: "suggestedPrice",
          editor: false,
          render: (_, record) => {
            const {
              minMaxPriceSuggestedLineCount,
              suggestedLineCount,
              itemLineCount,
            } = record || {};
            return this.multiplyFormAmountAndCombile([ minMaxPriceSuggestedLineCount, suggestedLineCount, itemLineCount ]);
          },
        },
        {
          formRow: 700,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.view.message.button.priceAssistant").$D("比价助手"),
          fieldCode: "priceAssistant",
          render: () => {
            return (
              <a onClick={this.downloadPriceCompare} style="color: var(--font-color-primary);">
                {$T("hzero.common.button.download").$D("下载")}
              </a>
            );
          },
        },
        expertScoreFlag ? {
          formRow: 800,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.view.tab.gradInformation").$D("评分信息"),
          fieldCode: "scoreInfo",
          editor: false,
          render: (_, record) => {
            return (
              <srm-button plain={true} size="small" on-click={() => this.directionDetailViewPage(record)}>
                {this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              </srm-button>
            );
          },
        } : null,
      ].filter(Boolean);
    },
    getTenantNum() {
      return window.localStorage.getItem("tenantNum");
    },
    getTabFormColumns() {
      const {
        auctionDirection,
        priceTypeCode,
        newQuotationFlag,
      } = this.headInfo;

      const list = this.getCurrentTabListDataLength();
      if (list.length === 0) {
        return [];
      }

      const supplier = [
        {
          fieldType: "EMPTY",
          formRow: 10,
          formCol: 1,
          fieldCode: "supplierCompanyName",
          render: (val, record) => {
            const {
              quotationRank,
            } = record || {};
            return (
              <div style="width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: top;">
                  <div>
                    <div style="display: inline-flex;align-items: center">
                      <img src={supplierIcon} alt="supplier" style="margin-right: 4px" />
                      <srm-tooltip title={val} placement="bottom">
                        <span class="ssrc-header-title-value">{val}</span>
                      </srm-tooltip>
                    </div>
                    <div>
                      {this.renderTags(record)}
                    </div>
                  </div>
                  <div>
                    {quotationRank ? <div class="ssrc-header-rank-tag">
                      {this.$T("ssrc.supplierQuotation.model.supQuo.ranking").$D("排名") }: {quotationRank}
                    </div> : ""}
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          formRow: 100,
          formCol: 1,
          fieldCode: "localSuggestedQtnNetAmount",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.benchmarkLocalSugQtnAmount").$D("中标总金额"),
          render: (val, record) => {
            const {
              localSuggestedQtnNetAmount,
              localSuggestedQtnTotalAmount,
            } = record || {};
            const amount = priceTypeCode === "NET_PRICE" ? localSuggestedQtnNetAmount : localSuggestedQtnTotalAmount;
            return this.formatFinicial(amount);
          },
        },
        {
          formRow: 100,
          formCol: 2,
          fieldName: this.bidFlag ?
            this.$T("ssrc.supplierQuotation.model.supQuo.totalTenderAmount").$D("投标总金额") :
            this.$T("ssrc.common.totalQuotaionAmount").$D("报价总金额"),
          fieldCode: "supplierTotalAmount",
          render: (val, record) => {
            const { supplierNetAmount, supplierTotalAmount } = record || {};
            const amount = priceTypeCode !== "NET_PRICE" ? supplierTotalAmount : supplierNetAmount;
            return this.formatFinicial(amount);
          },
        },
        {
          formRow: 200,
          formCol: 1,
          fieldName: this.$T("ssrc.bidHall.model.bidHall.savingAmount").$D("节支金额"),
          fieldCode: "savingAmount",
          render: (val, record) => {
            const { savingAmount = null, } = record || {};
            return this.formatFinicial(savingAmount);
          },
        },
        {
          formRow: 200,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.savingRatio").$D("节支率"),
          fieldCode: "savingsRate",
          render: (value, record) => {
            const { savingRatio } = record || {};
            return !isNil(savingRatio) ? `${savingRatio}%` : "-";
          },
        },
        {
          formRow: 300,
          formCol: 1,
          fieldName: auctionDirection === "FORWARD" ?
            this.$T("ssrc.inquiryHall.model.inquiryHall.maxSuggestedRatio").$D("最高价中标率") :
            this.$T("ssrc.inquiryHall.model.inquiryHall.minMaxSuggestedRatio").$D("最低价中标率"),
          fieldCode: "minMaxSuggestedRatio",
          render: (value, record) => {
            const { minMaxSuggestedRatio } = record || {};
            return !isNil(minMaxSuggestedRatio) ? `${minMaxSuggestedRatio}%` : "-";
          },
        },
        {
          formRow: 300,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierAttachment").$D("供应商附件"),
          fieldCode: "attachmentUuid",
          // fieldType: "UPLOAD",
          showCount: true,
          // readOnly: true,
          // bucketName: this.bucketName,
          bucketDirectory: "ssrc-rfx-quotationheader",
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
          render: (_, record) => {
            const {
              attachmentUuid,
              businessAttachmentUuid,
              techAttachmentUuid,
              roundBusinessAttachmentUuid,
              roundTechAttachmentUuid,
              bargainBusinessAttachmentUuid,
              bargainTechAttachmentUuid,
            } = record || {};
            return newQuotationFlag ?
              <file-group name="attachmentUuid" record={record} fileType="HEADER" /> :
              <srm-upload
                attachmentUuid={attachmentUuid}
                isTab={false}
                showIcon={false}
                showCount={true}
                readOnly={true}
                bucketName={this.bucketName}
                bucketDirectory="ssrc-rfx-quotationheader"
                descTitle={this.$T("ssrc.common.model.common.viewAttachment").$D("查看附件")}
                title={this.$T("ssrc.inquiryHall.model.inquiryHall.supplierAttachment").$D("供应商附件")}
                fileArr={[
                  {
                    title: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件"),
                    attachmentUuid: businessAttachmentUuid,
                    readOnly: true,
                  },
                  {
                    title: $T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件"),
                    attachmentUuid: techAttachmentUuid,
                    readOnly: true,
                  },
                  roundBusinessAttachmentUuid ? {
                    title: $T("ssrc.inquiryHall.model.inquiryHall.roundBusinessAttachments").$D("多轮补充商务附件"),
                    attachmentUuid: roundBusinessAttachmentUuid,
                    readOnly: true,
                  } : null,
                  roundTechAttachmentUuid ? {
                    title: $T("ssrc.inquiryHall.model.inquiryHall.roundTechAttachments").$D("多轮补充技术附件"),
                    attachmentUuid: roundTechAttachmentUuid,
                    readOnly: true,
                  } : null,
                  bargainBusinessAttachmentUuid ? {
                    title: $T("ssrc.inquiryHall.model.inquiryHall.bargainBusinessAttachments").$D("议价补充商务附件"),
                    attachmentUuid: bargainBusinessAttachmentUuid,
                    readOnly: true,
                  } : null,
                  bargainTechAttachmentUuid ? {
                    title: $T("ssrc.inquiryHall.model.inquiryHall.bargainTechAttachments").$D("议价补充技术附件"),
                    attachmentUuid: bargainTechAttachmentUuid,
                    readOnly: true,
                  } : null,
                ].filter(Boolean)}
              />
            ;
          },
        },
        {
          formRow: 400,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.winningBidOrTotal").$D("中标标的数/总标的数"),
          fieldCode: "suggestedLineCount",
          render: (value, record) => {
            const { suggestedLineCount, itemLineCount } = record || {};
            const countBid = `${suggestedLineCount} / ${itemLineCount}`;
            return countBid;
          },
        },
      ];

      // item form
      const item = [
        {
          fieldType: "EMPTY",
          formRow: 1,
          formCol: 1,
          fieldCode: "itemName",
          render: (val, record) => {
            const {
              itemName,
            } = record || {};
            return (
              <div style="width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: top;">
                  <div>
                    <div style="display: inline-flex;align-items: center">
                      <img src={itemIcon} alt="supplier" style="margin-right: 4px" />
                      <srm-tooltip title={itemName} placement="bottom">
                        <span class="ssrc-header-title-value">{itemName}</span>
                      </srm-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          formRow: 100,
          formCol: 1,
          fieldCode: "localSuggestedQtnNetAmount",
          // fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonTotalPrice", [ getCheckPriceName(this.bidFlag) ]).$D("{checkPriceName}总金额"),
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.benchmarkLocalSugQtnAmount").$D("中标总金额"),
          render: (val, record) => {
            const {
              localSuggestedQtnNetAmount,
              localSuggestedQtnTotalAmount,
            } = record || {};
            const amount = priceTypeCode === "NET_PRICE" ?
              localSuggestedQtnNetAmount :
              localSuggestedQtnTotalAmount;
            return this.formatFinicial(amount);
          },
        },
        {
          formRow: 100,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedSupplierCount").$D("中标供应商数量"),
          fieldCode: "suggestedSupplierCount",
          render: (val, record) => {
            const { suggestedSupplierCount = null, } = record || {};
            return this.formatFinicial(suggestedSupplierCount);
          },
        },
        {
          formRow: 200,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierSavingAmountMobile").$D("节支金额"),
          fieldCode: "savingAmount",
          render: (val, record) => {
            const { savingAmount = null, } = record || {};
            return this.formatFinicial(savingAmount);
          },
        },
        {
          formRow: 200,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierSavingRatioMobile").$D("节支率"),
          fieldCode: "savingsRate",
          render: (value, record) => {
            const { savingRatio } = record || {};
            return !isNil(savingRatio) ? `${savingRatio}%` : "-";
          },
        },
        {
          formRow: 300,
          formCol: 1,
          fieldName: auctionDirection === "FORWARD" ?
            this.$T("ssrc.inquiryHall.model.inquiryHall.maxSuggestedFlag").$D("是否最高价中标") :
            this.$T("ssrc.inquiryHall.model.inquiryHall.minMaxSuggestedFlag").$D("是否最低价中标"),
          fieldCode: "minMaxSuggestedFlag",
          render: (value, record) => {
            const { minMaxSuggestedFlag } = record || {};
            if (isNil(minMaxSuggestedFlag)) {
              return "-";
            }
            return minMaxSuggestedFlag ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否");
          },
        },
        {
          formRow: 300,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAttachment").$D("行附件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          showCount: true,
          readOnly: true,
          bucketName: this.bucketName,
          bucketDirectory: "ssrc-rfx-rfxitem",
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        },
        {
          formRow: 400,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.winningItemNum").$D("中标项数"),
          fieldCode: "winBidNumber",
          render: (value, record) => {
            const { suggestedSupplierCount, allSupCount } = record || {};
            const countBid = `${suggestedSupplierCount} / ${allSupCount}`;
            return countBid;
          },
        },
      ];
      return this.isSupplierTab() ? supplier : item;
    },
  },
  beforeMount() {
    this.initRfxBid();
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        this.fetchConfig();
        this.fetchAllPage();
        this.fetchBidFileTemplateConfig();
      } finally {
        this.$loading.hide();
      }
    }

    this.$emit("GetApprovalTitle", this.approvalTitle());
  },
  methods: {
    // 查询招标文件模板是否启用
    async fetchBidFileTemplateConfig() {
      const flag = await queryBidFileTemplateConfig();
      this.fileTemplateManageFlag = flag;
    },
    async fetchConfig() {
      this.doubleUnitFlag = await queryDoubleUnit({
        businessModule: "RFX",
      });
    },
    async fetchAllPage() {
      await this.getProjectSection();
      await this.getPricingOrderHead(this.sourceHeaderId);
      await this.getLineCheckInfo(this.sourceHeaderId);
      await this.getProcessFile(this.sourceHeaderId);
    },
    approvalTitle() {
      const title = !this.bidFlag ?
        this.$T("hipspfm.pricingApproval.view.message.title.checkPriceApproval").$D("寻源核价审批") :
        this.$T("hipspfm.pricingApproval.view.title.bidNewPriceApproval").$D("招标书定标审批");
      return title;
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
    getCustomizeUnitCode(type) {
      if (!type || isEmpty(type)) {
        return null;
      }

      const RfxCodeMap = new Map([
        [ "base", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE.BASE_FORM_INFO" ], // 基础信息
        [ "supplierForm", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE.SUPPLIER_BASE_FORM_INFO" ], // supplier tab form
        [ "itemTable", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE.SUP_ITEM_LINE_DETAIL" ], // 物料明细, // supplier tab item table
        [ "itemForm", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE.ITEM_BASE_FORM_INFO" ], // item tab form
        [ "supplierTable", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE.ITEM_SUPPLIER_LINE" ], // item tab form supplier table
      ]);

      const BidCodeMap = new Map([
        [ "base", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE_BID.BASE_FORM_INFO" ], // 基础信息
        [ "supplierForm", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE_BID.SUPPLIER_BASE_FORM_INFO" ], // supplier tab form
        [ "itemTable", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE_BID.SUP_ITEM_LINE_DETAIL" ], // 物料明细, // supplier tab item table
        [ "itemForm", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE_BID.ITEM_BASE_FORM_INFO" ], // item tab form
        [ "supplierTable", "SMBL.WORKFLOW.PRICING_APPROVAL_COMPLETE_BID.ITEM_SUPPLIER_LINE" ], // item tab form supplier table
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
    handCardClick(record, key) {
      if (this.isSupplierTab()) {
        this.currentSupplierTabIndex = key;
        document.getElementById(`${record.rfxLineSupplierId}${key}`).scrollIntoViewIfNeeded();
      }
      if (this.isItemTab()) {
        this.currentItemTabIndex = key;
        document.getElementById(`${record.rfxLineItemId}${key}`).scrollIntoViewIfNeeded();
      }

      this.fetchSupplierOrItemSingle(record);
      this.fethSupplierOrItemTable(record);
    },
    getCurrentSelectTabDS() {
      let ds = this.selectTabSupplierListDS;
      if (this.isItemTab()) {
        ds = this.selectTabItemListDS;
      }

      return ds;
    },
    renderTags(item) {
      const tags = this.renderSupplierTag(item);

      if (isEmpty(tags)) {
        return "";
      }

      return (
        <div style="display: flex; align-items: top;">
          {tags.map((tag, index) =>
            <div key={String(index)}>
              {tag}
            </div>
          )}
        </div>
      );
    },
    renderSupplierTag(item) {
      const {
        entryMethod,
        // quotationStatus,
        supplierStatus,
        candidateFlag,
        eliminateFlag,
        partEliminate,
        reviewFlag,
        invalidFlag,
      } = item || {};
      /**
       * 显示供应商的所有标签信息，例如：候选人、线上、线下、全部淘汰、部分淘汰、符合性检查不通过、无效、放弃
       *
       * entryMethod: OFFLINE/线下录入|ONLINE/线上录入
       candidateFlag: 1为候选
       eliminateFlag: 1为全部淘汰
       partEliminate：1为部分淘汰
       reviewFlag: 1为符合性检查不通过
       invalidFlag：1为无效标志
       supplierStatus: ABANDONED放弃*/
      const tagList = [];
      if (entryMethod === "OFFLINE") {
        tagList.push(
          <span class="priceComparisonTab-supplierTag">
            {this.$T("ssrc.common.view.title.OFFLINE").$D("线下")}
          </span>
        );
      }

      // if (entryMethod === "ONLINE") {
      //   tagList.push(
      //     <span class="priceComparisonTab-supplierTag">
      //       {this.$T("ssrc.common.view.title.ONLINE").$D("线上")}
      //     </span>
      //   );
      // }

      if (eliminateFlag === 1) {
        tagList.push(
          <span class="priceComparisonTab-supplierTag">
            {this.$T("ssrc.common.view.status.allEliminate").$D("全部淘汰")}
          </span>
        );
      }

      if (partEliminate === 1) {
        tagList.push(
          <span class="priceComparisonTab-supplierTag">
            {this.$T("ssrc.common.view.status.partiallyEliminate").$D("部分淘汰")}
          </span>
        );
      }

      if (invalidFlag === 1) {
        tagList.push(
          <span class="priceComparisonTab-supplierTag">
            {this.$T("ssrc.common.view.status.invalid").$D("无效")}
          </span>
        );
      }

      if (candidateFlag === 1) {
        tagList.push(
          <span class={"priceComparisonTab-supplierTag"}>
            {this.$T("ssrc.common.view.title.candidatePeople").$D("候选人")}
          </span>
        );
      }

      if (supplierStatus === "ABANDONED" || supplierStatus === "QUOTATION_ABANDONED") {
        tagList.push(
          <span class={"priceComparisonTab-supplierTag"}>
            {this.$T("ssrc.supplierQuotation.view.message.giveUp").$D("放弃")}
          </span>
        );
      }

      if (supplierStatus === "UN_QUOTATION") {
        tagList.push(
          <span class={"priceComparisonTab-supplierTag"}>
            {this.$T("ssrc.inquiryHall.model.inquiryHall.noQuotation").$D("未报价")}
          </span>
        );
      }

      if (supplierStatus === "NEW") {
        tagList.push(
          <span class={"priceComparisonTab-supplierTag"}>
            {this.$T("ssrc.inquiryHall.model.inquiryHall.noFeedback").$D("未反馈")}
          </span>
        );
      }

      if (reviewFlag === 1) {
        tagList.push(
          <span class={"priceComparisonTab-supplierTag"}>
            {this.$T("ssrc.common.view.message.tag.complianceCheckRejected").$D("符合性检查不通过")}
          </span>
        );
      }

      return tagList;
    },
    async handleTabSelect() {
      await this.fetchSelectTab();

      const modalTitle = this.isSupplierTab() ? this.$T("ssrc.common.view.message.title.changeSupplier").$D("切换供应商") : this.$T("ssrc.common.view.message.title.changeItem").$D("切换物料");
      this.selectTabItemModalRef = await this.$popup({
        title: modalTitle,
        headerAlign: "center",
        height: "80%",
        showHeader: true,
        showClose: true,
        rounded: true,
        content: <srm-list
          scrollable={false}
          dataSet={this.getCurrentSelectTabDS()}
          onItemClick={this.selectTabCurrentLine}
          columns={this.getSelectTabItemColumns()} />,
        onClose: () => {
          this.getCurrentSelectTabDS().reset();
        },
      });
    },
    async fetchSelectTab() {
      const currentDS = this.getCurrentSelectTabDS();
      const BODY_PARAMS = {
        rfxHeaderId: this.sourceHeaderId,
        // organizationId: this.organizationId,
        suggestedFlag: this.getCurrentTabListSuggestedFlag(),
        sourceMobileEndFlag: 1,
      };
      currentDS.setQueryParameter({
        customizeUnitCode: "",
      });

      this.$loading.show();

      currentDS.setBodyParameter(BODY_PARAMS);
      await currentDS.query();

      this.$loading.hide();
    },
    getSelectTabItemColumns() {
      const {
        // auctionDirection,
        priceTypeCode,
      } = this.headInfo;

      const supplier = [
        {
          fieldType: "EMPTY",
          formRow: 10,
          formCol: 1,
          fieldCode: "supplierCompanyName",
          render: (val, record) => {
            const {
              quotationRank,
            } = record || {};
            return (
              <div style="width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: top;">
                  <div>
                    <div style="display: inline-flex;align-items: center">
                      <img src={supplierIcon} alt="supplier" style="margin-right: 4px" />
                      <srm-tooltip title={val} placement="bottom">
                        <span class="ssrc-header-title-value">{val}</span>
                      </srm-tooltip>
                    </div>
                    <div>
                      {this.renderTags(record)}
                    </div>
                  </div>
                  <div>
                    {quotationRank ? <div class="ssrc-header-rank-tag">
                      {this.$T("ssrc.supplierQuotation.model.supQuo.ranking").$D("排名") }: {quotationRank}
                    </div> : ""}
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          formRow: 100,
          formCol: 1,
          fieldCode: "benchmarkLocalSugQtnAmount",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.benchmarkLocalSugQtnAmount").$D("中标总金额"),
          render: (val, record) => {
            const {
              localSuggestedQtnNetAmount,
              localSuggestedQtnTotalAmount,
            } = record || {};
            const amount = priceTypeCode === "NET_PRICE" ? localSuggestedQtnNetAmount : localSuggestedQtnTotalAmount;
            return this.formatFinicial(amount);
          },
        },
        {
          formRow: 100,
          formCol: 1,
          fieldCode: "suagestedLineCount",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidItemCountInSupplier").$D("中标物料"),
          render: (val, record) => {
            const {
              suggestedLineCount = 0,
              itemLineCount = 0,
            } = record || {};
            const number = `${suggestedLineCount || "0"} / ${itemLineCount || "0"}`;
            return number;
          },
        },
      ];

      // item form
      const item = [
        {
          fieldType: "EMPTY",
          formRow: 10,
          formCol: 1,
          fieldCode: "itemName",
          render: (val, record) => {
            const {
              itemName,
            } = record || {};
            return (
              <div style="width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: top;">
                  <div>
                    <div style="display: inline-flex;align-items: center">
                      <img src={itemIcon} alt="supplier" style="margin-right: 4px" />
                      <srm-tooltip title={itemName} placement="bottom">
                        <span class="ssrc-header-title-value">{itemName}</span>
                      </srm-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          formRow: 100,
          formCol: 1,
          fieldCode: "benchmarkLocalSugQtnAmount",
          // fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonTotalPrice", [ getCheckPriceName(this.bidFlag) ]).$D("{checkPriceName}总金额"),
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.benchmarkLocalSugQtnAmount").$D("中标总金额"),
          render: (val, record) => {
            const {
              localSuggestedQtnNetAmount,
              localSuggestedQtnTotalAmount,
            } = record || {};
            const amount = priceTypeCode === "NET_PRICE" ?
              localSuggestedQtnNetAmount :
              localSuggestedQtnTotalAmount;
            return this.formatFinicial(amount);
          },
        },
        {
          formRow: 100,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedSupplierCount").$D("中标供应商数量"),
          fieldCode: "suggestedSupplierCount",
          render: (val, record) => {
            const { suggestedSupplierCount = null, } = record || {};
            return this.formatFinicial(suggestedSupplierCount);
          },
        },
      ];
      return this.isSupplierTab() ? supplier : item;
    },
    closeSelectTabItemModal() {
      if (this.selectTabItemModalRef) {
        this.selectTabItemModalRef.closePopup();
      }
    },
    selectTabCurrentLine(record, index) {
      const data = {};

      const listData = this.getCurrentTabListData();
      let recordId = null;
      let recordIdName = "";
      let currentRecordIndexInList = index;

      if (this.isSupplierTab()) {
        const rfxLineSupplierId = record.get("rfxLineSupplierId");
        data.rfxLineSupplierId = rfxLineSupplierId;
        recordId = rfxLineSupplierId;
        recordIdName = "rfxLineSupplierId";
      }

      if (this.isItemTab()) {
        const rfxLineItemId = record?.get("rfxLineItemId");
        data.rfxLineItemId = rfxLineItemId;
        recordId = rfxLineItemId;
        recordIdName = "rfxLineItemId";
      }

      if (recordId && !isEmpty(listData) && recordIdName) {
        currentRecordIndexInList = listData.findIndex((line) => line[recordIdName] === recordId);
      }

      this.handCardClick(data, currentRecordIndexInList);
      // this.fetchSupplierOrItemSingle(data);
      // this.fethSupplierOrItemTable(data);

      this.closeSelectTabItemModal();
      this.getCurrentSelectTabDS().reset();
    },
    // getAttachments(attachmentUuid) {
    //   return [ {
    //     attachmentUuid: attachmentUuid,
    //     title: this.$T("ssrc.inquiryHall.model.attachmentUuid").$D("附件"),
    //     readOnly:true,
    //     // uploadButton: "default",
    //     // showInfo: false,
    //   } ];
    // },
    getTitle() {
      return this.$T("ssrc.common.view.message.title.downloadAttachments").$D("过程附件");
    },
    showBaseDetail() {
      this.headDetailInfo = this.headInfo;
      this.basePop = !this.basePop;
    },
    triggerTab() {
      this.showAllTabs = !this.showAllTabs;
    },
    async changeTab(data, index) {
      this.tabIndex = index;
      this.sourceHeaderId = data.sourceHeaderId;
      this.$loading.show();
      this.dataSet.addQueryParameter("rfxHeaderId", data.sourceHeaderId);
      this.dataSet.refresh();
      this.refreshAttachmentListTable();
      await this.getLineCheckInfo(this.sourceHeaderId);
      this.getPricingOrderHead(data.sourceHeaderId).finally(() => {
        this.$loading.hide();
      });
    },
    // 刷新附件列表
    refreshAttachmentListTable() {
      if (!this.fileTemplateManageFlag) {
        return;
      }
      const fileTempAttachmentDS = (this.$refs.fileTempAttachmentRef || {}).fileTempAttachmentDS;

      if (fileTempAttachmentDS) {
        fileTempAttachmentDS.refresh();
      }
    },
    handDimenChange(key) {
      this.currentTab = key || "supplier";
      this.getLineCheckInfo();
      this.$forceUpdate();
    },
    async getProjectSection() {
      return await getProjectSection(this.changeReqId).then((res) => {
        if (res) {
          this.projectSection = res.projectLineSectionList || [];
          this.sourceProject = res.sourceProject || [];
          if (!SrmUtil.isEmpty(res.projectLineSectionList)) {
            this.sourceHeaderId = res.projectLineSectionList[0].sourceHeaderId;
          }
          this.sourceHeaderId = this.sourceHeaderId || this.changeReqId;
        }
      });
    },
    reachBottom() {
      const ds = this.getCurrentTableDS();
      if (ds) {
        ds?.loadMore();
      }
    },
    // 获取核价单头信息
    async getPricingOrderHead(rfxId = null) {
      const rfxHeaderId = rfxId || this.sourceHeaderId;
      if (!rfxHeaderId) {
        return;
      }

      const params = {
        organizationId: this.organizationId,
        rfxHeaderId,
        customizeUnitCode: this.getCustomizeUnitCode("base"),
      };

      let head = await getRfxHeaderCheckPrice(params);
      if (head && head.failed) {
        return;
      }

      head = head || {};
      this.headInfo = head;
      this.baseInfoDS.create(head, 0);
      // this.baseInfoDS.setData([ head ]);
    },
    async fetchSupplierOrItemList(options = {}) {
      const { rfxId, } = options || {};
      const rfxHeaderId = rfxId || this.sourceHeaderId;
      if (!rfxHeaderId) {
        return;
      }

      const data = {
        rfxHeaderId,
        organizationId: this.organizationId,
        suggestedFlag: this.getCurrentTabListSuggestedFlag(),
        querys: {
          customizeUnitCode: "",
        },
        ...options || {},
      };

      let result = null;
      if (this.isSupplierTab()) {
        result = await fetchSupplierLine(data);
      }

      if (this.isItemTab()) {
        result = await fetchItemLine(data);
      }

      if (result && result.failed) {
        return;
      }
      if (isNil(result)) {
        return;
      }
      return result || [];
    },
    async getLineCheckInfo(rfxId) {
      let result = await this.fetchSupplierOrItemList({
        rfxId,
      });

      if (isNil(result)) {
        return;
      }

      let currentFormData = {};
      if (this.isSupplierTab()) {
        this.currentSupplierTabList = result || [];
        this.currentSupplierTabData = result[0] || {};
        this.currentSupplierTabIndex = 0;
        currentFormData = result[0] || {};
      }

      if (this.isItemTab()) {
        this.currentItemTabList = result || [];
        this.currentItemTabData = result[0] || {};
        this.currentItemTabIndex = 0;
        currentFormData = result[0] || {};
      }

      this.fetchSupplierOrItemSingle(currentFormData);
      this.fethSupplierOrItemTable(currentFormData);
    },
    // supplier / item list
    getCurrentTabListData() {
      const list = this.isSupplierTab() ? this.currentSupplierTabList : this.currentItemTabList;
      return list || [];
    },
    getCurrentTabListDataLength() {
      const list = this.getCurrentTabListData() || [];
      return list.length;
    },
    // tab form
    async fetchSupplierOrItemSingle(record) {
      const { rfxLineSupplierId, rfxLineItemId } = record || {};
      const formUnitCodeName = this.isSupplierTab() ? "supplierForm" : "itemForm";
      if (!rfxLineSupplierId && !rfxLineItemId) {
        return;
      }

      const data = {
        organizationId: this.organizationId,
        rfxHeaderId: this.sourceHeaderId,
        rfxLineSupplierId,
        rfxLineItemId,
        sourceMobileEndFlag: 1,
        querys: {
          customizeUnitCode: this.getCustomizeUnitCode([ formUnitCodeName ]),
        },
      };

      let result = null;
      if (this.currentTab === "supplier") {
        result = await fetchSupplierData(data);
      }

      if (this.currentTab === "item") {
        result = await fetchItemData(data);
      }

      if (result && result.failed) {
        return;
      }
      if (isEmpty(result)) {
        return;
      }

      result = result || {};
      if (this.isSupplierTab()) {
        this.currentSupplierTabData = result || {};
      }

      if (this.isItemTab()) {
        this.currentItemTabData = result || {};
      }

      this.currentTabFormDS.create(result, 0);
    },
    // tab table
    async fethSupplierOrItemTable(record) {
      const { rfxLineSupplierId, rfxLineItemId } = record || {};
      const currentTableDS = this.getCurrentTableDS();
      if (!currentTableDS) {
        return;
      }

      if (!rfxLineSupplierId && !rfxLineItemId) {
        currentTableDS.reset();
        return;
      }

      const data = {
        organizationId: this.organizationId,
        rfxHeaderId: this.sourceHeaderId,
        rfxLineSupplierId,
        rfxLineItemId,
        sourceMobileEndFlag: 1,
        customizeUnitCode: this.getCurrentTabTableUnitCode(),
      };

      currentTableDS.addPathParameter("organizationId", this.organizationId);
      currentTableDS.setQueryParameter(data);
      currentTableDS.refresh();
    },
    getCurrentTabTableUnitCode() {
      const name = this.isSupplierTab() ? "itemTable" : "supplierTable";
      const code = this.getCustomizeUnitCode(name);
      return code;
    },
    getCurrentTabListSuggestedFlag() {
      const flag = this.isSupplierTab() ? this.supplierSuggested : this.itemSuggested;
      return flag;
    },
    getLineInfoColumns() {
      const infoColumns = this.isItemTab() ? this.getSupplierTableColumn() : this.getItemTableColumn();

      return infoColumns;
    },
    getItemTableColumn() {
      return [
        {
          formRow: 1,
          formCol: 1,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => {
            const {
              suggestedFlag,
              itemName,
              eliminateRoundNumber
            } = item || {};
            return (
              <div style="width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: top;">
                  <div>
                    <srm-tooltip title={itemName} placement="bottom">
                      <span class="ssrc-header-title-value">{itemName}</span>
                    </srm-tooltip>
                  </div>
                  <div>
                    {suggestedFlag ? <srm-tag
                      type="success"
                      fill>
                      {this.$T("ssrc.inquiryHall.model.inquiryHall.suggest").$D("选用")}
                    </srm-tag> :
                      <srm-tag
                        type="info">
                        {this.$T("ssrc.inquiryHall.model.inquiryHall.noSelectThisQuotation").$D("未选用")}
                      </srm-tag>
                    }
                    {eliminateRoundNumber ? <srm-tag type="info" style="margin-left: 4px;">
                      {this.$T("ssrc.bidHall.view.button.eliminate").$D("淘汰")}
                    </srm-tag> : ""
                    }
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          formRow: 100,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineNo.").$D("行号"),
          fieldCode: "rfxLineItemNum",
          editor: false,
        },
        {
          formRow: 100,
          formCol: 2,
          fieldName: this.$T("ssrc.common.unitPrice").$D("单价"),
          fieldCode: "localLnQuotationPrice",
          visible: this.isTax(),
          render: (val, item) => {
            const { localLnQuotationPrice } = item || {};
            return this.formatPrice(localLnQuotationPrice);
          },
        },
        {
          formRow: 101,
          formCol: 1,
          fieldName: this.$T("ssrc.common.unitPrice").$D("单价"),
          fieldCode: "localLnNetPrice",
          visible: !this.isTax(),
          render: (val, item) => {
            const { localLnNetPrice } = item || {};
            return this.formatPrice(localLnNetPrice);
          },
        },
        {
          formRow: 101,
          formCol: 2,
          fieldName: getQuotationPrice(this.doubleUnitFlag),
          fieldCode: "baseQuotationPrice",
          visible: this.doubleUnitFlag && this.isTax(),
          render: (val, item) => {
            const { baseQuotationPrice } = item || {};
            return this.formatPrice(baseQuotationPrice);
          },
        },
        {
          formRow: 102,
          formCol: 1,
          fieldName: getQuotationPrice(this.doubleUnitFlag),
          fieldCode: "baseNetPrice",
          visible: this.doubleUnitFlag && !this.isTax(),
          render: (val, item) => {
            const { baseNetPrice } = item || {};
            return this.formatPrice(baseNetPrice);
          },
        },
        {
          formRow: 300,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lastWinningBidPrice").$D("上次中标价"),
          fieldCode: "lastBiddedPrice",
          render: (val, item) => {
            const { lastBiddedPrice } = item || {};
            return this.formatPrice(lastBiddedPrice);
          },
        },
        {
          formRow: 300,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.savingRatio").$D("节支率"),
          fieldCode: "savingsRate",
          render: (value, record) => {
            const { savingRatio } = record || {};
            return !isNil(savingRatio) ? `${savingRatio}%` : "-";
          },
        },
        {
          formRow: 400,
          formCol: 1,
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldCode: "rfxQuantity",
          render: (val, item) => {
            const { rfxQuantity } = item || {};
            return this.formatPrice(rfxQuantity);
          },
        },
        {
          formRow: 400,
          formCol: 2,
          fieldName: getAllottedQuantity(this.doubleUnitFlag),
          fieldCode: "allottedQuantity",
          editor: false,
          render: (val, item) => {
            const { allottedQuantity } = item || {};
            return this.formatPrice(allottedQuantity);
          },
        },
        {
          formRow: 500,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quantity").$D("需求数量"),
          fieldCode: "secondaryQuantity",
          editor: false,
          visible: this.doubleUnitFlag,
          render: (val, item) => {
            const { secondaryQuantity } = item || {};
            return this.formatPrice(secondaryQuantity);
          },
        },
        {
          formRow: 500,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allottedQuantity").$D("分配数量"),
          fieldCode: "allottedSecondaryQuantity",
          editor: false,
          visible: this.doubleUnitFlag,
        },
        {
          formRow: 800,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.reason").$D("选用理由"),
          fieldCode: "suggestedRemark",
        },
      ];
    },
    // supplier table
    getSupplierTableColumn() {
      const {
        newQuotationFlag = 0,
      } = this.headInfo;

      return [
        {
          formRow: 1,
          formCol: 1,
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          render: (val, item) => {
            const {
              suggestedFlag,
              supplierCompanyName,
              eliminateRoundNumber
            } = item || {};
            return (
              <div style="width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: top;">
                  <div>
                    <srm-tooltip title={supplierCompanyName} placement="bottom">
                      <span class="ssrc-header-title-value">{supplierCompanyName}</span>
                    </srm-tooltip>
                  </div>
                  <div>
                    {suggestedFlag ? <srm-tag type="success" fill>
                      {this.$T("ssrc.inquiryHall.model.inquiryHall.suggest").$D("选用")}
                    </srm-tag> :
                      <srm-tag type="info">
                        {this.$T("ssrc.inquiryHall.model.inquiryHall.noSelectThisQuotation").$D("未选用")}
                      </srm-tag>
                    }
                    {eliminateRoundNumber ? <srm-tag type="info" style="margin-left: 4px;">
                      {this.$T("ssrc.bidHall.view.button.eliminate").$D("淘汰")}
                    </srm-tag> : ""
                    }
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          formRow: 100,
          formCol: 1,
          fieldName: this.$T("ssrc.common.unitPrice").$D("单价"),
          fieldCode: "localLnQuotationPrice",
          visible: this.isTax(),
          render: (val, item) => {
            const { localLnQuotationPrice } = item || {};
            return this.formatPrice(localLnQuotationPrice);
          },
        },
        {
          formRow: 100,
          formCol: 1,
          fieldName: this.$T("ssrc.common.unitPrice").$D("单价"),
          fieldCode: "localLnNetPrice",
          visible: !this.isTax(),
          render: (val, item) => {
            const { localLnNetPrice } = item || {};
            return this.formatPrice(localLnNetPrice);
          },
        },
        {
          formRow: 100,
          formCol: 2,
          fieldName: getAllottedQuantity(this.doubleUnitFlag),
          fieldCode: "allottedQuantity",
          editor: false,
          render: (val, item) => {
            const { allottedQuantity } = item || {};
            return this.formatPrice(allottedQuantity);
          },
        },
        {
          formRow: 101,
          formCol: 1,
          fieldName: getQuotationPrice(this.doubleUnitFlag),
          fieldCode: "baseQuotationPrice",
          visible: this.doubleUnitFlag && this.isTax(),
          render: (val, item) => {
            const { baseQuotationPrice } = item || {};
            return this.formatPrice(baseQuotationPrice);
          },
        },
        {
          formRow: 102,
          formCol: 2,
          fieldName: getQuotationPrice(this.doubleUnitFlag),
          fieldCode: "baseNetPrice",
          visible: this.doubleUnitFlag && !this.isTax(),
          render: (val, item) => {
            const { baseNetPrice } = item || {};
            return this.formatPrice(baseNetPrice);
          },
        },
        {
          formRow: 120,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allottedQuantity").$D("分配数量"),
          fieldCode: "allottedSecondaryQuantity",
          editor: false,
          visible: this.doubleUnitFlag,
        },

        {
          formRow: 200,
          formCol: 1,
          fieldName: this.$T("ssrc.resultsQuery.model.resultsQuery.selectLineCost").$D("选用行金额"),
          fieldCode: "localSuggestedLnTotalAmount",
          editor: false,
          visible: this.isTax(),
          render: (val, item) => {
            const { localSuggestedLnTotalAmount } = item || {};
            return this.formatPrice(localSuggestedLnTotalAmount);
          },
        },
        {
          formRow: 200,
          formCol: 1,
          fieldName: this.$T("ssrc.resultsQuery.model.resultsQuery.selectLineCost").$D("选用行金额"),
          fieldCode: "localSuggestedLnNetAmount",
          editor: false,
          visible: !this.isTax(),
          render: (val, item) => {
            const { localSuggestedLnNetAmount } = item || {};
            return this.formatPrice(localSuggestedLnNetAmount);
          },
        },
        {
          formRow: 200,
          formCol: 2,
          fieldName: this.$T("ssrc.common.model.common.suggestedFlag").$D("是否选用"),
          fieldCode: "suggestedFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          formRow: 300,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.reason").$D("选用理由"),
          fieldCode: "suggestedRemark",
        },
        {
          formRow: 300,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierLineAttachment").$D("供应商行附件"),
          fieldCode: "attachmentUuid",
          editor: false,
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
          render: (_, record) => {
            const {
              attachmentUuid,
            } = record || {};
            return newQuotationFlag ?
              <file-group name="attachmentUuid" record={record} fileType="LINE" /> :
              <srm-upload
                attachmentUuid={attachmentUuid}
                isTab={false}
                showIcon={false}
                showCount={true}
                readOnly={true}
                bucketName={this.bucketName}
                // bucketDirectory="ssrc-rfx-quotationheader"
                descTitle={this.$T("ssrc.common.model.common.viewAttachment").$D("查看附件")}
                title={this.$T("ssrc.inquiryHall.model.inquiryHall.supplierLineAttachment").$D("供应商行附件")}
              />
            ;
          },
        },
      ];
    },
    // 基础信息详情
    getHeaderBaseDetailInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingTemplate").$D("寻源模板"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
          fieldCode: "sourceCategoryMeaning",
          render: (_, record) => record.secondarySourceCategoryMeaning || record.sourceCategoryMeaning || "-"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
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
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
          fieldCode: "budgetAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.currencyCode").$D("币种"),
          fieldCode: "currencyCodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.exchangeRate").$D("汇率"),
          fieldCode: "exchangeRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonQuotationStartTime", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonqQotationDeadline", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingType").$D("寻源类型"),
          fieldCode: "sourceTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.paymentTerms").$D("付款方式"),
          fieldCode: "paymentTypeName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceCategory").$D("价格类型"),
          fieldCode: "priceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceAnnouncementFlag").$D("创建寻源公告"),
          fieldCode: "sourceAnnouncementFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemRemark").$D("备注"),
          fieldCode: "rfxRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailRemark").$D("初审备注"),
          fieldCode: "pretrailRemark",
        },
      ];
    },
    // 查看附件
    showFileList() {
      // this.fileListDataSet = new DataSet(fileListDs(this.sourceHeaderId));
      this.fileListFlag = true;
    },
    getProcessFile(rfxHeadId) {
      getProcessFileApi(rfxHeadId).then((res) => {
        this.fileListData = res.content || [];
        // 过程附件数量
        this.fileListNum = 0;
        if (this.fileListData.length > 0) {
          this.fileListData.forEach((e) => {
            this.fileListNum = this.fileListNum + e.rfxProcessAttachmentDTOS.length;
          });
        }
      });
    },
    // 获取附件
    getFileListColumns() {
      return [
        {
          fieldName: this.$T("ssrc.common.model.common.node").$D("节点"),
          fieldCode: "nodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.uploadBy").$D("上传人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.creationDate").$D("上传时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.attachmentType").$D("附件类型"),
          fieldCode: "fileType",
          render: (val, record) => <SrmUpload
            type="primary"
            showIcon={false}
            showCount={false}
            descTitle={record.type}
            attachmentUuid={record.rfxProcessAttachmentDTOS} />
        },
      ];
    },
    // 跳转采购申请工作台详情页
    async toDetail(record) {
      // 环境域名
      const environmentUrl = window.location.origin;
      const params = {
        multiSelectHeaderAndLineNums:record.prNum,
        customizeUnitCode: "SPRM.PURCHASE_PLAFORM_EXECUTION.FLATSEARCHBAR,SPRM.PURCHASE_PLAFORM_EXECUTION.LIST"
      };
      this.$loading.show();
      await getPurchaseApi(params).then((res) => {
        if (res.content && res.content.length === 1) {
          // 获取headerId
          const prHeaderId = res.content[0].prHeaderId;
          this.formParameters = {
            prHeaderId,
            type: "readOnly",
          };
          const detailUrl = `/PurchaseReqWorkbench/#/PurchaseReqWorkbenchDetail?prHeaderId=${prHeaderId}&type=readOnly`;
          const toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
          this.detailPopup = this.$popup({
            title: this.$T("ssrc.inquiryHall.view.details").$D("详情"),
            showHeader: true,
            showBack: true,
            content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.prNumDocError").$D("单据不唯一或不存在"),
            duration: 2000
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    async getBiddingList() {
      const res = await getBiddingSupplier(this.sourceHeaderId);
      if (res) {
        this.biddingSupplierList = res;
      }
    },
    calcMicrometer(value) {
      if (typeof value !== "undefined" && typeof value !== "object") {
        return String(value).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      }
    },
    previewRemarkImg(e) {
      if (e.target.src) {
        const imageArr = e.currentTarget.getElementsByTagName("img");
        let imageSrcArr = [];
        for (let i = 0; i < imageArr.length; i++) {
          if (imageArr[i]?.src) {
            imageSrcArr.push(imageArr[i]?.src);
          }
        }
        const indexSrc = imageSrcArr.findIndex((item) => item === e.target.src) || 0;
        this.$previewImage(imageSrcArr, { index: indexSrc, showClose: true, });
      }
      e.stopPropagation();
    },
    //获取阶梯报价信息
    getLadderLevelInfo(item) {
      this.ladderLevelPop = false;
      // eslint-disable-next-line no-unused-vars
      this.ladderLevelDetailData = new DataSet(ladderLevelDetailDs(item.quotationLineId));
      this.ladderLevelDetailData.refresh();
      this.ladderLevels = item;
      this.pricingPop = true;
      this.ladderLevelPop = true;
    },
    multiplyFormAmountAndCombile(list) {
      if (isEmpty(list)) {
        return "-";
      }

      const newPriceList = list.map((value) => this.formatFinicial(value));

      const valueStr = newPriceList.join("/");
      return valueStr;
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
    isSupplierTab() {
      return this.currentTab === "supplier";
    },
    isItemTab() {
      return this.currentTab === "item";
    },
    isTax() {
      const { priceTypeCode } = this.headInfo || {};
      return priceTypeCode && priceTypeCode !== "NET_PRICE";
    },
    getCurrentTableDS () {
      const ds = this.isSupplierTab() ? this.currentSupplierTabTableDS : this.currentItemTabTableDS;
      return ds;
    },
    getSupplierText() {
      const suppliers = {
        all: this.$T("ssrc.inquiryHall.view.selectAllSupplier").$D("查看全部供应商"),
        suggest: this.$T("ssrc.inquiryHall.view.selectUnSupplier").$D("仅查看中标供应商"),
      };
      return suppliers;
    },
    getItemText() {
      const items = {
        all: this.$T("ssrc.inquiryHall.view.selectAllItemView").$D("查看全部物料"),
        suggest: this.$T("ssrc.inquiryHall.view.viewSelectSupplierItem").$D("仅查看选用供应商的物料"),
      };
      return items;
    },
    getSuggestedText(value) {
      const textObj = this.isSupplierTab() ? this.getSupplierText() : this.getItemText();

      let key = "all";
      if (value === 1 || value === "1") {
        key = "suggest";
      }

      return textObj[key];
    },
    getCurrentTabSelectValue() {
      const value = this.isSupplierTab() ? this.supplierSuggested : this.itemSuggested;
      return value;
    },
    getCurrentTabSelectValueText() {
      const textObj = this.isSupplierTab() ? this.getSupplierText() : this.getItemText();
      const currentValue = this.getCurrentTabSelectValue();
      const valueKey = currentValue === 1 || currentValue === "1" ? "suggest" : "all";

      const text = textObj[valueKey];
      return text;
    },
    onApproveStatusSelect(value) {
      const currentValue = value === 1 || value === "1" ? 1 : null;
      if (this.isSupplierTab()) {
        this.supplierSuggested = currentValue;
      }
      if (this.isItemTab()) {
        this.itemSuggested = currentValue;
      }

      this.getLineCheckInfo();
    },
    getCurrentTabName() {
      return this.currentTab;
    },
    // 比价助手
    downloadPriceCompare() {
      const handle = throttle(this.handleDownloadPriceCompare, 10_000);
      handle();
    },
    // 寻源明细
    directionDetailViewPage(record) {
      const { rfxHeaderId, } = record || {};

      if (!rfxHeaderId) {
        return;
      }

      // 环境域名
      const environmentUrl = window.location.origin;
      const documentType = !this.bidFlag ? "RFX" : "BID";

      // 构造跳转地址
      let detailUrl = `/RfxHall/#/RfxHall?rfxHeaderId=${rfxHeaderId}&autoLocationStepNode=SCORING`;

      if (this.bidFlag) {
        // nextPageName = "HallDetail";
        detailUrl = `/NewBidHall/#/HallDetail?rfxHeaderId=${rfxHeaderId}&autoLocationStepNode=SCORING&documentType=${documentType}`;
      }

      if (!detailUrl) {
        return;
      }

      const path = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;

      this.detailPopup = this.$popup({
        title: this.$T("ssrc.inquiryHall.view.details").$D("详情"),
        showHeader: true,
        showBack: true,
        content:<iframe style="height:100%; width:100%" ref="relate_data" src={path}/>
      });
    },
    async handleDownloadPriceCompare() {
      const { rfxHeaderId, } = this.headInfo;
      if (!rfxHeaderId) {
        return;
      }

      const data = {
        organizationId: this.organizationId,
        rfxHeaderId,
      };
      this.$loading.show();
      let res = await checkPriceComparePriceDownloadZip(data);
      if (res && res.failed) {
        this.$notification.open({
          message: res.message,
          class: "notification"
        });
        this.$loading.hide();
        return;
      }

      const result = await getUrl({
        querys: {
          outType: "EXCEL",
        },
        organizationId: this.organizationId,
        token: Array.isArray(res) ? res : [ res ],
      });
      this.$loading.hide();

      downloadFile(result);

      // if (result) {
      //   const tempLink = document.createElement("a");
      //   tempLink.style.display = "none";
      //   tempLink.href = result;
      //   // 兼容：某些浏览器不支持HTML5的download属性
      //   if (typeof tempLink.download === "undefined") {
      //     tempLink.setAttribute("target", "_blank");
      //   }
      //   // 挂载a标签
      //   document.body.appendChild(tempLink);
      //   tempLink.click();
      //   document.body.removeChild(tempLink);
      // }
    }
  }
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl"

.ssrc-rfx-title {
  color: #333;
  font-size: 12px;
  font-weight: 600;
}

.pricing-approval-complete {

  >>> .srm-form {
    min-height: 5vh;
  }

  .header-box {
    padding: 16px;
    font-size: 14px;

    .rfx-title {
      display: block;
      margin-top: 10px;
    }
  }

  .tab {
    position: relative;
    display: block;
    width: 100%;
    border-bottom: #f5f5f5 solid 1px;
    font-size: 14px;

    .tab-container {
      width: calc(100% - 46px);
      overflow-x: scroll;
      -webkit-overflow-scrolling: touch;
      padding: 0 5px;

      .tab-item-box {
        margin: 8px;
        display: inline-block;

        .tab-item {
          color: #333;
          font-size: 12px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          border-radius: 12px;
          font-family: PingFangSC-Medium;
          line-height: 16px;
          min-width: 50px;
        }

        .tab-item-active {
          color: $srm-theme-color-primary;
          background: $srm-theme-color-primary-fill;
        }
      }
    }

    .tab-trigger {
      position: absolute;
      height: 40px;
      width: 46px;
      right: 0;
      top: 0;
      box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.06);
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
    }

    .tab-trigger-active {
      background: #f5f5f5;
    }
  }
}

>>> .srm-list-item-card-head-left {
  max-width: 80%;
  white-space: nowrap
  overflow: hidden;
  word-break: all;
  text-overflow: ellipsis;
  margin-left: 0 !important;

  .srm-tag {
    margin-right: 5px;
  }
}

.pricing-approving {
  >>> .no-content{
    height: calc(100vh-500px) !important
    padding-bottom: 0

    img{
      width: 80px;
      height: 80px;
    }
  }
}

.bidding-header{
  font-weight: bold;
  padding: 8px 0;
}

.bidding-item{
  padding: 8px 0;
}

.pricing-approval-complete-detail-selection {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.pricing-approval-complete-detail-content {
  border-top: 2px var(--background-color-empty-second) solid;
  padding-top: 10px;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 999;
}

.pricing-approval-complete-detail-left {
  width: 50%;
}

.pricing-approval-complete-detail-right {
  // width: 50%;

  >>> .srm-tooltip-container {
    width: 100%;

    .srm-dropdown-button-tooltip {
      width: 100%;
      height: 8vw;
      background-color: white;
      padding-right: 0;

      .srm-dropdown-button-box {
        justify-content: right;
      }

      .srm-dropdown-button-text {
        min-width: 20px;
        max-width: 90%;
        font-size: 12px;
        font-weight: 400;
        color: #1D2129;
        font-family: PingFangSC-Regular;
      }

      .srm-button-text {
        .srm-icon {
          color: #1D2129;
          font-size: 10px;
          margin-left: 8px;
        }
      }
    }
  }
}

.change-button-active {
  font-size: 20px;
}

.change-button-unactive {
  font-size: 17px;
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

.ssrc-header-rank-tag {
  background: rgba(71,184,131,0.15);
  border-radius: 2px;
  font-size: 12px;
  color: #179454;
  text-align: justify;
  line-height: 18px;
  font-weight: 600;
  padding: 0 4px;
  max-width: 50px;
  white-space: nowrap
  overflow: hidden;
  text-overflow: ellipsis;
}

.srm-wrap-scoll-card {
  position: sticky;
  top: -1px;
  z-index: 999;
  background: var(--color-bg-default);
}

.ssrc-scroll-tab-item-customize-title {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background: var(--background-color-empty-second);
  color: var(--font-color-default);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 3.733vw;
  font-weight: 500;
  line-height: 5.333vw;
  padding: 2.667vw 4vw;
}

.ssrc-header-title-value {
  font-weight: 600;
}

.srm-content-top {
  display: flex;
  height: 52px;
  justify-content: space-between;
  align-items: center;

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

.priceComparisonTab-supplierTag {
  font-family: PingFangSC-Medium;
  //color: #4E5769;
  background-color: #F0F2F5;
  padding: 4px;
  border-radius: 5px;
  margin-left: 6px;
  font-size: 10px;
  color: #333333;
  line-height: 12px;
  font-weight: 500;
}

</style>
