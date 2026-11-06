// import uuid from "uuid";
import { $T } from "srm-mobile-ui";
import {
  getStatusCodeColor,
} from "../utils";
export default {
  data() {
    return {};
  },
  methods: {
    // 行信息
    getDetailLineColumns(commonInfo) {
      const { tab, node, lineReadOnly, currentLine } = commonInfo;
      switch (node) {
      case "ASN":
        return [
          {
            fieldCode: "itemCode",
            fieldType: "EMPTY",
            render: (val, item) => <srm-list-header show-open-tag={true}>
              <span>{ item.itemCode || "-" }</span>
              <span slot="right" style={getStatusCodeColor(item.lineStatus)}>{ item.lineStatusMeaning }</span>
            </srm-list-header>,
            formRow: 1,
          },
          {
            fieldCode: "itemName",
            formRow: 2,
          },
          {
            fieldCode: "displayUom",
            formRow: 3
          },
          {
            fieldCode: "displayAsnLineNum",
            formRow: 3
          },
          {
            fieldCode: "actualQuantity",
            editor: tab === "submit" && !lineReadOnly,
            required: tab === "submit" && !lineReadOnly,
            formRow: 4,
            fieldName: node === "ASN" ?
              $T("slod.common.model.common.createQuantity").$D("本次创建数量") :
              $T("slod.common.model.common.presentQuantity").$D("本次计划数量"),
          },
          tab !== "submit" && {
            fieldCode: "quantity",
            editor: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
              [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
              [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
            required: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
              [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
              [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
            formRow: 5
          },
          {
            formRow: 99999,
            fieldType: "EMPTY",
            render: (val, item) => (tab === "submit" && currentLine === "handleLine" ||
            tab === "affirm" && Number(item["changingFlag"]) !== 1 && item["demolitionUpdateCode"] === "CAN_SPLIT_UPDATE" &&
              [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]) &&
              currentLine === "handleLine") &&
              <srm-flex justify="end">
                <srm-button type="primary" fill onClick={() => this.splitLine(item)}>
                  { $T("slod.common.view.button.split").$D("拆分") }
                </srm-button>
              </srm-flex>
          },
        ];
      case "PLAN":
        return [
          {
            fieldCode: "itemCode",
            fieldType: "EMPTY",
            render: (val, item) => <srm-list-header show-open-tag={true}>
              <span>{ item.itemCode || "-" }</span>
              <span slot="right" style={getStatusCodeColor(item.lineStatus)}>{ item.lineStatusMeaning }</span>
            </srm-list-header>,
            formRow: 1,
          },
          {
            fieldCode: "itemName",
            formRow: 2,
          },
          {
            fieldCode: "displayUom",
            formRow: 3
          },
          {
            fieldCode: "displayPlanLineNum",
            formRow: 3
          },
          {
            fieldCode: "actualQuantity",
            editor: tab === "submit" && !lineReadOnly,
            required: tab === "submit" && !lineReadOnly,
            formRow: 4,
            fieldName: node === "ASN" ?
              $T("slod.common.model.common.createQuantity").$D("本次创建数量") :
              $T("slod.common.model.common.presentQuantity").$D("本次计划数量"),
          },
          {
            fieldCode: "plannedArrivalDate",
            formRow: 5,
            editor: tab === "submit" && !lineReadOnly,
            required: tab === "submit" && !lineReadOnly,
          },
          tab !== "submit" && {
            fieldCode: "quantity",
            formRow: 6,
            editor: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
              [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
              [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
            required: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
            [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
            [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
          },
          tab !== "submit" && {
            fieldCode: "confirmArrivalDate",
            formRow: 7,
            editor: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
            [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
            [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
            required: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
            [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
            [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
            // eslint-disable-next-line new-cap
            render: (val) => val ? this.$options.filters.CalcDate(val) : "",
          },
          {
            formRow: 99999,
            fieldType: "EMPTY",
            render: (val, item) => (tab === "submit" && currentLine === "handleLine" ||
            tab === "affirm" && Number(item["changingFlag"]) !== 1 && item["demolitionUpdateCode"] === "CAN_SPLIT_UPDATE" &&
              [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]) &&
              currentLine === "handleLine") &&
              <srm-flex justify="end">
                <srm-button type="primary" fill onClick={() => this.splitLine(item)}>
                  { $T("slod.common.view.button.split").$D("拆分") }
                </srm-button>
              </srm-flex>
          },
        ];
      default:
        return [];
      }
    },
    // 行信息-明细
    getDetailMoreLineColumns(commonInfo) {
      const { tab, node, lineReadOnly, currentLine } = commonInfo;
      switch (node) {
      case "ASN":
        return [
          {
            fieldCode: "lineStatusMeaning",
          },
          {
            fieldCode: "displayAsnLineNum",
          },
          tab === "all" && {
            fieldCode: "exportRecord",
            render: (val, item) => item.lineExportStatusMeaning ? <span style="color: var(--color-other-default-b)">{item.lineExportStatusMeaning}</span> : "-",
            callBack: async (item) => {
              if (item.lineExportStatusMeaning) {
                this.exportRecord({ lineId: item.asnLineId }, true);
              }
            }
          },
          {
            fieldCode: "itemCode",
          },
          {
            fieldCode: "itemName",
          },
          {
            fieldCode: "displayUom",
          },
          tab !== "affirm" && {
            fieldCode: "sourceQuantity",
          },
          tab === "submit" && {
            fieldCode: "canCreateQuantity",
          },
          tab !== "submit" && {
            fieldCode: "quantity",
            editor: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
                [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
                [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
            required: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
                [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
                [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
          },
          {
            fieldCode: "actualQuantity",
            editor: tab === "submit" && !lineReadOnly,
            required: tab === "submit" && !lineReadOnly,
            fieldName: node === "ASN" ?
              $T("slod.common.model.common.createQuantity").$D("本次创建数量") :
              $T("slod.common.model.common.presentQuantity").$D("本次计划数量"),
            inputChange:(val, record) => {
              if (record.actualQuantity && record.unitPackageQuantity && val) {
                const number = record.actualQuantity / record.unitPackageQuantity;
                // eslint-disable-next-line radix
                const num = parseInt(number);
                // const residue = (record.actualQuantity % record.unitPackageQuantity)
                const residue = this.calculation(_, record.actualQuantity, record.unitPackageQuantity * num);
                this.$set(record, "packageQuantity", num);
                this.$set(record, "remainderQuantity", residue);
              } else {
                this.$set(record, "packageQuantity", null);
                this.$set(record, "remainderQuantity", null);
              }
            },
          },
          {
            fieldCode: "unitPackageQuantity",
            editor: tab === "submit" && !lineReadOnly,
            inputChange:(val, record) => {
              if (record.actualQuantity && record.unitPackageQuantity && val) {
                const number = record.actualQuantity / record.unitPackageQuantity;
                // eslint-disable-next-line radix
                const num = parseInt(number);
                // const residue = (record.actualQuantity % record.unitPackageQuantity)
                const residue = this.calculation(_, record.actualQuantity, record.unitPackageQuantity * num);
                this.$set(record, "packageQuantity", num);
                this.$set(record, "remainderQuantity", residue);
              } else {
                this.$set(record, "packageQuantity", null);
                this.$set(record, "remainderQuantity", null);
              }
            },
          },
          {
            fieldCode: "packageQuantity",
          },
          {
            fieldCode: "remainderQuantity",
          },
          {
            fieldCode: "netWeight",
            editor: tab === "submit" && !lineReadOnly,
          },
          {
            fieldCode: "grossWeight",
            editor: tab === "submit" && !lineReadOnly,
          },
          {
            fieldCode: "lotNum",
            editor: tab === "submit" && !lineReadOnly,
          },
          {
            fieldCode: "productionDate",
            editor: tab === "submit" && !lineReadOnly,
          },
          {
            fieldCode: "lotExpirationDate",
            editor: tab === "submit" && !lineReadOnly,
          },
          {
            fieldCode: "serialNum",
            editor: tab === "submit" && !lineReadOnly,
          },
          {
            fieldCode: "fromDisplayPoNum",
            render: (val, item) => item.fromDisplayPoNum ? <span>{val}-{item.fromDisplayPoLineNum}</span> : "-",
          },
          {
            fieldCode: "fromDisplayPoLocationNum",
          },
          {
            fieldCode: "sourceDisplayNum",
            render: (val, item) => item.sourceDisplayNum ? <span>{val}-{item.sourceDisplayLineNum}</span> : "-",
          },
          {
            fieldCode: "sourceNodeConfigName",
          },
          {
            fieldCode: "purchaseLineRemark",
            editor: (val, item) => tab === "submit" && currentLine === "handleLine" || currentLine === "handleLine" && item["changedFlag"] !== 1 &&
                [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED", "SUPPLIER_FEEDBACK" ].includes(item["lineStatus"]),
          },
          {
            fieldCode: "supplierLineRemark",
          },
          tab === "submit" && {
            fieldCode: "supplierCompanyName",
          },
          {
            fieldCode: "deliveryAddress",
            editor: tab !== "all" && !lineReadOnly,
          },
          {
            fieldCode: "receiveAddress",
            editor: tab !== "all" && !lineReadOnly,
          },
          {
            fieldCode: "shipToLocContName",
          },
          {
            fieldCode: "shipToLocTelNum",
          },
          {
            fieldCode: "productNum", // 商品编码
          },
          {
            fieldCode: "productName", // 商品名称
          },
          {
            fieldCode: "catalogName", // 商品目录
          },
          {
            fieldCode: "creationDate", // 创建时间
          },
          {
            fieldCode: "createdName", // 创建人
          },
          {
            fieldCode: "purchaseLineAttachmentUuid",
            // editor: (val, item) => tab === "submit" && !lineReadOnly && item["changedFlag"] !== 1,
            disabled: (val, item) => item["changedFlag"] === 1 && !lineReadOnly || tab === "all",
            canUpload: (val, item) => tab === "submit" && !lineReadOnly && item["changedFlag"] !== 1,
            canDelete: (val, item) => tab === "submit" && !lineReadOnly && item["changedFlag"] !== 1,
          },
          {
            fieldCode: "supplierLineAttachmentUuid",
          },
          {
            fieldCode: "splitFlag",
            render: (val, item) => item.splitFlagMeaning,
          },
          {
            fieldCode: "occupiedQuantity",
          },
          {
            fieldCode: "changingFlag",
            render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val === 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
          },
        ];
      case "PLAN":
        return [
          tab === "all" && {
            fieldCode: "exportRecord",
            render: (val, item) => item.lineExportStatusMeaning ? <span style="color: var(--color-other-default-b)">{item.lineExportStatusMeaning}</span> : "-",
            callBack: async (item) => {
              if (item.lineExportStatusMeaning) {
                this.exportRecord({ lineId: item.planLineId }, true);
              }
            }
          },
          {
            fieldCode: "lineStatusMeaning",
          },
          {
            fieldCode: "displayPlanLineNum",
          },
          {
            fieldCode: "splitDisplayLineNum",
          },
          {
            fieldCode: "itemCode",
          },
          {
            fieldCode: "itemName",
          },
          {
            fieldCode: "displayUom",
          },
          tab === "submit" && {
            fieldCode: "canCreateQuantity",
          },
          {
            fieldCode: "actualQuantity",
            editor: tab === "submit" && !lineReadOnly,
            required: tab === "submit" && !lineReadOnly,
            fieldName: node === "ASN" ?
              $T("slod.common.model.common.createQuantity").$D("本次创建数量") :
              $T("slod.common.model.common.presentQuantity").$D("本次计划数量"),
            // inputChange:(val, record) => {
            //   if (record.actualQuantity && record.unitPackageQuantity && val) {
            //     const number = record.actualQuantity / record.unitPackageQuantity;
            //     // eslint-disable-next-line radix
            //     const num = parseInt(number);
            //     // const residue = (record.actualQuantity % record.unitPackageQuantity)
            //     const residue = this.calculation(_, record.actualQuantity, record.unitPackageQuantity * num);
            //     this.$set(record, "packageQuantity", num);
            //     this.$set(record, "remainderQuantity", residue);
            //   } else {
            //     this.$set(record, "packageQuantity", null);
            //     this.$set(record, "remainderQuantity", null);
            //   }
            // },
          },
          {
            fieldCode: "plannedArrivalDate",
            width: 160,
            editor: tab === "submit" && !lineReadOnly,
            required: tab === "submit" && !lineReadOnly,
            // eslint-disable-next-line new-cap
            render: (val) => val ? this.$options.filters.CalcDate(val) : "",
          },
          tab !== "submit" && {
            fieldCode: "confirmArrivalDate",
            width: 160,
            editor: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
            [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
            [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
            required: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
            [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
            [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
            // eslint-disable-next-line new-cap
            render: (val) => val ? this.$options.filters.CalcDate(val) : "",
          },
          tab !== "submit" && {
            fieldCode: "quantity",
            editor: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
              [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
              [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
            required: (val, item) => tab === "affirm" && !lineReadOnly && item["changedFlag"] !== 1 &&
            [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
            [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED" ].includes(item["lineStatus"]),
          },
          {
            fieldCode: "fromDisplayPoNum",
            render: (val, item) => item.fromDisplayPoNum ? <span>{val}-{item.fromDisplayPoLineNum}</span> : "-",
          },
          {
            fieldCode: "sourceDisplayNum",
            render: (val, item) => item.sourceDisplayNum ? <span>{val}-{item.sourceDisplayLineNum}</span> : "-",
          },
          {
            fieldCode: "sourceNodeConfigName",
          },
          {
            fieldCode: "neededDate",
            // eslint-disable-next-line new-cap
            render: (val) => val ? this.$options.filters.CalcDate(val) : "",
          },
          {
            fieldCode: "promisedDate",
            // eslint-disable-next-line new-cap
            render: (val) => val ? this.$options.filters.CalcDate(val) : "",
          },
          {
            fieldCode: "purchaseLineRemark",
            editor: (val, item) => tab === "submit" && currentLine === "handleLine" || currentLine === "handleLine" && item["changedFlag"] !== 1 &&
            [ "SUPPLIER_PUBLISHED", "SUPPLIER_REJECTED", "SUPPLIER_FEEDBACK" ].includes(item["lineStatus"]),
          },
          {
            fieldCode: "supplierLineRemark",
          },
          {
            fieldCode: "agentName",
          },
          {
            fieldCode: "categoryName",
          },
          {
            fieldCode: "invOrganizationName",
          },
          {
            fieldCode: "deliveryAddress",
            editor: tab !== "all" && !lineReadOnly,
          },
          {
            fieldCode: "receiveAddress",
            editor: tab !== "all" && !lineReadOnly,
          },
          {
            fieldCode: "supplierCompanyName",
          },
          {
            fieldCode: "splitFlag",
            render: (val, item) => item.splitFlagMeaning,
          },
          tab === "affirm" && {
            fieldCode: "createCampCodeMeaning",
          },
          tab === "affirm" && {
            fieldCode: "createdName",
          },
          {
            fieldCode: "occupiedQuantity",
          },
          {
            fieldCode: "changingFlag",
            render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val === 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
          },
        ];
      default:
        return [];
      }
    },
  }
};
