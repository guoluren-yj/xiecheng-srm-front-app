import { SrmUtil, $T } from "srm-mobile-ui";

function badProject(headerId, spotCheckCount, statusCode) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    data: [],
    showTotalCount: false,
    editable: statusCode !== "CHECKED",
    // editFlag: true,
    // enableQuery: false,
    // queryParameter: {
    //   headerId, spotCheckCount
    // },
    fastQueryField: {
      fieldCode: "badnessDescriptionMeaning",
      fieldType: "TEXT",
      fieldName: $T("scux.summaryReceipt.model.summaryReceipt.badnessDescription").$D("不良项描述"),
    },
    fields: [
      {
        fieldCode: "badnessDescription",
        fieldType: "SELECT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.badnessDescription").$D("不良项描述"),
        lovCode: "HHKJ.BLXMS",
        editor: statusCode !== "CHECKED"
      },
      {
        fieldCode: "badnessCount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.badnessCount").$D("数量"),
        required: (val, item) => item.badnessDescription && statusCode !== "CHECKED",
        editor: statusCode !== "CHECKED",
        inputChange: (val, item, _, record) => {
          record.setField("percent", (val * 100 / (spotCheckCount * 100) * 100).toFixed(2));
          // record.percent = val * 100 / (spotCheckCount * 100) * 100;
        }
      },
      {
        fieldCode: "percent",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.percent").$D("百分比%"),
        editor: false,
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/CfYoAicBDhm5c9yuUFiat2gpViaQsOyeial4miadlq4EiaS68TiahDph05Jw6ZvrFaHxk0u`,
        method: "get",
      },
    },
  };
}

function letterData(itemCode) {
  return {
    autoQuery: true,
    selection: 0,
    pageSize: 10,
    fields: [
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
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/WMjXJjhibCIicrK71jNibntXxEQFG1tet2mSqbhItiaKaJKvmgLwT2Bdx68CRvECpHiaY?itemCode=${itemCode}`,
        method: "get",
      },
    },
  };
}

function drawingData(itemId) {
  return {
    autoQuery: true,
    selection: 0,
    pageSize: 10,
    fields: [
      {
        fieldCode: "drawingVersion",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.drawingVersion").$D("物料版本"),
      },
      {
        fieldCode: "drawingLink",
        fieldType: "UPLOAD",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.drawing").$D("图纸"),
      },
    ],
    transport: {
      read: {
        url: `/smdm/v1/${SrmUtil.getTenantId()}/drawings/view/list?itemId=${itemId}`,
        method: "get",
      },
    },
  };
}

export { badProject, letterData, drawingData };