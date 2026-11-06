<template>
  <srm-scroll-tab>
    <srm-scroll-tab-item class="tab-container"
                         :label="$T('ssrc.inquiryHall.view.tab.allDetails').$D('基本信息')">
      <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
        <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
      </div>
      <div v-else style="padding-top: 10px">
        <customize
          :columns="getBasicColumns(headInfo.prTypeCode)" :data-source="headInfo"
          need-padding/>
      </div>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item class="tab-container"
                         :label="$T('ssrc.inquiryHall.view.selectSupplier.QuotationDetail').$D('选用供应商报价明细')">
      <srm-list
        :scrollable="false"
        :data-set="selectSupplierQuotaionDataSet"
        :columns="getSupplierQuotaionColumns('select')"
        @itemClick="onListItemClick('select',$T('ssrc.inquiryHall.view.selectSupplier.QuotationDetail').$D('选用供应商报价明细'))"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item class="tab-container"
                         :label="$T('ssrc.inquiryHall.view.allSupplier.QuotationDetail').$D('全部供应商报价明细')">
      <srm-list
        :scrollable="false"
        :data-set="allSupplierQuotaionDataSet"
        :columns="getSupplierQuotaionColumns('all')"
        @itemClick="onListItemClick('all',$T('ssrc.inquiryHall.view.allSupplier.QuotationDetail').$D('全部供应商报价明细'))"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item v-if="headInfo.prTypeCode === '10'"
                         class="tab-container"
                         :label="$T('ssrc.inquiryHall.view.allSupplier.ApproalItemDetail').$D('申请物料明细')">
      <srm-list
        :scrollable="false"
        :data-set="approvalItemDataSet"
        :columns="getApprovalItemColumns"/>
    </srm-scroll-tab-item>
    <srm-popup position="right" header-align="left" :visible.sync="supplierQuotationDetailFlag" height="100%" :show-header="false">
      <product-detail v-if="supplierQuotationDetailFlag" :quotation-data="qutationData" />
    </srm-popup>
  </srm-scroll-tab>
</template>

<script>

