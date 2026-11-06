<template>
  <!-- 开标 -->
  <div
    :class="headInfo.rfxStatus==='OPEN_BID_PENDING' && headInfo.openEnabledFlag===1 ? 'ssrc-rfx-detail-component-open-bid-include-bottom-button-wrap' : ''">
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <div style="padding: 16px 15px;">
          <customize
            :data-source="headInfo"
            :columns="getBasicColumns"
            :code="getCustomizeCode('basicInfo')"
            type="list"
            :need-padding="false" />
        </div>
      </srm-scroll-tab-item>
      <!-- 开标详情 -->
      <srm-scroll-tab-item :label="getLanguageDefine('bidOpening')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="bidOpeningDataSet"
                  :columns="getOpenDetailColumns"
                  :customize-code="getCustomizeCode('bidOpening')"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="bidOpeningNewFlag === true" :label="getLanguageDefine('bidOpeningOverView')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="bidOpeningViewDataSet"
                  :columns="getColumnsView"
                  :customize-code="getCustomizeCode('bidOpeningOverView')"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 详情弹框 -->
    <srm-popup :visible="quotationDetailPop"
               :title="$T('ssrc.inquiryHall.model.inquiryHall.quotationDetail').$D('报价明细')"
               height="100%"
               :show-back="true"
               :show-close="true"
               :show-header="true"
               @onClose="itemDetailTableClosePopup">
      <srm-list :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="quotationDetailLineDS"
                :columns="getQuotationLineColumns"
                :customize-code="getCustomizeCode('quotationLine')"/>
    </srm-popup>
    <!-- 过程附件弹框 -->
    <!--    <process-attachment-pop ref="processAttachComRef" /> -->
  </div>
</template>

<script>
import { bidOpeningDs, bidOpeningViewDataSet, quotationDetailLineDataSet, } from "../../datasource/BidOpeningDs";
import { DataSet, $T, SrmUtil, SrmUpload } from "srm-mobile-ui";

// import ProcessAttachmentPop from "../commonPop/ProcessAttachmentPop";
import {
  getPriceName,
  getNetPriceName,
  getAvailableQtyName,
  getQuantityAndUomCombine,
} from "@/utils/doubleUnit.js";

import {
  getBasicInfoApi,
  getSecBidOpeningEnableApi,
} from "../../api/BidOpening";
import { queryEnableDoubleUnit } from "../../../NewSupplierQuotation/api";
import { commonRfxStatusColor } from "../../../NewSupplierQuotation/components/commonRfxStatusColor";

