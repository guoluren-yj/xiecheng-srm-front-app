import { $T, SrmButton, SrmUpload, SrmFlex, SrmUtil } from "srm-mobile-ui";
import { getLabelName } from "../../../../utils/index";
// import { isNil } from "lodash";
import uuid from "uuid";
import {
  getStatusCodeColor,
} from "../utils";
export default {
  data() {
    return {};
  },
  methods: {
    //基本信息
    getBasicColumns() {
      let cuxBasicInfoDetail = [];
      const currentTenant = SrmUtil.getTenantNum();
      if (this.over$getColumns && typeof this.over$getColumns === "function") {
        cuxBasicInfoDetail = this.over$getColumns();
      }
      return [
        {
          formRow: 1,
          fieldCode: "displayTrxNum",
          // fieldType: "EMPTY",
          // render: (val, item) => <SrmListHeader>
          //   {item.displayTrxNum}
          //   <span class="title-text">{val}</span>
          //   <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="primary">
          //     {item.rcvStatusCodeMeaning}
          //   </SrmButton>
          // </SrmListHeader>
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span class="title-text">{val}</span>
            <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.rcvStatusCode)}>{item.rcvStatusCodeMeaning}</srm-tag>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
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
          render:(val, record) => val && record.rcvTypeName || "-",
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
        },
        {
          formRow: 90,
          seq: 10,
          fieldCode: "unitIds",
          render: (val, record) => (val && record.unitNames) || "-",
        },
      ].concat(currentTenant === "SRM-WEILONG" ? cuxBasicInfoDetail : []);
    },
    getBasicDetailColumns() {
      let cuxBasicInfoDetail = [];
      const currentTenant = SrmUtil.getTenantNum();
      if (this.over$getColumns && typeof this.over$getColumns === "function") {
        cuxBasicInfoDetail = this.over$getColumns();
      }
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
          displayField: "rcvTypeName",
          render:(val, record) => val && record.rcvTypeName || "-",
        },
        {
          fieldCode: "creationName",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "unitIds",
          render: (val, record) => val && record.unitNames || "-",
        },
        {
          fieldCode: "rcvStatusCodeMeaning",
        }, {
          fieldCode: "totalQuantity",
        },
        {
          fieldCode: "totalTaxIncludedAmount",
        },
        {
          fieldCode: "remark",
        },
      ].concat(currentTenant === "SRM-WEILONG" ? cuxBasicInfoDetail : []);
    },
    //行信息
    getLineColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "itemName",
          // fieldType: "EMPTY",
          // render: (val, item) => <SrmListHeader>
          //   {item.itemName}
          //   {/* <SrmButton
          //     onClick={() => {
          //       this.linkPr(item);
          //     }}
          //     slot="right" plain rect style={{ fontWeight: "bold" }} type="primary">
          //     {$T("sinv.receiptExecution.model.receipt.pr").$D("采购申请")}
          //   </SrmButton> */}
          // </SrmListHeader>,
          render: (val) => <srm-list-header show-open-tag={false}>
            <span class="title-text">{ val || "-" }</span>
            {/* <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.rcvStatusCode)}>{item.rcvStatusCodeMeaning}</srm-tag> */}
            {/* <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/> */}
          </srm-list-header>,
        },
        {
          formRow: 10,
          seq: 10,
          fieldCode: "itemCode",
        },
        this.isDoubleUnit && {
          formRow: 15,
          seq: 10,
          fieldCode: "secondaryLeftQuantity",
          fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量") : $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D("可退货数量"),
        },
        this.isDoubleUnit && {
          fieldCode: "secondaryUomId",
          render: (val, item) => {
            const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
            const options = {
              queryParams: { invOrganizationId: item.invOrganizationId, itemId: item.itemId, primaryUomId: item.uomId },
            };
            return <SrmLovField
              editor={Boolean(item.itemId &&
                item.firstNodeFlag === 1 &&
                this.isDoubleUnit === 2 &&
                item.upStreamSuFlag === 0 && rcvStatusCode !== "40_FINISHED" && item.returnedFlag !== 1 &&
                item.poSourcePlatform !== "CATALOGUE" &&
                item.poSourcePlatform !== "E-COMMERCE")}
              v-model={item.secondaryUomId}
              name="secondaryUomId"
              code="SMDM_ITEM_ORG_UOM"
              theme="fill"
              placeholder={this.$T("smbl.common.view.pleaseSelect", [ $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位") ]).$D("请选择{}")}
              display={item.secondaryUomName}
              options={options} />;
          },
          required: this.isDoubleUnit,
          // editor: (val, item) => {
          //   const rcvStatusCode = this.headDataSet.data[0]["rcvStatusCode"];
          //   return item.itemId &&
          //     item.firstNodeFlag === 1 &&
          //     this.isDoubleUnit === 2 &&
          //     item.upStreamSuFlag === 0 && rcvStatusCode !== "40_FINISHED" && item.returnedFlag !== 1;
          // } // 当前节点是第一个事务节点、上游模块（订单、协议）未开启双单位、物流开启双单位的情况下，该字段可编辑
        },
        {
          formRow: 45,
          seq: 10,
          fieldCode: "leftQuantity",
          // fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量") : $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D("可退货数量"),
          fieldName: getLabelName(this.isDoubleUnit, "leftQuantity", this.returnFlag === 0 ? 0 : 1),
          precision: (val, item) => Number(item.uomPrecision) ? Number(item.uomPrecision) : null,
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
          inputChange: (val, record) => this.lineNameChange(val, record, "secondaryQuantity"),
          precision: (val, item) => Number(item.secondaryUomPrecision) ? Number(item.secondaryUomPrecision) : null,
        },
        {
          formRow: 45,
          seq: 10,
          fieldCode: "quantity",
          fieldName: getLabelName(this.isDoubleUnit, "quantity", this.returnFlag === 0 ? 1 : 3),
          precision: (val, item) => Number(item.uomPrecision) ? Number(item.uomPrecision) : null,
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "taxIncludedAmount",
          fieldName: this.returnFlag === 0 ? $T("sinv.receiptWorkbench.model.receipt.taxIncludedAmount").$D("执行金额(含税)") : $T("sinv.receiptExecution.model.receipt.reversedTaxAmount").$D("退回金额"),
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
    },
    getLineDetailColumns() {
      return [ {
        formRow: 1,
        fieldCode: "header",
        fieldType: "EMPTY",
        render: (val, item) => {
          if (!item.sinvLineAttachmentUuid) {
            item.sinvLineAttachmentUuid = uuid();
          }
          return <SrmFlex>
            <SrmButton style="margin-right:16px" size="mid" type="primary" fill>
              <SrmUpload readOnly attachmentUuid={item.sinvLineAttachmentUuid} descTitle={$T("sinv.receiptExecution.model.receipt.lineUuid").$D("行附件")} showCount={false} showIcon={false}
                style="margin-right: 0"
                color="#fff" /></SrmButton>
            <SrmButton onClick={() => {
              this.customSpecs(item);
            }} size="mid" type="primary" bordered>{$T("sinv.receiptExecution.model.receipt.customSpecsJson").$D("定制品属性")}</SrmButton>
          </SrmFlex>;
        }
      },
      {
        fieldCode: "itemCode",
      },
      this.isDoubleUnit && {
        fieldCode: "secondaryLeftQuantity",
        fieldName: this.returnFlag === 0 ? $T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量") : $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D("可退货数量"),
        precision: (val, item) => Number(item.secondaryUomPrecision) ? Number(item.secondaryUomPrecision) : null,
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
              item.upStreamSuFlag === 0 && rcvStatusCode !== "40_FINISHED" && item.returnedFlag !== 1}
            v-model={item.secondaryUomId}
            name="secondaryUomId"
            code="SMDM_ITEM_ORG_UOM"
            theme="fill"
            placeholder={this.$T("smbl.common.view.pleaseSelect", [ $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位") ]).$D("请选择{}")}
            display={item.secondaryUomName}
            options={options} />;
        },
        required: this.isDoubleUnit,
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
        precision: (val, item) => Number(item.secondaryUomPrecision) ? Number(item.secondaryUomPrecision) : null,
        inputChange: (val, record) => this.lineNameChange(val, record, "secondaryQuantity"),
      },
      {
        fieldCode: "quantity",
        fieldName: getLabelName(this.isDoubleUnit, "quantity", this.returnFlag === 0 ? 1 : 3),
        precision: (val, item) => Number(item.uomPrecision) ? Number(item.uomPrecision) : null,
      },
      {
        fieldCode: "leftQuantity",
        fieldName: getLabelName(this.isDoubleUnit, "leftQuantity", this.returnFlag === 0 ? 0 : 1),
        precision: (val, item) => Number(item.uomPrecision) ? Number(item.uomPrecision) : null,
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldName: this.returnFlag === 0 ? $T("sinv.receiptWorkbench.model.receipt.taxIncludedAmount").$D("执行金额(含税)") : $T("sinv.receiptExecution.model.receipt.reversedTaxAmount").$D("退回金额"),
        inputChange: (val, record) => this.lineAmountChange(val, record, "taxIncludedAmount"),
      },
      {
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
      },
      {
        fieldCode: "invOrganizationName",
      },
      {
        fieldCode: "inventoryId",
        render: (val, item) =>
          val && item.inventoryName || "-"
      },
      {
        fieldCode: "locatorId",
        render: (val, item) =>
          val && item.locationName || "-"
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
        render:(val) => {
          let text = "";
          switch (String(val)) {
          case "1":
            text = $T("sinv.receiptExecution.model.receipt.leftTaxAmount.low").$D("质量低劣");
            break;
          case "2":
            text = $T("sinv.receiptExecution.model.receipt.leftTaxAmount.going").$D("未完成的");
            break;
          case "3":
            text = $T("sinv.receiptExecution.model.receipt.leftTaxAmount.bed").$D("损坏的");
            break;
          case "4":
            text = $T("sinv.receiptExecution.model.receipt.leftTaxAmount.other").$D("其他");
            break;
          default:
            text = "-";
            break;
          }
          return text;
        },
        visible: () => this.returnFlag === 1,
      },
      {
        fieldCode: "fromDisplayTrxHeaderAndLineNum",
        render: (i, item) => item.fromDisplayTrxNum ? item.fromDisplayTrxNum + "|" + item.fromDisplayTrxLineNum : ""
      }, ];
    },
  }
};
