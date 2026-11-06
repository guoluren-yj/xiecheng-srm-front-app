import { SrmUtil } from "srm-mobile-ui";

export default {
  data() {
    return {};
  },
  methods: {
    //退回
    getReverseColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.itemName}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="primary">
              {item.nodeConfigName}
            </SrmButton>
          </SrmListHeader>
        },
        {
          formRow: 2,
          fieldCode: "itemCode",
        },
        {
          formRow: 3,
          seq:1,
          fieldCode: "displayTrxHeaderAndLineNum",
          render:(val, item) => <SrmButton plain rect style={{ fontWeight: "bold" }} type="primary"
            onClick={() => this.jumpDetail(item.rcvTrxHeaderId, item.returnedFlag, item.nodeConfigIndex,this.isDoubleUnit)}>
            {item.displayTrxHeaderAndLineNum}
          </SrmButton>
        },
        this.isDoubleUnit && ![ "40_FINISHED" ].includes(this?.headDataSet?.data[0]?.["rcvStatusCode"]) && {
          formRow: 3,
          seq:2,
          fieldCode: "secondaryLeftQuantity",
          fieldType: "INPUT_NUMBER",
          editor:false,
        },
        ![ "40_FINISHED" ].includes(this?.headDataSet?.data[0]?.["rcvStatusCode"]) && {
          formRow: 4,
          seq:1,
          fieldCode: "leftQuantity",
          fieldType: "INPUT_NUMBER",
          editor:false
        },
        ![ "40_FINISHED" ].includes(this?.headDataSet?.data[0]?.["rcvStatusCode"]) && {
          formRow: 4,
          seq:2,
          fieldCode: "leftTaxAmount",
          fieldType: "TEXT",
          render: (val, item) => {
            if (item.hidePriceFlag && Number(item.hidePriceFlag)) {
              return "***";
            }
            return SrmUtil.getNumberLocalized(val, item.financialPrecision);
          },
        },
        this.isDoubleUnit && {
          formRow: 5,
          seq:2,
          fieldCode: "secondaryUomName",
        },
        {
          formRow: 5,
          seq:1,
          fieldCode: "uomName",
        },
        {
          formRow: 6,
          seq:1,
          fieldCode: "trxDate",
          editor:false
        }
      ];
    },
    getReverseDetailColumns() {
      return [
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "uomName",
        },
        this.isDoubleUnit && {
          fieldCode: "secondaryUomName",
        },
        {
          fieldCode: "supplierName",
        },
        ![ "40_FINISHED" ].includes(this?.headDataSet?.data[0]?.["rcvStatusCode"]) && {
          fieldCode: "leftQuantity",
        },
        this.isDoubleUnit && ![ "40_FINISHED" ].includes(this?.headDataSet?.data[0]?.["rcvStatusCode"]) && {
          fieldCode: "secondaryLeftQuantity",
        },
        ![ "40_FINISHED" ].includes(this?.headDataSet?.data[0]?.["rcvStatusCode"]) && {
          fieldCode: "leftTaxAmount",
          fieldType: "TEXT",
          render: (val, item) => {
            if (item.hidePriceFlag && Number(item.hidePriceFlag)) {
              return "***";
            }
            return SrmUtil.getNumberLocalized(val, item.financialPrecision);
          },
        },
        {
          fieldCode: "displayTrxHeaderAndLineNum",
        },
        {
          fieldCode: "trxDate",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "inventoryName",
        },
        {
          fieldCode: "locationName",
        },
        {
          fieldCode: "productNum",
        },
        {
          fieldCode: "productName",
        },
        {
          fieldCode: "fromDisplayPoHeaderAndLineNum",
        },
        {
          fieldCode: "fromDisplayAsnHeaderAndLineNum",
        },
        {
          fieldCode: "fromPcHeaderAndLineNum",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "agentName",
        },
        {
          fieldCode: "creationName",
        },
        {
          fieldCode: "strategyCode",
        },
      ];
    }
  }
};
