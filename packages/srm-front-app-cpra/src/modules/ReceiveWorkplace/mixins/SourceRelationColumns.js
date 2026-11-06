import { SrmUtil } from "srm-mobile-ui";

export default {
  data() {
    return {};
  },
  methods: {
    //来源单据收货状态关联columns
    getSourceRelationColumns() {
      return [ {
        formRow: 1,
        fieldCode: "header",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader showOpenTag={false}>
          {item.displayTrxHeaderAndLineNum}
          <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="primary">
            {item.returnedFlag === 0 ? this.$T("sinv.receiptExecution.model.receipt.aog").$D("收货") : this.$T("sinv.receiptWorkbench.model.receipt.sendBack").$D("退回")}
          </SrmButton>
        </SrmListHeader>
      }, this.isDoubleUnit && {
        formRow: 10,
        seq: 10,
        fieldCode: "secondaryQuantity",
        editor: false
      }, {
        formRow: 20,
        seq: 10,
        fieldCode: "quantity",
        editor: false,
      },
      {
        formRow: 20,
        seq: 20,
        fieldType:"TEXT",
        fieldCode: "taxIncludedAmount",
        render: (val, item) => {
          if (this.hidePriceFlag && Number(this.hidePriceFlag)) {
            return "***";
          }
          return SrmUtil.getNumberLocalized(val, item.financialPrecision);
        },
        editor: false
      },
      {
        formRow: 30,
        fieldCode: "rcvTypeName",
      },
      {
        formRow: 40,
        fieldCode: "trxDate",
        editor: false
      } ];
    },
    getSourceRelationDetailColumns() {
      return [
        {
          fieldCode: "displayTrxHeaderAndLineNum",
        },
        {
          fieldCode: "rcvTypeName",
        },
        {
          fieldCode: "quantity",
        },
        {
          fieldCode: "secondaryQuantity",
        },
        {
          fieldCode: "taxIncludedAmount",
          fieldType:"TEXT",
          render: (val, item) => {
            if (this.hidePriceFlag && Number(this.hidePriceFlag)) {
              return "***";
            }
            return SrmUtil.getNumberLocalized(val, item.financialPrecision);
          },
        },
        {
          fieldCode: "returnedFlag",
          render: (val) => <span>{val === 0 ? this.$T("sinv.receiptExecution.model.receipt.aog").$D("收货") : this.$T("sinv.receiptWorkbench.model.receipt.sendBack").$D("退回")}</span>
        },
        {
          fieldCode: "trxDate",
        }
      ];
    }
  }
};
