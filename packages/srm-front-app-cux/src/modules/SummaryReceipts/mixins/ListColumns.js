import { $T } from "srm-mobile-ui";

export default {
  data() {
    return {};
  },
  methods: {
    getColumns() {
      return [
        {
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader>
              {item.itemName}
              <SrmButton slot="right" plain rect style={{ fontWeight: "bold", color: "blue" }} type="info">
                {item.statusCodeMeaning}
              </SrmButton>
            </SrmListHeader>
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "qualityInspectionCategoryCode",
        },
        {
          fieldCode: "qualityControlFlag",
        },
        {
          fieldCode: "spotCheckCount",
        },
        {
          fieldCode: "retrunCount",
        },
        {
          fieldCode: "checkResult",
        },
        {
          fieldCode: "spotCheckBadCount",
        },
        {
          fieldCode: "badRate",
        },
        {
          fieldCode: "checkByName",
        },
        {
          fieldCode: "headerId",
          render: (val, item) => {
            if (item.spotCheckCount) {
              return (
                <a onClick={() => this.openModal(val, item.spotCheckCount, item.statusCode, item)}>
                  {$T("scux.summaryReceipt.model.summaryReceipt.badProject").$D("不良项")}
                </a>
              );
            }
            return "";
          }
        },
        {
          fieldCode: "remark",
        },
        {
          fieldCode: "letter",
          render: (val, item) =>
            <a onClick={() => this.attachmentLetterModal(item.itemCode)}>
              {$T("scux.summaryReceipt.model.summaryReceipt.letter").$D("物料承认书")}
            </a>
        },
        // {
        //   fieldCode: "drawing",
        //   render: (val, item) =>
        //     <a onClick={() => this.attachmentDrawingModal(item.itemId)}>
        //       {$T("scux.summaryReceipt.model.summaryReceipt.drawing").$D("物料图纸")}
        //     </a>
        // },
        {
          fieldCode: "attachmentUuid",
        },
      ];
    },
    getBadProjectColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: () =>
            <SrmListHeader>
              {$T("scux.summaryReceipt.model.summaryReceipt.badProject").$D("不良项")}
            </SrmListHeader>
        },
        {
          fieldCode: "badnessDescription",
        },
        {
          fieldCode: "badnessCount",
        },
        {
          fieldCode: "percent",
        },
      ];
    },
    getBadProjectForm() {
      return [
        {
          fieldCode: "supplierName",
          fieldType: "TEXT",
          fieldName: $T("scux.summaryReceipt.model.summaryReceipt.supplierName").$D("供应商名称"),
        },
        {
          fieldCode: "itemCode",
          fieldType: "TEXT",
          fieldName: $T("scux.summaryReceipt.model.summaryReceipt.itemCode").$D("物品编号"),
        },
      ];
    },
    getLetterColumns() {
      return [
        {
          fieldCode: "itemVersion",
          fieldType: "TEXT",
          fieldName: $T("scux.summaryReceipt.model.summaryReceipt.itemVersion").$D("物料版本"),
        },
        {
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          fieldName: $T("scux.summaryReceipt.model.summaryReceipt.acknowledgment").$D("承认书"),
        },
      ];
    },
    getDrawingColumns() {
      return [
        {
          fieldCode: "drawingVersion",
          fieldType: "TEXT",
          fieldName: $T("scux.summaryReceipt.model.summaryReceipt.drawingVersion").$D("物料版本"),
        },
        {
          fieldCode: "drawingLink",
          fieldType: "TEXT",
          render: (val, item) =>
            <a onClick={() => this.attachmentDrawingLoad(item.itemCode, item.drawingVersion, item.drawingLink)}>
              {$T("scux.summaryReceipt.model.summaryReceipt.drawingDoload").$D("图纸下载")}
            </a>,
          fieldName: $T("scux.summaryReceipt.model.summaryReceipt.drawing").$D("图纸"),
        },
      ];
    }
  }
};