import { getBaseInfoApi } from "./api/index";
import { DataSet } from "srm-mobile-ui";
import supplierQuotaionDs from "./dataSource/supplierQuotaionDs";
import supplierChoseQuotaionDs from "./dataSource/supplierChoseQuotaionDs";
import approvalItemDs from "./dataSource/approvalItemDs";
export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.workFlow", "smbl.common" ],
  name: "LoveStudyRFXCheckApproval",
  components:{
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
  },
  data() {
    return {
      headInfo: {},
      supplierQuotationDetailFlag:false,
      selectSupplierQuotaionDataSet:new DataSet(supplierChoseQuotaionDs(this.changeReqId, "select")),
      allSupplierQuotaionDataSet:new DataSet(supplierQuotaionDs(this.changeReqId, "all")),
      approvalItemDataSet: new DataSet(approvalItemDs(this.changeReqId)),
      qutationData:{}
    };
  },
  computed:{
    getBasicColumns() {
      return (code) => [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          fieldCode: "sourceCategoryMeaning",
          formRow: 1,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prTypeName").$D("申请类型"),
          fieldCode: "prTypeName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaserName").$D("采购员"),
          fieldCode: "purchaserName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.currencyName").$D("币种"),
          fieldCode: "currencyCodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.winningSupplier").$D("中标供应商"),
          fieldCode: "winningSupplier",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceFrom").$D("来源方式"),
          fieldCode: "sourceFromMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Remark").$D("备注"),
          fieldCode: "rfxRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.applyEstimatedAmount").$D("申请单预估金额"),
          fieldCode: "totalEstimatedAmount",
          editor: false,
          render: (val) => this.returnFloat(val),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        code !== "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalPricet").$D("核价总金额"),
          editor: false,
          render: (val) => this.returnFloat(val),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          fieldCode: "totalPrice",
        },
        code === "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidAmountSumss").$D("定标总额"),
          editor: false,
          render: (val) => this.returnFloat(val),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          fieldCode: "bidAmountSumss",
        },
        code === "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.excessAmountSums").$D("超本总额"),
          editor: false,
          render: (val) => this.returnFloat(val),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          fieldCode: "excessAmountSums",
        },
        code === "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.reqItemName").$D("申请物料名称"),
          editor: false,
          fieldCode: "reqItemName",
        },
      ];
    },
    getSupplierQuotaionColumns() {
      return (type) => {
        const columns = [
          {
            fieldName: this.$T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次"),
            fieldCode: type === "select" ? "quotationRoundNumber" : "allRound",
            formRow:1,
            formCol:1
          },
          {
            fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.estimatedPrice").$D("预估单价(含税)"),
            fieldCode: "netEstimatedPrice",
            formRow:1,
            formCol:2,
            fieldType: "INPUT_NUMBER",
            render: (val) => this.returnFloat(val),
            editor: false,
          },
          {
            fieldName: this.$T("ssrc.inquiryHall.model.goods.quantityRequired").$D("需求数量"),
            fieldCode: "rfxQuantity",
            formRow:2,
            formCol:1
          },
          {
            fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.applyEstimatePrice").$D("申请预估金额"),
            fieldCode: "applyEstimatePrice",
            editor: false,
            render: (val) => this.returnFloat(val),
            precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
            formRow:2,
            formCol:2
          },
          {
            fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidAmount").$D("定标金额"),
            fieldCode: "bidAmount",
            editor: false,
            render: (val) => this.returnFloat(val),
            precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
            formRow:3,
            formCol:1
          },
          {
            fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lastPurchasePrice").$D("上次采购价格"),
            fieldCode: "lastPurchasePrice",
            editor: false,
            render: (val) => this.returnFloat(val),
            precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
            formRow:3,
            formCol:2
          },
          {
            fieldName: this.$T("ssrc.inquiryHall.model.checkPrice.allottedQuantityy").$D("本次下单数量"),
            fieldCode: "allottedQuantity",
            formRow:4,
            formCol:1
          },
          {
            fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.excessAmount").$D("超本金额"),
            fieldCode: "excessAmount",
            editor: false,
            render: (val) => this.returnFloat(val),
            precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
            formRow:4,
            formCol:2
          },
          {
            fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overbookRatios").$D("超本比例"),
            fieldCode: "overbookRatios",
            formRow:5,
            formCol:1
          },
        ];
        if (type === "select") {
          columns.unshift({
            fieldCode: "itemName",
            fieldType: "EMPTY",
            formRow:0,
            render: (val, record) => <SrmListHeader>
              <span> {record.itemCode}-{val}</span>
              <span slot="right" style="color:#C6CAD6;">{this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号")}:{record.rfxLineItemNum}</span>
            </SrmListHeader>
          },);
        }
        if (type === "all") {
          columns.unshift({
            fieldCode: "itemName",
            fieldType: "EMPTY",
            formRow:0,
            render: (val, record) => <SrmListHeader>
              <div>
                {record.suggestedFlag ?
                  <SrmTag
                    type="success"
                    fill>
                    {this.$T("ssrc.inquiryHall.model.inquiryHall.suggest").$D("选用")}
                  </SrmTag> :
                  <SrmTag
                    type="danger"
                    fill>
                    {this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedNoFlag").$D("不选用")}
                  </SrmTag>
                }
                <span> {record.itemCode}-{val}</span>
              </div>
              <span slot="right" style="color:#C6CAD6;">{this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号")}:{record.rfxLineItemNum}</span>
            </SrmListHeader>
          },);
        }
        return columns;
      };
    },
    getQuotaionDetailColumns() {
      return (type, code) => [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号"),
          fieldCode: "itemCode",
        },
        code === "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.attributeVarchar14").$D("申请物料编码"),
          fieldCode: "attributeVarchar14",
        },
        code === "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.attributeVarchar15").$D("申请物料名称"),
          fieldCode: "attributeVarchar15",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCategory").$D("物料类别"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.UNIT").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次"),
          fieldCode: type === "select" ? "quotationRoundNumber" : "allRound",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.isSuggestedFlag").$D("是否选用"),
          fieldCode: "suggestedFlag",
          visible:type === "all",
          render:(val) => val ? this.$T("smbl.common.message.yes").$D("是") : this.$T("smbl.common.message.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.supplierCompanyNum").$D("供应商编码"),
          fieldCode: "companyNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.supplierCompanyName").$D("供应商名称"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.attributeVarchar10").$D("账期"),
          fieldCode: "attributeVarchar10",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.performanceScore").$D("绩效评分"),
          fieldCode: "performanceScore",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.candidateSuggestion").$D("推荐意见"),
          fieldCode: "candidateSuggestion",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.estimatedPrice").$D("预估单价(含税)"),
          fieldCode: "estimatedPrice",
          fieldType: "INPUT_NUMBER",
          render: (val) => this.returnFloat(val),
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.quantityRequireds").$D("业务申请数量"),
          fieldCode: "rfxQuantity",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.applyEstimateAllPrice").$D("申请预估总金额"),
          fieldCode: "applyEstimatePrice",
          editor: false,
          render: (val) => this.returnFloat(val),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        code === "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.applyEstimatePriceSum").$D("预估总金额"),
          fieldCode: "applyEstimatePriceSum",
          editor: false,
          render: (val) => this.returnFloat(val),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidAmountd").$D("实际含税总价"),
          fieldCode: "bidAmount",
          editor: false,
          render: (val) => this.returnFloat(val),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        // {
        //   fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidAmountSum").$D("定标总额"),
        //   fieldCode: "bidAmountSum",
        //   editor: false,
        //   render: (val) => this.returnFloat(val),
        //   precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        // },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.supplierItemAveragePrice").$D("供应商该物料平均报价"),
          fieldCode: "supplierItemAveragePrice",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lastPurchasePrice").$D("上次采购价格"),
          fieldCode: "lastPurchasePrice",
          editor: false,
          render: (val) => this.returnFloat(val),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludePriced").$D("实际采购含税单价"),
          fieldCode: type === "select" ? "taxPrice" : "lastQuotationPrice",
          fieldType: "INPUT_NUMBER",
          render: (val) => this.returnFloat(val),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.checkPrice.allottedQuantityd").$D("本次下单数量"),
          fieldCode: "allottedQuantity",
        },
        code !== "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.checkPrice.thisUnorderQuantity").$D("本次未下单数量"),
          fieldCode: "thisUnorderQuantity",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxRate").$D("税率(%)"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.checkPrice.suggestedRemark").$D("选用理由"),
          fieldCode: "suggestedRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.excessAmount").$D("超本金额"),
          fieldCode: "excessAmount",
          render: (val) => this.returnFloat(val),
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overbookRatios").$D("超本比例"),
          fieldCode: "overbookRatios",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prNum").$D("采购申请单号"),
          fieldCode: "prNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prCreatedName").$D("申请人"),
          fieldCode: "prCreatedName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.remark").$D("申请原因"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prCreationDate").$D("业务申请日期"),
          fieldCode: "prCreationDate",
        },
        code !== "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.orderQuantity").$D("已下单数量(总)"),
          fieldCode: "orderQuantity",
        },
        code !== "10" && {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.occupiedQuantitys").$D("未下单数量(总)"),
          fieldCode: "occupiedQuantity",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitNamePath").$D("费用承担部门"),
          fieldCode: "unitNamePath",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.attributeVarchar16").$D("采购数量逻辑描述"),
          fieldCode: "attributeVarchar16",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartDate").$D("报价有效期从"),
          fieldCode: "validExpiryDateFrom",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationEndDate").$D("报价有效期至"),
          fieldCode: "validExpiryDateTo",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validDeliveryCycle").$D("供货周期(天)"),
          fieldCode: "validDeliveryCycle",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationTime").$D("报价时间"),
          fieldCode: "quotedDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
      ];
    },
    getApprovalItemColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.attributeVarchar14").$D("申请物料编码"),
          fieldCode: "attributeVarchar14",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.attributeVarchar15").$D("申请物料名称"),
          fieldCode: "attributeVarchar15",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.applyEstimatePriceSums").$D("申请预估金额"),
          fieldCode: "applyEstimatePriceSums",
          render: (val) => this.returnFloat(val),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidAmountSums").$D("定标金额"),
          fieldCode: "bidAmountSums",
          render: (val) => this.returnFloat(val),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.excessAmountSum").$D("超本金额"),
          fieldCode: "excessAmountSum",
          render: (val) => this.returnFloat(val),
        },
      ];
    }
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getBaseInfo();
      } catch (err) {
        console.log(err, "error");
      } finally {
        this.$loading.hide();
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.view.message.title.rfxCheckApproval").$D(
        "寻源核价审批工作流"
      )
    );
  },
  methods: {
    onListItemClick(type, title) {
      let dataSet = {};
      if (type === "select") {
        dataSet = this.selectSupplierQuotaionDataSet;
      } else {
        dataSet = this.allSupplierQuotaionDataSet;
      }
      this.$popup({
        title,
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={this.getQuotaionDetailColumns(type, this.headInfo.prTypeCode)}
          dataSet={dataSet}/>,
      });
    },
    // 获取寻源核价头信息
    async getBaseInfo() {
      await getBaseInfoApi(this.changeReqId)
        .then((res) => {
          this.headInfo = res;
        });
    },
    // 保留两位小数
    returnFloat(value) {
      const num = value.toString().split(".");
      if (value === 0) {
        return `${value.toString()}.00`;
      } else if (value) {
        if (num.length === 1) {
          const values = `${value.toString()}.00`;
          return values;
        }
        if (num.length > 1) {
          if (num[1].length < 2) {
            const values = `${value.toString()}0`;
            return values;
          }
          const values = Math.floor(value * 100) / 100;
          return values;
        }
      } else {
        return "-";
      }
    }
  }
};
</script>

<style scoped lang="stylus">

</style>
