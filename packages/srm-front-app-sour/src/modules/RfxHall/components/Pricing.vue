<template>
  <!-- 核价 -->
  <div>
    <!-- 内容区域 -->
    <srm-scroll-tab class="content">
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.headerBaseInfo').$D('基础信息')" >
        <div class="customize-card" @click="goToPricingBasicInfoDetail">
          <customize :need-padding="true" type="list" :data-source="headInfo" code="SMBL.INQUIRY_HALL.RFXPRICE_RFXPRICE_HEADER_DETAIL" :columns="getPricingBasicInfoColumns" />
        </div>
        <div v-if="getTenantNum === 'SRM-WEILONG'">
          <div v-for="(item, index) in weilongFileList" :key="index">
            <img :src="item" style="width: 100%" @click="$previewImage(weilongFileList,{ index: index })">
          </div>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.costRemark').$D('成本备注')" >
        <div class="customize-card" @click="goToPricingCostRemarkDetail">
          <customize :need-padding="true" :data-source="headInfo" code="SMBL.INQUIRY_HALL.PRICING_COSTRE_MARK" :columns="getPricingCostRemarkColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.tab.allQuotationDetails').$D('全部报价明细')" >
        <!-- <div v-for="(item, index) in allQuotationDetails" :key="index" class="customize-card">
          <div @click="goToAllQuotationDetail(item)">
            <customize :need-padding="true" :data-source="item" code="SMBL.INQUIRY_HALL.ALL_QUOTATION_DETAILS" :columns="getAllQuotationDetailsColumns" />
          </div>
        </div> -->
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="allQuotationListDS"
                  customize-code="SMBL.INQUIRY_HALL.ALL_QUOTATION_DETAILS"
                  :columns="getAllQuotationDetailsColumns"
                  @itemClick="goToAllQuotationDetail"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.library.attachmentUuid').$D('附件')" >
        <div class="customize-card">
          <customize :need-padding="true" :data-source="headInfo" :columns="getProcessAttachmentColumns" />
        </div>
      </srm-scroll-tab-item>
      <!-- 附件列表 -->
      <srm-scroll-tab-item v-if="fileTemplateManageFlag" :show-title="false" :label="$T('ssrc.inquiryHall.view.message.tab.attachmentList').$D('附件列表')">
        <file-temp-attachment ref="fileTempAttachmentRef" :head-info="headInfo" :editor-flag="false" unit-code-symbol="fileTempAttach-detail"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 报价明细弹窗 -->
    <srm-popup height="100%" :visible.sync="pricingPop" :show-header="false">
      <!-- 过程附件 -->
      <div v-if="processAttachmentPop">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="processAttachmentData"
                  code="SMBL.INQUIRY_HALL.PRICE_PROCESS_ATTACHMENT"
                  :columns="getProcessAttachmentDetailColumns"/>
      </div>
      <!-- 阶梯报价 -->
      <div v-if="ladderLevelPop">
        <ul style="padding: 16px 0 12px 15px">
          <customize
            :data-source="ladderLevels"
            :columns="getLadderLevelColumns"
            code="SMBL.INQUIRY_HALL.PRICE_LADDER_LEVEL"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank size="mid" theme="fill" />
        <srm-list :scrollable="false"
                  height="auto"
                  customize-code="SMBL.INQUIRY_HALL.PRICE_LADDER_LEVEL_LINE"
                  style="height: auto"
                  :data-set="ladderLevelDetailData"
                  :columns="getLadderLevelDetailColumns"/>
      </div>
      <!-- 报价明细 -->
      <section v-if="quotaionDetailPop" key="quotaionDetailPop">
        <srm-scroll-tab >
          <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.quotaionDetail').$D('报价明细')">
            <ul style="padding: 16px 0 12px 15px">
              <customize
                :data-source="quotaionDetailBaseInfo"
                :columns="getQuotaionDetailBaseInfoColumns"
                code="SMBL.INQUIRY_HALL.PRICE_QUOTAION_DETAIL_BASEINFO"
                type="list"
                :need-padding="false"/>
            </ul>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.quoteInfo').$D('报价信息')">
            <ul>
              <div v-for="(item, index) of quotationModuleList" :key="index">
                <ul style="padding: 10px 0px 10px 15px; border-bottom: 1px solid var(--background-color-empty-second);">
                  <customize
                    :data-source="item.templateObj"
                    :columns="getTemplateNameColumns"
                    type="list"
                    :need-padding="false"/>
                </ul>
                <srm-list :scrollable="false"
                          height="auto"
                          style="height: auto"
                          :data-set="item.quotationDetailDataSet"
                          :columns="item.quotationColumns"/>
                <srm-blank v-if="index !== quotationModuleList.length - 1" size="large" theme="fill"/>
              </div>
            </ul>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </section>
    </srm-popup>
  </div>
