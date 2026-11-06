import uuid from "uuid";
import { $T, SrmButton, SrmFlex, SrmUpload, SrmUtil } from "srm-mobile-ui";

export default {
  data() {
    return {};
  },
  methods: {
    //执行中
    getDoingColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {/*<SrmButton plain rect style={{ fontWeight: "bold" }} type="primary"*/}
            {/*  onClick={() => this.jumpDetail(item.rcvTrxHeaderId,item.returnedFlag,item.nodeConfigIndex)}>*/}
            {/*  {item.displayTrxNum}*/}
            {/*</SrmButton>*/}
            {item.supplierName}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }}
              type={this.getDoingStatusType(item.rcvStatusCode)}>
              {item.rcvStatusCodeMeaning}
            </SrmButton>
          </SrmListHeader>
        }, {
          formRow: 2,
          fieldCode: "displayTrxNum",
        },
        {
          formRow: 3,
          seq: 1,
          fieldCode: "companyName",
        },
        {
          formRow: 4,
          seq: 1,
          fieldCode: "nodeConfigName",
        },
        {
          formRow: 4,
          seq: 2,
          fieldCode: "returnedFlagMeaning",
        },
        {
          formRow: 5,
          seq: 1,
          fieldCode: "rcvTypeName",
        },
        {
          formRow: 5,
          seq: 2,
          fieldCode: "creationName",
        },
        {
          formRow: 6,
          seq: 1,
          fieldCode: "creationDate",
        }
      ];
    },
    getDoingDetailColumns() {
      return [
        {
          fieldCode: "rcvStatusCodeMeaning",
        },
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
          render: (val, item) => {
            if (item.printTimes !== 0) {
              return <span>{val}({item.printTimes})</span>;
            }
            return <span>{val}</span>;
          }
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "remark",
        },
        {
          fieldCode: "creationName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
    //执行中-按行
    getDoingByLineColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {/*<SrmButton plain rect style={{ fontWeight: "bold" }} type="primary"*/}
            {/*  onClick={() => this.jumpDetail(item.rcvTrxHeaderId,item.returnedFlag,item.nodeConfigIndex)}>*/}
            {/*  {item.supplierName}*/}
            {/*</SrmButton>*/}
            {item.supplierName}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }}
              type={this.getDoingStatusType(item.rcvStatusCode)}>
              {item.rcvStatusCodeMeaning}
            </SrmButton>
          </SrmListHeader>
        }, {
          formRow: 2,
          fieldCode: "displayTrxNum",
          render:(val, item) => <SrmButton plain rect style={{ fontWeight: "bold" }} type="primary"
            onClick={() => this.jumpDetail(item.rcvTrxHeaderId, item.returnedFlag, item.nodeConfigIndex, this.isDoubleUnit)}>
            {item.displayTrxNum}
          </SrmButton>
        },
        {
          formRow: 3,
          seq: 1,
          fieldCode: "companyName",
        },
        {
          formRow: 4,
          seq: 1,
          fieldCode: "nodeConfigName",
        },
        {
          formRow: 4,
          seq: 2,
          fieldCode: "returnedFlagMeaning",
        },
        {
          formRow: 5,
          seq: 1,
          fieldCode: "rcvTypeName",
        },
        {
          formRow: 5,
          seq: 2,
          fieldCode: "creationName",
        },
        {
          formRow: 6,
          seq: 1,
          fieldCode: "creationDate",
        }
      ];
    },
    getDoingByLineDetailColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => {
            if (!item.sinvLineAttachmentUuid) {
              item.sinvLineAttachmentUuid = uuid();
            }
            return <SrmFlex>
              <SrmButton style="margin-right:16px" size="mid" type="primary" fill>
                <SrmUpload canDelete={false} canUpload={false} attachmentUuid={item.sinvLineAttachmentUuid} descTitle={$T("sinv.receiptExecution.model.receipt.lineUuid").$D("行附件")} showCount={false} showIcon={false}
                  style="margin-right: 0"/></SrmButton>
              <SrmButton onClick={() => {
                this.customSpecs(item);
              }} size="mid" type="primary" bordered >{$T("sinv.receiptExecution.model.receipt.customSpecsJson").$D("定制品属性")}</SrmButton>
            </SrmFlex>;
          }
        },
        {
          fieldCode: "rcvStatusCodeMeaning",
        },
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "displayTrxNum",
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
            return SrmUtil.getNumberLocalized(val, SrmUtil.getCurrencyPrecision(item.currencyCode, "financialPrecision"));
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
          fieldCode: "productName",
        },
        {
          fieldCode: "productNum",
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
          fieldCode: "dueDate",
        },
        {
          fieldCode: "remark",
          editor:false,
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "creationName",
        },
        {
          fieldCode: "creationDate",
        }
      ];
    },
  }
};
