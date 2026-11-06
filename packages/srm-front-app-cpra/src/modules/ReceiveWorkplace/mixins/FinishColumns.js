import { SrmUtil } from "srm-mobile-ui";

export default {
  data() {
    return {};
  },
  methods: {
    //已完成
    getFinishColumns() {
      return [ {
        formRow: 1,
        fieldCode: "header",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader>
          {/*<SrmButton plain rect style={{ fontWeight: "bold" }} type="primary"*/}
          {/*  onClick={() => this.jumpDetail(item.rcvTrxHeaderId,item.returnedFlag,item.nodeConfigIndex)}>*/}
          {/*  {item.displayTrxNum}*/}
          {/*</SrmButton>*/}
          {item.supplierCompanyName}
          <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="info">
            {item.nodeConfigName}
          </SrmButton>
        </SrmListHeader>
      }, {
        formRow: 2,
        fieldCode: "displayTrxNum",
      },
      {
        formRow: 3,
        seq:1,
        fieldCode: "companyName",
      },
      {
        formRow: 4,
        seq:1,
        fieldCode: "nodeConfigName",
      },
      {
        formRow: 4,
        seq:2,
        fieldCode: "returnedFlagMeaning",
      },
      {
        formRow: 5,
        seq:1,
        fieldCode: "rcvTypeName",
      },
      {
        formRow: 5,
        seq:2,
        fieldCode: "creationName",
      },
      {
        formRow: 6,
        seq:1,
        fieldCode: "creationDate",
      } ];
    },
    getFinishDetailColumns() {
      return [
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "displayTrxNum",
        },
        {
          fieldCode: "rcvTypeName",
        },
        {
          fieldCode: "returnedFlagMeaning",
        },
        {
          fieldCode: "printFlagMeaning",
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "creationName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
    //已完成-行
    getFinishByLineColumns() {
      return [ {
        formRow: 1,
        fieldCode: "header",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader>
          {/*<SrmButton plain rect style={{ fontWeight: "bold" }} type="primary"*/}
          {/*  onClick={() => this.jumpDetail(item.rcvTrxHeaderId,item.returnedFlag,item.nodeConfigIndex)}>*/}
          {/*  {item.displayTrxHeaderAndLineNum}*/}
          {/*</SrmButton>*/}
          {item.supplierCompanyName}
          <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="info">
            {item.nodeConfigName}
          </SrmButton>
        </SrmListHeader>
      }, {
        formRow: 2,
        fieldCode: "displayTrxHeaderAndLineNum",
        render:(val, item) => <SrmButton plain rect style={{ fontWeight: "bold" }} type="primary"
          onClick={() => this.jumpDetail(item.rcvTrxHeaderId, item.returnedFlag, item.nodeConfigIndex,this.isDoubleUnit)}>
          {item.displayTrxHeaderAndLineNum}
        </SrmButton>
      },
      {
        formRow: 3,
        seq:1,
        fieldCode: "companyName",
      },
      {
        formRow: 4,
        seq:1,
        fieldCode: "nodeConfigName",
      },
      {
        formRow: 4,
        seq:2,
        fieldCode: "returnedFlagMeaning",
      },
      {
        formRow: 5,
        seq:1,
        fieldCode: "rcvTypeName",
      },
      {
        formRow: 5,
        seq:2,
        fieldCode: "creationName",
      },
      {
        formRow: 6,
        seq:1,
        fieldCode: "creationDate",
      } ];
    },
    getFinishByLineDetailColumns() {
      return [
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "displayTrxHeaderAndLineNum",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        this.isDoubleUnit && {
          fieldCode: "secondaryUomName",
        },
        {
          fieldCode: "uomName",
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "returnedFlagMeaning",
        },
        this.isDoubleUnit && {
          fieldCode: "secondaryQuantity",
          editor:false,
        },
        {
          fieldCode: "quantity",
          editor:false,
        },
        {
          fieldCode: "taxIncludedAmount",
          editor:false,
          fieldType: "TEXT",
          render: (val, item) => {
            if (item.hidePriceFlag && Number(item.hidePriceFlag)) {
              return "***";
            }
            return SrmUtil.getNumberLocalized(val, item.financialPrecision);
          },
        },
        {
          fieldCode: "rcvTypeName",
        },
        {
          fieldCode: "trxDate",
          editor:false,
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
          fieldCode: "fromDisplayTrxHeaderAndLineNum",
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
          fieldCode: "fromOrderTypeName",
        },
        {
          fieldCode: "sourceStatusMeaning",
          render: (val) => <SrmFlex justify="between">
            <SrmFlexItem>
              {val}
            </SrmFlexItem>
            <SrmFlexItem>
              <em class="srm-icon icon-chevron-right"/>
            </SrmFlexItem>
          </SrmFlex>,
          callBack: (dataSource, item) => {
            this.onSourceStatusItemClick(dataSource);
          }
        },

        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "creationName",
        },
        {
          fieldCode: "billMatchedFlagMeaning",
        },
        {
          fieldCode: "invoiceMatchedStatusMeaning",
        },
        {
          fieldCode: "importStatusMeaning",
          render: (val) => <SrmFlex justify="between">
            <SrmFlexItem>
              {val}
            </SrmFlexItem>
            <SrmFlexItem>
              <em class="srm-icon icon-chevron-right"/>
            </SrmFlexItem>
          </SrmFlex>,
          callBack: (dataSource, item) => {
            this.onImportItemClick(dataSource);
          }
        },
      ];
    }
  }
};
