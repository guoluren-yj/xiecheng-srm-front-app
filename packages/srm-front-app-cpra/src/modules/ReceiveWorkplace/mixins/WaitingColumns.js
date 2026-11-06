import { $T, SrmInputField, SrmUtil } from "srm-mobile-ui";
import { isNil } from "lodash";
export default {
  data() {
    return {};
  },
  methods: {
    getWaitingColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.itemName}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="primary">
              {item.nodeConfigName}
            </SrmButton>
          </SrmListHeader>
        },
        // {
        //   formRow: 1,
        //   fieldCode: "fromDisplayPoHeaderAndLineNum",
        // },
        {
          formRow: 10,
          fieldCode: "itemCode",
        },
        this.isDoubleUnit && {
          formRow: 15,
          // seq: 10,
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.isDoubleUnit && {
          formRow: 15,
          seq: 10,
          fieldCode: "secondaryLeftQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
          // editor: (val,item)=>{
          //   return item.subjectType === "QUANTITY";
          // }
        },
        {
          formRow: 20,
          seq: 20,
          fieldCode: "leftQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "taxIncludedAmount",
          fieldType: "TEXT",
          render: (val, item) => {
            if (item.hidePriceFlag && Number(item.hidePriceFlag)) {
              return "***";
            }
            return SrmUtil.getNumberLocalized(val, item.financialPrecision);
          },
        },
        {
          formRow: 40,
          seq: 20,
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
          formRow: 45,
          seq: 10,
          fieldCode: "secondaryUomName",
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "uomName",
        },
        {
          formRow: 50,
          seq: 20,
          fieldCode: "fromOrderTypeName",
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "sourceStatusMeaning"
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "trxDate",
          editor: false
        }
      ];
    },
    getWaitingDetailColumns() {
      return [
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        this.isDoubleUnit && {
          fieldCode: "secondaryUomId",
          render: (val, item) => {
            const options = {
              queryParams: { invOrganizationId: item.invOrganizationId, itemId: item.itemId, primaryUomId: item.uomId },
            };
            return <SrmLovField
              editor={Boolean(item.itemId &&
                item.firstNodeFlag === 1 &&
                this.isDoubleUnit === 2 &&
                item.upStreamSuFlag === 0 &&
                item.poSourcePlatform !== "CATALOGUE" &&
                item.poSourcePlatform !== "E-COMMERCE")}
              v-model={item.secondaryUomId}
              name="secondaryUomId"
              code="SMDM_ITEM_ORG_UOM"
              theme="fill"
              placeholder={this.$T("smbl.common.view.pleaseSelect", [$T("sinv.receipWorkbench.model.receipt.uoName").$D("单位")]).$D("请选择{}")}
              display={item.secondaryUomName}
              options={options} />;
          },
          required: this.isDoubleUnit,
          editor: (val, item) => item.itemId &&
            item.firstNodeFlag === 1 &&
            this.isDoubleUnit === 2 &&
            item.upStreamSuFlag === 0, // 当前节点是第一个事务节点、上游模块（订单、协议）未开启双单位、物流开启双单位的情况下，该字段可编辑
        },
        {
          fieldCode: "uomName",
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "quantity",
          editor: (val, item) => item.subjectType === "QUANTITY",
          // precision: (val, item) => !isNil(item.uomPrecision) ? Number(item.uomPrecision) : 10,
          inputChange: (val, record) => this.lineNameChange(val, record, "quantity", record.uomPrecision),
        },
        {
          fieldCode: "leftQuantity",
        },
        this.isDoubleUnit && {
          fieldCode: "secondaryQuantity",
          editor: (val, item) => item.subjectType === "QUANTITY",
          inputChange: (val, record) => this.lineNameChange(val, record, "secondaryQuantity"),
          // precision: (val, item) => !isNil(item.secondaryUomPrecision) ? Number(item.secondaryUomPrecision) : 10
        },
        this.isDoubleUnit && {
          fieldCode: "secondaryLeftQuantity",
          editor: false,
        },
        {
          fieldCode: "taxIncludedAmount",
          fieldType: "TEXT",
          render: (val, item) => {
            if (item.subjectType === "AMOUNT") {
              return <SrmInputField
                size="small"
                theme="fill"
                clearButton={false}
                placeholder={this.$T("smbl.common.view.pleaseInput", [this.$T("sinv.receiptWorkbench.model.receipt.taxIncludedAmount").$D("执行金额(含税)")]).$D("请输入{}")}
                type="number"
                v-model={val}
                editor={true}
                precision={item.financialPrecision}
                editLimit={true}
                localizeNumber={true}
                onInputChange= {
                  (val2) => {
                    this.lineAmountChange(val2, item, "taxIncludedAmount");
                  }
                }
              />;
            }
            if (item.hidePriceFlag && Number(item.hidePriceFlag)) {
              return "***";
            }
            return SrmUtil.getNumberLocalized(val, item.financialPrecision);
          },
          // inputChange: (val, record) => this.lineAmountChange(val, record, "taxIncludedAmount"),
        },
        {
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
          fieldCode: "trxDate",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "inventoryId",
          render: (val, item) => {
            const options = {
              subDisplayField: "inventoryCode",
              queryParams: { invOrganizationId: item.invOrganizationId },
            };
            return <SrmLovField
              v-model={item.inventoryId}
              name="inventoryId"
              code="SODR.INVENTORY"
              theme="fill"
              placeholder={this.$T("smbl.common.view.pleaseSelect", [$T("sinv.receipWorkbench.model.receipt.inventoryName").$D("库房")]).$D("请选择{}")}
              display={item.inventoryName}
              options={options} />;
          }
        },
        {
          fieldCode: "locatorId",
          render: (val, item) => {
            const options = {
              subDisplayField: "locationCode",
              queryParams: {
                inventoryId: item.inventoryId
              }
            };
            return <SrmLovField
              v-model={item.locatorId}
              name="locatorId"
              code="HPFM.LOCATION"
              theme="fill"
              placeholder={this.$T("smbl.common.view.pleaseSelect", [$T("sinv.receipWorkbench.model.receipt.locationName").$D("库位")]).$D("请选择{}")}
              display={item.locationName}
              options={options} disabled={!item.inventoryId} />;
          },
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
          fieldCode: "fromOrderTypeName",
        },

        {
          fieldCode: "sourceStatusMeaning",
          render: (val) => <SrmFlex justify="between">
            <SrmFlexItem>
              {val}
            </SrmFlexItem>
            <SrmFlexItem>
              <em class="srm-icon icon-chevron-right" />
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
          fieldCode: "purchaseAgentName",
        },
        {
          fieldCode: "creationName",
        },
        {
          fieldCode: "dueDate",
        },
        {
          fieldCode: "fromDisplayTrxHeaderAndLineNum",
        },
        {
          fieldCode: "fromPcHeaderAndLineNum",
        },
        {
          fieldCode: "strategyCode",
        },
      ];
    }
  }
};
