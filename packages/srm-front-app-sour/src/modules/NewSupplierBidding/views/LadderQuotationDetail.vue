<template>
  <div>
    <div>
      <srm-detail-head :data-source="lineData" :columns="getDetailHeadColumns"/>
      <section class="content">
        <srm-list
          :data-set="getDataSet"
          :show-bottom-bar="editCheckStatus"
          :columns="getColumns"/>
      </section>
    </div>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import ladderQuotationDS from "../datasource/ladderQuotationDetailDataSet";

export default {
  modules: [ "hipspfm.supplierQuotation", "hipspfm.common", "ssrc.supplierQuotation", "ssrc.inquiryHall", "hzero.common", "sslm.enterpriseInform", "ssrc.common" ],
  name: "LadderQuotation",
  components: {
  },
  props: {
    headInfo:{
      type: Object,
      default: () => ({})
    },
    lineData: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      quotationLineId: null,
      rfxLineItemId: "",
      itemCode: "",
      itemName: "",
      taxRate: "",
      currencyCode: "",
      lineStatus:"",
      noParticipateFlag:false,
      lineNum: null,
      isStart: false,
      getDataSet:{},
      continuousQuotationFlag: false, //是否可以连续报价
      diyLadderQuotationFlag: false //是否可配置阶段报价
    };
  },
  computed:{
    isUnTaxPriceFlag() {
      return this.headInfo && this.headInfo.priceTypeCode === "NET_PRICE";
    },
    disableTaxPriceFlag() {
      return true;
    },
    getColumns() {
      const columns = [
        {
          fieldCode: "rfxLadderLineNum",
          formRow:0,
          fieldType:"EMPTY",
          render:(val) => <SrmListHeader showOpenTag={false}>
            <span class="head-num">
              <span>{this.$T("ssrc.supplierQuotation.model.supQuo.lineNo").$D("行号")}：{val}</span>
            </span>
          </SrmListHeader>
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.currentLadderPrice").$D("含税单价"),
          fieldCode: "currentLadderPrice",
          formRow:10,
          formCol:10,
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.currentNetLadderPrice").$D("未税单价"),
          fieldCode: "currentNetLadderPrice",
          formRow:10,
          formCol:20,
        },
        !this.isUnTaxPriceFlag ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validLadderTaxPrice").$D("有效阶梯报价（含税）"),
          fieldCode: "validLadderPrice",
          formRow:20
        } : null,
        this.isUnTaxPriceFlag ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.validLadderNetPrice").$D("有效阶梯报价(不含税)"),
          fieldCode: "validNetLadderPrice",
          formRow:20
        } : null,
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.configQuantity≥").$D("数量≥"),
          fieldCode: "ladderFrom",
          formRow:30,
          formCol:10,
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.configQuantity<").$D("数量<"),
          fieldCode: "ladderTo",
          formRow:30,
          formCol:20,
        },
      ].filter(Boolean);
      return columns;
    },
    //可编辑可勾选状态
    editCheckStatus() {
      return false;
    },
    //可编辑不可勾选
    editUnCheckStatus() {
      return false;
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.curryCode").$D("币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.taxRate:").$D("税率"),
          fieldCode: "taxRate",
          render:(val) => val ? <span>{val}%</span> : <span>{val}</span>
        },
      ];

      return columns;
    },
  },
  watch: {
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.lineStatus = this.lineData.lineStatus;
      this.taxRate = this.lineData.taxRate;
      this.taxIncludedFlag = this.lineData.taxIncludedFlag;
      this.noParticipateFlag = this.lineData.noParticipateFlag;
      this.quotationLineStatus = this.lineData.quotationLineStatus; //报价状态
      this.diyLadderQuotationFlag = Boolean(Number(this.lineData.diyLadderQuotationFlag)); //是否自定义阶梯报价
      this.continuousQuotationFlag = Boolean(Number(this.lineData.continuousQuotationFlag)); //是否可以连续报价
      this.quotationLineId = this.lineData.quotationLineId;
      this.rfxLineItemId = this.lineData.rfxLineItemId;
      let lineId = this.noParticipateFlag ? this.rfxLineItemId : this.quotationLineId;
      if (this.editCheckStatus) {
        this.getDataSet = new DataSet(ladderQuotationDS(this.noParticipateFlag, lineId, false));
      } else {
        this.getDataSet = new DataSet(ladderQuotationDS(this.noParticipateFlag, lineId, false));
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
.content {
  background: var(--color-bg-default-b);
  height: calc(100vh - 176px);
}
</style>
