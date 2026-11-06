<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('ssrc.rfDetail.view.card.title.basicInfos').$D('基本信息')">
        <srm-list
          :data-set="basicDs"
          :customize-code="documentType === 'RFI' ? 'SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFI.BASIC' : 'SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFP.BASIC' "
          :columns="getBaseInfoColumns"
          :scrollable="false"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.rfDetail.view.card.title.supplier').$D('供应商')">
        <srm-list
          :data-set="supplierDs"
          :customize-code="documentType === 'RFI' ? 'SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFI.SUPPLIER' : 'SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFP.SUPPLIER'"
          :columns="getSupplierInfoColumns"
          :scrollable="false"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.rfCheck.view.card.title.quotationDetail').$D('报价明细')">
        <srm-list
          :data-set="quotationDs"
          :customize-code="documentType === 'RFI' ? 'SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFI.QUOTATION' : 'SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFP.QUOTATION'"
          :columns="getQuotationInfoColumns"
          :scrollable="false"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.rfDetail.model.rfDetail.attachmentUuid').$D('附件')">
        <customize
          :data-set="basicDs"
          :columns="getAttachmentInfoColumns"
          :scrollable="false"
          :row-col-to-seq="true"
          type="list"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 伙伴信息详情弹窗 -->
    <srm-popup
      :visible.sync="ladderPop"
      position="right"
      show-back
      height="100%"
      :show-close="false"
      :title="$T('ssrc.rfDetail.view.message.button.ladderLevel').$D('阶梯报价')">
      <div style="padding: 5px 15px">
        <customize
          :columns="getLadderHeaderInfoColumns"
          :data-source="ladderHeadInfo" type="list" :need-padding="false"/>
      </div>
      <srm-blank size="small" theme="fill"/>
      <srm-list
        :data-set="ladderDs"
        :customize-code="documentType === 'RFI' ? 'SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFI.LADDER' : 'SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFP.LADDER'"
        :columns="getLadderInfoColumns"
        :scrollable="false"/>
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
import { DataSet } from "srm-mobile-ui";
import { queryDoubleUnit } from "@/utils/utils";
import { basicDs, supplierDs, quotationDs, commonDs, ladderDs } from "./datasource/ds";
import { getBasicInfoApi } from "./api/index";
import { getPriceName, getNetPriceName, getAvailableQtyName, getUomName, getQtyName, getLadderFrom, getLadderTo } from "@/utils/doubleUnit";
export default {
  modules: [ "ssrc.rfDetail", "ssrc.inquiryHall", "ssrc.rfCheck", "smbl.common", "ssrc.common", "ssrc.priceLibraryNew", "hipspfm.common" ],
  name: "RfIdentifySuppliersApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      basicDs:new DataSet(commonDs()),
      supplierDs:new DataSet(commonDs()),
      quotationDs:new DataSet(commonDs()),
      ladderDs:new DataSet(commonDs()),
      ladderPop:false, // 阶梯报价pop
      ladderHeadInfo:{}, // 阶梯报价头
      sourceCategory:"",
      documentType:"RFI", // RFI(RFI确定供应商审批)/RFP(RFP确定供应商审批)
      doubleUnitFlag: false, // 判断是否开启双单位
    };
  },
  computed:{
    // 基本信息
    getBaseInfoColumns() {
      return [
        {
          // fieldName: this.$T("ssrc.rfDetail.model.rfDetail.rfiTitle").$D("征询书标题"),
          fieldType: "EMPTY",
          fieldCode: "rfTitle",
          formRow: 0,
          render: (val) => <SrmListHeader showOpenTag={false}>
            {val}
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.RFPNo").$D("RFP单号"),
          fieldType: "TEXT",
          fieldCode: "rfNum",
        },
        {
          fieldName: this.$T("ssrc.rfDetail.model.rfDetail.templateName").$D("征询模板"),
          fieldType: "TEXT",
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.rfDetail.model.rfDetail.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "rfRemark",
        },
      ];
    },
    // 供应商信息
    getSupplierInfoColumns() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "supplierCompanyName",
          formRow: 0,
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            {record.supplierCompanyName}
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.rfCheck.model.rfCheck.quotationNum").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("ssrc.rfCheck.model.rfCheck.quotationContent").$D("供应商备注"),
          fieldType: "TEXT",
          fieldCode: "quotationContent",
        },
        {
          fieldName: this.$T("ssrc.rfCheck.model.rfCheck.supplierAttach").$D("供应商附件"),
          fieldCode: "rfiAttachmentUuid",
          render:(val, record) => {
            // RFP(技术、商务附件) | RFI（供应商附件）
            if (this.sourceCategory === "RFP") {
              // 技术附件
              let techAttachmentUuid = record.techAttachmentUuid || uuid();
              // 商务附件
              let businessAttachmentUuid = record.businessAttachmentUuid || uuid();
              return <SrmUpload
                isTab={false}
                showIcon={false}
                show-count={true}
                descTitle={this.$T("smbl.common.button.viewAttachment").$D("查看附件")}
                fileArr={[
                  {
                    title: this.$T("ssrc.rfDetail.view.card.subtitle.techAttach").$D("技术组附件"),
                    attachmentUuid: techAttachmentUuid,
                    readOnly: true
                  },
                  {
                    title: this.$T("ssrc.rfDetail.view.card.subtitle.businessAttach").$D("商务组附件"),
                    attachmentUuid: businessAttachmentUuid,
                    readOnly: true
                  },
                ]}/>;
            }
            // 供应商附件
            let rfiAttachmentUuid = record.rfiAttachmentUuid || uuid();
            return <SrmUpload
              isTab={false}
              showIcon={false}
              show-count={true}
              descTitle={this.$T("smbl.common.button.viewAttachment").$D("查看附件")}
              fileArr={[
                {
                  title: this.$T("ssrc.rfCheck.model.rfCheck.supplierAttach").$D("供应商附件"),
                  attachmentUuid: rfiAttachmentUuid,
                  readOnly: true
                },
              ]}/>;
          }
        },
        {
          fieldName: this.$T("ssrc.rfCheck.model.rfCheck.suggestedFlag").$D("是否选用"),
          fieldType: "TEXT",
          fieldCode: "suggestedFlag",
          render: (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.rfCheck.model.rfCheck.suggestedRemark").$D("选择理由"),
          fieldType: "TEXT",
          fieldCode: "suggestedRemark",
        },
      ];
    },
    // 报价明细信息
    getQuotationInfoColumns() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "itemName",
          formRow: 0,
          render: (val) => <SrmListHeader showOpenTag={false}>
            {val}
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.supplierNum").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.supplierName").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxPrice").$D("单价(含税)"),
          fieldCode: "validQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.netPrice").$D("单价(不含税)"),
          fieldCode: "validNetSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldCode: "validQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldCode: "validNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationCurrencyType").$D("币种"),
          fieldType: "TEXT",
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.exchangeRate").$D("汇率"),
          fieldType: "TEXT",
          fieldCode: "exchangeRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludedFlag").$D("是否含税"),
          fieldType: "TEXT",
          fieldCode: "taxIncludedFlag",
          render: (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxRate").$D("税率（%）"),
          fieldType: "TEXT",
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderInquiry").$D("阶梯报价"),
          fieldType: "TEXT",
          fieldCode: "ladderInquiryFlag",
          render:(val, record) => <SrmButton plain rect onClick={() => this.showLadder(record)}>
            <span style="font-size: 12px">{this.$T("smbl.common.view.button.view").$D("查看")}</span>
          </SrmButton>
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validQuotationQuantity").$D("可供数量"),
          fieldCode: "validQuotationSecQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getAvailableQtyName(this.doubleUnitFlag),
          fieldCode: "validQuotationQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmount").$D("行金额"),
          fieldCode: "localLnTotalAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAmountWithoutTax").$D("行金额(不含税)"),
          fieldCode: "localLnNetAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.uomName").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "secondaryUomName",
        } : null,
        {
          fieldName: getUomName(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.categoryName").$D("物料类别"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryName",
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quantity").$D("需求数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldCode: "demandQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.batchPrice").$D("价格批量"),
          fieldCode: "priceBatchQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.neededDate").$D("需求日期"),
          fieldType: "TEXT",
          fieldCode: "demandDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachment").$D("采购方附件"),
          fieldType: "UPLOAD",
          fieldCode: "purchaseAttachmentUuid",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierAttachment").$D("供应商附件"),
          fieldType: "UPLOAD",
          fieldCode: "attachmentUuid",
        },
      ].filter(Boolean);
    },
    // 附件信息
    getAttachmentInfoColumns() {
      return [
        {
          fieldName: this.$T("hipspfm.common.button.viewAttachments").$D("查看附件"),
          fieldType: "UPLOAD",
          fieldCode: "checkAttachmentUuid",
          showCount: true,
        },
      ];
    },
    // 阶梯报价头
    getLadderHeaderInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.supplierNum").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.supplierName").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
        },
      ];
    },
    // 阶梯报价
    getLadderInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderLineNum").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "rfLadderLineNum",
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderFromRange").$D("数量从(>=)"),
          fieldType: "TEXT",
          fieldCode: "secondaryLadderFrom",
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderToRange").$D("数量至(<)"),
          fieldType: "TEXT",
          fieldCode: "secondaryLadderTo",
        } : null,
        {
          fieldName: getLadderFrom(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "ladderFrom",
        },
        {
          fieldName: getLadderTo(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "ladderTo",
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderPriceRemark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ].filter(Boolean);
    }
  },
  async beforeMount() {
    const rfHeaderId = this.parameters.rfHeaderId;
    this.documentType = this.parameters.documentType;

    this.$loading.show();
    this.doubleUnitFlag = await queryDoubleUnit({
      businessModule: "RFX",
    });
    this.getBasicInfo(rfHeaderId);
    this.basicDs = new DataSet(basicDs({
      rfHeaderId,
      customizeUnitCode: this.documentType === "RFI" ? "SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFI.BASIC" : "SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFP.BASIC",
    }));
    this.supplierDs = new DataSet(supplierDs({
      rfHeaderId,
      customizeUnitCode: this.documentType === "RFI" ? "SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFI.SUPPLIER" : "SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFP.SUPPLIER",
    }));
    this.quotationDs = new DataSet(quotationDs({
      rfHeaderId,
      customizeUnitCode: this.documentType === "RFI" ? "SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFI.QUOTATION" : "SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFP.QUOTATION",
    }));
    this.basicDs.query();
    this.supplierDs.query();
    this.quotationDs.query();
    this.$loading.hide();
  },
  methods:{
    getBasicInfo(rfHeaderId) {
      getBasicInfoApi(rfHeaderId).then((res) => {
        this.sourceCategory = res.sourceCategory;
      });
    },
    // 阶梯报价
    showLadder(item) {
      this.ladderHeadInfo = item;
      this.ladderPop = !this.ladderPop;
      this.ladderDs = new DataSet(ladderDs({
        quotationLineId: item.quotationLineId,
        customizeUnitCode: this.documentType === "RFI" ? "SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFI.LADDER" : "SMBL.WORKFLOW.RF_DENTIFY_SUPPLIERS_RFP.LADDER",
      }));
      this.ladderDs.refresh();
    },
  },
};

</script>

<style lang="stylus" scoped>

</style>