</template>

<script>

// eslint-disable-next-line no-unused-vars
import { getHeaderApi, getAllQuotationDetailsApi, processAttachmentDownloadApi, getPricingQuotaionDetailInfoApi, getFileList } from "../api/Pricing";
// eslint-disable-next-line no-unused-vars
import { quotaionDetailQuoteInfoDs, ladderLevelDetailDs, processAttachmentDs, allQuotationListDataSet } from "../datasource/PricingDs";
// eslint-disable-next-line no-unused-vars
import { DataSet, $T, SrmListHeader, SrmUtil, } from "srm-mobile-ui";
// eslint-disable-next-line no-unused-vars
// import { downloadFile } from "srm-mobile-ui/src/utils/jsBridge";
import { isEmpty, } from "lodash";

import FileTempAttachment from "@/components/FileTempAttachment";
import { queryBidFileTemplateConfig } from "@/components/FileTempAttachment/utils";

import { getPriceName, getUomName, getQtyName, getAvailableQtyName, getNetPriceName, getAllottedQuantity, } from "../../../utils/doubleUnit";

// cux
import { getCUXPricingBasicInfoColumns, getAllTabTableCommonColumnsCUX, getNewCUXPricingBasicInfoColumns, } from "@/modules/RfxHall/components/cux/pricingAndCompleteCuxs.js";

