<!-- eslint-disable vue/no-mutating-props -->
<template>
  <srm-popup
    :title="$T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息')"
    :visible="value"
    height="100%"
    position="bottom"
    @onClose="$emit('input', false)">
    <div class="BigContainer">
      <srm-detail-head :data-source="lineInfoDetail" :columns="getDetailHeadColumns"/>
      <div class="prequalification-detail">
        <customize-detail code="SMBL.EXPERT_RATING.MATERIAL_LINEINFO_DETAIL_NEW" :need-padding="true" :data-source="lineInfoDetail" :columns="getPrequalificationDetailColumns" />
      </div>
    </div>
  </srm-popup>
</template>

<script>
import { getPriceName, getNetPriceName, getAvailableQtyName, getUomName, getQtyName } from "@/utils/doubleUnit";
export default {
  modules: [ "hipspfm.common", "ssrc.bidHall", "ssrc.expertScoring", "ssrc.inquiryHall", "hipspfm.expertScoring", "ssrc.common" ],
  name: "OrderLineDetail",
  components: {
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    lineInfoDetail: {
      type: Object
    },
    showLineFilePop: {
      type: Function
    },
    doubleUnitFlag: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {};
  },
  computed:{
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "sourceLineItemNum",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
      ];

      return columns;
    },
    getPrequalificationDetailColumns() {
      const columns = [
        this.doubleUnitFlag ? {
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.taxIncludedPrice").$D("单价(含税)"),
          fieldCode:"validQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible:(val, record) => record.lineTeam === "BUSINESS"
        } : null,
        this.doubleUnitFlag ? {
          fieldName:this.$T("ssrc.inquiryHall.model.inquiryHall.netPrice").$D("单价(不含税)"),
          fieldCode:"validNetSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible:(val, record) => record.lineTeam === "BUSINESS"
        } : null,
        {
          fieldName:getPriceName(this.doubleUnitFlag),
          fieldCode:"validQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible:(val, record) => record.lineTeam === "BUSINESS"
        },
        {
          fieldName:getNetPriceName(this.doubleUnitFlag),
          fieldCode:"validNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible:(val, record) => record.lineTeam === "BUSINESS"
        },
        this.doubleUnitFlag ? {
          fieldName:this.$T("ssrc.bidHall.modal.inqueryHall.unit").$D("单位"),
          fieldCode: "secondaryUomName",
        } : null,
        this.doubleUnitFlag ? {
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.quantity").$D("需求数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName:getUomName(this.doubleUnitFlag),
          fieldCode:"uomName",
        },
        {
          fieldName:getQtyName(this.doubleUnitFlag),
          fieldCode:"sourceQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName:this.$T("ssrc.bidHall.modal.inqueryHall.demandDate").$D("需求日期"),
          fieldCode:"demandDate",
        },
        this.doubleUnitFlag ? {
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.validQtationQuantity").$D("可供数量"),
          fieldCode:"validQuotationSecQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName:getAvailableQtyName(this.doubleUnitFlag),
          fieldCode:"validQuotationQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName:this.$T("ssrc.bidHall.model.bidHall.currentPromisedDate").$D("承诺交货日期"),
          fieldCode:"validPromisedDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
          ,
        },
        {
          fieldName:this.$T("ssrc.bidHall.model.bidHall.itemCategory").$D("物料类别"),
          fieldCode:"itemCategoryName",
        },
        {
          fieldName:this.$T("ssrc.bidHall.model.bidHall.costPrice").$D("标底单价"),
          fieldCode:"costPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.totalAmount").$D("总金额"),
          fieldCode:"totalAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.quotationCurrencyCode, "financialPrecision")),
          visible:(val, record) => record.lineTeam === "BUSINESS"
        },
        {
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.netPrice").$D("不含税总金额"),
          fieldCode:"netAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.quotationCurrencyCode, "financialPrecision")),
          visible:(val, record) => record.lineTeam === "BUSINESS"
        },
        {
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.taxAmount").$D("税额"),
          fieldCode:"taxAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.quotationCurrencyCode, "financialPrecision")),
          visible:(val, record) => record.lineTeam === "BUSINESS"
        },
        {
          fieldName:this.$T("ssrc.inquiryHall.model.inquiryHall.taxRate").$D("税率（%）"),
          fieldCode:"taxRate",
        },
        {
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.currentDeliveryCycle").$D("供货周期"),
          fieldCode:"validDeliveryCycle",
        },
        {
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.attachmentUuid").$D("附件"),
          fieldCode:"attachmentUuid",
          render:(val, record) => <span
            style={{ color: "var(--color-other-default-b)" }}
            onClick={() => this.showLineFilePop(record.attachmentUuid)}>{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>
        },
        {
          fieldName:this.$T("ssrc.expertScoring.model.expertScoring.currentQuotationRemark").$D("备注"),
          fieldCode:"remark",
        },
      ];

      return columns;
    }
  },
};
</script>

<style lang="stylus" scoped>
.BigContainer {
  position: relative;
  height: 100%;
  .prequalification-detail {
    height: calc(100vh - 180px);
    overflow: auto;
  }
}
</style>
