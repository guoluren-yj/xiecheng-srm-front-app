<template>
  <div>
    <!-- 头信息 -->
    <srm-detail-head :data-source="list" :columns="getDetailHeadColumns" />
    <!-- 报价/竞价前物料信息 -->
    <div v-if="!leftTimeFlag" class="prequalification-detail">
      <ul>
        <customize-detail key="quoteBidColumns" ref="quoteBidColumns" :columns="getQuoteBidColumns" :data-source="list" />
      </ul>
    </div>

    <!-- (报价)物料信息 -->
    <div v-else-if="pageFlag && !bargainPageFlag" class="prequalification-detail">
      <ul>
        <customize-detail key="quoteColumns" ref="quoteColumns" :columns="getQuoteColumns" :data-source="list" />
      </ul>
      <section class="no-more"/>
    </div>

    <!-- 议价 -->
    <div v-else-if="bargainPageFlag" class="prequalification-detail">
      <ul>
        <customize-detail key="bargainColumns" ref="bargainColumns" :columns="getBargainColumns" :data-source="list" />
      </ul>
      <section class="no-more"/>
    </div>

    <!-- (竞价)物料信息 -->
    <div v-else class="prequalification-detail">
      <ul>
        <customize-detail key="bidColumns" :columns="getBidColumns" :data-source="list" />
      </ul>
      <section class="no-more"/>
    </div>
    <!-- 日期弹窗 -->
    <date-chooser v-model="datePopup" @submitDate="handleConfirm"/>
    <!-- 附件预览 -->
    <pre-file-pop v-model="preModel" :pre-url="preUrl"/>
    <srm-popup :visible="ladderQuotationPopup"
               height="100%"
               position="right"
               :show-back="true"
               :show-close="false"
               :title="$T('ssrc.supplierQuotation.model.supQuo.ladderBidding').$D('阶梯报价')"
               @onClose="onPopupClose">
      <ladder-quotation v-if="ladderQuotationPopup" :head-info="headInfo" :line-data="list" :double-unit-flag="doubleUnitFlag"/>
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
import PreFilePop from "@/components/File/PreFilePop";
import Quotation from "@/modules/SupplierQuotation/components/Quotation";
import DateChooser from "@/components/DateChooser";
import LadderQuotation from "@/modules/SupplierQuotation/views/LadderQuotationDetail";
import { $T, SrmListHeader } from "srm-mobile-ui";

