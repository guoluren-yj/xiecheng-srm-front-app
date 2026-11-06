<template>
  <div class="srm-wrapper">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('ssrc.bidHall.view.tab.baseInfo').$D('基础信息')">
        <div class="srm-customize-card">
          <customize :columns="getBaseInfoColumns"
                     :need-padding="true"
                     :data-source="headerInfo"
                     code="SMBL.WORKFLOW.FRX_BARGAIN.BASE_INFO"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.tab.barginPriceDetail').$D('议价明细')">
        <srm-list v-if="barginPriceDataSet"
                  :scrollable="false"
                  :data-set="barginPriceDataSet"
                  customize-code="SMBL.WORKFLOW.FRX_BARGAIN.BARGAIN_LINE_INFO_NEW"
                  :columns="getBarginPriceLineColumns"
                  @itemClick="clickBarginLineInfo"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 议价明细行 -->
    <srm-popup
      :visible.sync="barginPriceDetailPop"
      position="right"
      height="100%"
      width="100%"
      class="upload-button"
      show-back
      :title="$T('ssrc.inquiryHall.view.tab.barginPriceDetail').$D('议价明细')"
      @onClose="$emit('input',false)">
      <customize-detail :columns="getBarginPriceLineDetailColumns"
                        :need-padding="true"
                        :data-source="bargainPriceDetailData"
                        code="SMBL.WORKFLOW.FRX_BARGAIN.BARGAIN_LINE_DETAIL_NEW"/>
    </srm-popup>

    <!-- 阶梯报价 -->
    <srm-popup
      :visible.sync="ladderPop"
      position="right"
      height="100%"
      width="100%"
      class="upload-button"
      show-back
      :title="$T('ssrc.inquiryHall.view.message.title.ladderLevelQuot').$D('阶梯报价')"
      @onClose="$emit('input',false)">
      <div>
        <customize :columns="getLadderHeaderInfoColumns"
                   :need-padding="true"
                   :data-source="ladderHeaderInfo"
                   code="SMBL.WORKFLOW.FRX_BARGAIN.LADDER_HEADER_INFO_NEW"/>
        <srm-blank size="small" theme="fill"/>
        <srm-list v-if="ladderLineDataSet"
                  :scrollable="false"
                  :data-set="ladderLineDataSet"
                  customize-code="SMBL.WORKFLOW.FRX_BARGAIN.LADDER_LINE_INFO_NEW"
                  :columns="getLadderLineInfoColumns"/>
      </div>
    </srm-popup>
    <!-- 报价明细 -->
    <srm-popup
      :visible.sync="quotaionDetailPop"
      position="right"
      height="100%"
      width="100%"
      class="upload-button"
      show-back
      :title="$T('ssrc.inquiryHall.model.inquiryHall.quotaionDetail').$D('报价明细')"
      @onClose="$emit('input',false)">
      <div>
        <srm-scroll-tab>
          <srm-scroll-tab-item :label="$T('ssrc.bidHall.view.tab.baseInfo').$D('基础信息')">
            <customize :columns="getQuotaionHeaderInfoColumns"
                       :need-padding="true"
                       :data-source="quotaionDetailInfo"
                       code="SMBL.WORKFLOW.FRX_BARGAIN.QUOTAE_HEADER_INFO_NEW"/>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item :label="$T('ssrc.common.view.message.quotationInfos').$D('报价信息')">
            <div v-for="(item,index1) in quotaionDetailLineInfo" :key="index1">
              <srm-blank size="small" theme="fill"/>
              <div class="srm-quotaion-detail-title">{{ item.templateName }}</div>
              <srm-blank size="small" theme="fill"/>
              <div v-for="(nextItem,index2) in item.supQuotationDetailPage.content" :key="index2">
                <customize :columns="getQuotaionLineInfoColumns"
                           :need-padding="true"
                           :data-source="nextItem"
                           code="SMBL.WORKFLOW.FRX_BARGAIN.QUOTAE_LINE_INFO"/>
                <srm-blank size="small" theme="fill"/>
              </div>
            </div>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>
    </srm-popup>
    <!-- 下级报价明细 -->
    <srm-popup
      :visible.sync="nextQuotaionDetailPop"
      position="right"
      height="100%"
      width="100%"
      class="upload-button"
      show-back
      :title="$T('ssrc.inquiryHall.model.inquiryHall.nextQuotationDetails').$D('下级报价明细')"
      @onClose="$emit('input',false)">
      <div>
        <div v-for="(item,index) in nextQuotaionDetailLineInfo"
             :key="index">
          <customize :columns="getQuotaionLineInfoColumns"
                     :need-padding="true"
                     :data-source="item"
                     code="SMBL.WORKFLOW.FRX_BARGAIN.QUOTAE_LINE_INFO"/>
          <srm-blank size="small" theme="fill"/>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { isNil } from "lodash";