export default {
  modules: [ "ssrc.queryRfq", "ssrc.inquiryHall", "smbl.common", "hipspfm.common", "ssrc.common", "ssrc.supplierQuotation", "hzero.common" ],
  name: "BidOpening",
  components: {
    // ProcessAttachmentPop
  },
  props: {
    rfxHeaderId: {
      type: String,
    },
    documentType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      bucketName: SrmUtil.getDefaultBucketName(),
      // 基础信息
      headInfo: {},
      // 开标信息
      bidOpeningDataSet: new DataSet(),
      bidOpeningViewDataSet: new DataSet(bidOpeningViewDataSet()),
      quotationDetailLineDS: new DataSet(quotationDetailLineDataSet()),
      visibleDetailPopup: false,
      infoDetailPopup: {},
      bidOpeningNewFlag: false, // 专家评分开标是否开启新功能
      quotationDetailPop: false,
      bidFlag: this.documentType === "BID",
      doubleUnitFlag: false, // 双单位是否开启标志
    };
  },
  // 获取字段
  computed: {
    getBasicColumns() {
      const columnList = [
        {
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, item) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                {item.rfxNum || "-"}
              </span>
            </SrmListHeader>,
        },
        {
          fieldCode: "rfxTitle",
          fieldName: this.bidFlag ? $T("ssrc.inquiryHall.model.inquiryHall.rfxTitle").$D("招标书标题") : $T("ssrc.inquiryHall.model.inquiryHall.inquiryTitle").$D("询价单标题"),
          formRow: 20,
        },
        {
          fieldCode: "companyName",
          fieldName: $T("ssrc.common.company").$D("公司"),
          formRow: 30,
        },
        {
          fieldCode: "sourceCategory",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          formRow: 40,
          render: (val, item) => {
            const { secondarySourceCategoryMeaning, sourceCategoryMeaning, } = item || {};
            return secondarySourceCategoryMeaning || sourceCategoryMeaning || "";
          },
        },
        {
          fieldCode: "sourceMethod",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
          formRow: 60,
          render: (val, item) => {
            const { sourceMethodMeaning, } = item || {};
            return sourceMethodMeaning || "";
          },
        },
      ];

      return columnList;
    },
    getOpenDetailColumns() {
      const { expertScoreType, openBidOrder, existSecondOpenBidFlag, bidRuleType, } = this.headInfo || {};
      // // 不包含专家评分节点 || 不区分商务技术 || 区分商务技术同步评标
      const showBidFlag =
          expertScoreType !== "ONLINE" ||
          bidRuleType === "NONE" ||
          bidRuleType === "DIFF" && openBidOrder === "SYNC";
      // 配置表开启 && 存在二阶段开标 && 包含专家评分节点 && 先技术后商务或者先商务后技术
      const showSecondBidFlag =
          this.bidOpeningNewFlag &&
          existSecondOpenBidFlag === 1 &&
          expertScoreType === "ONLINE" &&
          [ "TECH_FIRST", "BUSINESS_FIRST" ].includes(openBidOrder);

      const columnList = [
        {
          fieldCode: "realName",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, item) => {
            const { realName, } = item || {};
            return <SrmListHeader>
              <span>
                { realName || "-"}
              </span>
            </SrmListHeader>;
          }
        },
        !this.bidOpeningNewFlag || showBidFlag ? {
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.openBidStatus").$D("开标状态"),
          fieldCode: "openedFlag",
          formRow: 30,
          render: (_, record) => {
            const { openedFlagMeaning, openedFlag, } = record || {};
            const statusClass = openedFlag === 1 ? "opened-bidding-status-bg" : "un-opened-bidding-status-bg";
            return (
              <div class={`ssrc-open-bidding-table-line-status-wrap ${statusClass}`}>
                { openedFlagMeaning || "" }
              </div>
            );
          },
        } : null,
        showSecondBidFlag ? {
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.openTechBidStatus").$D("技术开标状态"),
          fieldCode: "techFlag",
          formRow: 30,
          render: (_, record) => {
            const { openedFlagMeaning, secondOpenedFlagMeaning, openedFlag, secondOpenedFlag, } = record || {};
            const status = openBidOrder === "TECH_FIRST" ? openedFlag : secondOpenedFlag;
            const statusMeaning = openBidOrder === "TECH_FIRST" ? openedFlagMeaning : secondOpenedFlagMeaning;
            const statusClass = status === 1 ? "opened-bidding-status-bg" : "un-opened-bidding-status-bg";
            return (
              <div class={`ssrc-open-bidding-table-line-status-wrap ${statusClass}`}>
                { statusMeaning || "" }
              </div>
            );
          },
        } : null,
        showSecondBidFlag ? {
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.openBusinessBidStatus").$D("商务开标状态"),
          fieldCode: "bussinessFlag",
          formRow: 40,
          render: (_, record) => {
            const { openedFlagMeaning, secondOpenedFlagMeaning, openedFlag, secondOpenedFlag, } = record || {};
            const status = openBidOrder === "TECH_FIRST" ? secondOpenedFlag : openedFlag;
            const statusMeaning = openBidOrder === "TECH_FIRST" ? secondOpenedFlagMeaning : openedFlagMeaning;
            const statusClass = status === 1 ? "opened-bidding-status-bg" : "un-opened-bidding-status-bg";
            return (
              <div class={`ssrc-open-bidding-table-line-status-wrap ${statusClass}`}>
                { statusMeaning || "" }
              </div>
            );
          },
        } : null,
        {
          fieldCode: "phone",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.contactMobilephone").$D("联系方式"),
          formRow: 20,
          render: (_, record) => {
            const { internationalTelCodeMeaning, phone, } = record || {};
            return internationalTelCodeMeaning ? `${internationalTelCodeMeaning} | ${phone}` : phone;
          },
        },
        {
          fieldCode: "email",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.email").$D("电子邮件"),
          formRow: 30,
        },
      ];

      return columnList;
    },
    // 报价明细行
    getQuotationLineColumns() {
      const doubleUnitFlag = this.doubleUnitFlag;

      const Fields = [
        {
          formRow: 1,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => {
            const {
              itemName,
              displayQuotationLineStatus,
              displayQuotationLineStatusMeaning,
            } = item || {};
            // todo 先暂时用，后期状态统一
            const statusClass = displayQuotationLineStatus === "SUBMITTED" ? "opened-bidding-status-bg" : "un-opened-bidding-status-bg";
            return <SrmListHeader>
              <div class="ssrc-table-line-customize-header-titles">
                {itemName ?? ""}
              </div>
              <span slot="right">
                <div class={`ssrc-open-bidding-table-line-status-wrap ${statusClass}`}>
                  {commonRfxStatusColor(displayQuotationLineStatus, displayQuotationLineStatusMeaning)}
                </div>
              </span>
            </SrmListHeader>;
          },
        },
        {
          fieldName: getQuantityAndUomCombine(doubleUnitFlag),
          fieldCode: "rfxQuantity",
          formRow: 20,
          formCol: 1,
          render: (val, item) => {
            const currentValue = this.getQuantityAndUomCombineValue(item);
            return currentValue;
          },
        },
        doubleUnitFlag ? {
          fieldName: $T("ssrc.common.quantityAndUomCombine").$D("数量-单位"),
          fieldCode: "secondaryQuantity",
          formRow: 20,
          formCol: 2,
          render: (val, item) => {
            const currentValue = this.getSecondaryQuantityAndUomCombineValue(item);
            return currentValue;
          },
        } : null,
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          formRow: 30,
          formCol: 1,
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
        },
        // {
        //   formRow: 30,
        //   formCol: 2,
        //   fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachment").$D("采购方附件"),
        //   fieldCode: "rfxAttachmentUuid",
        //   fieldType: "UPLOAD",
        //   showCount: true,
        //   readonly: true,
        //   bucketName: this.bucketName,
        //   title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        // },
        {
          formRow: 40,
          formCol: 1,
          fieldCode: "specs",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.specs").$D("规格"),
        },
        {
          formRow: 40,
          formCol: 2,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.abandon").$D("放弃"),
          fieldCode: "abandonedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          formRow: 50,
          formCol: 1,
          fieldName: getPriceName(doubleUnitFlag),
          fieldCode: "quotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: !doubleUnitFlag,
        },
        {
          formRow: 50,
          formCol: 2,
          fieldName: getNetPriceName(doubleUnitFlag),
          fieldCode: "validNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          editLimit: true,
          visible: !doubleUnitFlag,
        },
        doubleUnitFlag ? {
          formRow: 60,
          formCol: 1,
          fieldName: $T("ssrc.common.model.common.taxPrice").$D("单价(含税)"),
          fieldCode: "quotationSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        } : null,
        doubleUnitFlag ? {
          formRow: 60,
          formCol: 2,
          fieldName: $T("ssrc.common.model.common.netPrice").$D("单价(不含税)"),
          fieldCode: "validNetSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        } : null,
        {
          formRow: 70,
          formCol: 1,
          fieldCode: "priceBatchQuantity",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.priceBatch").$D("价格批量"),
        },
        {
          formRow: 80,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxQuotationAmount").$D("行金额(含税)"),
          fieldCode: "totalAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 80,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmountWithoutTax").$D("行金额(不含税)"),
          fieldCode: "netAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 90,
          formCol: 1,
          fieldCode: "taxIncludedFlag",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.taxIncludedFlag").$D("是否含税"),
          render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
        },
        {
          fieldCode: "taxRate",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.taxRateCode").$D("税率"),
          formRow: 90,
          formCol: 1,
        },
        doubleUnitFlag ? {
          formRow: 100,
          formCol: 1,
          fieldName: $T("ssrc.common.model.common.availableQuantity").$D("可供数量"),
          fieldCode: "quotationSecondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          formRow: 100,
          formCol: 2,
          fieldName:getAvailableQtyName(doubleUnitFlag),
          fieldCode:"quotationQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 110,
          formCol: 1,
          fieldName: this.$T("ssrc.common.deliveryCycleDay").$D("供货周期"),
          fieldCode:"deliveryCycle",
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

      return Fields.filter(Boolean);
    },
    // 开标一览表
    getColumnsView() {
      const { quotationScope } = this.headInfo || {};
      const allQuotationFlag = quotationScope === "ALL_QUOTATION";

      const columns = [
        {
          formRow: 1,
          fieldType: "EMPTY",
          fieldCode: "supplierCompanyName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierCompanysName").$D("供应商名称"),
          render: (val, item) => {
            const { supplierCompanyName, supplierName } = item || {};
            const text = supplierCompanyName || supplierName || "";
            return <SrmListHeader>
              <span style="font-weight: normal !important">
                {text || "-"}
              </span>
            </SrmListHeader>;
          },
        },
        {
          formRow: 10,
          fieldCode: "supplierCompanyNum",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.supplierCompanyNum").$D("供应商编码"),
          render: (val, item) => {
            const { supplierCompanyNum, supplierNum } = item || {};
            const text = supplierCompanyNum || supplierNum || "";
            return text;
          },
        },
        !allQuotationFlag && {
          formRow: 11,
          formCol: 1,
          fieldCode: "assignItemCountConcatQuotedCount",
          fieldName: $T("ssrc.common.model.common.quotationNumber").$D("报价行数"),
        },
        {
          formRow: 20,
          formCol: 1,
          fieldCode: "techAttachmentUuid",
          // fieldType: "UPLOAD",
          showCount: true,
          readonly: true,
          bucketName: this.bucketName,
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件"),
          render: (val, item) => {
            const { hideTechAttachmentFlag, } = item || {};
            if (hideTechAttachmentFlag) {
              return "***";
            }
            return (
              <SrmUpload
                attachmentUuid={val}
                bucketName={this.bucketName}
                // show-count={false}
                show-icon={false}
                readonly
                title={$T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件")}
                desc-title={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              />
            );
          },
        },

        {
          formRow: 20,
          formCol: 2,
          fieldCode: "businessAttachmentUuid",
          readonly: true,
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件"),
          render: (val, item) => {
            const { hideBusinessAttachmentFlag, } = item || {};
            if (hideBusinessAttachmentFlag) {
              return "***";
            }
            return (
              <SrmUpload
                attachmentUuid={val}
                bucketName={this.bucketName}
                // show-count={false}
                show-icon={false}
                readonly
                title={$T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件")}
                desc-title={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
              />
            );
          },
        },
        {
          formRow: 30,
          formCol: 1,
          fieldCode: "currencyCode",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationCurrency").$D("报价币种"),
        },
        {
          formRow: 30,
          formCol: 2,
          fieldCode: "supplierTotalAmount",
          fieldName: $T("ssrc.common.totalQuotaionAmount").$D("报价总金额"),
        },
        // 全部报价才显示该字段
        allQuotationFlag && {
          formRow: 40,
          formCol: 1,
          fieldCode: "quotationRank",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationRank").$D("报价排名"),
        },
        {
          formRow: 40,
          formCol: 2,
          fieldCode: "quotationDetail",
          fieldName: $T("ssrc.inquiryHall.view.message.modal.quotationDetail").$D("报价明细"),
          render: (val, item) => {
            const {
              hideQuotationDetailFlag,
            } = item || {};
            if (hideQuotationDetailFlag) {
              return "***";
            }
            return (
              <span style="color: var(--color-other-default-b);" onClick={(e) => this.showQuotationDetailPop(e, { item, })}>
                { this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span>
            );
          },
        },
      ];

      return columns;
    },
  },
  async mounted() {
    if (!this.rfxHeaderId) {
      return;
    }
    try {
      this.$loading.show();
      await this.fetchData();
    } catch (err) {
      this.$loading.hide();
    }
  },
  methods: {
    getQuantityAndUomCombineValue(item) {
      const {
        uomName,
        rfxQuantity,
      } = item || {};
      const quantity = rfxQuantity;
      const uom = uomName;

      const quantityAndUomCombine = quantity && uom ? `${SrmUtil.getNumberLocalized(quantity)}-${uom}` : quantity || uom || "";
      return quantityAndUomCombine;
    },
    getSecondaryQuantityAndUomCombineValue(item) {
      const {
        secondaryUomName,
        secondaryQuantity,
      } = item || {};
      const quantity = secondaryQuantity;
      const uom = secondaryUomName;

      const quantityAndUomCombine = quantity && uom ? `${SrmUtil.getNumberLocalized(quantity)}-${uom}` : quantity || uom || "";
      return quantityAndUomCombine;
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
    async showQuotationDetailPop(e, data) {
      const { item, } = data || {};
      const { quotationHeaderId } = item || {};
      if (!quotationHeaderId) {
        return;
      }

      this.quotationDetailLineDS.setQueryParameter({
        rfxHeaderId: this.rfxHeaderId,
        quotationHeaderId,
        customizeUnitCode: this.getCustomizeCode("quotationLine"),
        sourceMobileEndFlag: 1,
      });

      await this.quotationDetailLineDS.refresh();

      this.quotationDetailPop = !this.quotationDetailPop;
    },
    itemDetailTableClosePopup() {
      this.quotationDetailPop = false;
      this.quotationDetailLineDS.reset();
    },
    async fetchData() {
      await this.fetchBidOpeningBlackConfig();
      this.queryDoubleUnit();

      this.bidOpeningViewDataSet.setQueryParameter({
        customizeUnitCode: this.getCustomizeCode("bidOpeningOverView"),
      });
      this.bidOpeningViewDataSet.setBodyParameter({
        rfxHeaderId: this.rfxHeaderId,
        sourceMobileEndFlag: 1,
      });

      this.bidOpeningDataSet = new DataSet(bidOpeningDs(this.rfxHeaderId));
      this.bidOpeningDataSet.setQueryParameter({
        customizeUnitCode: this.getCustomizeCode("bidOpening"),
        rfxRole: "OPENED_BY",
      });
      await getBasicInfoApi(this.rfxHeaderId, { data: {
        customizeUnitCode: this.getCustomizeCode("basicInfo"),
        sourceMobileEndFlag: 1,
      },
      }).then((res) => {
        this.headInfo = { ...res };
        this.$loading.hide();
      });

      this.bidOpeningDataSet.refresh();
      this.bidOpeningViewDataSet.refresh();
    },
    // 查询专家评分开标是否开启新功能, 不在在该配置表中的租户默认走新功能
    async fetchBidOpeningBlackConfig() {
      const data = await getSecBidOpeningEnableApi({ rfxHeaderId: this.rfxHeaderId, sourceMobileEndFlag: 1, });
      if (!data?.failed) {
        this.bidOpeningNewFlag = Boolean(data);
      }
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "basicInfo": $T("ssrc.inquiryHall.view.inquiryHall.headerBaseInfo").$D("基础信息"),
        "bidOpening": $T("ssrc.inquiryHall.view.inquiryHall.bidOpeningDetail").$D("开标详情"),
        "bidOpeningOverView": $T("ssrc.inquiryHall.view.message.modal.openingBid.list").$D("开标一览表"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCustomizeCode(code) {
      const bidFlag = this.bidFlag;

      const codeList = {
        basicInfo: bidFlag ? "SMBL.NEW_BID_HALL.BP.BASICINFO_NEW" : "SMBL.INQUIRY_HALL.BP.BASICINFO_NEW",
        bidOpening: bidFlag ? "SMBL.NEW_BID_HALL.BP.BIDOPENING_NEW" : "SMBL.INQUIRY_HALL.BP.BIDOPENING_NEW",
        bidOpeningOverView: bidFlag ? "SMBL.NEW_BID_HALL.BP.BASICINFO.DETAIL_NEW" : "SMBL.INQUIRY_HALL.BP.BASICINFO.DETAIL_NEW",
        quotationLine: bidFlag ? "SMBL.NEW_BID_HALL.BP.BIDOPENING.DETAIL_NEW" : "SMBL.INQUIRY_HALL.BP.BIDOPENING.DETAIL_NEW",
      };
      return codeList[code] || "";
    },
  }
};
</script>

<style lang="stylus" scoped>

.ssrc-rfx-detail-component-open-bid-include-bottom-button-wrap {
  margin-bottom: constant(safe-area-inset-top);
  //height: 50vh;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.ssrc-open-bidding-table-line-status-wrap {
  font-size: 3vw;
  text-align: right;
  line-height: 18px;
  font-weight: 600;
  border-radius: 2px;
  display: inline-flex;
  padding: 1px 4px;
}

.opened-bidding-status-bg {
  background: rgba(71,184,131,0.15);
  color: #179454;
}

.un-opened-bidding-status-bg {
  background: #E5E7EC;
  color: #4E5769;
}

</style>