export default {
  modules: [ "ssrc.inquiryHall", "hzero.common", "ssrc.common", "hipspfm.common", "scux.ssrc", "sscux.ssrc", ],
  name: "Pricing",
  components: {
    FileTempAttachment,
  },
  props: {
    rfxHeaderId: {
      type: String,
    },
    doubleUnitFlag: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      // 基础信息
      headInfo: {},
      allQuotationDetails: [],
      //过程附件
      processAttachmentData: new DataSet(), //过程附件信息
      processAttachmentPop: false, //过程附件弹窗
      //阶梯报价
      ladderLevels: {}, //阶梯报价基础信息
      ladderLevelDetailData: new DataSet(), //阶梯报价明细信息
      ladderLevelPop: false, //阶梯报价弹窗
      //明细报价
      quotaionDetailBaseInfo: {}, //报价明细基础信息
      quotationModuleList: [], //报价明细报价信息
      quotaionDetailPop: false, //报价明细弹窗
      quotationColumns: [], //明细报价动态字段
      //明细报价-下级报价
      // eslint-disable-next-line no-undef
      allQuotationListDS: new DataSet(allQuotationListDataSet()),
      nextQuotationDetailsDataSet: new DataSet(quotaionDetailQuoteInfoDs()), //下级报价明细信息
      nextQuotationDetailsPop: false, //下级报价明细弹窗
      pricingPop: false, //报价弹窗
      detailPopup: null, //详情页弹窗
      weilongFileList: [],
      fileTemplateManageFlag: false, // 是否开启招标文件模板管理
    };
  },
  computed: {
    //基础信息
    getPricingBasicInfoColumns() {
      const preBaseInfoFields = [
        {
          formRow: 10,
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号")}：{val ? val : "-"}
            </SrmListHeader>
        },
        {
          formRow: 20,
          fieldCode: "roundNumber",
          fieldName: this.$T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次")
        },
        {
          formRow: 20,
          fieldCode: "sourceCategoryMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
        },
        {
          formRow: 30,
          fieldCode: "sourceMethodMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
        },
        {
          formRow: 30,
          fieldCode: "pretrialUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailAttachment").$D("初审附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
        {
          formRow: 40,
          fieldCode: "checkRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.checkRemark").$D("核价备注")
        },
        {
          formRow: 40,
          fieldCode: "checkAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pricingAttachment").$D("核价附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
        ...getCUXPricingBasicInfoColumns(),
      ];

      const baseInfoFields = getNewCUXPricingBasicInfoColumns(preBaseInfoFields, {
        that: this,
      });

      return baseInfoFields.filter(Boolean);
    },
    //基础信息详情弹窗
    getPricingBasicInfoPopColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxNum",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号")
        },
        {
          formRow: 20,
          fieldCode: "roundNumber",
          fieldName: this.$T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次")
        },
        {
          formRow: 20,
          fieldCode: "sourceCategoryMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
        },
        {
          formRow: 30,
          fieldCode: "sourceMethodMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
        },
        {
          formRow: 30,
          fieldCode: "pretrialUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailAttachment").$D("初审附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
        {
          formRow: 40,
          fieldCode: "checkRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.checkRemark").$D("核价备注")
        },
        {
          formRow: 40,
          fieldCode: "checkAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pricingAttachment").$D("核价附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
      ];
    },
    //成本备注
    getPricingCostRemarkColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "totalCost",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.model.inquiryHall.totalCost").$D("总成本")}：{val}
            </SrmListHeader>
        },
        {
          formRow: 20,
          fieldCode: "totalPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalPrice").$D("核价总金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 30,
          fieldCode: "overCostFlag",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostFlag").$D("是否超成本"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 30,
          fieldCode: "overCostScale",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostScale").$D("超成本百分比")
        },
        {
          formRow: 40,
          fieldCode: "overCostPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostPrice").$D("超成本金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 50,
          fieldCode: "costRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.costRemark").$D("成本备注")
        }
      ];
    },
    //成本备注详情弹窗
    getPricingCostRemarkPopColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "totalCost",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalCost").$D("总成本"),
        },
        {
          formRow: 20,
          fieldCode: "totalPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalPrice").$D("核价总金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 30,
          fieldCode: "overCostFlag",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostFlag").$D("是否超成本"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 30,
          fieldCode: "overCostScale",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostScale").$D("超成本百分比")
        },
        {
          formRow: 40,
          fieldCode: "overCostPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostPrice").$D("超成本金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 50,
          fieldCode: "costRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.costRemark").$D("成本备注")
        }
      ];
    },
    //全部报价明细
    getAllQuotationDetailsColumns() {
      return [
        {
          formRow: 10,
          fieldType: "EMPTY",
          fieldCode: "itemCode",
          render: (val, item) => {
            let quotationDetail = item.itemCode + "-" + item.itemName;
            return <SrmListHeader>
              {quotationDetail}
            </SrmListHeader>;
          }
        },
        {
          formRow: 20,
          fieldCode: "categoryName",
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.itemCategory").$D("物料类别")
        },
        this.doubleUnitFlag ? {
          formRow: 20,
          fieldCode: "secondaryUomName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.uomName").$D("单位"),
        } : null,
        {
          formRow: 25,
          fieldCode: "uomName",
          fieldName: getUomName(this.doubleUnitFlag),
        },
        {
          formRow: 30,
          fieldCode: "companyNum",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierCode").$D("供应商编码")
        },
        {
          formRow: 40,
          fieldCode: "companyName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称"),
          render: (val, record) => {
            const { suggestedFlag = 0 } = record || {};
            if (this.getTenantNum === "SRM-KYLAND" && suggestedFlag === 1) {
              return <span style="color: green">{val}</span>;
            }
            return val;
          },
        },
        this.doubleUnitFlag ? {
          formRow: 50,
          fieldCode: "validQuotationSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxPrice").$D("含税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          formRow: 50,
          fieldCode: "validNetSecondaryPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.netPrice").$D("未税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          formRow: 55,
          fieldCode: "validQuotationPrice",
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 55,
          fieldCode: "validNetPrice",
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 60,
          fieldCode: "priceBatchQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceBatch").$D("价格批量")
        },
        {
          formRow: 60,
          fieldCode: "specs",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.specifications").$D("规格")
        },
        {
          formRow: 70,
          fieldCode: "perTaxIncludedSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perTaxIncludedPrice").$D("每一含税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 80,
          fieldCode: "perNetSecondaryPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perNetPrice").$D("每一未税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 90,
          fieldCode: "ladderQuotationBtn",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.model.inquiryHall.ladderInquiry").$D("阶梯报价") }：</span>
            {
              item.ladderInquiryFlag === 1 ? <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.getLadderLevelInfo(item);
                }}>
                { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span> : "-"
            }
          </SrmFlex>,
        },
        {
          formRow: 90,
          fieldCode: "quotationLineId",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.model.inquiryHall.quotationDetail").$D("报价明细") }：</span>
            {
              item.quotationDetailFlag === 1 ? <span style="color: var(--color-other-default-b);" on-click={(e) => {
                e.stopPropagation();
                this.getQuotaionDetailBaseInfo(item);
              }}>
                { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span> : "-"
            }
          </SrmFlex>,
        },
        this.doubleUnitFlag ? {
          formRow: 95,
          fieldCode: "secondaryQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quantity").$D("需求数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          formRow: 100,
          fieldCode: "rfxQuantity",
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          formRow: 95,
          fieldCode: "validQuotationSecQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.availableQuantity").$D("可供数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          formRow: 100,
          fieldCode: "validQuotationQuantity",
          fieldName: getAvailableQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          formRow: 110,
          fieldCode: "allottedSecondaryQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allottedQuantity").$D("分配数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          formRow: 110,
          fieldCode: "allottedQuantity",
          fieldName: getAllottedQuantity(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 110,
          fieldCode: "suggestedRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedRemark").$D("选用理由")
        },
        {
          formRow: 120,
          fieldCode: "selectionStrategyMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.strategy").$D("选择策略")
        },
        this.getTenantNum === "SRM-KYLAND" && {
          formRow: 130,
          fieldCode: "attributeDecimal1",
          fieldName: this.$T("scux.ssrc.model.inquiryHall.kyland.untaxedLineAmount").$D("未税行金额"),
          render: (val, record) => {
            let color = "";
            const attributeVarchar20 = record?.attributeVarchar20 || "";
            if (attributeVarchar20) {
              if (attributeVarchar20.indexOf("a") > -1 && attributeVarchar20.indexOf("b") > -1) {
                color = "#E64322";
              } else if (attributeVarchar20.indexOf("a") > -1) {
                color = "green";
              } else if (attributeVarchar20.indexOf("b") > -1) {
                color = "#E64322";
              }
              return <span style={{ color }}>{val}</span>;
            }
            return val;
          },
        },
        this.getTenantNum === "SRM-KYLAND" && {
          formRow: 130,
          fieldCode: "attributeVarchar4",
          fieldName: this.$T("scux.ssrc.model.inquiryHall.kyland.batchNumber").$D("批次号"),
          render: (val, record) => {
            let color = "";
            const attributeVarchar20 = record?.attributeVarchar20 || "";
            if (attributeVarchar20) {
              if (attributeVarchar20.indexOf("c") > -1 && attributeVarchar20.indexOf("d") > -1) {
                color = "#E64322";
              } else if (attributeVarchar20.indexOf("c") > -1) {
                color = "blue";
              } else if (attributeVarchar20.indexOf("d") > -1) {
                color = "#E64322";
              }
              return <span style={{ color }}>{val}</span>;
            }
            return val;
          },
        },
        ...getAllTabTableCommonColumnsCUX(), // cux
      ].filter(Boolean);
    },
    //全部报价明细详情弹窗
    getAllQuotationDetailsPopColumns() {
      return [
        {
          fieldCode: "itemCode",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码")
        },
        {
          fieldCode: "itemName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemMean").$D("物料名称")
        },
        {
          fieldCode: "categoryName",
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.itemCategory").$D("物料类别")
        },
        this.doubleUnitFlag ? {
          fieldCode: "secondaryUomName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.uomName").$D("单位"),
        } : null,
        {
          fieldCode: "uomName",
          fieldName: getUomName(this.doubleUnitFlag),
        },
        {
          fieldCode: "companyNum",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierCode").$D("供应商编码")
        },
        {
          fieldCode: "companyName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称"),
          render: (val, record) => {
            const { suggestedFlag = 0 } = record || {};
            if (this.getTenantNum === "SRM-KYLAND" && suggestedFlag === 1) {
              return <span style="color: green">{val}</span>;
            }
            return val;
          },
        },
        this.doubleUnitFlag ? {
          fieldCode: "validQuotationSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxPrice").$D("含税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldCode: "validNetSecondaryPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.netPrice").$D("未税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldCode: "validQuotationPrice",
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "validNetPrice",
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "priceBatchQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceBatch").$D("价格批量")
        },
        {
          fieldCode: "specs",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.specifications").$D("规格")
        },
        {
          fieldCode: "perTaxIncludedSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perTaxIncludedPrice").$D("每一含税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "perNetSecondaryPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perNetPrice").$D("每一未税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "ladderQuotationBtn",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.model.inquiryHall.ladderInquiry").$D("阶梯报价") }：</span>
            {
              item.ladderInquiryFlag === 1 ? <span style="color: var(--color-other-default-b);"
                on-click={(e) => {
                  e.stopPropagation();
                  this.getLadderLevelInfo(item);
                }}>
                { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span> : "-"
            }
          </SrmFlex>,
        },
        {
          fieldCode: "quotationLineId",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ $T("ssrc.inquiryHall.model.inquiryHall.quotationDetail").$D("报价明细") }：</span>
            {
              item.quotationDetailFlag === 1 ? <span style="color: var(--color-other-default-b);" on-click={(e) => {
                e.stopPropagation();
                this.getQuotaionDetailBaseInfo(item);
              }}>
                { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span> : "-"
            }
          </SrmFlex>,
        },
        this.doubleUnitFlag ? {
          fieldCode: "secondaryQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quantity").$D("需求数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldCode: "rfxQuantity",
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          fieldCode: "validQuotationSecQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.availableQuantity").$D("可供数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldCode: "validQuotationQuantity",
          fieldName: getAvailableQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          fieldCode: "allottedSecondaryQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allottedQuantity").$D("分配数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldCode: "allottedQuantity",
          fieldName: getAllottedQuantity(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "suggestedRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedRemark").$D("选用理由")
        },
        {
          fieldCode: "selectionStrategyMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.strategy").$D("选择策略")
        },
        this.getTenantNum === "SRM-KYLAND" && {
          fieldCode: "attributeDecimal1",
          fieldName: this.$T("scux.ssrc.model.inquiryHall.kyland.untaxedLineAmount").$D("未税行金额"),
          render: (val, record) => {
            let color = "";
            const attributeVarchar20 = record?.attributeVarchar20 || "";
            if (attributeVarchar20) {
              if (attributeVarchar20.indexOf("a") > -1 && attributeVarchar20.indexOf("b") > -1) {
                color = "#E64322";
              } else if (attributeVarchar20.indexOf("a") > -1) {
                color = "green";
              } else if (attributeVarchar20.indexOf("b") > -1) {
                color = "#E64322";
              }
              return <span style={{ color }}>{val}</span>;
            }
            return val;
          },
        },
        this.getTenantNum === "SRM-KYLAND" && {
          fieldCode: "attributeVarchar4",
          fieldName: this.$T("scux.ssrc.model.inquiryHall.kyland.batchNumber").$D("批次号"),
          render: (val, record) => {
            let color = "";
            const attributeVarchar20 = record?.attributeVarchar20 || "";
            if (attributeVarchar20) {
              if (attributeVarchar20.indexOf("c") > -1 && attributeVarchar20.indexOf("d") > -1) {
                color = "#E64322";
              } else if (attributeVarchar20.indexOf("c") > -1) {
                color = "blue";
              } else if (attributeVarchar20.indexOf("d") > -1) {
                color = "#E64322";
              }
              return <span style={{ color }}>{val}</span>;
            }
            return val;
          },
        },
      ].filter(Boolean);
    },
    //过程附件查看
    getProcessAttachmentColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxHeaderId",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ this.$T("ssrc.inquiryHall.view.button.examine").$D("过程附件查看") }：</span>
            <span style="color: var(--color-other-default-b);"
              on-click={(e) => {
                e.stopPropagation();
                this.getProcessAttachmentDetailInfo(item);
              }}>
              { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
            </span>
          </SrmFlex>,
        }
      ];
    },
    //过程附件详情字段
    getProcessAttachmentDetailColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "nodeMeaning",
          fieldName: this.$T("ssrc.common.model.common.node").$D("节点")
        },
        {
          formRow: 10,
          fieldCode: "type",
          fieldName: this.$T("ssrc.common.model.common.attachmentType").$D("附件类型")
        },
        {
          formRow: 20,
          fieldCode: "realName",
          fieldName: this.$T("ssrc.common.model.common.uploadBy").$D("上传人")
        },
        {
          formRow: 20,
          fieldCode: "creationDate",
          fieldName: this.$T("ssrc.common.model.common.creationDate").$D("上传时间")
        },
        {
          formRow: 30,
          fieldCode: "rfxHeaderId",
          fieldName: this.$T("ssrc.inquiryHall.view.message.title.downloadAttachments").$D("附件下载"),
          render: (val, item) =>
            <span style="color: var(--color-other-default-b);"
              on-click={(e) => {
                e.stopPropagation();
                // eslint-disable-next-line no-undef
                this.downloadlFileHandler(item);
              }}>
              { $T("ssrc.inquiryHall.view.message.title.downloadAttachments").$D("附件下载") }
            </span>,
        },
      ];
    },
    //报价明细基础信息
    getQuotaionDetailBaseInfoColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "templateName",
          fieldType: "TEXT",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationTemplateName").$D("报价模板")
        },
        {
          formRow: 20,
          fieldCode: "attachmentNeedFlag",
          fieldName: this.$T("ssrc.common.model.common.supplierAttachNeed").$D("供应商附件必传"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 30,
          fieldCode: "allowCreateFlag",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allowCreateFlag").$D("允许供应商新建明细行"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 40,
          fieldCode: "purchaseAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachment").$D("采购方附件"),
          fieldType: "UPLOAD",
          canUpload: false,
        },
      ];
    },
    //报价信息模板字段
    getTemplateNameColumns() {
      return [
        {
          fieldCode: "templateNameHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <SrmFlex>
              <span>
                {item.templateName}
              </span>
            </SrmFlex>
        },
      ];
    },
    //阶梯报价基础信息
    getLadderLevelColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "companyName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称"),
        },
        {
          formRow: 20,
          fieldCode: "itemCode",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码")
        },
        {
          formRow: 20,
          fieldCode: "itemName",
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.itemName").$D("物料名称"),
        },
      ];
    },
    //阶梯报价行信息
    getLadderLevelDetailColumns() {
      return [
        {
          fieldCode: "rfxLadderLineNum",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val, item) =>
            <span style="font-weight: bold">
              {$T("ssrc.inquiryHall.model.inquiryHall.ladder").$D("阶梯")}{val} - [{this.doubleUnitFlag ? item.secondaryLadderFrom : item.ladderFrom}, {this.doubleUnitFlag ? item.secondaryLadderTo : item.ladderTo})
            </span>
        },
        this.doubleUnitFlag ? {
          formRow: 20,
          fieldCode: "validLadderSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxPrice").$D("含税单价"),
        } : null,
        this.doubleUnitFlag ? {
          formRow: 20,
          fieldCode: "validNetLadderSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.netPrice").$D("未税单价"),
        } : null,
        {
          formRow: 25,
          fieldCode: "validLadderPrice",
          fieldName: getPriceName(this.doubleUnitFlag),
        },
        {
          formRow: 25,
          fieldCode: "validNetLadderPrice",
          fieldName: getNetPriceName(this.doubleUnitFlag),
        },
        {
          formRow: 30,
          fieldCode: "cumulativeFlag",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.isCumulativeFlag").$D("是否累计阶梯"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 30,
          fieldCode: "remark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
        },
      ];
    },
    getTenantNum() {
      return window.localStorage.getItem("tenantNum");
    },
  },
  async mounted() {
    if (this.rfxHeaderId) {
      try {
        this.$loading.show();
        getHeaderApi(this.rfxHeaderId).then((res) => {
          this.headInfo = { ...res };
          if (this.getTenantNum === "SRM-WEILONG") {
            getFileList({ uuid: this.headInfo.attributeVarchar10 }).then((r) => {
              if (Array.isArray(r) && r.length > 0) {
                this.weilongFileList = r.map((item) => item.fileUrl);
              }
            });
          }
        });
        const paramList = {
          rfxHeaderId: this.rfxHeaderId,
          sourceMobileEndFlag: 1,
          customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.ALL_QUOTATION",
        };

        this.allQuotationListDS.setQueryParameter(paramList);
        this.allQuotationListDS.query();

        this.fetchBidFileTemplateConfig();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
  },
  methods: {
    // 查询招标文件模板是否启用
    async fetchBidFileTemplateConfig() {
      const flag = await queryBidFileTemplateConfig();
      this.fileTemplateManageFlag = flag;
    },
    //获取报价明细信息
    getQuotaionDetailBaseInfo(item) {
      this.$loading.show();
      this.quotaionDetailPop = false;
      this.ladderLevelPop = false;
      this.processAttachmentPop = false;
      getPricingQuotaionDetailInfoApi(this.rfxHeaderId, {
        itemId: item.itemId,
        quotationHeaderId: item.quotationHeaderId,
        quotationLineId: item.quotationLineId,
        rfxLineItemId: item.rfxLineItemId,
        sourceFrom: "RFX",
        form: "CHECK",
        pageType: "CHECK_PRICE",
        sourceMobileEndFlag: 1,
      }).then((res) => {
        this.quotaionDetailBaseInfo = {
          templateName: res.templateName,
          attachmentNeedFlag: res.attachmentNeedFlag,
          allowCreateFlag: res.allowCreateFlag,
          purchaseAttachmentUuid: res. purchaseAttachmentUuid
        };
        // 多模块
        this.quotationModuleList = [];
        let quotationColumns = [];
        if (res.moduleList) {
          res.moduleList.map((data, index) => {
            quotationColumns = [
              {
                fieldCode: "configCode",
                fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configCode").$D("报价明细编码"),
                formRow: 0
              },
              {
                fieldCode: "configName",
                fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configName").$D("报价明细名称"),
                formRow: 1
              },
              {
                fieldCode: "nextQuotationDetails",
                fieldType: "EMPTY",
                //visible: (val, record) => record.childList && record.childList.length > 0 ? 1 : 0,
                render: (val, record) => <SrmFlex>
                  <span>{ $T("ssrc.inquiryHall.model.inquiryHall.nextQuotationDetails").$D("下级报价明细") }：</span>
                  {
                    record.childList && record.childList.length > 0 ? <span style="color: var(--color-other-default-b);"
                      on-click={(e) => {
                        e.stopPropagation();
                        this.getNextQuotationDetailsInfo(record.childList);
                      }}>
                      { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
                    </span> : "-"
                  }
                </SrmFlex>,
                formRow: 2
              }
            ];
            // 动态 生成报价列
            data.quotationColumns.map((val, i) => {
              quotationColumns.push({
                fieldCode: val.columnCode,
                fieldName: $T(`ssrc.inquiryHall.model.inquiryHall.${val.columnCode}`).$D(val.columnName),
                formRow: i % 2 > 0 ? i + 2 : i + 3,
              });
            });
            // 动态数据值 扁平化
            data.supQuotationDetailPage.content.map((val) => {
              val.quotationColumns.map((j) => {
                val[j.columnCode] = j.supQuotationColumnValueMeaning;
              });
              if (val.childFlag === 1) {
                val["childList"] = [];
              }
            });
            // 数据tree
            let list = [];
            data.supQuotationDetailPage.content.map((val) => {
              console.log(val.xxx);
              if (val.childFlag === 1) {
                list.push(val);
                data.supQuotationDetailPage.content.map((valTwo) => {
                  if (valTwo.childFlag !== 1 && val.supQuotationDetailId === valTwo.parentDetailId) {
                    val["childList"].push(valTwo);
                  }
                });
              } else if (!val.parentDetailId) {
                list.push(val);
              }
            });
            this.quotationModuleList.push({
              templateObj: { templateName: data.templateName },
              quotationColumns: [ ...quotationColumns ],
              // eslint-disable-next-line no-undef
              quotationDetailDataSet: new DataSet(quotaionDetailQuoteInfoDs()),
            });
            this.quotationColumns = [ ...quotationColumns ];
            this.quotationModuleList[index]["quotationDetailDataSet"].setData([ ...list ]);
          });
        } else {
          // 单模块
          quotationColumns = [
            {
              fieldCode: "configCode",
              fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configCode").$D("报价明细编码"),
              formRow: 0
            },
            {
              fieldCode: "configName",
              fieldName: $T("ssrc.inquiryHall.model.inquiryHall.configName").$D("报价明细名称"),
              formRow: 1
            },
            {
              fieldCode: "nextQuotationDetails",
              fieldType: "EMPTY",
              //visible: (val, record) => record.childList && record.childList.length > 0 ? 1 : 0,
              render: (val, record) => <SrmFlex>
                <span>{ $T("ssrc.inquiryHall.model.inquiryHall.nextQuotationDetails").$D("下级报价明细") }：</span>
                {
                  record.childList && record.childList.length > 0 ? <span style="color: var(--color-other-default-b);"
                    on-click={(e) => {
                      e.stopPropagation();
                      this.getNextQuotationDetailsInfo(record.childList);
                    }}>
                    { $T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
                  </span> : "-"
                }
              </SrmFlex>,
              formRow: 2
            }
          ];
          // 动态 生成报价列
          res.quotationColumns.map((val, index) => {
            quotationColumns.push({
              fieldCode: val.columnCode,
              fieldName: $T(`ssrc.inquiryHall.model.inquiryHall.${val.columnCode}`).$D(val.columnName),
              formRow: index % 2 > 0 ? index + 2 : index + 3,
            });
          });
          // 动态数据值 扁平化
          res.supQuotationDetailPage.content.map((val) => {
            val.quotationColumns.map((j) => {
              val[j.columnCode] = j.supQuotationColumnValueMeaning;
            });
            if (val.childFlag === 1) {
              val["childList"] = [];
            }
          });
          // 数据tree
          let list = [];
          res.supQuotationDetailPage.content.map((val) => {
            if (val.childFlag === 1) {
              list.push(val);
              res.supQuotationDetailPage.content.map((valTwo) => {
                if (valTwo.childFlag !== 1 && val.supQuotationDetailId === valTwo.parentDetailId) {
                  val["childList"].push(valTwo);
                }
              });
            } else if (!val.parentDetailId) {
              list.push(val);
            }
          });
          this.quotationModuleList.push({
            templateObj: { templateName: res.templateName },
            quotationColumns: [ ...quotationColumns ],
            quotationDetailDataSet: new DataSet(quotaionDetailQuoteInfoDs()),
          });
          this.quotationColumns = [ ...quotationColumns ];
          this.quotationModuleList[0]["quotationDetailDataSet"].setData([ ...list ]);
        }
        this.$loading.hide();
        this.pricingPop = true;
        this.quotaionDetailPop = true;
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //获取下级报价明细
    async getNextQuotationDetailsInfo(item) {
      this.nextQuotationDetailsDataSet.setData([ ...item ]);
      this.$popup({
        showHeader: false,
        position: "bottom",
        height: "100vh",
        content: <srm-list scrollable="false"
          height="auto"
          style="height: auto"
          data-set={this.nextQuotationDetailsDataSet}
          columns={this.quotationColumns}/>,
      });
    },
    //获取阶梯报价信息
    getLadderLevelInfo(item) {
      this.quotaionDetailPop = false;
      this.ladderLevelPop = false;
      this.processAttachmentPop = false;
      // eslint-disable-next-line no-unused-vars
      this.ladderLevelDetailData = new DataSet(ladderLevelDetailDs(item.quotationLineId));
      this.ladderLevelDetailData.refresh();
      this.ladderLevels = {
        itemCode: item.itemCode,
        itemName: item.itemName,
        companyName: item.companyName,
      };
      this.pricingPop = true;
      this.ladderLevelPop = true;
    },
    //获取过程附件信息
    getProcessAttachmentDetailInfo(item) {
      this.quotaionDetailPop = false;
      this.ladderLevelPop = false;
      this.processAttachmentPop = false;
      this.processAttachmentData = new DataSet(processAttachmentDs(item.rfxHeaderId));
      this.processAttachmentData.refresh();
      this.pricingPop = true;
      this.processAttachmentPop = true;
    },
    //过程附件下载
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    getProcessAttachmentDetailDownload(item) {
      let param = {
        realName: item.realName,
        node: item.node,
        // eslint-disable-next-line camelcase
        access_token: SrmUtil.getUserToken()
      };
      processAttachmentDownloadApi(this.headInfo.rfxHeaderId, param);
    },
    //过程附件下载
    downloadlFileHandler(item) {
      const { rfxProcessAttachmentDTOS = [], } = item || {};

      let newFileList = [];
      if (!isEmpty(rfxProcessAttachmentDTOS)) {
        newFileList = rfxProcessAttachmentDTOS.map((e) => ({
          fileUrl: e.fileUrl,
          fileName: e.fileName,
          fileSize: e.fileSize,
          creationDate: e.creationDate,
          bucketName: "private-bucket",
        }));
      }

      this.$showFileList({
        fileList: newFileList,
      });
    },
    //核价头信息详细页面
    goToPricingBasicInfoDetail() {
      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code="SMBL.INQUIRY_HALL.RFXPRICE_RFXPRICE_HEADER_DETAIL_POP"
          style="padding: 0 15px"
          dataSource={this.headInfo}
          columns={this.getPricingBasicInfoPopColumns}
        />,
      });
    },
    //核价成本备注信息详细页面
    goToPricingCostRemarkDetail() {
      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code="SMBL.INQUIRY_HALL.PRICING_COSTRE_MARK_POP"
          style="padding: 0 15px"
          dataSource={this.headInfo}
          columns={this.getPricingCostRemarkPopColumns}
        />,
      });
    },
    //核价全部报价信息详细页面
    goToAllQuotationDetail(item) {
      const lineData = item ? item.toData() : {};

      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code="SMBL.INQUIRY_HALL.ALL_QUOTATION_DETAILS_POP"
          style="padding: 0 15px"
          dataSource={lineData}
          columns={this.getAllQuotationDetailsPopColumns}
        />,
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
  .customize-card {
    padding: 16px 0px 6px 0px;
  }
</style>