export default {
  modules: [ "ssrc.supplierQuotation", "hipspfm.supplierQuotation", "hipspfm.common", "hptl.common", "spuc.common", "ssrc.inquiryHall", "smbl.common", "hzero.common", "ssrc.common" ],
  name: "SupplierBiddingMaterialInfo",
  components: {
    LadderQuotation,
    PreFilePop,
    // eslint-disable-next-line vue/no-unused-components
    Quotation,
    DateChooser,
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    isUnTaxPriceFlag: {
      type: Boolean,
      default: false
    },
    headInfo: {
      type: Object,
      default: () => ({})
    },
    lineInfo: {
      type: Array,
      default: () => []
    },
    operationMeaning: {
      type: String,
      default: null,
    },
    switchUrl: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      preModel: false, //附件预览
      preUrl: "", //附件路径
      taxChecked: false,
      quotationChecked: false,
      abandonedChecked: false,
      freightChecked: false,
      sampleChecked: false,
      addressInput: "",
      attachmentUuid: "", //当前传入的文件uuid
      attachmentType: "lineRfxFile", //当前获取文件类型
      page: 0,
      datePopup: false,
      choseedDate: "",
      timer: null,
      mLeftTime: {},
      rfxHeaderQuotationEndDate: "", //剩余时间
      pageFlag: false, //报价为true/竞价为false,
      bargainPageFlag: false, //议价为true
      quotationDetailPop: false,
      quotationDetail: {},
      ladderQuotationPopup: false,
      //一下两个字段控制currentQuotationPrice，netPrice两字段inputChang监听方法互相作用导致死循环
      currentQuotationPriceTgr:false,
      netPriceTgrFlag: false,
      getColumns:[],
      getCodes:"",
    };
  },
  computed: {
    list() {
      return this.lineInfo[this.index] || {};
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "rfxLineItemNum",
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.lineNum").$D("行号"),
        },
        {
          fieldCode: "itemCode",
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.itemCode").$D("物料编码"),
        },
        {
          fieldCode: "itemName",
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.itemName").$D("物料名称"),
        },
      ];

      return columns;
    },
    getQuoteBidColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationStartDate").$D("开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationsEndDate").$D("结束时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.businessUnit").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.inventoryOrg").$D("库存组织"),
          fieldCode: "invOrganizationName",
        },
        {
          fieldName: this.$T("hipspfm.supplierQuotation.model.supplierQuotation.categoryName").$D("物品分类"),
          fieldCode: "categoryName",
          render: () => this.list.categoryName || this.list.itemCategoryName
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.itemNote").$D("物品说明"),
          fieldCode: "itemRemark",
        },
        Number(this.switchUrl) !== 2 && {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细"),
          fieldCode: "tenderClarification",
          render: () => {
            if (this.list.quotationDetailFlag) {
              return <span style="color:blue">{this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细")}</span>;
            }
            return "";
          },
          callBack: (val) => {
            this.showQuotationDetail(val);
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryAddress").$D("送货地址"),
          fieldCode: "deliveryAddress",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quantity").$D("需求数量"),
          fieldCode: "rfxQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率（%）"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationRange").$D("报价幅度"),
          fieldCode: "quotationRange",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.maxLimitPrice").$D("最高限价"),
          fieldCode: "maxLimitPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minLimitPrice").$D("最低限价"),
          fieldCode: "minLimitPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.needSample").$D("需要样品"),
          fieldCode: "sampleRequestedFlagMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.includingFreight").$D("是否含运费"),
          fieldCode: "freightIncludedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) =>
          // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格"),
          fieldCode: "specs",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.model").$D("型号"),
          fieldCode: "model",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.startLadderLevel").$D("启用阶梯报价"),
          fieldCode: "ladderInquiryFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        Number(this.switchUrl) !== 2 && {
          fieldName: this.$T("ssrc.supplierQuotation.view.message.button.ladderLevel").$D("阶梯报价"),
          fieldCode: "ladderQuotation",
          render: () => {
            if (this.list.ladderInquiryFlag) {
              return <span style="color:blue">{this.$T("hipspfm.supplierQuotation.view.message.viewDetail").$D("查看详情")}</span>;
            }
            return <SrmListHeader showOpenTag={false}>
              <span style="color:#999">{this.$T("hipspfm.supplierQuotation.view.message.viewDetail").$D("查看详情")}</span>
              <span slot="right" style="color:red">{this.$T("hipspfm.supplierQuotation.view.message.enabledLadderLevel").$D("未启用阶梯报价")}</span>
            </SrmListHeader>;
          },
          callBack: () => {
            if (this.list.ladderInquiryFlag) {
              this.goToDetail();
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.requisitionNo.").$D("采购申请号"),
          fieldCode: "prNum",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.requisitionLineNo.").$D("采购申请行号"),
          fieldCode: "prLineNum",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.InquiryAttachment").$D("询价单附件"),
          fieldCode: "rfxAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T("smbl.common.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "smbl.common.view.button.viewUpload"
                ).$D("查看附件")}
              />
            </div>
          ,
        },
      ];

      return columns;
    },
    getQuoteColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.configUnitPrice").$D("单价"),
          fieldCode: "currentQuotationPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.netPrice").$D("未税单价"),
          fieldCode: "netPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationStatus").$D("报价状态"),
          fieldCode: "quotationLineStatusMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quantity").$D("需求数量"),
          fieldCode: "rfxQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.currentQuotationQuantity").$D("可供数量"),
          fieldCode: "currentQuotationQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) =>
          // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validQuotationPrice").$D("有效单价"),
          fieldCode: "validQuotationPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.Counter-bidPrice").$D("还价单价"),
          fieldCode: "validBargainPrice",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmount").$D("行金额"),
          fieldCode: "totalAmount",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmountWithoutTax").$D("行金额（未税）"),
          fieldCode: "netAmount",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格"),
          fieldCode: "specs",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.model").$D("型号"),
          fieldCode: "model",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.counterOfferReason").$D("还价理由"),
          fieldCode: "currentBargainRemark",
          render: () => this.list.currentBargainRemark || this.list.validBargainRemark || ""
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.Counter-bider").$D("还价人"),
          fieldCode: "currentBargainBy",
          render: () => this.list.currentBargainBy || this.list.bargainName || ""
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率（%）"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.abandon").$D("放弃"),
          fieldCode: "abandonedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.startLadderLevel").$D("启用阶梯报价"),
          fieldCode: "ladderInquiryFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        Number(this.switchUrl) !== 2 && {
          fieldName: this.$T("ssrc.supplierQuotation.view.message.button.ladderLevel").$D("阶梯报价"),
          fieldCode: "ladderQuotation",
          render: () => {
            if (!this.list.ladderInquiryFlag && this.pageFlag) {
              return <SrmListHeader showOpenTag={false}>
                <span style="color:#999">{this.$T("hipspfm.supplierQuotation.view.message.viewDetail").$D("查看详情")}</span>
                <span slot="right" style="color:red">{this.$T("hipspfm.supplierQuotation.view.message.enabledLadderLevel").$D("未启用阶梯报价")}</span>
              </SrmListHeader>;
            }
            return <span style="color:blue">{this.$T("hipspfm.supplierQuotation.view.message.viewDetail").$D("查看详情")}</span>;
          },
          callBack: () => {
            if (!this.list.ladderInquiryFlag && this.pageFlag) {
              return null;
            }
            this.goToDetail();
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.qVFrom").$D("报价有效期从"),
          fieldCode: "currentExpiryDateFrom",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentExpiryDateTo").$D("报价有效期至"),
          fieldCode: "currentExpiryDateTo",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentPromisedDate").$D("承诺交货日期"),
          fieldCode: "currentPromisedDate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryPeriod2").$D("供货周期"),
          fieldCode: "currentDeliveryCycle",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDescription").$D("报价说明"),
          fieldCode: "currentQuotationRemark",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.priceQuantity").$D("价格批量"),
          fieldCode: "priceBatchQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minimumPurAmount").$D("最小采购量"),
          fieldCode: "minPurchaseQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minPackageQuantity").$D("最小包装量"),
          fieldCode: "minPackageQuantity",
        },
        {
          fieldName: this.$T("hipspfm.supplierQuotation.model.supplierQuotation.categoryName").$D("物品分类"),
          fieldCode: "categoryName",
          render: () => this.list.categoryName || this.list.itemCategoryName
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.itemNote").$D("物品说明"),
          fieldCode: "itemRemark",
        },
        Number(this.switchUrl) !== 2 && {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细"),
          fieldCode: "tenderClarification",
          render: () => {
            if (this.list.quotationDetailFlag) {
              return <span style="color:blue">{this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细")}</span>;
            }
            return "";
          },
          callBack: (val) => {
            this.showQuotationDetail(val);
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationRange").$D("报价幅度"),
          fieldCode: "quotationRange",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryAddress").$D("送货地址"),
          fieldCode: "deliveryAddress",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.includingFreight").$D("是否含运费"),
          fieldCode: "freightIncludedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.freightAmount").$D("运费"),
          fieldCode: "freightAmount",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.needSample").$D("需要样品"),
          fieldCode: "sampleRequestedFlagMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.maxLimitPrice").$D("最高限价"),
          fieldCode: "maxLimitPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minLimitPrice").$D("最低限价"),
          fieldCode: "minLimitPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.rfxAttachmentUuid").$D("询价单行附件"),
          fieldCode: "rfxAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T("smbl.common.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "smbl.common.view.button.viewUpload"
                ).$D("查看附件")}
              />
            </div>
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.supplierLineAttachment").$D("供应商行附件"),
          fieldCode: "supplyAttachment",
          render: (val, record) => {
            return <SrmUpload
              attachmentUuid={record.currentAttachmentUuid}
              show-count={false}
              show-icon={false}
              title={this.$T("smbl.common.model.annexUuid").$D(
                "相关附件"
              )}
              desc-title={this.$T(
                "smbl.common.view.button.viewUpload"
              ).$D("查看附件")}
            />;
          },
        },
      ];

      return columns;
    },
    getBargainColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationStatus").$D("报价状态"),
          fieldCode: "quotationLineStatusMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.configUnitPrice").$D("单价"),
          fieldCode: "currentQuotationPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.netPrice").$D("未税单价"),
          fieldCode: "netPrice",
        },
        this.headInfo.priceTypeCode === "TAX_INCLUDED_PRICE" || this.headInfo.priceTypeCode === null ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validTaxQuotationPrice").$D("有效含税报价"),
          fieldCode: "validQuotationPrice",
        } : null,
        this.headInfo.priceTypeCode === "NET_PRICE" ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validUnTaxQuotationPrice").$D("有效未税报价"),
          fieldCode: "validNetPrice",
        } : null,
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.Counter-bidPrice").$D("还价单价"),
          fieldCode: "validBargainPrice",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmount").$D("行金额"),
          fieldCode: "totalAmount",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmountWithoutTax").$D("行金额（未税）"),
          fieldCode: "netAmount",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.counterOfferReason").$D("还价理由"),
          fieldCode: "currentBargainRemark",
          render: () => this.list.currentBargainRemark || this.list.validBargainRemark || ""
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.Counter-bider").$D("还价人"),
          fieldCode: "currentBargainBy",
          render: () => this.list.currentBargainBy || this.list.bargainName || ""
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格"),
          fieldCode: "specs",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.model").$D("型号"),
          fieldCode: "model",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率（%）"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quantity").$D("需求数量"),
          fieldCode: "rfxQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.currentQuotationQuantity").$D("可供数量"),
          fieldCode: "currentQuotationQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.priceQuantity").$D("价格批量"),
          fieldCode: "priceBatchQuantity",
        },
        Number(this.switchUrl) !== 2 && {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细"),
          fieldCode: "tenderClarification",
          render: () => {
            if (this.list.quotationDetailFlag) {
              return <span style="color:blue">{this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细")}</span>;
            }
            return "";
          },
          callBack: (val) => {
            this.showQuotationDetail(val);
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) =>
          // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.startLadderLevel").$D("启用阶梯报价"),
          fieldCode: "ladderInquiryFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        Number(this.switchUrl) !== 2 && {
          fieldName: this.$T("ssrc.supplierQuotation.view.message.button.ladderLevel").$D("阶梯报价"),
          fieldCode: "ladderQuotation",
          render: () => {
            if (this.list.ladderInquiryFlag) {
              return <span style="color:blue">{this.$T("hipspfm.supplierQuotation.view.message.viewDetail").$D("查看详情")}</span>;
            }
            return <SrmListHeader showOpenTag={false}>
              <span style="color:#999">{this.$T("hipspfm.supplierQuotation.view.message.viewDetail").$D("查看详情")}</span>
              <span slot="right" style="color:red">{this.$T("hipspfm.supplierQuotation.view.message.enabledLadderLevel").$D("未启用阶梯报价")}</span>
            </SrmListHeader>;
          },
          callBack: () => {
            if (this.list.ladderInquiryFlag) {
              this.goToDetail();
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.qVFrom").$D("报价有效期从"),
          fieldCode: "currentExpiryDateFrom",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentExpiryDateTo").$D("报价有效期至"),
          fieldCode: "currentExpiryDateTo",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentPromisedDate").$D("承诺交货日期"),
          fieldCode: "currentPromisedDate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryPeriod2").$D("供货周期"),
          fieldCode: "currentDeliveryCycle",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDescription").$D("报价说明"),
          fieldCode: "currentQuotationRemark",
        },

        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minimumPurAmount").$D("最小采购量"),
          fieldCode: "minPurchaseQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minPackageQuantity").$D("最小包装量"),
          fieldCode: "minPackageQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.itemCategory").$D("物料类别"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.includingFreight").$D("是否含运费"),
          fieldCode: "freightIncludedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.freightAmount").$D("运费"),
          fieldCode: "freightAmount",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.rfxAttachmentUuid").$D("询价单行附件"),
          fieldCode: "rfxAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T("smbl.common.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "smbl.common.view.button.viewUpload"
                ).$D("查看附件")}
              />
            </div>
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.supplierLineAttachment").$D("供应商行附件"),
          fieldCode: "supplyAttachment",
          render: (val, record) => {
            return <SrmUpload
              attachmentUuid={record.currentAttachmentUuid}
              show-count={false}
              show-icon={false}
              title={this.$T("smbl.common.model.annexUuid").$D(
                "相关附件"
              )}
              desc-title={this.$T(
                "smbl.common.view.button.viewUpload"
              ).$D("查看附件")}
            />;
          },
        },
      ];

      return columns;
    },
    getBidColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.supplierQuotation.model.supplierQuotation.rank").$D("排名"),
          fieldCode: "rank",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.configUnitPrice").$D("单价"),
          fieldCode: "currentQuotationPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.netPrice").$D("未税单价"),
          fieldCode: "netPrice",
        },
        !this.pageFlag ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.lineStatus").$D("行状态"),
          fieldCode: "lineStatusMeaning",
          render: (val) => <span style="color:#ffbc00"> {val} </span>
        } : null,
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格"),
          fieldCode: "specs",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.model").$D("型号"),
          fieldCode: "model",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationStatus").$D("报价状态"),
          fieldCode: "quotationLineStatusMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quantity").$D("需求数量"),
          fieldCode: "rfxQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.currentQuotationQuantity").$D("可供数量"),
          fieldCode: "currentQuotationQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationStartDate").$D("开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationsEndDate").$D("结束时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validQuotationPrice").$D("有效单价"),
          fieldCode: "validQuotationPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationRange").$D("报价幅度"),
          fieldCode: "quotationRange",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.maxLimitPrice").$D("最高限价"),
          fieldCode: "maxLimitPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minLimitPrice").$D("最低限价"),
          fieldCode: "minLimitPrice",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率（%）"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) =>
          // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minimumPurAmount").$D("最小采购量"),
          fieldCode: "minPurchaseQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minPackageQuantity").$D("最小包装量"),
          fieldCode: "minPackageQuantity",
        },
        Number(this.switchUrl) !== 2 && {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细"),
          fieldCode: "tenderClarification",
          render: () => {
            if (this.list.quotationDetailFlag) {
              return <span style="color:blue">{this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细")}</span>;
            }
            return "";
          },
          callBack: (val) => {
            this.showQuotationDetail(val);
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.abandon").$D("放弃"),
          fieldCode: "abandonedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.startLadderLevel").$D("启用阶梯报价"),
          fieldCode: "ladderInquiryFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        Number(this.switchUrl) !== 2 && {
          fieldName: this.$T("ssrc.supplierQuotation.view.message.button.ladderLevel").$D("阶梯报价"),
          fieldCode: "ladderQuotation",
          render: () => {
            if (this.list.ladderInquiryFlag) {
              return <span style="color:blue">{this.$T("hipspfm.supplierQuotation.view.message.viewDetail").$D("查看详情")}</span>;
            }
            return <SrmListHeader showOpenTag={false}>
              <span style="color:#999">{this.$T("hipspfm.supplierQuotation.view.message.viewDetail").$D("查看详情")}</span>
              <span slot="right" style="color:red">{this.$T("hipspfm.supplierQuotation.view.message.enabledLadderLevel").$D("未启用阶梯报价")}</span>
            </SrmListHeader>;
          },
          callBack: () => {
            if (this.list.ladderInquiryFlag) {
              this.goToDetail();
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.qVFrom").$D("报价有效期从"),
          fieldCode: "currentExpiryDateFrom",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentExpiryDateTo").$D("报价有效期至"),
          fieldCode: "currentExpiryDateTo",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentPromisedDate").$D("承诺交货日期"),
          fieldCode: "currentPromisedDate",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryPeriod2").$D("供货周期"),
          fieldCode: "currentDeliveryCycle",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDescription").$D("报价说明"),
          fieldCode: "currentQuotationRemark",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryAddress").$D("送货地址"),
          fieldCode: "deliveryAddress",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.includingFreight").$D("是否含运费"),
          fieldCode: "freightIncludedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.freightAmount").$D("运费"),
          fieldCode: "freightAmount",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.needSample").$D("需要样品"),
          fieldCode: "sampleRequestedFlagMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.rfxAttachmentUuid").$D("询价单行附件"),
          fieldCode: "rfxAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={false}
                show-icon={false}
                title={this.$T("smbl.common.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "smbl.common.view.button.viewUpload"
                ).$D("查看附件")}
              />
            </div>
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.supplierLineAttachment").$D("供应商行附件"),
          fieldCode: "supplyAttachment",
          render: (val, record) => {
            let currentAttachmentUuid;
            if (record.currentAttachmentUuid) {
              currentAttachmentUuid = record.currentAttachmentUuid;
            } else {
              currentAttachmentUuid = uuid();
              record.currentAttachmentUuid = currentAttachmentUuid;
            }
            if (this.pageFlag) {
              return <SrmUpload
                color="blue"
                attachmentUuid={currentAttachmentUuid}
                canUpload={true}
                showIcon={false}
                title={this.$T("smbl.common.model.annexUuid").$D(
                  "相关附件"
                )}
                descTitle={this.$T("hipspfm.common.button.uploadAttachment").$D("上传附件")} />;
            }
            return <SrmUpload
              attachmentUuid={currentAttachmentUuid}
              show-count={false}
              show-icon={false}
              title={this.$T("smbl.common.model.annexUuid").$D(
                "相关附件"
              )}
              desc-title={this.$T(
                "smbl.common.view.button.viewUpload"
              ).$D("查看附件")}
            />;
          },
        },
      ];

      return columns;
    },
    leftTimeFlag() {
      return [ "BIDDING", "QUOTATION", "ROUND_QUOTATION", "BARGAIN_QUOTATION" ].includes(
        this.operationMeaning
      );
    },
  },
  watch: {
    ladderQuotationPopup(val) {
      if (!val) {
        //弹窗关闭刷新数据
        this.$emit("updateData");
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      this.freightUpdatableFlag = this.headInfo.freightUpdatableFlag;
      const { operationMeaning } = this;
      operationMeaning === "QUOTATION" || operationMeaning === "ROUND_QUOTATION" || operationMeaning === "BARGAIN_QUOTATION" ?
        this.pageFlag = true :
        this.pageFlag = false;
      operationMeaning === "BARGAIN_QUOTATION" ? this.bargainPageFlag = true : this.bargainPageFlag = false;
    },
    //选择时间
    handleConfirm(value) {
      this[this.changeDate] = value;
      this.list[this.changeDate] = value + " 00:00:00";
      this.datePopup = false;
    },
    // 跳转阶梯报价
    goToDetail(flag) {
      this.list.noParticipateFlag = flag === "noParticipate";
      this.ladderQuotationPopup = true;
    },
    //展示报价明细
    showQuotationDetail(list) {
      this.quotationDetail = list;
      if (list.quotationDetailFlag) {
        this.detailPopup = this.$popup({
          title: $T("ssrc.inquiryHall.view.message.modal.quotationDetail").$D("报价明细"),
          showHeader: true,
          showClose: true,
          position: "right",
          showBack: false,
          height: "100%",
          rounded: false,
          content: <quotation supplier-quotation-detail={this.quotationDetail} left-time-flag={false} />,
        });
      }
      // if (list.quotationDetailFlag) {
      //   this.quotationDetailPop = !this.quotationDetailPop;
      // }
    },
    close() {
      this.$emit("input", false);
      this.refreshdata;
    },
    refreshdata() {
      this.$emit("refreshData");
    },
    onPopupClose() {
      this.ladderQuotationPopup = false;
      this.refreshdata();
    },
  }
};
</script>

