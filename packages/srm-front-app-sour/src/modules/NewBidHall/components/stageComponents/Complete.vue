<template>
  <!-- 完成 -->
  <div>
    <srm-scroll-tab class="content" customize-code="SMBL.NEW_BID_HALL.COMPLETE.TABS">
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.headerBaseInfo').$D('基础信息')" code="headerBaseInfo">
        <div class="customize-card" @click="goToCompleteBasicInfoDetail">
          <customize :need-padding="true" type="list" :data-source="headInfo" :code="getCustomizeCode('baseInfo')" :columns="getPricingBasicInfoColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.costRemark').$D('成本备注')" code="costRemark">
        <div class="customize-card" @click="goToCompleteCostRemarkDetail">
          <customize :need-padding="true" :data-source="headInfo" :code="getCustomizeCode('costRemark')" :columns="getPricingCostRemarkColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.tab.allQuotationDetails').$D('全部报价明细')" code="allQuotationDetails">
        <div v-for="(item, index) in allQuotationDetails" :key="index" class="customize-card">
          <div @click="goToAllQuotationDetail(item)">
            <customize :need-padding="true" :data-source="item" :code="getCustomizeCode('allQuotationDetails')" :columns="getAllQuotationDetailsColumns" />
          </div>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.library.attachmentUuid').$D('附件')" code="attachmentUuid">
        <div class="customize-card">
          <customize :need-padding="true" :data-source="headInfo" :columns="getProcessAttachmentColumns" />
        </div>
      </srm-scroll-tab-item>
      <!-- 附件列表 -->
      <srm-scroll-tab-item v-if="fileTemplateManageFlag" :show-title="false" :label="$T('ssrc.inquiryHall.view.message.tab.attachmentList').$D('附件列表')" code="attachmentList">
        <file-temp-attachment ref="fileTempAttachmentRef" :head-info="headInfo" :editor-flag="false" :bid-flag="documentType === 'BID'" unit-code-symbol="fileTempAttach-detail"/>
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
                  :code="getCustomizeCode('processAttachment')"
                  :columns="getProcessAttachmentDetailColumns"/>
      </div>
      <!-- 阶梯报价 -->
      <div v-if="ladderLevelPop">
        <ul style="padding: 16px 0 12px 15px">
          <customize
            :data-source="ladderLevels"
            :columns="getLadderLevelColumns"
            :code="getCustomizeCode('ladderLevels')"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank size="mid" theme="fill" />
        <srm-list :scrollable="false"
                  height="auto"
                  :customize-code="getCustomizeCode('ladderLevelLines')"
                  style="height: auto"
                  :data-set="ladderLevelDetailData"
                  :columns="getLadderLevelDetailColumns"/>
      </div>
      <!-- 报价明细 -->
      <section v-if="quotaionDetailPop">
        <srm-scroll-tab >
          <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.quotaionDetail').$D('报价明细')">
            <ul style="padding: 16px 0 12px 15px">
              <customize
                :data-source="quotaionDetailBaseInfo"
                :columns="getQuotaionDetailBaseInfoColumns"
                :code="getCustomizeCode('quotaionDetail')"
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
import { getHeaderApi, getAllQuotationDetailsApi, processAttachmentDownloadApi, getPricingQuotaionDetailInfoApi } from "../../api/Complete";
import CompleteMethod from "../../../CUX_PART/Method/CompleteMethod";
// eslint-disable-next-line no-unused-vars
import { quotaionDetailQuoteInfoDs, ladderLevelDetailDs, processAttachmentDs } from "../../datasource/CompleteDs";
// eslint-disable-next-line no-unused-vars
import { DataSet, $T, SrmListHeader, SrmUtil } from "srm-mobile-ui";
// eslint-disable-next-line no-unused-vars
import { downloadFile } from "srm-mobile-ui/src/utils/jsBridge";
import { getPriceName, getUomName, getQtyName, getAvailableQtyName, getNetPriceName, getAllottedQuantity, getLadderFrom, getLadderTo, getLadderPriceName, getNetLadderPriceName } from "@/utils/doubleUnit";
import FileTempAttachment from "@/components/FileTempAttachment";
import { queryBidFileTemplateConfig } from "@/components/FileTempAttachment/utils";