import { queryDoubleUnit } from "@/utils/utils";
import { getRfxBargainInfoApi, getQuotaionDetailInfoApi } from "./api/index";
import barginPriceDataSet from "./datasource/barginPriceDataSet";
import ladderLineDataSet from "./datasource/ladderLineDataSet";
import { getPriceName, getNetPriceName, getAvailableQtyName, getUomName, getQtyName, getLadderFrom, getLadderTo } from "@/utils/doubleUnit";
export default {
  modules: [ "ssrc.inquiryHall", "ssrc.bidHall", "hipspfm.common", "ssrc.common", "ssrc.priceLibLadder" ],
  name: "RfxBargainApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      headerInfo: {},
      barginPriceDataSet: null,
      ladderLineDataSet: null,
      ladderHeaderInfo:{}, // 阶梯对应行信息
      ladderInfo:[], // 阶梯报价信息
      ladderPop:false, // 阶梯报价Pop
      barginPriceDetailPop:false, // 议价行Pop
      bargainPriceDetailData:{}, // pop data
      ladderLineInfo:{}, // 阶梯对应行信息
      quotaionDetailPop:false, // 报价明细Pop
      quotaionDetailInfo:{}, // 报价明细
      quotaionDetailLineInfo:[], // 报价明细行
      nextQuotaionDetailPop:false, // 下级报价明细Pop
      nextQuotaionDetailLineInfo:[], // 下级报价明细行
      tempContentNext:[],
      doubleUnitFlag: false, // 判断是否开启双单位
    };
  },
  computed: {
    // 基础信息Columns
    getBaseInfoColumns() {
      return [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "rfxTitle",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{record.rfxTitle}</span>
            {!isNil(record.quotationRoundNumber) ? <span slot="right"><SrmTag type="primary">{ this.$T("ssrc.bidHall.model.bidHall.roundNumber").$D("轮次") }：{record.quotationRoundNumber}</SrmTag></span> : null}
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号"),
          fieldType: "TEXT",
          fieldCode: "rfxNum"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.bargain.bargainDeadline").$D("议价截止时间"),
          fieldType: "TEXT",
          fieldCode: "bargainEndDate"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.bargain.reasonToBargain").$D("议价理由"),
          fieldType: "TEXT",
          fieldCode: "bargainRemark"
        }
      ];
    },
    // 议价明细
    getBarginPriceLineColumns() {
      return [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "rfxNum",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{record.itemName}</span>
            <div slot="right" style={{ display: "flex" }}>
              <SrmTag type="success">{record.quotationLineStatusMeaning}</SrmTag>
              <div class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color: "var(--font-color-field2)", marginLeft: "8px" }} />
            </div>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.rfxLineItemNum").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "rfxLineItemNum"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.categoryName").$D("物品分类"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryName"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.supplierCompanyName").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName"
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPriceTax").$D("单价（含税）"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validQuotationSecPrice",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.offlineEntry.netPrice").$D("单价（不含税）"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validNetSecondaryPrice",
          editor: false,
        } : null,
        {
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validQuotationPrice",
          editor: false,
        },
        {
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validNetPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lastQuotation").$D("上次报价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "preQuotationPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceFluctuation").$D("价格浮动"),
          fieldType: "TEXT",
          fieldCode: "priceFluctuation"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Counter-bidPrice").$D("还价单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "currentBargainPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Counter-bidRemark").$D("还价理由"),
          fieldType: "TEXT",
          fieldCode: "currentBargainRemark"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validBargainPrice").$D("有效还价单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validBargainPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validBidReason").$D("有效还价理由"),
          fieldType: "TEXT",
          fieldCode: "validBargainRemark"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderInquiry").$D("阶梯报价"),
          fieldType: "TEXT",
          fieldCode: "ladderInquiryFlag",
          render:(val, record) => {
            if (record.ladderInquiryFlag === 1) {
              return <srm-flex>
                <srm-button type="primary" style={{ fontSize: "12px", fontWeight: 400 }} plain rect onClick={() => this.toLadderDetail(record)}>{this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}</srm-button>
              </srm-flex>;
            }
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotaionDetail").$D("报价明细"),
          fieldType: "TEXT",
          fieldCode: "quotationDetailFlag",
          render:(val, record) => {
            if (record.quotationDetailFlag === 1) {
              return <srm-flex>
                <srm-button type="primary" style={{ fontSize: "12px", fontWeight: 400 }} plain rect onClick={() => this.toQuotaionDetail(record)}>{this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}</srm-button>
              </srm-flex>;
            }
          }
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.number").$D("需求数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "secondaryQuantity",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.availableQuantity").$D("可供数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validQuotationSecQuantity",
          editor: false,
        } : null,
        {
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "rfxQuantity",
          editor: false,
        },
        {
          fieldName: getAvailableQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validQuotationQuantity",
          editor: false,
        },
      ];
    },
    // 议价明细详情
    getBarginPriceLineDetailColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStatus").$D("报价状态"),
          fieldType: "TEXT",
          fieldCode: "quotationLineStatusMeaning"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.rfxLineItemNum").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "rfxLineItemNum"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.categoryName").$D("物品分类"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryName"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.itemLinecode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.specifications").$D("规格"),
          fieldType: "TEXT",
          fieldCode: "specs"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.supplierCompanyName").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName"
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPriceTax").$D("单价（含税）"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validQuotationSecPrice",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.offlineEntry.netPrice").$D("单价（不含税）"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validNetSecondaryPrice",
          editor: false,
        } : null,
        {
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validQuotationPrice",
          editor: false,
        },
        {
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validNetPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lastQuotation").$D("上次报价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "preQuotationPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceFluctuation").$D("价格浮动"),
          fieldType: "TEXT",
          fieldCode: "priceFluctuation"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Counter-bidPrice").$D("还价单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "currentBargainPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Counter-bidRemark").$D("还价理由"),
          fieldType: "TEXT",
          fieldCode: "currentBargainRemark"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validBargainPrice").$D("有效还价单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validBargainPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validBidReason").$D("有效还价理由"),
          fieldType: "TEXT",
          fieldCode: "validBargainRemark"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludedFlag").$D("是否含税"),
          fieldType: "TEXT",
          fieldCode: "taxIncludedFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxRate").$D("税率（%）"),
          fieldType: "TEXT",
          fieldCode: "taxRate"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderInquiry").$D("阶梯报价"),
          fieldType: "TEXT",
          fieldCode: "ladderInquiryFlag",
          render:(val, record) => {
            if (record.ladderInquiryFlag === 1) {
              return <srm-flex>
                <srm-button type="primary" plain rect onClick={() => this.toLadderDetail(record)}>{this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}</srm-button>
              </srm-flex>;
            }
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotaionDetail").$D("报价明细"),
          fieldType: "TEXT",
          fieldCode: "quotationDetailFlag",
          render:(val, record) => {
            if (record.quotationDetailFlag === 1) {
              return <srm-flex>
                <srm-button type="primary" plain rect onClick={() => this.toQuotaionDetail(record)}>{this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}</srm-button>
              </srm-flex>;
            }
          }
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.number").$D("需求数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "secondaryQuantity",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.availableQuantity").$D("可供数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validQuotationSecQuantity",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.uomName").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "secondaryUomCode",
          render:(val, record) => record.secondaryUomCode + "/" + record.secondaryUomName
        } : null,
        {
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "rfxQuantity",
          editor: false,
        },
        {
          fieldName: getAvailableQtyName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validQuotationQuantity",
          editor: false,
        },
        {
          fieldName: getUomName(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "uomCode",
          render:(val, record) => record.uomCode + "/" + record.uomName
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.supplierNum").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.qVFrom").$D("报价有效期从"),
          fieldType: "TEXT",
          fieldCode: "validExpiryDateFrom"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.qVTo").$D("报价有效期至"),
          fieldType: "TEXT",
          fieldCode: "validExpiryDateTo"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validPromisedDate").$D("承诺交货期"),
          fieldType: "TEXT",
          fieldCode: "validPromisedDate"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validDeliveryCycle").$D("供货周期（天）"),
          fieldType: "TEXT",
          fieldCode: "validDeliveryCycle"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.minimumPurchaseAmount").$D("最小购买量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "minPurchaseQuantity",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.minimumPackageAmount").$D("最小包装量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "minPackageQuantity",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.includingFreight").$D("是否含运费"),
          fieldType: "TEXT",
          fieldCode: "freightIncludedFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.freightAmount").$D("运费"),
          fieldType: "TEXT",
          fieldCode: "freightAmount"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationTime").$D("报价时间"),
          fieldType: "TEXT",
          fieldCode: "quotedDate"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.companyName").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.ouName").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.invOrganizationName").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierLineAttachment").$D("供应商行附件"),
          fieldType: "UPLOAD",
          fieldCode: "attachmentUuid"
        },
      ];
    },
    // 阶梯报价头
    getLadderHeaderInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.supplierName").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.itemLinecode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName"
        }
      ];
    },
    // 阶梯报价行
    getLadderLineInfoColumns() {
      return [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "rfxLadderLineNum",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{this.$T("ssrc.inquiryHall.model.inquiryHall.ladder").$D("阶梯")}:{record.rfxLadderLineNum}</span>
          </SrmListHeader>
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderFrom").$D("数量从（>=）"),
          fieldType: "TEXT",
          fieldCode: "secondaryLadderFrom"
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.priceLibLadder.model.priceLibLadder.ladderTo").$D("数量至（<）"),
          fieldType: "TEXT",
          fieldCode: "secondaryLadderTo"
        } : null,
        {
          fieldName: getLadderFrom(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "ladderFrom"
        },
        {
          fieldName: getLadderTo(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "ladderTo"
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPriceTax").$D("单价（含税）"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "currentLadderSecPrice",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.offlineEntry.netPrice").$D("单价（不含税）"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "currentNetLadderSecPrice",
          editor: false,
        } : null,
        {
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "currentLadderPrice",
          editor: false,
        },
        {
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          fieldCode: "currentNetLadderPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.isCumulativeFlag").$D("是否累计阶梯"),
          fieldType: "TEXT",
          fieldCode: "cumulativeFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Counter-bidPrice").$D("还价单价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "currentBargainPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Counter-bidRemark").$D("还价理由"),
          fieldType: "TEXT",
          fieldCode: "currentBargainRemark"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validPrice").$D("有效还价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "validBargainPrice",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validBidReason").$D("有效还价理由"),
          fieldType: "TEXT",
          fieldCode: "validBargainRemark"
        },
      ];
    },
    // 报价明细头信息
    getQuotaionHeaderInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.QuotationTemplateName").$D("报价模板名称"),
          fieldType: "TEXT",
          fieldCode: "templateName"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.attachmentNeedFlag").$D("供应商附件必传"),
          fieldType: "TEXT",
          fieldCode: "attachmentNeedFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allowCreateFlag").$D("允许供应商新建明细行"),
          fieldType: "TEXT",
          fieldCode: "allowCreateFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.attachement").$D("附件"),
          fieldType: "UPLOAD",
          fieldCode: "attachmentUuid"
        },
      ];
    },
    // 报价明细行信息
    getQuotaionLineInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.configCode").$D("报价明细编码"),
          fieldType: "TEXT",
          fieldCode: "configCode"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.configName").$D("报价明细名称"),
          fieldType: "TEXT",
          fieldCode: "configName"
        },
        !this.nextQuotaionDetailPop && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.nextQuotationDetails").$D("下级报价明细"),
          fieldType: "TEXT",
          fieldCode: "childFlag",
          render:(val, record) => {
            if (val === 1) {
              return <srm-flex>
                <srm-button type="primary" plain rect onClick={() => this.toNextQuotaionDetail(record)}>{this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}</srm-button>
              </srm-flex>;
            }
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quantities").$D("数量"),
          fieldType: "TEXT",
          fieldCode: "quantity",
          render:(val, record) => {
            let resultValue;
            record.quotationColumns.forEach((v) => {
              if (v.columnCode === "Quantity") {
                resultValue = v.supQuotationColumnValue;
              }
            });
            return resultValue;
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPrice").$D("单价"),
          fieldType: "TEXT",
          fieldCode: "price",
          render:(val, record) => {
            let resultValue;
            record.quotationColumns.forEach((v) => {
              if (v.columnCode === "Price") {
                resultValue = v.supQuotationColumnValue;
              }
            });
            return resultValue;
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
          render:(val, record) => {
            let resultValue;
            record.quotationColumns.forEach((v) => {
              if (v.columnCode === "Remark") {
                resultValue = v.supQuotationColumnValue;
              }
            });
            return resultValue;
          }
        },
      ];
    },
  },
  async beforeMount() {
    this.$loading.show();
    this.doubleUnitFlag = await queryDoubleUnit({
      businessModule: "RFX",
    });
    this.getRfxBargainInfo(this.parameters.rfxHeaderId);
    this.barginPriceDataSet = new DataSet(barginPriceDataSet(this.parameters.rfxHeaderId, this.parameters.rfxHeaderId));
    this.barginPriceDataSet.refresh();
    this.$loading.hide();
  },
  methods: {
    // 获取议价头信息
    async getRfxBargainInfo(rfxHeaderId) {
      this.$loading.show();
      const headerParams = {
        customizeUnitCode: "SMBL.WORKFLOW.FRX_BARGAIN.BASE_INFO",
      };
      await getRfxBargainInfoApi(rfxHeaderId, headerParams).then((res) => {
        this.$loading.hide();
        if (!res.impty) {
          this.headerInfo = res;
        }
      });
    },
    // 获取阶梯报价信息
    async getLadderInfo(quotationLineId) {
      this.$loading.show();
      this.ladderLineDataSet = new DataSet(ladderLineDataSet(quotationLineId, { customizeUnitCode: "SMBL.WORKFLOW.FRX_BARGAIN.LADDER_LINE_INFO_NEW", }));
      this.ladderLineDataSet.refresh();
      this.$loading.hide();
    },
    // 获取报价明细信息
    async getQuotaionDetailInfo(record) {
      this.quotaionDetailLineInfo = [];
      const params = {
        itemCategoryId: record.itemCategoryId,
        itemId: record.itemId,
        quotationHeaderId: record.quotationHeaderId,
        quotationLineId: record.quotationLineId,
        rfxLineItemId: record.rfxLineItemId,
        sourceFrom: "RFX",
        page: 0,
        size: 9000,
      };
      this.$loading.show();
      await getQuotaionDetailInfoApi(record.rfxHeaderId, params).then((res) => {
        if (!res.impty) {
          this.quotaionDetailInfo = res;
          this.tempContentNext = [];
          let tempRecord = {};
          let tempContent = [];
          let tempContentPar = [];
          //组装报价明细行
          if (res.templateNum === "WZ01") {
            //1、不分模块不分上下级
            tempRecord.supQuotationDetailPage = res.supQuotationDetailPage;
            tempRecord.templateName = res.templateName;
            this.quotaionDetailLineInfo.push(tempRecord);
          } else if (res.templateNum === "WZ02") {
            //2、不分模块分上下级
            tempContent = res.supQuotationDetailPage.content;
            tempContent.map((v) => {
              if (v.childFlag === 1) {
                tempContentPar.push(v);
              } else {
                this.tempContentNext.push(v);
              }
            });
            tempRecord.supQuotationDetailPage = res.supQuotationDetailPage;
            tempRecord.templateName = res.templateName;
            tempRecord.supQuotationDetailPage.content = tempContentPar;
            this.quotaionDetailLineInfo.push(tempRecord);
          } else if (res.templateNum === "WZ03") {
            //3、分模块不分上下级
            res.moduleList.forEach((v) => {
              this.quotaionDetailLineInfo.push(v);
            });
          } else if (res.templateNum === "WZ04") {
            //4、分模块分上下级
            res.moduleList.forEach((v) => {
              tempContentPar = [];
              tempContent = [];
              tempContent = v.supQuotationDetailPage.content;
              tempContent.map((v2) => {
                if (v2.childFlag === 1) {
                  tempContentPar.push(v2);
                } else {
                  this.tempContentNext.push(v2);
                }
              });
              v.supQuotationDetailPage.content = tempContentPar;
              this.quotaionDetailLineInfo.push(v);
            });
          }
        }
        this.$loading.hide();
      });
    },
    //报价明细
    toQuotaionDetail(record) {
      this.getQuotaionDetailInfo(record);
      this.quotaionDetailPop = !this.quotaionDetailPop;
    },
    //报价明细下级页面
    toNextQuotaionDetail(record) {
      this.nextQuotaionDetailLineInfo = [];
      this.tempContentNext.map((v) => {
        if (v.parentDetailId === record.dtlRecId) {
          this.nextQuotaionDetailLineInfo.push(v);
        }
      });
      this.nextQuotaionDetailPop = !this.nextQuotaionDetailPop;
    },
    //阶梯报价
    toLadderDetail(record) {
      this.getLadderInfo(record.quotationLineId);
      this.ladderHeaderInfo = record;
      this.ladderPop = !this.ladderPop;
    },
    //议价详情页
    clickBarginLineInfo(record) {
      if (!record) {
        return;
      }

      this.barginPriceDetailPop = !this.barginPriceDetailPop;
      const currentData = record.toData() || {};
      console.log(
        currentData,
        "currentData",
      );
      this.bargainPriceDetailData = currentData;
    },
  }
};
</script>

<style lang="stylus" scoped>
.srm-wrapper {
  width: 100%;

  .srm-customize-card {
    // padding: 6px 0px 6px 0px;
  }
}

.srm-quotaion-detail-title {
    padding: 10px 15px;
    font-size: 12px;
  }
</style>