<template>
  <div>
    <div class="main-info">
      <section
        v-if="leftTimeFlag && mLeftTime.days"
        class="time-info">
        {{ $T('hipspfm.supplierQuotation.model.supplierQuotation.remainingTime').$D('剩余时间') }}：{{
          mLeftTime.days
        }}{{ $T('hipspfm.common.message.days').$D('天') }}:{{ mLeftTime.hours }}:{{
          mLeftTime.minutes
        }}:{{ mLeftTime.seconds }}
      </section>
    </div>

    <!-- 头信息 -->
    <srm-detail-head :data-source="list" :columns="getDetailHeadColumns" />
    <!-- 报价/竞价前物料信息 -->
    <div v-if="!leftTimeFlag" class="prequalification-detail">
      <ul>
        <customize-detail key="quoteBidColumns" ref="quoteBidColumns" :columns="getQuoteBidColumns" :data-source="list"
                          code="SMBL.SUPPLIER_QUOTATION.QUOTE_BID_MATERIAL_DETIAL"/>
      </ul>
    </div>

    <!-- (报价)物料信息 -->
    <div v-else-if="pageFlag && !bargainPageFlag" class="prequalification-detail">
      <ul>
        <customize-detail key="quoteColumns" ref="quoteColumns" :columns="getQuoteColumns" :data-source="list"
                          code="SMBL.SUPPLIER_QUOTATION.QUOTE_MATERIAL_DETIAL"/>
      </ul>
      <section class="no-more"/>
    </div>

    <!-- 议价 -->
    <div v-else-if="bargainPageFlag" class="prequalification-detail">
      <ul>
        <customize-detail key="bargainColumns" ref="bargainColumns" :columns="getBargainColumns" :data-source="list"
                          code="SMBL.SUPPLIER_QUOTATION.BARGAIN_MATERIAL_DETIAL_NEW"/>
      </ul>
      <section class="no-more"/>
    </div>

    <!-- (竞价)物料信息 -->
    <div v-else class="prequalification-detail">
      <ul>
        <customize-detail key="bidColumns" :columns="getBidColumns" :data-source="list"
                          code="SMBL.SUPPLIER_QUOTATION.MATERIAL_DETIAL"/>
      </ul>
      <section class="no-more"/>
    </div>
    <!-- 日期弹窗 -->
    <date-chooser v-model="datePopup" @submitDate="handleConfirm"/>
    <!-- 附件预览 -->
    <pre-file-pop v-model="preModel" :pre-url="preUrl"/>
    <!-- 底部按钮组 -->
    <srm-bottom-handler v-if="leftTimeFlag" :btn-arr="getBtnArr"/>
    <!-- 报价明细 ,当前逻辑移动至少showQuotationDetail方法中，打开弹窗进行加载 -->
    <!--      <quotation -->
    <!--        :supplier-quotation-detail="quotationDetail" -->
    <!--        :left-time-flag="leftTimeFlag"/> -->
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
import { leftTime } from "@/utils/index";
import Quotation from "../components/Quotation";
import DateChooser from "@/components/DateChooser";
import { numberInputCheckAllNum, judgeIsNumExist } from "@/utils/index";
import {
  saveQuotation,
} from "../api/index";
import LadderQuotation from "@/modules/SupplierQuotation/views/LadderQuotation";
import { $T, SrmListHeader, SrmMath, SrmUtil } from "srm-mobile-ui";
import { debounce } from "lodash";

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
    }
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
    // 底部按钮
    getBtnArr() {
      const btnArr = [
        {
          title: this.$T("hipspfm.common.button.save").$D("保存"),
          type:"primary",
          handler: debounce(() => {
            this.handleSubmit();
          }, 500),
        },
      ];

      return btnArr;
    },
    list() {
      return this.lineInfo[this.index] || {};
    },
    netPriceFlag() {
      return !(this.list.abandonedFlag ||
                this.list.continuousQuotationFlag === 0 && this.list.currentQuotationPrice && this.list.quotationLineStatus === "SUBMITTED" ||
                this.list.bargainFlag === 0 && this.list.bargainStatus === "BARGAINING_ONLINE" ||
                this.list.quotationLineStatus === "SUBMITTED" && this.list.bargainFlag !== 1 && this.list.continuousQuotationFlag !== 1 || // 启用连续报价，且进行议价的行可编辑
                this.headInfo.priceTypeCode === "TAX_INCLUDED_PRICE" ||
                this.headInfo.priceTypeCode === null);
    },
    priceFlag() {
      return !(this.list.abandonedFlag ||
                this.list.continuousQuotationFlag === 0 && this.list.currentQuotationPrice && this.list.quotationLineStatus === "SUBMITTED" ||
                this.list.bargainFlag === 0 && this.list.bargainStatus === "BARGAINING_ONLINE" ||
                this.list.quotationLineStatus === "SUBMITTED" && this.list.bargainFlag !== 1 && this.list.continuousQuotationFlag !== 1 || // 启用连续报价，且进行议价的行可编辑
                this.headInfo.priceTypeCode === "NET_PRICE");
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
        {
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
          fieldType:"INPUT_NUMBNER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          fieldType: "SWITCH",
          disabled: true,
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
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minLimitPrice").$D("最低限价"),
          fieldCode: "minLimitPrice",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.needSample").$D("需要样品"),
          fieldCode: "sampleRequestedFlagMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.includingFreight").$D("是否含运费"),
          fieldCode: "freightIncludedFlag",
          fieldType: "SWITCH",
          disabled: true,
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
        // 二开字段
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar1").$D("年级"),
          fieldCode: "attributeVarchar1Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar2").$D("学科"),
          fieldCode: "attributeVarchar2Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar3").$D("课程类别"),
          fieldCode: "attributeVarchar3Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar4").$D("总页码"),
          fieldCode: "attributeVarchar4",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar5").$D("封面用纸"),
          fieldCode: "attributeVarchar5",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar6").$D("封面印色"),
          fieldCode: "attributeVarchar6Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar7").$D("内文用纸"),
          fieldCode: "attributeVarchar7",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar8").$D("内文印色"),
          fieldCode: "attributeVarchar8Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar9").$D("规格尺寸"),
          fieldCode: "attributeVarchar9",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar10").$D("装订方式"),
          fieldCode: "attributeVarchar10Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar11").$D("工艺"),
          fieldCode: "attributeVarchar11",
        } : null,
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.startLadderLevel").$D("启用阶梯报价"),
          fieldCode: "ladderInquiryFlag",
          fieldType: "SWITCH",
          disabled: true,
        },
        {
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
          fieldType: "INPUT_NUMBER",
          editor:this.priceFlag,
          editLimit:this.priceFlag,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision")),
          required: this.priceFlag && !this.list.abandonedFlag,
          inputChange: (val, record) => {
            this.inputQuotationPriceFocus(record);
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.netPrice").$D("未税单价"),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          editor:this.netPriceFlag,
          editLimit:this.netPriceFlag,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision")),
          required:this.netPriceFlag && !this.list.abandonedFlag,
          inputChange: (val, record) => {
            this.inputNetPriceFocus(record);
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationStatus").$D("报价状态"),
          fieldCode: "quotationLineStatusMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quantity").$D("需求数量"),
          fieldCode: "rfxQuantity",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.currentQuotationQuantity").$D("可供数量"),
          fieldCode: "currentQuotationQuantity",
          fieldType: "INPUT_NUMBER",
          editor:Boolean(this.list.quantityChangeFlag),
          editLimit:Boolean(this.list.quantityChangeFlag),
          precision: (val, record) => Number(record.uomPrecision),
          required: !this.list.abandonedFlag && this.list.quantityChangeFlag,
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
        // 二开字段
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar1").$D("年级"),
          fieldCode: "attributeVarchar1Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar2").$D("学科"),
          fieldCode: "attributeVarchar2Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar3").$D("课程类别"),
          fieldCode: "attributeVarchar3Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar4").$D("总页码"),
          fieldCode: "attributeVarchar4",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar5").$D("封面用纸"),
          fieldCode: "attributeVarchar5",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar6").$D("封面印色"),
          fieldCode: "attributeVarchar6Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar7").$D("内文用纸"),
          fieldCode: "attributeVarchar7",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar8").$D("内文印色"),
          fieldCode: "attributeVarchar8Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar9").$D("规格尺寸"),
          fieldCode: "attributeVarchar9",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar10").$D("装订方式"),
          fieldCode: "attributeVarchar10Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar11").$D("工艺"),
          fieldCode: "attributeVarchar11",
        } : null,
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validQuotationPrice").$D("有效单价"),
          fieldCode: "validQuotationPrice",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.Counter-bidPrice").$D("还价单价"),
          fieldCode: "validBargainPrice",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmount").$D("行金额"),
          fieldCode: "totalAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision:(val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision"))
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmountWithoutTax").$D("行金额（未税）"),
          fieldCode: "netAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision:(val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision"))
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格"),
          fieldCode: "specs",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.model").$D("型号"),
          fieldCode: "model",
        },
        //我乐家个性化字段
        this.getTenantNum === "SRM-OTO" ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.demandAttachment").$D("需求方附件"),
          fieldCode: "attributeLongtext1",
          render: (val) => {
            if (val) {
              return <span style="color:blue">{this.$T("hptl.common.model.portal.linkUrl").$D("链接")}</span>;
            }
            return <span style="color:#afafaf">{this.$T("hptl.common.model.portal.linkUrl").$D("链接")}</span>;
          },
          callBack: (val) => {
            if (val.attributeLongtext1) {
              this.showPreModel(val.attributeLongtext1);
            }
          }
        } : null,
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
          fieldType: "SWITCH",
          disabled: Boolean(this.list.abandonedFlag === 1 || this.list.taxChangeFlag === 0),
          inputChange: (val) => {
            this.$set(this.list, "taxIncludedFlag", val);
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率（%）"),
          fieldCode: "taxRate",
          required: this.list.taxChangeFlag && this.list.taxIncludedFlag && !this.list.abandonedFlag,
          render: (val) => {
            if (this.list.taxChangeFlag && this.list.taxIncludedFlag) {
              return <span style="color:blue">
                {val || this.$T("hipspfm.supplierQuotation.message.validation.handlerTaxRate").$D("请选择税率")}
              </span>;
            }
            return val;
          },
          callBack: () => {
            if (this.list.taxChangeFlag && this.list.taxIncludedFlag) {
              if (!this.list.abandonedFlag) {
                this.showTaxRate();
              }
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.abandon").$D("放弃"),
          fieldCode: "abandonedFlag",
          fieldType: "SWITCH",
          disabled: this.list.quotationScope === "ALL_QUOTATION",
          inputChange: (val) => {
            this.$set(this.list, "abandonedFlag", val);
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.startLadderLevel").$D("启用阶梯报价"),
          fieldCode: "ladderInquiryFlag",
          fieldType: "SWITCH",
          disabled: this.list.diyLadderQuotationFlag !== 1,
          inputChange: (val) => {
            this.$set(this.list, "ladderInquiryFlag", val);
          },
        },
        {
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
          fieldType: "DATE_PICKER",
          required: this.list.validDateInputType === "REQUIRED" && !this.list.abandonedFlag,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentExpiryDateTo").$D("报价有效期至"),
          fieldCode: "currentExpiryDateTo",
          fieldType: "DATE_PICKER",
          required: this.list.validDateInputType === "REQUIRED" && !this.list.abandonedFlag,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentPromisedDate").$D("承诺交货日期"),
          fieldCode: "currentPromisedDate",
          render: (val) => {
            if (val) {
              if (this.list.abandonedFlag) {
                return <span style="color:#e1e3e9">{val.substring(0, 10)}</span>;
              }
              return <span style="color:#c6cad6">{val.substring(0, 10)}</span>;
            }
            if (this.list.abandonedFlag) {
              return <span style="color:#e1e3e9">{this.$T("hipspfm.supplierQuotation.message.validation.handlerDate").$D("请选择日期")}</span>;
            }
            return <span style="color:#c6cad6">{this.$T("hipspfm.supplierQuotation.message.validation.handlerDate").$D("请选择日期")}</span>;
          },
          callBack: () => {
            if (this.pageFlag && !this.list.abandonedFlag) {
              this.choseData("currentPromisedDate");
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryPeriod2").$D("供货周期"),
          fieldCode: "currentDeliveryCycle",
          disabled: Boolean(this.list.abandonedFlag),
          fieldType: "INPUT",
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerDeliveryPeriod").$D("请填写供货周期"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDescription").$D("报价说明"),
          fieldCode: "currentQuotationRemark",
          disabled: Boolean(this.list.abandonedFlag),
          fieldType: "INPUT",
          placeholder: this.$T("ssrc.supplierQuotation.view.write.supQuo.quotationDescription").$D("请填写报价说明"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.priceQuantity").$D("价格批量"),
          fieldCode: "priceBatchQuantity",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minimumPurAmount").$D("最小采购量"),
          fieldCode: "minPurchaseQuantity",
          fieldType: "INPUT",
          disabled: Boolean(this.list.abandonedFlag),
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerMinimumPurAmount").$D("请填写最小采购量"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minPackageQuantity").$D("最小包装量"),
          fieldCode: "minPackageQuantity",
          fieldType: "INPUT",
          disabled: Boolean(this.list.abandonedFlag),
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerMinPackageQuantity").$D("请填写最小包装量"),
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
        {
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
          fieldType: "SWITCH",
          disabled: Boolean(this.list.abandonedFlag === 1 || this.freightUpdatableFlag === 0),
          inputChange:(val, record) => {
            if (val !== 1) {
              record.freightAmount = "";
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.freightAmount").$D("运费"),
          fieldCode: "freightAmount",
          fieldType: !this.list.freightIncludedFlag ? "TEXT" : "INPUT",
          disabled: (val, record) => Boolean(!record.freightIncludedFlag),
          placeholder: this.list.freightAmount ? String(this.list.freightAmount) : this.$T("ssrc.supplierQuotation.view.write.supQuo.freightAmount").$D("请输入运费"),
          inputType: "number"
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
    getBargainColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationStatus").$D("报价状态"),
          fieldCode: "quotationLineStatusMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.configUnitPrice").$D("单价"),
          fieldCode: "currentQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: this.priceFlag,
          editLimit:this.priceFlag,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision")),
          inputChange: (val, record) => {
            this.inputQuotationPriceFocus(record);
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.netPrice").$D("未税单价"),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          editor: this.netPriceFlag,
          editLimit:this.netPriceFlag,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision")),
          inputChange: (val, record) => {
            this.inputNetPriceFocus(record);
          },
        },
        this.headInfo.priceTypeCode === "TAX_INCLUDED_PRICE" || this.headInfo.priceTypeCode === null ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validTaxQuotationPrice").$D("有效含税报价"),
          fieldCode: "validQuotationPrice",
        } : null,
        this.headInfo.priceTypeCode === "NET_PRICE" ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validUnTaxQuotationPrice").$D("有效未税报价"),
          fieldCode: "validNetPrice",
        } : null,
        //二开字段
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "年级",
        //   fieldCode: "attributeVarchar1Meaning",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar1",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "学科",
        //   fieldCode: "attributeVarchar2Meaning",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar2",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "课程类别",
        //   fieldCode: "attributeVarchar3Meaning",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar3",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "总页码",
        //   fieldCode: "attributeVarchar4",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar4",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "封面用纸",
        //   fieldCode: "attributeVarchar5",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar5",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "封面印色",
        //   fieldCode: "attributeVarchar6Meaning",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar6",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "内文用纸",
        //   fieldCode: "attributeVarchar7",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar7",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "内文印色",
        //   fieldCode: "attributeVarchar8Meaning",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar8",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "规格尺寸",
        //   fieldCode: "attributeVarchar9",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar9",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "装订方式",
        //   fieldCode: "attributeVarchar10Meaning",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar10",
        // }:undefined,
        // this.getTenantNum =="SRM-BJHL" ? {
        //   fieldName: "工艺",
        //   fieldCode: "attributeVarchar11",
        //   langCode: "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar11",
        // }:undefined,
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.Counter-bidPrice").$D("还价单价"),
          fieldCode: "validBargainPrice",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmount").$D("行金额"),
          fieldCode: "totalAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision:(val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision"))
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmountWithoutTax").$D("行金额（未税）"),
          fieldCode: "netAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision:(val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision"))
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
        //我乐家个性化字段
        this.getTenantNum === "SRM-OTO" ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.demandAttachment").$D("需求方附件"),
          fieldCode: "attributeLongtext1",
          render: (val) => {
            if (val) {
              return <span style="color:blue">{this.$T("hptl.common.model.portal.linkUrl").$D("链接")}</span>;
            }
            return <span style="color:#afafaf">{this.$T("hptl.common.model.portal.linkUrl").$D("链接")}</span>;
          },
          callBack: (val) => {
            if (val.attributeLongtext1) {
              this.showPreModel(val.attributeLongtext1);
            }
          }
        } : null,
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          fieldType: "SWITCH",
          disabled: Boolean(this.list.abandonedFlag === 1 || this.list.taxChangeFlag === 0),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率（%）"),
          fieldCode: "taxRate",
          required: !(!this.list.taxChangeFlag || !this.list.taxIncludedFlag) && !this.list.abandonedFlag,
          render: (val) => {
            if (this.list.taxChangeFlag && this.list.taxIncludedFlag) {
              return <span style="color:blue">
                { val || this.$T("hipspfm.supplierQuotation.message.validation.handlerTaxRate").$D("请选择税率")}
              </span>;
            }
            return val;
          },
          callBack: () => {
            if (this.list.taxChangeFlag && this.list.taxIncludedFlag) {
              if (!this.list.abandonedFlag) {
                this.showTaxRate();
              }
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quantity").$D("需求数量"),
          fieldCode: "rfxQuantity",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.currentQuotationQuantity").$D("可供数量"),
          fieldCode: "currentQuotationQuantity",
          fieldType: "INPUT_NUMBER",
          editor:Boolean(this.list.quantityChangeFlag),
          editLimit:Boolean(this.list.quantityChangeFlag),
          precision: (val, record) => Number(record.uomPrecision),
          disabled: Boolean(this.list.abandonedFlag),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.priceQuantity").$D("价格批量"),
          fieldCode: "priceBatchQuantity",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
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
          fieldType: "SWITCH",
          disabled: this.list.diyLadderQuotationFlag !== 1,
        },
        {
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
          fieldType: "DATE_PICKER",
          editor: () => !this.list.abandonedFlag && this.list.validDateInputType !== "READONLY",
          required: this.list.validDateInputType === "REQUIRED" && !this.list.abandonedFlag,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentExpiryDateTo").$D("报价有效期至"),
          fieldCode: "currentExpiryDateTo",
          fieldType: "DATE_PICKER",
          editor: () => !this.list.abandonedFlag && this.list.validDateInputType !== "READONLY",
          required: this.list.validDateInputType === "REQUIRED" && !this.list.abandonedFlag,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentPromisedDate").$D("承诺交货日期"),
          fieldCode: "currentPromisedDate",
          render: (val) => {
            if (val) {
              if (this.list.abandonedFlag) {
                return <span style="color:#e1e3e9">{val.substring(0, 10)}</span>;
              }
              return <span style="color:#c6cad6">{val.substring(0, 10)}</span>;
            }
            if (this.list.abandonedFlag) {
              return <span style="color:#e1e3e9">{this.$T("hipspfm.supplierQuotation.message.validation.handlerDate").$D("请选择日期")}</span>;
            }
            return <span style="color:#c6cad6">{this.$T("hipspfm.supplierQuotation.message.validation.handlerDate").$D("请选择日期")}</span>;
          },
          callBack: () => {
            if (this.pageFlag && !this.list.abandonedFlag) {
              this.choseData("currentPromisedDate");
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryPeriod2").$D("供货周期"),
          fieldCode: "currentDeliveryCycle",
          disabled: Boolean(this.list.abandonedFlag),
          fieldType: "INPUT",
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerDeliveryPeriod").$D("请填写供货周期"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDescription").$D("报价说明"),
          fieldCode: "currentQuotationRemark",
          disabled: Boolean(this.list.abandonedFlag),
          fieldType: "INPUT",
          placeholder: this.$T("ssrc.supplierQuotation.view.write.supQuo.quotationDescription").$D("请填写报价说明"),
        },

        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minimumPurAmount").$D("最小采购量"),
          fieldCode: "minPurchaseQuantity",
          fieldType: "INPUT",
          disabled: Boolean(this.list.abandonedFlag),
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerMinimumPurAmount").$D("请填写最小采购量"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minPackageQuantity").$D("最小包装量"),
          fieldCode: "minPackageQuantity",
          fieldType: "INPUT",
          disabled: Boolean(this.list.abandonedFlag),
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerMinPackageQuantity").$D("请填写最小包装量"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.itemCategory").$D("物料类别"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.includingFreight").$D("是否含运费"),
          fieldCode: "freightIncludedFlag",
          fieldType: "SWITCH",
          disabled: Boolean(this.list.abandonedFlag === 1 || this.freightUpdatableFlag === 0),
          inputChange:(val, record) => {
            if (val !== 1) {
              record.freightAmount = "";
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.freightAmount").$D("运费"),
          fieldCode: "freightAmount",
          fieldType: !this.list.freightIncludedFlag ? "TEXT" : "INPUT",
          disabled: (val, record) => Boolean(!record.freightIncludedFlag),
          placeholder: this.list.freightAmount ? String(this.list.freightAmount) : this.$T("ssrc.supplierQuotation.view.write.supQuo.freightAmount").$D("请输入运费"),
          inputType: "number"
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
    getBidColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.supplierQuotation.model.supplierQuotation.rank").$D("排名"),
          fieldCode: "rank",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.configUnitPrice").$D("单价"),
          fieldCode: "currentQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor:this.priceFlag,
          editLimit:this.priceFlag,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision")),
          required: this.headInfo.priceTypeCode === "TAX_INCLUDED_PRICE" && !this.list.abandonedFlag,
          inputChange: (val, record) => {
            this.inputQuotationPriceFocus(record);
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.netPrice").$D("未税单价"),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          editor: this.netPriceFlag,
          editLimit:this.netPriceFlag,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision")),
          required: this.headInfo.priceTypeCode === "NET_PRICE" && !this.list.abandonedFlag,
          inputChange: (val, record) => {
            this.inputNetPriceFocus(record);
          },
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
        //我乐家个性化字段
        this.getTenantNum === "SRM-OTO" ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.demandAttachment").$D("需求方附件"),
          fieldCode: "attributeLongtext1",
          render: (val) => {
            if (val) {
              return <span style="color:blue">{this.$T("hptl.common.model.portal.linkUrl").$D("链接")}</span>;
            }
            return <span style="color:#afafaf">{this.$T("hptl.common.model.portal.linkUrl").$D("链接")}</span>;
          },
          callBack: (val) => {
            if (val.attributeLongtext1) {
              this.showPreModel(val.attributeLongtext1);
            }
          }
        } : null,
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
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.currentQuotationQuantity").$D("可供数量"),
          fieldCode: "currentQuotationQuantity",
          fieldType: "INPUT_NUMBER",
          editor:Boolean(!this.list.abandonedFlag),
          editLimit:Boolean(!this.list.abandonedFlag),
          precision: (val, record) => Number(record.uomPrecision),
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
          fieldType:"INPUT_NUMBER",
          editor:false
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
          fieldType: "SWITCH",
          disabled: Boolean(this.list.abandonedFlag === 1 || this.list.taxChangeFlag === 0),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率（%）"),
          fieldCode: "taxRate",
          required: !(!this.list.taxChangeFlag || !this.list.taxIncludedFlag) && !this.list.abandonedFlag,
          render: (val) => {
            if (this.list.taxChangeFlag && this.list.taxIncludedFlag) {
              return <span style="color:blue">
                { val || this.$T("hipspfm.supplierQuotation.message.validation.handlerTaxRate").$D("请选择税率")}
              </span>;
            }
            return val;
          },
          callBack: () => {
            if (this.list.taxChangeFlag && this.list.taxIncludedFlag) {
              if (!this.list.abandonedFlag) {
                this.showTaxRate();
              }
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) =>
          // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        //二开字段
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar1").$D("年级"),
          fieldCode: "attributeVarchar1Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar2").$D("学科"),
          fieldCode: "attributeVarchar2Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar3").$D("课程类别"),
          fieldCode: "attributeVarchar3Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar4").$D("总页码"),
          fieldCode: "attributeVarchar4",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar5").$D("封面用纸"),
          fieldCode: "attributeVarchar5",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar6").$D("封面印色"),
          fieldCode: "attributeVarchar6Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar7").$D("内文用纸"),
          fieldCode: "attributeVarchar7",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar8").$D("内文印色"),
          fieldCode: "attributeVarchar8Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar9").$D("规格尺寸"),
          fieldCode: "attributeVarchar9",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar10").$D("装订方式"),
          fieldCode: "attributeVarchar10Meaning",
        } : null,
        this.getTenantNum === "SRM-BJHL" ? {
          fieldName: this.$T("spuc.common.model.common.bjhlpolineexportdto.attributeVarchar11").$D("工艺"),
          fieldCode: "attributeVarchar11",
        } : null,
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minimumPurAmount").$D("最小采购量"),
          fieldCode: "minPurchaseQuantity",
          fieldType: "INPUT",
          disabled: Boolean(this.list.abandonedFlag),
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerMinimumPurAmount").$D("请填写最小采购量"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.minPackageQuantity").$D("最小包装量"),
          fieldCode: "minPackageQuantity",
          fieldType: "INPUT",
          disabled: Boolean(this.list.abandonedFlag),
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerMinPackageQuantity").$D("请填写最小包装量"),
        },
        {
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
          fieldType: "SWITCH",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.startLadderLevel").$D("启用阶梯报价"),
          fieldCode: "ladderInquiryFlag",
          fieldType: "SWITCH",
          disabled: this.list.diyLadderQuotationFlag !== 1,
        },
        {
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
          fieldType: "DATE_PICKER",
          editor: () => !this.list.abandonedFlag && this.list.validDateInputType !== "READONLY",
          required: this.list.validDateInputType === "REQUIRED" && !this.list.abandonedFlag,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentExpiryDateTo").$D("报价有效期至"),
          fieldCode: "currentExpiryDateTo",
          fieldType: "DATE_PICKER",
          editor: () => !this.list.abandonedFlag && this.list.validDateInputType !== "READONLY",
          required: this.list.validDateInputType === "REQUIRED" && !this.list.abandonedFlag,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentPromisedDate").$D("承诺交货日期"),
          fieldCode: "currentPromisedDate",
          render: (val) => {
            if (val) {
              if (this.list.abandonedFlag) {
                return <span style="color:#e1e3e9">{val.substring(0, 10)}</span>;
              }
              return <span style="color:#c6cad6">{val.substring(0, 10)}</span>;
            }
            if (this.list.abandonedFlag) {
              return <span style="color:#e1e3e9">{this.$T("hipspfm.supplierQuotation.message.validation.handlerDate").$D("请选择日期")}</span>;
            }
            return <span style="color:#c6cad6">{this.$T("hipspfm.supplierQuotation.message.validation.handlerDate").$D("请选择日期")}</span>;
          },
          callBack: () => {
            if (this.pageFlag && !this.list.abandonedFlag) {
              this.choseData("currentPromisedDate");
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryPeriod2").$D("供货周期"),
          fieldCode: "currentDeliveryCycle",
          disabled: Boolean(this.list.abandonedFlag),
          fieldType: "INPUT",
          inputType: "number",
          placeholder: this.$T("hipspfm.supplierQuotation.message.validation.handlerDeliveryPeriod").$D("请填写供货周期"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDescription").$D("报价说明"),
          fieldCode: "currentQuotationRemark",
          disabled: Boolean(this.list.abandonedFlag),
          fieldType: "INPUT",
          placeholder: this.$T("ssrc.supplierQuotation.view.write.supQuo.quotationDescription").$D("请填写报价说明"),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.deliveryAddress").$D("送货地址"),
          fieldCode: "deliveryAddress",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.includingFreight").$D("是否含运费"),
          fieldCode: "freightIncludedFlag",
          fieldType: "SWITCH",
          disabled: Boolean(this.list.abandonedFlag === 1 || this.freightUpdatableFlag === 0),
          inputChange:(val, record) => {
            if (val !== 1) {
              record.freightAmount = "";
            }
          }
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.freightAmount").$D("运费"),
          fieldCode: "freightAmount",
          fieldType: !this.list.freightIncludedFlag ? "TEXT" : "INPUT",
          disabled: (val, record) => Boolean(!record.freightIncludedFlag),
          placeholder: this.list.freightAmount ? String(this.list.freightAmount) : this.$T("ssrc.supplierQuotation.view.write.supQuo.freightAmount").$D("请输入运费"),
          inputType: "number"
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
    getTenantNum() {
      return SrmUtil.getTenantNum();
    }
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
    //附件预览显示、隐藏
    showPreModel(file) {
      // console.log("file:", file);
      const fileType = file.split(".").reverse()[0].toLowerCase();

      if ([ "jpg", "png", "gif", "jpeg" ].includes(fileType)) {
        // eslint-disable-next-line rulesdir/no_hips
        this.$hips.previewer.show({ imageSet: [ { src: file } ] });
      } else if ([ "docx", "xlsx", "pptx", "pdf", "doc", "xls", "ppt", "mp3", "mp4", "txt" ].includes(fileType)) {
        this.preUrl = file;
        this.preModel = !this.preModel;
      }
    },
    // 初始化数据
    initData() {
      this.freightUpdatableFlag = this.headInfo.freightUpdatableFlag;
      this.getLeftTime();
      const { operationMeaning } = this;
      operationMeaning === "QUOTATION" || operationMeaning === "ROUND_QUOTATION" || operationMeaning === "BARGAIN_QUOTATION" ?
        this.pageFlag = true :
        this.pageFlag = false;
      operationMeaning === "BARGAIN_QUOTATION" ? this.bargainPageFlag = true : this.bargainPageFlag = false;
    },
    //含税单价值监听
    inputQuotationPriceFocus(record) {
      if (this.netPriceTgrFlag) {
        return;
      }
      const defaultPrecision = Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision"));
      const finPrecision = Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision"));
      //标记当前字段currentQuotationPrice在编辑，
      this.currentQuotationPriceTgr = true;
      //判断含税标识
      if (this.list.taxIncludedFlag) {
        //税率
        const taxRate = this.list.taxRate;
        if (judgeIsNumExist(this.list.currentQuotationPrice) && taxRate) {
          const netPrice = SrmMath.toFixed(SrmMath.div(this.list.currentQuotationPrice, SrmMath.plus(1, SrmMath.div(taxRate, 100))), defaultPrecision);
          this.list.netPrice = netPrice;
        }
        if (judgeIsNumExist(this.list.currentQuotationPrice) && judgeIsNumExist(this.list.currentQuotationQuantity)) {
          const totalAmount = SrmMath.toFixed(SrmMath.times(this.list.currentQuotationPrice, this.list.currentQuotationQuantity), finPrecision); // 行金额
          this.list.totalAmount = totalAmount;
        }
        if (judgeIsNumExist(this.list.netPrice) && judgeIsNumExist(this.list.currentQuotationQuantity)) {
          const netAmount = SrmMath.toFixed(SrmMath.times(this.list.netPrice, this.list.currentQuotationQuantity), finPrecision); // 行金额未税
          this.list.netAmount = netAmount;
        }

      } else {
        // let netPrice = Number(this.list.currentQuotationPrice);
        // if (netPrice !== 0) {
        //   netPrice = netPrice.toFixed(defaultPrecision);
        // }
        if (judgeIsNumExist(this.list.currentQuotationPrice) && judgeIsNumExist(this.list.currentQuotationQuantity)) {
          const totalAmount = SrmMath.toFixed(SrmMath.times(this.list.currentQuotationPrice, this.list.currentQuotationQuantity), finPrecision); // 行金额
          const netAmount = SrmMath.toFixed(SrmMath.times(this.list.currentQuotationPrice, this.list.currentQuotationQuantity), finPrecision); // 行金额未税
          this.list.totalAmount = totalAmount;
          this.list.netAmount = netAmount;
        }
        this.list.netPrice = this.list.currentQuotationPrice;
      }
      this.$emit("onUnitPrice", this.list, this.index);
    },
    //未税单价值监听
    inputNetPriceFocus(record) {
      if (this.currentQuotationPriceTgr) {
        return;
      }
      //标记当前字段netPrice在编辑，
      this.netPriceTgrFlag = true;
      const defaultPrecision = Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision"));
      const finPrecision = Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision"));
      //判断含税标识
      if (this.list.taxIncludedFlag) {
        //税率
        const taxRate = this.list.taxRate;
        if (judgeIsNumExist(this.list.netPrice) && judgeIsNumExist(taxRate)) {
          const currentQuotationPrice = SrmMath.toFixed(SrmMath.times(this.list.netPrice, SrmMath.plus(1, SrmMath.div(taxRate, 100))), defaultPrecision);
          this.list.currentQuotationPrice = currentQuotationPrice;
        }
        if (judgeIsNumExist(this.list.currentQuotationPrice) && judgeIsNumExist(this.list.currentQuotationQuantity)) {
          const totalAmount = SrmMath.toFixed(SrmMath.times(this.list.currentQuotationPric, this.list.currentQuotationQuantity), finPrecision); // 行金额
          this.list.totalAmount = totalAmount;
        }
        if (judgeIsNumExist(this.list.netPrice) && judgeIsNumExist(this.list.currentQuotationQuantity)) {
          const netAmount = SrmMath.toFixed(SrmMath.times(this.list.netPrice, this.list.currentQuotationQuantity), finPrecision); // 行金额未税
          this.list.netAmount = netAmount;
        }
      } else {
        let currentQuotationPrice = this.list.netPrice;
        // if (currentQuotationPrice !== 0) {
        //   currentQuotationPrice = currentQuotationPrice.toFixed(defaultPrecision);
        // }
        if (judgeIsNumExist(currentQuotationPrice) && judgeIsNumExist(this.list.currentQuotationQuantity)) {
          const totalAmount = SrmMath.toFixed(SrmMath.times(currentQuotationPrice, this.list.currentQuotationQuantity), finPrecision); // 行金额
          this.list.totalAmount = totalAmount;
        }
        if (judgeIsNumExist(this.list.netPrice) && judgeIsNumExist(this.list.currentQuotationQuantity)) {
          const netAmount = SrmMath.toFixed(SrmMath.times(this.list.netPrice, this.list.currentQuotationQuantity), finPrecision); // 行金额未税
          this.list.netAmount = netAmount;
        }
        this.list.currentQuotationPrice = this.list.netPrice;
      }
      this.$emit("onUnitPrice", this.list, this.index);
    },
    //开启日期弹窗
    choseData(type) {
      this.changeDate = type;
      this.datePopup = true;
    },
    // 打开税率弹窗
    showTaxRate() {
      this.$lov("SMDM.TAX", (value) => {
        if (value && value.length) {
          this.$set(this.list, "taxRate", value[0].taxRate);
          this.$set(this.list, "taxId", value[0].taxId);
        }
      }, {
        displayField: "taxCode",
        subDisplayField: "taxRate",
      });
    },
    //选择时间
    handleConfirm(value) {
      this[this.changeDate] = value;
      this.list[this.changeDate] = value + " 00:00:00";
      this.datePopup = false;
    },
    getLeftTime() {
      // eslint-disable-next-line consistent-this
      const self = this;

      if (!this.leftTimeFlag) {
        return false;
      }
      const rfxHeaderQuotationEndDate = this.list.rfxHeaderQuotationEndDate;
      const date = rfxHeaderQuotationEndDate ?
        rfxHeaderQuotationEndDate.replace(/\s/, "T") :
        "";

      if (new Date(date).getTime() - Date.now() <= 0 || !date) {
        this.mLeftTime = {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00"
        };
      } else {
        this.timer = setInterval(() => {
          self.mLeftTime = leftTime(new Date(date));
        }, 1000);
      }
    },
    // 跳转阶梯报价
    goToDetail(flag) {
      this.list.noParticipateFlag = flag === "noParticipate";
      this.ladderQuotationPopup = true;
    },
    // 保存
    async handleSubmit() {
      if (!this.list.taxIncludedFlag) {
        this.list.taxRate = null;
      }
      if (!(this.list.abandonedFlag ||
          this.list.continuousQuotationFlag === 0 && this.list.currentQuotationPrice && this.list.quotationLineStatus === "SUBMITTED" ||
          this.list.bargainFlag === 0 && this.list.bargainStatus === "BARGAINING_ONLINE" ||
          this.headInfo.priceTypeCode === "NET_PRICE") && !this.list.currentQuotationPrice) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.currentQuotationPrice.none").$D("单价不能为空"),
        });
        return false;
      }
      if (!this.list.abandonedFlag && !this.list.currentQuotationQuantity) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.currentQuotationQuantity.none").$D("可供数量不能为空"),
        });
        return false;
      }
      // Why ？  annotation by  cyy 20211226
      // if (typeof this.list.taxRate === "object") {
      //   this.list.abandonedFlag ||
      //   this.list.continuousQuotationFlag === 0 &&
      //   this.list.currentQuotationPrice &&
      //   this.list.quotationLineStatus === "SUBMITTED" ||
      //   this.list.bargainFlag === 0 &&
      //   this.list.bargainStatus === "BARGAINING_ONLINE" ||
      //   this.isUnTaxPriceFlag ?
      //     this.list.currentQuotationPrice = this.list.netPrice :
      //     this.list.netPrice = this.list.currentQuotationPrice;
      // } else {
      //   this.list.abandonedFlag ||
      //   this.list.continuousQuotationFlag === 0 &&
      //   this.list.currentQuotationPrice &&
      //   this.list.quotationLineStatus === "SUBMITTED" ||
      //   this.list.bargainFlag === 0 &&
      //   this.list.bargainStatus === "BARGAINING_ONLINE" ||
      //   this.isUnTaxPriceFlag ?
      //     this.list.currentQuotationPrice =
      //           this.list.netPrice * (1 + Number(this.list.taxRate) / 100) :
      //     this.list.netPrice =
      //           this.list.currentQuotationPrice / (1 + Number(this.list.taxRate) / 100);
      // }
      if (!this.list.freightIncludedFlag) {
        this.list.freightAmount = null;
      }
      if (this.list.taxIncludedFlag && typeof this.list.taxRate === "object" && !this.list.abandonedFlag) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.taxRate.none").$D("税率不能为空"),
        });
        return false;
      }
      if (!this.list.currentExpiryDateFrom && !this.list.currentExpiryDateFrom && this.list.validDateInputType === "REQUIRED" && !this.list.abandonedFlag) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.quotation.valid.dateFrom.dateTo.none").$D("【报价有效期从】【报价有效期至】字段未填写，请填写后提交"),
        });
        return false;
      } else if (!this.list.currentExpiryDateFrom && this.list.validDateInputType === "REQUIRED" && !this.list.abandonedFlag) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.quotation.valid.dateFrom.none").$D("【报价有效期从】字段未填写，请填写后提交"),
        });
        return false;
      } else if (!this.list.currentExpiryDateTo && this.list.validDateInputType === "REQUIRED" && !this.list.abandonedFlag) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.quotation.valid.dateTo.none").$D("【报价有效期至】字段未填写，请填写后提交"),
        });
        return false;
      }

      const lineData = {
        ...this.list,
        abandonedFlag: this.list.abandonedFlag ? 1 : 0,
        ladderInquiryFlag: this.list.ladderInquiryFlag ? 1 : 0,
        sampleRequestedFlag: this.list.sampleRequestedFlag ? 1 : 0,
        freightIncludedFlag: this.list.freightIncludedFlag ? 1 : 0,
        taxIncludedFlag: this.list.taxIncludedFlag ? 1 : 0,
        currentExpiryDateFrom: `${this.list.currentExpiryDateFrom} 00:00:00`,
        currentExpiryDateTo: `${this.list.currentExpiryDateTo} 00:00:00`,
      };
      const body = {
        rfxQuotationHeader: this.headInfo,
        rfxQuotationLine: [ lineData ]
      };
      if (this.validateLine() || this.list.abandonedFlag) {
        this.$loading.show();
        const res = await saveQuotation(body);

        this.$loading.hide();
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.saveSuccess").$D("保存成功"),
          });
          // this.$emit("refresh", true);
          // this.list.objectVersionNumber = Number(this.list.objectVersionNumber) + 1;
          this.refreshdata();
        }
      }
    },
    validateLine() {
      if (this.$refs.quoteBidColumns) {
        return this.$refs.quoteBidColumns.validate();
      }
      if (this.$refs.quoteColumns) {
        return this.$refs.quoteColumns.validate();
      }
      if (this.$refs.bargainColumns) {
        return this.$refs.bargainColumns.validate();
      }
      if (this.$refs.bidColumns) {
        return this.$refs.bidColumns.validate();
      }
      return true;
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
          content: <quotation supplier-quotation-detail={this.quotationDetail} left-time-flag={this.leftTimeFlag}/>,
        });
      }
      // if (list.quotationDetailFlag) {
      //   this.quotationDetailPop = !this.quotationDetailPop;
      // }
    },
    numCheck(v, t) {
      return numberInputCheckAllNum(v, t);
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
