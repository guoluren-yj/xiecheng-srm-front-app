import { $T, SrmButton, SrmUpload, SrmFlex, SrmUtil } from "srm-mobile-ui";
import { getLabelName } from "../../../utils/index";
import { getCUXLineColumns, getCuxLineDetailColumns } from "../CUX/DetailColumnMethod";
import { isNil } from "lodash";
import uuid from "uuid";
export default {
  data() {
    return {
    };
  },
  methods: {
    //基本信息
    getBasicColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.displayTrxNum}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="primary">
              {item.rcvStatusCodeMeaning}
            </SrmButton>
          </SrmListHeader>
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "companyName",
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "supplierCompanyName",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "nodeConfigName",
        },
        {
          formRow: 40,
          seq: 20,
          fieldCode: "returnedFlag",
          render: (val) => <span>{val === 0 ? this.$T("sinv.receiptExecution.model.receipt.aog").$D("收货") : this.$T("sinv.receiptWorkbench.model.receipt.sendBack").$D("退回")}</span>
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "rcvTrxTypeId",
          displayField: "rcvTypeName",
          // fieldType: "EMPTY",
          render: (val, item) => {
            //退回的和已完成的不准编辑
            if ([ "20_SUBMITTED", "40_FINISHED" ].includes(item.rcvStatusCode) || item.returnedFlag === 1 || item.sourceCode !== "SRM" && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(item.rcvStatusCode)) {
              return item.rcvTypeName;
            }
            const options = {
              subDisplayField: "rcvTypeCode",
              queryParams: {
                nodeConfigId: item.nodeConfigId
              },
            };
            return <SrmLovField
              v-model={item.rcvTrxTypeId}
              name="rcvTrxTypeId"
              code="SPUC.SINV_MOVE_TYPE"
              theme="fill"
              // jsx不支持双向绑定
              {...{
                on: {
                  "update:display": (value) => {
                    item.rcvTypeName = value;
                  }
                }
              }}
              display={item.rcvTypeName}
              placeholder={$T("sinv.receiptWorkbench.model.receipt.rcvTypeReName").$D("收货类型") + ":"}
              options={options} />;
          }
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "creationName",
        },
        {
          formRow: 60,
          seq: 20,
          fieldCode: "totalQuantity",
          editor: false,
        },
        {
          formRow: 65,
          seq: 10,
          fieldCode: "totalTaxIncludedAmount",
          editor: false,
          precision: (val, item) => Number(item.financialPrecision) ? Number(item.financialPrecision) : null,
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "remark",
          fieldType: "TEXT",
        },
        {
          formRow: 80,
          seq: 10,
          fieldCode: "creationDate",
        }, {
          formRow: 90,
          seq: 10,
          fieldCode: "unitIds",
          options: {
            displayField: "unitName",
            subDisplayField: "unitCode",
            multiple: true,
            // callback: (val) => {
            //   this.unitAll = val;
            // },
          },
          // disabled:(i, item) => item.rcvStatusCode === "40_FINISHED",
          // fieldType: "EMPTY",
          // render:(val) => {
          //   if (val) {
          //     return <srm-flex align="center" style="width:100%; height:44px;border-top: solid 1px #F6F6F6"><SrmTagGroup tags={val.split(",")} /></srm-flex>;
          //   }
          // }
        },
        {
          formRow: 100,
          seq: 10,
          fieldCode: "receiveLocationAddress",
          editor: false,
          // render: () => {
          //   if (!this.autoReceiveLocationAddress) {
          //     this.autoReceiveLocationAddress = "location...";
          //     this.$geoLocation().then((res) => {
          //       this.autoReceiveLocationAddress = `${res?.nation}${res?.province}${res?.district}${res?.addr}`;
          //     }).catch(() => {
          //       this.autoReceiveLocationAddress = "location failed";
          //     });
          //   }
          //   return <SrmTextarea autoSize={true} editor={false} value={this.autoReceiveLocationAddress}></SrmTextarea>;
          // },
          render: (val, item) => {
            if (!this.autoReceiveLocationAddress) {
              if ([ "10_NEW" ].includes(item.rcvStatusCode) || item.sourceCode === "SRM" && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(item.rcvStatusCode)) {
                this.autoReceiveLocationAddress = "location...";
                this.$geoLocation().then((res) => {
                  this.autoReceiveLocationAddress = `${res?.nation}${res?.province}${res?.district}${res?.addr}`;
                  console.log(`${res?.nation}${res?.province}${res?.district}${res?.addr}`, "定位信息000");
                }).catch(() => {
                  this.autoReceiveLocationAddress = "location failed";
                });
              } else {
                this.autoReceiveLocationAddress = val;
              }
            }
            return <SrmTextarea autoSize={true} editor={false} value={this.autoReceiveLocationAddress}></SrmTextarea>;
          },
        },
        {
          formRow: 110,
          seq: 10,
          fieldCode: "receiveDetailAddress",
        }
      ];
    },
    getBasicDetailColumns() {
      return [
        {
          fieldCode: "displayTrxNum",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "returnedFlag",
          render: (val) => <span>{val === 0 ? this.$T("sinv.receiptExecution.model.receipt.aog").$D("收货") : this.$T("sinv.receiptWorkbench.model.receipt.sendBack").$D("退回")}</span>
        },
        {
          fieldCode: "rcvTrxTypeId",
          // fieldType: "EMPTY",
          displayField: "rcvTypeName",
          render: (val, item) => {
            if ([ "20_SUBMITTED", "40_FINISHED" ].includes(item.rcvStatusCode) || item.returnedFlag === 1 || item.sourceCode !== "SRM" && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(item.rcvStatusCode)) {
              return item.rcvTypeName;
            }
            const options = {
              subDisplayField: "rcvTypeCode",
              queryParams: {
                nodeConfigId: item.nodeConfigId
              },
            };
            return <SrmLovField
              v-model={item.rcvTrxTypeId}
              name="rcvTrxTypeId"
              code="SPUC.SINV_MOVE_TYPE"
              theme="fill"
              // jsx不支持双向绑定
              {...{
                on: {
                  "update:display": (value) => {
                    item.rcvTypeName = value;
                  }
                }
              }}
              display={item.rcvTypeName}
              placeholder={$T("sinv.receiptWorkbench.model.receipt.rcvTypeReName").$D("收货类型") + ":"}
              options={options} />;
          }
        },
        {
          fieldCode: "creationName",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "unitIds",
          options: {
            displayField: "unitName",
            subDisplayField: "unitCode",
            multiple: true,
            // callback: (val) => {
            //   this.unitAll = val;
            // },
          },
        }, {
          fieldCode: "rcvStatusCodeMeaning",
        }, {
          fieldCode: "totalQuantity",
        },
        {
          fieldCode: "totalTaxIncludedAmount",
        },
        {
          fieldCode: "remark",
          // editor: (i, item) => ![ "20_SUBMITTED", "40_FINISHED" ].includes(item.rcvStatusCode) && [ "30_SUP_REJECTED", "30_REJECTED" ].includes(item.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(item.sourceCode),
          editor: (i, item) => [ "SRM", "SRM-MALL" ].includes(item.sourceCode) && ![ "20_SUBMITTED", "40_FINISHED" ].includes(item.rcvStatusCode),
        },
        {
          formRow: 100,
          seq: 10,
          fieldCode: "receiveLocationAddress",
          editor: false,
          render: (val, item) => {
            //新建
            if ([ "10_NEW" ].includes(item.rcvStatusCode) || item.sourceCode === "SRM" && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(item.rcvStatusCode)) {
              return this.autoReceiveLocationAddress;
            }
            return item.receiveLocationAddress;
          },
        },
        {
          formRow: 110,
          seq: 10,
          fieldCode: "receiveDetailAddress",
        },
      ];
    },
    //行信息
    getLineColumns() {
      const columns = [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.itemName}
          </SrmListHeader>,
        },
        {
          formRow: 10,
          seq: 10,
          fieldCode: "itemCode",
        },
        this.isDoubleUnit && ![ "40_FINISHED" ].includes(this.headDataSet.data[0]?.["rcvStatusCode"]) && {
          formRow: 15,
          seq: 10,
          fieldCode: "secondaryLeftQuantity",
          fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量") : $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D("可退货数量"),
          // precision: (val, item) => !isNil(item.secondaryUomPrecision) ? Number(item.secondaryUomPrecision) : 10,
        },
        this.isDoubleUnit && {
          fieldCode: "secondaryUomId",
          render: (val, item) => {
            const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
            const options = {
              queryParams: { invOrganizationId: item.invOrganizationId, itemId: item.itemId, primaryUomId: item.uomId },
            };
            return <SrmLovField
              editor={item.itemId &&
                item.firstNodeFlag === 1 &&
                this.isDoubleUnit === 2 &&
                item.upStreamSuFlag === 0 && ![ "20_SUBMITTED", "40_FINISHED", "30_SUP_REJECTED", "30_REJECTED" ].includes(rcvStatusCode) && item.returnedFlag !== 1 &&
                item.poSourcePlatform !== "CATALOGUE" &&
                item.poSourcePlatform !== "E-COMMERCE"
              }
              v-model={item.secondaryUomId}
              name="secondaryUomId"
              code="SMDM_ITEM_ORG_UOM"
              theme="fill"
              placeholder={this.$T("smbl.common.view.pleaseSelect", [ $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位") ]).$D("请选择{}")}
              display={item.secondaryUomName}
              options={options} />;
          },
          required: this.isDoubleUnit,
          editor: (val, item) => {
            const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
            return item.itemId &&
              item.firstNodeFlag === 1 &&
              this.isDoubleUnit === 2 &&
              item.upStreamSuFlag === 0 && ![ "20_SUBMITTED", "40_FINISHED", "30_SUP_REJECTED", "30_REJECTED" ].includes(rcvStatusCode) && item.returnedFlag !== 1 &&
              item.poSourcePlatform !== "CATALOGUE" &&
              item.poSourcePlatform !== "E-COMMERCE";
          } // 当前节点是第一个事务节点、上游模块（订单、协议）未开启双单位、物流开启双单位的情况下，该字段可编辑
        },
        ![ "40_FINISHED" ].includes(this.headDataSet.data[0]?.["rcvStatusCode"]) && {
          formRow: 45,
          seq: 10,
          fieldCode: "leftQuantity",
          // fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量") : $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D("可退货数量"),
          fieldName: getLabelName(this.isDoubleUnit, "leftQuantity", this.returnFlag === 0 ? 0 : 1),
          // precision: (val, item) => !isNil(item.uomPrecision) ? Number(item.uomPrecision) : 10
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "uomName",
          fieldName: getLabelName(this.isDoubleUnit, "uomName",),
        },
        this.isDoubleUnit && {
          formRow: 35,
          seq: 10,
          fieldCode: "secondaryQuantity",
          fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量") : $T("sinv.receiptExecution.model.receipt.reversedQuantity").$D("退货数量"),
          editor: (val, item) => {
            const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
            return ![ "20_SUBMITTED", "40_FINISHED" ].includes(rcvStatusCode) && item.subjectType === "QUANTITY" && !([ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode));
          },
          inputChange: (val, record) => this.lineNameChange(val, record, "secondaryQuantity"),
          // precision: (val, item) => !isNil(item.secondaryUomPrecision) ? Number(item.secondaryUomPrecision) : 0
        },
        {
          formRow: 45,
          seq: 10,
          fieldCode: "quantity",
          fieldName: getLabelName(this.isDoubleUnit, "quantity", this.returnFlag === 0 ? 1 : 3),
          // fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量") : $T("sinv.receiptExecution.model.receipt.reversedQuantity").$D("退货数量"),
          editor: (val, item) => {
            const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
            return ![ "20_SUBMITTED", "40_FINISHED" ].includes(rcvStatusCode) && item.subjectType === "QUANTITY" && !([ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode));
          },
          // precision: (val, item) => !isNil(item.uomPrecision) ? Number(item.uomPrecision) : 10,
          inputChange: (val, record) => this.lineNameChange(val, record, "quantity", record.uomPrecision),
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "taxIncludedAmount",
          fieldName: this.returnFlag === 0 ? $T("sinv.receiptWorkbench.model.receipt.taxIncludedAmount").$D("执行金额(含税)") : $T("sinv.receiptExecution.model.receipt.reversedTaxAmount").$D("退回金额"),
          precision: (val, item) => !isNil(item.financialPrecision) ? Number(item.financialPrecision) : 0,
          // fieldType: "TEXT",
          // render: (val, item) => {
          //   const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
          //   if (![ "20_SUBMITTED", "40_FINISHED" ].includes(rcvStatusCode) && item.subjectType === "AMOUNT") {
          //     return <SrmInputField
          //       size="small"
          //       theme="fill"
          //       clearButton={false}
          //       placeholder={this.$T("smbl.common.view.pleaseInput", [ this.returnFlag === 0 ? $T("sinv.receiptWorkbench.model.receipt.taxIncludedAmount").$D("执行金额(含税)") : $T("sinv.receiptExecution.model.receipt.reversedTaxAmount").$D("退回金额") ]).$D("请输入{}")}
          //       type="number"
          //       v-model={val}
          //       editor={true}
          //       precision={item.financialPrecision}
          //       editLimit={true}
          //       localizeNumber={true}
          //     />;
          //   }
          //   if (item.hidePriceFlag && Number(item.hidePriceFlag)) {
          //     return "***";
          //   }
          //   return SrmUtil.getNumberLocalized(val, item.financialPrecision);
          // },
          // render:(val, item) => <SrmTooltip placement="top">
          //   {item.taxIncludedAmount}
          // </SrmTooltip>,
          editor: (val, item) => {
            const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
            return ![ "20_SUBMITTED", "40_FINISHED" ].includes(rcvStatusCode) && item.subjectType === "AMOUNT" && !([ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode));
          },
          inputChange: (val, record) => this.lineAmountChange(val, record, "taxIncludedAmount"),
        },
        {
          formRow: 60,
          seq: 10,
          fieldCode: "fromOrderTypeName",
        },
        {
          formRow: 70,
          seq: 10,
          fieldCode: "trxDate",
          editor: false,
        },
      ];
      if (getCUXLineColumns && typeof getCUXLineColumns === "function") {
        const that = this;
        return getCUXLineColumns(columns, that);
      }
      return columns;
    },
    getLineDetailColumns() {
      const columns = [ {
        formRow: 1,
        fieldCode: "header",
        fieldType: "EMPTY",
        render: (val, item) => {
          if (!item.sinvLineAttachmentUuid) {
            item.sinvLineAttachmentUuid = uuid();
          }
          return <SrmFlex>
            <SrmButton style="margin-right:16px" size="mid" type="primary" fill>
              <SrmUpload canDelete={this.headDataSet.data[0].rcvStatusCode !== "40_FINISHED"} canUpload={this.headDataSet.data[0].rcvStatusCode !== "40_FINISHED" && !([ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode))} attachmentUuid={item.sinvLineAttachmentUuid} descTitle={$T("sinv.receiptExecution.model.receipt.lineUuid").$D("行附件")} showCount={false} showIcon={false}
                style="margin-right: 0"
                color="#fff" /></SrmButton>
            <SrmButton onClick={() => {
              this.customSpecs(item);
            }} size="mid" type="primary" bordered>{$T("sinv.receiptExecution.model.receipt.customSpecsJson").$D("定制品属性")}</SrmButton>
          </SrmFlex>;
        }
      }, {
        fieldCode: "itemCode",
      },
      this.isDoubleUnit && ![ "40_FINISHED" ].includes(this.headDataSet.data[0]?.["rcvStatusCode"]) && {
        fieldCode: "secondaryLeftQuantity",
        fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量") : $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D("可退货数量"),
        // precision: (val, item) => !isNil(item.secondaryUomPrecision) ? Number(item.secondaryUomPrecision) : 10,
      },
      this.isDoubleUnit && {
        fieldCode: "secondaryUomId",
        render: (val, item) => {
          const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
          const options = {
            queryParams: { invOrganizationId: item.invOrganizationId, itemId: item.itemId, primaryUomId: item.uomId },
          };
          return <SrmLovField
            editor={item.itemId &&
              item.firstNodeFlag === 1 &&
              this.isDoubleUnit === 2 &&
              item.upStreamSuFlag === 0 && ![ "20_SUBMITTED", "40_FINISHED", "30_SUP_REJECTED", "30_REJECTED" ].includes(rcvStatusCode) && item.returnedFlag !== 1 &&
              item.poSourcePlatform !== "CATALOGUE" &&
              item.poSourcePlatform !== "E-COMMERCE"
            }
            v-model={item.secondaryUomId}
            name="secondaryUomId"
            code="SMDM_ITEM_ORG_UOM"
            theme="fill"
            placeholder={this.$T("smbl.common.view.pleaseSelect", [ $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位") ]).$D("请选择{}")}
            display={item.secondaryUomName}
            options={options} />;
        },
        required: this.isDoubleUnit,
        editor: (val, item) => {
          const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
          return item.itemId &&
            item.firstNodeFlag === 1 &&
            this.isDoubleUnit === 2 &&
            item.upStreamSuFlag === 0 && ![ "20_SUBMITTED", "40_FINISHED", "30_SUP_REJECTED", "30_REJECTED" ].includes(rcvStatusCode) && item.returnedFlag !== 1 &&
            item.poSourcePlatform !== "CATALOGUE" &&
            item.poSourcePlatform !== "E-COMMERCE";
        } // 当前节点是第一个事务节点、上游模块（订单、协议）未开启双单位、物流开启双单位的情况下，该字段可编辑
      },
      {
        fieldCode: "itemName",
      },
      {
        fieldCode: "uomName",
        fieldName: getLabelName(this.isDoubleUnit, "uomName",),
        formRow: 30,
        seq: 10,
      },
      this.isDoubleUnit && {
        formRow: 35,
        seq: 10,
        fieldCode: "secondaryQuantity",
        fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量") : $T("sinv.receiptExecution.model.receipt.reversedQuantity").$D("退货数量"),
        editor: (val, item) => {
          const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
          return ![ "20_SUBMITTED", "40_FINISHED" ].includes(rcvStatusCode) && item.subjectType === "QUANTITY" && !([ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode));
        },
        // precision: (val, item) => !isNil(item.secondaryUomPrecision) ? Number(item.secondaryUomPrecision) : 0,
        inputChange: (val, record) => this.lineNameChange(val, record, "secondaryQuantity"),
      },
      {
        fieldCode: "quantity",
        fieldName: getLabelName(this.isDoubleUnit, "quantity", this.returnFlag === 0 ? 1 : 3),
        editor: (val, item) => {
          const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
          return ![ "20_SUBMITTED", "40_FINISHED" ].includes(rcvStatusCode) && item.subjectType === "QUANTITY" && !([ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode));
        },
        // precision: (val, item) => !isNil(item.uomPrecision) ? Number(item.uomPrecision) : 0,
        inputChange: (val, record) => this.lineNameChange(val, record, "quantity", record.uomPrecision),
      },
      ![ "40_FINISHED" ].includes(this.headDataSet.data[0]?.["rcvStatusCode"]) && {
        fieldCode: "leftQuantity",
        // fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量") : $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D("可退货数量"),
        fieldName: getLabelName(this.isDoubleUnit, "leftQuantity", this.returnFlag === 0 ? 0 : 1),
        // precision: (val, item) => !isNil(item.uomPrecision) ? Number(item.uomPrecision) : 10,
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldName: this.returnFlag === 0 ? $T("sinv.receiptWorkbench.model.receipt.taxIncludedAmount").$D("执行金额(含税)") : $T("sinv.receiptExecution.model.receipt.reversedTaxAmount").$D("退回金额"),
        precision: (val, item) => !isNil(item.financialPrecision) ? Number(item.financialPrecision) : 0,
        //   // eslint-disable-next-line rulesdir/check_js
        //   return "左向宇";
        // },
        // fieldType: "TEXT",
        // render: (val, item) => {
        //   const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
        //   if (![ "20_SUBMITTED", "40_FINISHED" ].includes(rcvStatusCode) && item.subjectType === "AMOUNT") {
        //     return <SrmInputField
        //       size="small"
        //       theme="fill"
        //       clearButton={false}
        //       placeholder={this.$T("smbl.common.view.pleaseInput", [ this.returnFlag === 0 ? $T("sinv.receiptWorkbench.model.receipt.taxIncludedAmount").$D("执行金额(含税)") : $T("sinv.receiptExecution.model.receipt.reversedTaxAmount").$D("退回金额") ]).$D("请输入{}")}
        //       type="number"
        //       v-model={val}
        //       editor={true}
        //       precision={item.financialPrecision}
        //       editLimit={true}
        //       localizeNumber={true}
        //     />;
        //   }
        //   if (item.hidePriceFlag && Number(item.hidePriceFlag)) {
        //     return "***";
        //   }
        //   return SrmUtil.getNumberLocalized(val, item.financialPrecision);
        // },
        editor: (val, item) => {
          const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
          return ![ "20_SUBMITTED", "40_FINISHED" ].includes(rcvStatusCode) && item.subjectType === "AMOUNT" && !([ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode));
        },
        inputChange: (val, record) => this.lineAmountChange(val, record, "taxIncludedAmount"),
      },
      ![ "40_FINISHED" ].includes(this.headDataSet.data[0]?.["rcvStatusCode"]) && {
        fieldCode: "leftTaxAmount",
        fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.leftTaxAmount.tax").$D("可执行金额(含税)") : $T("sinv.receiptExecution.model.receipt.can.return.amount").$D("可退回金额"),
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
        editor: () => ![ "20_SUBMITTED", "40_FINISHED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && !([ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode)),
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
            placeholder={this.$T("smbl.common.view.pleaseSelect", [ $T("sinv.receipWorkbench.model.receipt.inventoryName").$D("库房") ]).$D("请选择{}")}
            display={item.inventoryName}
            onInputChange={(currentVal, data) => {
              if (data.length !== 0) {
                item.inventoryCode = data[0].inventoryCode;
              }
            }}
            options={options} disabled={this.headDataSet.data[0].rcvStatusCode === "40_FINISHED" || this.returnFlag === 1 || [ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet.data[0].rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet.data[0].sourceCode)} />;
        },
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
            placeholder={this.$T("smbl.common.view.pleaseSelect", [ $T("sinv.receipWorkbench.model.receipt.locationName").$D("库位") ]).$D("请选择{}")}
            display={item.locationName}
            options={options} disabled={!item.inventoryId || this.headDataSet.data[0].rcvStatusCode === "40_FINISHED" || this.returnFlag === 1 || [ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet.data[0].rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet.data[0].sourceCode)} />;
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
        render: (i, item) => item.fromDisplayPoNum ? item.fromDisplayPoNum + "|" + item.fromDisplayPoLineNum : ""
      },
      {
        fieldCode: "fromPcHeaderAndLineNum",
        render: (i, item) => item.fromPcNum ? item.fromPcNum + "|" + item.fromPcSubjectNum : ""
      },
      {
        fieldCode: "fromDisplayAsnHeaderAndLineNum",
        render: (i, item) => item.fromDisplayAsnNum ? item.fromDisplayAsnNum + "|" + item.fromDisplayAsnLineNum : ""
      },
      {
        fieldCode: "deliverTime",
      },
      {
        fieldCode: "supplierCompanyName",
      },
      {
        fieldCode: "companyName",
      },
      {
        fieldCode: "agentName",
      },
      {
        fieldCode: "remark",
        editor: () => ![ "20_SUBMITTED", "40_FINISHED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && !([ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode)),
      },
      {
        fieldCode: "sinvLineAttachmentUuid",
        visible: false
      },
      {
        fieldCode: "fromOrderTypeName",
      },
      //退回原因
      {
        fieldCode: "moveReason",
        visible: () => this.returnFlag === 1,
        disabled: () => this.headDataSet.data[0].rcvStatusCode === "40_FINISHED" || [ "30_SUP_REJECTED", "30_REJECTED" ].includes(this.headDataSet?.data[0]?.rcvStatusCode) && ![ "SRM", "SRM-MALL" ].includes(this.headDataSet?.data[0]?.sourceCode),
        render: (val, item) => <span>{item.moveReasonMeaning}</span>
      },
      //协议-阶段编码
      {
        fieldCode: "stageCode",
        visible: () => this.returnFlag === 1
      },
      //协议-阶段名称
      {
        fieldCode: "stageName",
        visible: () => this.returnFlag === 1
      },
      {
        fieldCode: "fromDisplayTrxHeaderAndLineNum",
        render: (i, item) => item.fromDisplayTrxNum ? item.fromDisplayTrxNum + "|" + item.fromDisplayTrxLineNum : ""
      }, ];
      if (getCuxLineDetailColumns && typeof getCuxLineDetailColumns === "function") {
        const that = this;
        return getCuxLineDetailColumns(columns, that);
      }
      return columns;
    },
    //分数
    getScoreColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "overallScore",
          render: (val, item, fieldItem, record) => {
            let score = val ? val : 0;
            return <srm-score achieved-score={score} half-flag={true} style-type="starFill" total-score-flag={true} total-score={5} onItemClick={(result) => {
              record.setField("overallScore", result);
              // item.overallScore = result;
            }} />;
          }
        },
        {
          formRow: 20,
          fieldCode: "overallEvaluate",
        },
        {
          formRow: 30,
          fieldCode: "deliveryScore",
          fieldType: "TEXT",
          render: (val, item, fieldItem, record) => {
            let score = val ? val : 0;
            return <srm-score achieved-score={score} half-flag={true} style-type="starFill" total-score-flag={true} total-score={5} onItemClick={(result) => {
              // item.deliveryScore = result;
              record.setField("deliveryScore", result);
            }} />;
          }
        },
        {
          formRow: 40,
          fieldCode: "deliveryEvaluate",
        },
        {
          formRow: 50,
          fieldCode: "qualityScore",
          fieldType: "TEXT",
          render: (val, item, fieldItem, record) => {
            let score = val ? val : 0;
            return <srm-score achieved-score={score} half-flag={true} style-type="starFill" total-score-flag={true} total-score={5} onItemClick={(result) => {
              // item.qualityScore = result;
              record.setField("qualityScore", result);
            }} />;
          }
        },
        {
          formRow: 60,
          fieldCode: "qualityEvaluate",
        },
        {
          formRow: 70,
          fieldCode: "serviceScore",
          fieldType: "TEXT",
          render: (val, item, fieldItem, record) => {
            let score = val ? val : 0;
            return <srm-score achieved-score={score} half-flag={true} style-type="starFill" total-score-flag={true} total-score={5} onItemClick={(result) => {
              // item.serviceScore = result;
              record.setField("serviceScore", result);
            }} />;
          }
        },
        {
          formRow: 80,
          fieldCode: "serviceEvaluate",
        },
      ];
    },
    //行批量维护
    getReceiveLineDefineColumns() {
      return [
        {
          fieldCode: "trxDate",
          fieldType: "DATE_PICKER",
          fieldName: $T("sinv.receiptWorkbench.model.receipt.trxDate").$D("实际操作日期"),
        },
        {
          fieldCode: "inventoryName",
          fieldType: "TEXT",
          visible: false,
        },
        {
          fieldCode: "inventoryId",
          fieldType: "LOV",
          fieldName: $T("sinv.receipWorkbench.model.receipt.inventoryName").$D("库房"),
          lovCode: "SODR.INVENTORY",
          displayField: "inventoryName",
          options: {
            subDisplayField: "inventoryCode",
            queryParams: { invOrganizationId: this.defineData.invOrganizationId },
          },
          disabled: (val, dataSource) => !dataSource.invOrganizationSameFlag,
          validator: (val, dataSource) => {
            if (!dataSource.invOrganizationSameFlag) {
              return $T("sinv.receiptWorkbench.model.receipt.noInventoryNameLov").$D("收货组织不一致");
            }
          },
        },
        {
          fieldCode: "locatorId",
          fieldType: "LOV",
          fieldName: $T("sinv.receipWorkbench.model.receipt.locationName").$D("库位"),
          lovCode: "HPFM.LOCATION",
          displayField: "locationName",
          options: {
            subDisplayField: "locationCode",
            queryParams: { inventoryId: this.defineData.inventoryId },
          },
          disabled: (val, dataSource) => {
            this.$refs.testVal.columns.forEach((item) => {
              if (item.fieldCode === "locatorId") {
                item.options.queryParams.inventoryId = dataSource.inventoryId;
              }
            });
            // this.$refs.testVal.columns[3].options.queryParams.inventoryId = this.dataSource.inventoryId;
            return !dataSource.inventoryId;
          },
          validator: (val, dataSource) => {
            if (!dataSource.inventoryId && !dataSource.inventorySameFlag) {
              return $T("sinv.receiptWorkbench.model.receipt.noLocationName").$D("收货库房不一致");
            }
          },
        },
      ];
    },
    getBatchReceiveColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "displayTrxNum",
          fieldType: "EMPTY"
        },
        {
          formRow: 1,
          fieldCode: "tag",
          fieldType: "EMPTY",
          visible: (val, item) => this.rcvTrxHeaderId === item.rcvTrxHeaderId,
          render: () => <srm-tag size="small" type="primary" fill={true}>{this.$T("smbl.common.view.current.now").$D("当前")}</srm-tag>
        }
      ];
    }
  }
};