export default {
  modules: [ "ssrc.inquiryHall", "hzero.common", "ssrc.common", "hipspfm.common", "smbl.inquiryHall", "ssrc.bidHall" ],
  name: "Complete",
  components: {
    FileTempAttachment,
  },
  extends: CompleteMethod,
  props: {
    rfxHeaderId: {
      type: String,
    },
    documentType: {
      type: String,
      default: "",
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
      // nextQuotationDetailsDataSet: {}, //下级报价明细信息
      nextQuotationDetailsPop: false, //下级报价明细弹窗
      pricingPop: false, //报价弹窗
      detailPopup: null, //详情页弹窗
      params: {
        rfxHeaderId: this.rfxHeaderId,
      },
      fileTemplateManageFlag: false, // 是否开启招标文件模板管理
    };
  },
  computed: {
    //基础信息
    getPricingBasicInfoColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.inquiryHallBidNum").$D("招标书编号") : $T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号")}：{val ? val : "-"}
            </SrmListHeader>
        },
        {
          formRow: 20,
          fieldCode: "roundNumber",
          fieldName: this.$T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次")
        },
        {
          formRow: 20,
          fieldCode: this.documentType === "BID" ? "secondarySourceCategoryMeaning" : "sourceCategoryMeaning",
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
          fieldName: this.documentType === "BID" ? this.$T("ssrc.bidHall.model.bidHall.calibrationRemark").$D("定标备注") : this.$T("ssrc.inquiryHall.model.inquiryHall.checkRemark").$D("核价备注")
        },
        {
          formRow: 40,
          fieldCode: "checkAttachmentUuid",
          fieldName: this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.checkAttachmentUuid").$D("定标附件") : this.$T("ssrc.inquiryHall.model.inquiryHall.pricingAttachment").$D("核价附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
      ];
    },
    //基础信息详情弹窗
    getPricingBasicInfoPopColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxNum",
          fieldName: this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.inquiryHallBidNum").$D("招标书编号") : this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号")
        },
        {
          formRow: 20,
          fieldCode: "roundNumber",
          fieldName: this.$T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次")
        },
        {
          formRow: 30,
          fieldCode: this.documentType === "BID" ? "secondarySourceCategoryMeaning" : "sourceCategoryMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
        },
        {
          formRow: 40,
          fieldCode: "sourceMethodMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
        },
        {
          formRow: 50,
          fieldCode: "pretrialUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailAttachment").$D("初审附件"),
          fieldType: "UPLOAD",
          canUpload: false,
          showCount: false
        },
        {
          formRow: 60,
          fieldCode: "checkRemark",
          fieldName: this.documentType === "BID" ? this.$T("ssrc.bidHall.model.bidHall.calibrationRemark").$D("定标备注") : this.$T("ssrc.inquiryHall.model.inquiryHall.checkRemark").$D("核价备注")
        },
        {
          formRow: 70,
          fieldCode: "checkAttachmentUuid",
          fieldName: this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.checkAttachmentUuid").$D("定标附件") : this.$T("ssrc.inquiryHall.model.inquiryHall.pricingAttachment").$D("核价附件"),
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
          fieldName: this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.bidTotalPrice").$D("定标总金额") : this.$T("ssrc.inquiryHall.model.inquiryHall.totalPrice").$D("核价总金额"),
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
          fieldName: this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.bidTotalPrice").$D("定标总金额") : this.$T("ssrc.inquiryHall.model.inquiryHall.totalPrice").$D("核价总金额"),
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
          formRow: 40,
          fieldCode: "overCostScale",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostScale").$D("超成本百分比")
        },
        {
          formRow: 50,
          fieldCode: "overCostPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostPrice").$D("超成本金额"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 60,
          fieldCode: "costRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.costRemark").$D("成本备注")
        }
      ];
    },
    //全部报价明细
    getAllQuotationDetailsColumns() {
      return [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "itemCode",
          render: (val, item) => {
            let quotationDetail = (item.itemCode || "") + (item.itemCode ? "-" : "") + item.itemName;
            return <SrmListHeader>
              {quotationDetail}
            </SrmListHeader>;
          }
        },
        {
          formRow: 10,
          fieldCode: "categoryName",
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.itemCategory").$D("物料类别")
        },
        this.doubleUnitFlag ? {
          formRow: 10,
          fieldCode: "secondaryUomName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.uomName").$D("单位"),
        } : null,
        {
          formRow: 15,
          fieldCode: "uomName",
          fieldName: getUomName(this.doubleUnitFlag),
        },
        {
          formRow: 20,
          fieldCode: "companyNum",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierCode").$D("供应商编码")
        },
        {
          formRow: 30,
          fieldCode: "companyName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称")
        },
        this.doubleUnitFlag ? {
          formRow: 40,
          fieldCode: "validQuotationSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxPrice").$D("含税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          formRow: 40,
          fieldCode: "validNetSecondaryPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.netPrice").$D("未税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          formRow: 45,
          fieldCode: "validQuotationPrice",
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 45,
          fieldCode: "validNetPrice",
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 50,
          fieldCode: "priceBatchQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceBatch").$D("价格批量")
        },
        {
          formRow: 50,
          fieldCode: "specs",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.specifications").$D("规格")
        },
        {
          formRow: 60,
          fieldCode: "perTaxIncludedPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perTaxIncludedPrice").$D("每一含税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          render: (val, record) => this.doubleUnitFlag ? record.perTaxIncludedSecPrice : record.perTaxIncludedPrice,
        },
        {
          formRow: 70,
          fieldCode: "perNetPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perNetPrice").$D("每一未税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          render: (val, record) => this.doubleUnitFlag ? record.perNetSecondaryPrice : record.perNetPrice,
        },
        {
          formRow: 80,
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
          formRow: 80,
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
          formRow: 85,
          fieldCode: "secondaryQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quantity").$D("需求数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          formRow: 85,
          fieldCode: "validQuotationSecQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.availableQuantity").$D("可供数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          formRow: 90,
          fieldCode: "rfxQuantity",
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 90,
          fieldCode: "validQuotationQuantity",
          fieldName: getAvailableQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          formRow: 100,
          fieldCode: "allottedSecondaryQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allottedQuantity").$D("分配数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          formRow: 100,
          fieldCode: "allottedQuantity",
          fieldName: getAllottedQuantity(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 105,
          fieldCode: "suggestedRemark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedRemark").$D("选用理由")
        },
        {
          formRow: 110,
          fieldCode: "selectionStrategyMeaning",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.strategy").$D("选择策略")
        }
      ];
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
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称")
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
          fieldCode: "perTaxIncludedPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perTaxIncludedPrice").$D("每一含税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          render: (val, record) => this.doubleUnitFlag ? record.perTaxIncludedSecPrice : record.perTaxIncludedPrice,
        },
        {
          fieldCode: "perNetPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.perNetPrice").$D("每一未税单价"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          render: (val, record) => this.doubleUnitFlag ? record.perNetSecondaryPrice : record.perNetPrice,
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
        this.doubleUnitFlag ? {
          fieldCode: "validQuotationSecQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.availableQuantity").$D("可供数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldCode: "allottedSecondaryQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allottedQuantity").$D("分配数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldCode: "rfxQuantity",
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "validQuotationQuantity",
          fieldName: getAvailableQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
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
        }
      ];
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
        {
          formRow: 50,
          fieldCode: "quoDetailAttachmentUuid",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierAttachment").$D("供应商附件"),
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
          render: (val) =>
            <span style="font-weight: bold">
              {$T("ssrc.inquiryHall.model.inquiryHall.ladder").$D("阶梯")}{val}
            </span>
        },
        this.doubleUnitFlag ? {
          formRow: 20,
          fieldCode: "secondaryLadderFrom",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderFrom").$D("数量从"),
        } : null,
        this.doubleUnitFlag ? {
          formRow: 20,
          fieldCode: "secondaryLadderTo",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderTo").$D("数量至"),
        } : null,
        {
          formRow: 25,
          fieldCode: "ladderFrom",
          fieldName:getLadderFrom(this.doubleUnitFlag),
        },
        {
          formRow: 25,
          fieldCode: "ladderTo",
          fieldName: getLadderTo(this.doubleUnitFlag),
        },
        this.doubleUnitFlag ? {
          formRow: 30,
          fieldCode: "validLadderSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxPrice").$D("含税单价"),
        } : null,
        this.doubleUnitFlag ? {
          formRow: 30,
          fieldCode: "validNetLadderSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.netPrice").$D("未税单价"),
        } : null,
        {
          formRow: 35,
          fieldCode: "validLadderPrice",
          fieldName: getLadderPriceName(this.doubleUnitFlag),
        },
        {
          formRow: 35,
          fieldCode: "validNetLadderPrice",
          fieldName: getNetLadderPriceName(this.doubleUnitFlag),
        },
        {
          formRow: 40,
          fieldCode: "cumulativeFlag",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.isCumulativeFlag").$D("是否累计阶梯"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 40,
          fieldCode: "remark",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
        },
        {
          formRow: 50,
          fieldCode: "validBargainPrice",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.validBargainPrice").$D("有效还价单价"),
        },
      ];
    },
  },
  async mounted() {
    if (this.rfxHeaderId) {
      try {
        this.$loading.show();
        getHeaderApi(this.documentType, this.rfxHeaderId).then((res) => {
          this.headInfo = { ...res };
        });
        if (this.over$getAllQuotationDetailsParmas && typeof this.over$getAllQuotationDetailsParmas === "function") {
          this.over$getAllQuotationDetailsParmas();
        }
        getAllQuotationDetailsApi(this.documentType, this.params).then((res) => {
          this.allQuotationDetails = res.content;
        });
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
    // 获取 个性化配置
    getCustomizeCode(code) {
      const codeList = {
        // 基础信息
        baseInfo:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.BASICINFO.BID" : "SMBL.NEW_BID_HALL.CP.BASICINFO.RFX",
        // 基础信息详情
        baseInfoDetail:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.BASICINFO_DETAIL.BID" : "SMBL.NEW_BID_HALL.CP.BASICINFO_DETAIL.RFX",
        // 成本备注
        costRemark:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.COSTERMARK.BID" : "SMBL.NEW_BID_HALL.CP.COSTERMARK.RFX",
        // 成本备注详情
        costRemarkDetail:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.COSTERMARK_DETAIL.BID" : "SMBL.NEW_BID_HALL.CP.COSTERMARK_DETAIL.RFX",
        // 全部报价明细
        allQuotationDetails:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.ALLQUOTATIONDETAIL.BID" : "SMBL.NEW_BID_HALL.CP.ALLQUOTATIONDETAIL.RFX",
        // 全部报价详情
        allQuotationDetailsDetail:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.ALLQUOTATIONDETAIL_DETAIL.BID" : "SMBL.NEW_BID_HALL.CP.ALLQUOTATIONDETAIL_DETAIL.RFX",
        // 过程附件
        processAttachment:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.ATTACH.PROCESSATTACH.BID" : "SMBL.NEW_BID_HALL.CP.ATTACH.PROCESSATTACH.RFX",
        // 阶梯报价
        ladderLevels:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.PRICE_LADDER_LEVEL.BID" : "SMBL.NEW_BID_HALL.CP.PRICE_LADDER_LEVEL.RFX",
        ladderLevelLines:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.PRICE_LADDER_LEVEL_LINE.BID" : "SMBL.NEW_BID_HALL.CP.PRICE_LADDER_LEVEL_LINE.RFX",
        // 报价明细
        quotaionDetail:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.PRICE_QUOTAION_DETAIL_BASEINFO.BID" : "SMBL.NEW_BID_HALL.CP.PRICE_QUOTAION_DETAIL_BASEINFO.RFX",
        // quotaionDetailLines:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.CP.PRICE_QUOTAION_DETAIL_LINES.BID" : "SMBL.NEW_BID_HALL.CP.PRICE_QUOTAION_DETAIL_LINES.RFX",
      };
      return codeList[code] || "";
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
        sourceFrom: "RFX"
      }).then((res) => {
        this.quotaionDetailBaseInfo = {
          templateName: res.templateName,
          attachmentNeedFlag: res.attachmentNeedFlag,
          allowCreateFlag: res.allowCreateFlag,
          quoDetailAttachmentUuid: res.quoDetailAttachmentUuid,
          purchaseAttachmentUuid: res.purchaseAttachmentUuid
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
      const nextQuotationDetailsDataSet = new DataSet(quotaionDetailQuoteInfoDs());
      nextQuotationDetailsDataSet.setData([ ...item ]);
      this.$popup({
        showHeader: false,
        position: "bottom",
        height: "100vh",
        content: <srm-list scrollable={false}
          height="auto"
          style="height: auto"
          data-set={nextQuotationDetailsDataSet}
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
      let rfxProcessAttachmentDTOS = item.rfxProcessAttachmentDTOS;
      this.$showFileList({
        fileList: rfxProcessAttachmentDTOS.map((e) => ({
          fileUrl: e.fileUrl,
          fileName: e.fileName,
          fileSize: e.fileSize,
          creationDate: e.creationDate,
          bucketName: "private-bucket",
        }))
      });
      // let fileUrl;
      // let bucketName;
      // rfxProcessAttachmentDTOS.forEach((rfxProcessAttachmentDTO) => {
      //   fileUrl = rfxProcessAttachmentDTO.fileUrl;
      //   bucketName = rfxProcessAttachmentDTO.bucketName;
      //   try {
      //     const signedUrl = rfxProcessAttachmentDTO.signedUrl;
      //     location.href = signedUrl;
      //     // this.$downloadFile(fileUrl, bucketName);
      //   } catch (e) {
      //     const loadUrl = this.buildImgUrl(fileUrl, bucketName);
      //     this.$router.push({
      //       path: `downLoad?downLoadUrl=${encodeURIComponent(loadUrl)}`,
      //     });
      //   }
      // });
    },
    //头信息详细页面
    goToCompleteBasicInfoDetail() {
      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code={this.getCustomizeCode("baseInfoDetail")}
          style="padding: 0 15px"
          dataSource={this.headInfo}
          columns={this.getPricingBasicInfoPopColumns}
        />,
      });
    },
    //成本备注信息详细页面
    goToCompleteCostRemarkDetail() {
      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code={this.getCustomizeCode("costRemarkDetail")}
          style="padding: 0 15px"
          dataSource={this.headInfo}
          columns={this.getPricingCostRemarkPopColumns}
        />,
      });
    },
    //全部报价信息详细页面
    goToAllQuotationDetail(item) {
      this.detailPopup = this.$popup({
        content: <CustomizeDetail
          code={this.getCustomizeCode("allQuotationDetailsDetail")}
          style="padding: 0 15px"
          dataSource={item}
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