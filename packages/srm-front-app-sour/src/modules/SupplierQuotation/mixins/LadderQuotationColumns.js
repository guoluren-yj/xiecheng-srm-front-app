import { SrmListHeader, SrmMath } from "srm-mobile-ui";

export default {
  data() {
    return {};
  },
  methods: {
    getLadderQuotationColumns(editFlag) {
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
          fieldType: "INPUT_NUMBER",
          editor:!this.disableTaxPriceFlag,
          required:!this.isUnTaxPriceFlag,
          inputChange: (val, record) => {
            if (!this.disableTaxPriceFlag) {
              if (this.taxIncludedFlag) {
                record.currentNetLadderPrice = SrmMath.div(val, SrmMath.plus(SrmMath.div(this.taxRate, 100), 1));
              } else {
                record.currentNetLadderPrice = val;
              }
            }
          },
          editLimit:!this.disableTaxPriceFlag,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision")),
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.currentNetLadderPrice").$D("未税单价"),
          fieldCode: "currentNetLadderPrice",
          formRow:10,
          formCol:20,
          fieldType: "INPUT_NUMBER",
          editor:this.isUnTaxPriceFlag,
          required: this.isUnTaxPriceFlag,
          editLimit:this.isUnTaxPriceFlag,
          inputChange: (val, record) => {
            if (this.isUnTaxPriceFlag) {
              if (this.taxIncludedFlag) {
                record.currentLadderPrice = SrmMath.times(val, SrmMath.plus(SrmMath.div(this.taxRate, 100), 1));
              } else {
                record.currentLadderPrice = val;
              }
            }
          },
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision")),
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
          fieldType:"INPUT_NUMBER",
          formRow:30,
          formCol:10,
          editor:editFlag,
          required:editFlag,
        },
        {
          fieldName:this.$T("ssrc.supplierQuotation.model.supQuo.configQuantity<").$D("数量<"),
          fieldCode: "ladderTo",
          fieldType:"INPUT_NUMBER",
          formRow:30,
          formCol:20,
          editor:editFlag,
          required:editFlag,
        },
      ];
      return columns;
    },
  }
};