<style lang="stylus" scoped>
.header {
  font-size: 18px;
  font-weight: bold;
  line-height: 32px;
}

.time-info {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: var(--color-bg-default) 1 f 1;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--color-other-default);
  text-align: center;
}
.prequalification-detail {
  padding-bottom: 80px;
  padding: 0 15px;
  height: calc(100vh - 120px);
  overflow: auto;

  ul {
    li {
      display: flex;
      border-bottom: 1px solid var(--color-border-default);
      padding: 16px 20px 15px 0;

      &:last-child {
        align-items: center;
      }
      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;

        img {
          width: 16px;
          height: 16px;
          float: right;
        }
      }

      .status {
        color: var(--color-other-default-c) !important;
      }

      .edit {
        display: flex;
        justify-content: space-between;

        span {
          color: var(--color-font-default-b);
        }
      }

      span:nth-child(1) {
        width: 109px;
      }

      span:nth-child(2) {
        width: 225px;
        color: var(--color-font-default-b);
      }

      span.fileBtn {
        color: var(--color-font-default-e);
      }

      span.file-btn {
        color: var(--color-other-default-b);
      }

      span.unFileBtn {
        color: #999;
      }
    }
  }
}

.handler-bottom {
  display: flex;
  justify-content: center;
  width: 100%;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  font-weight: bold;
  color: var(--color-other-default-b);
  background: var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27, 30, 43, 0.05);
  position: fixed;
  bottom: 0;
  text-align: center;
  z-index: 555;
}
</style>
