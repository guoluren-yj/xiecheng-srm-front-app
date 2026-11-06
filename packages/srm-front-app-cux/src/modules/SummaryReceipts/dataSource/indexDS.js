import { SrmUtil, $T } from "srm-mobile-ui";

function indexDS(vue) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    data: [],
    fields: [
      {
        fieldCode: "inspectDate",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.inspectDate"
        ).$D("送检时间"),
      },
      {
        fieldCode: "statusCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.statusCodeMeaning"
        ).$D("质检状态"),
      },
      {
        fieldCode: "asnNum",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.asnNum").$D(
          "送货单号"
        ),
      },
      {
        fieldCode: "itemCollectLineNum",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.itemCollectLineNum"
        ).$D("物料汇总行"),
      },
      {
        fieldCode: "deliveryDate",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.deliveryDate"
        ).$D("发货时间"),
      },
      {
        fieldCode: "qcNum",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.qcNums").$D(
          "质检单号"
        ),
      },
      {
        fieldCode: "rcvTrxCreatedByName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.rcvTrxCreatedByName"
        ).$D("创建人"),
      },
      {
        fieldCode: "checkDate",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.checkDate").$D(
          "质检/取消质检时间"
        ),
      },
      {
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.invOrganizationName"
        ).$D("库存组织"),
      },
      {
        fieldCode: "supplierNum",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.supplierNum"
        ).$D("供应商编号"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.supplierName"
        ).$D("供应商名称"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.itemCode").$D(
          "物品编号"
        ),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.itemName").$D(
          "物品名称"
        ),
      },
      {
        fieldCode: "usedItemCode",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.usedItemCode"
        ).$D("旧物料编码"),
      },
      {
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.categoryName"
        ).$D("物料类别"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.uomName").$D(
          "单位"
        ),
      },
      {
        fieldCode: "itemLocationCount",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.itemLocationCount"
        ).$D("物品发运总数"),
      },
      {
        fieldCode: "qualityControlFlag",
        fieldType: "SELECT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.qualityControlFlag"
        ).$D("是否质检"),
        lovCode: "HHKJ.SFZJ",
        required: true,
        editor: (val, item) => item.statusCode !== "CHECKED",
      },
      {
        fieldCode: "qualifiedCount",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.qualifiedCount"
        ).$D("合格数量"),
      },
      {
        fieldCode: "retrunCount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.retrunCount"
        ).$D("退货数量"),
        required: true,
        editor: (val, item) => item.statusCode !== "CHECKED",
        inputChange: (val, item, _, record) => {
          const badnessAmount =
            val * 100 / (item.itemLocationCount * 100) * 100;
          record.set("badnessRate", badnessAmount.toFixed(2));
          record.set("qualifiedCount", item.itemLocationCount - val);
          if (val > Number(item.itemLocationCount)) {
            vue.$notification.open({
              message: $T("scux.summaryReceipt.message.returnNo").$D(
                "退货数量不能超过物品发运总数量!"
              ),
              class: "notification",
            });
          }
        },
      },
      {
        fieldCode: "badnessRate",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.badnessRate"
        ).$D("批不良率%"),
      },
      {
        fieldCode: "checkResult",
        fieldType: "SELECT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.checkResult"
        ).$D("检查结果"),
        lovCode: "HHKJ.JCJG",
        required: true,
        editor: (val, item) => item.statusCode !== "CHECKED",
      },
      {
        fieldCode: "spotCheckCount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.spotCheckCount"
        ).$D("抽检数量"),
        editor: (val, item) => item.statusCode !== "CHECKED",
        required: true,
        inputChange: (val, item, _, record) => {
          if (item.spotCheckBadCount) {
            record.setField(
              "badRate",
              (item.spotCheckBadCount * 100 / (val * 100) * 100).toFixed(2)
            );
          }
          if (val > Number(item.itemLocationCount)) {
            vue.$notification.open({
              message: $T("scux.summaryReceipt.message.spotCountNo").$D(
                "抽检数量不能超过物品发运总数量!"
              ),
              class: "notification",
            });
          }
        },
      },
      {
        fieldCode: "spotCheckBadCount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.spotCheckBadCount"
        ).$D("抽检不良数量"),
        editor: (val, item) =>
          item.spotCheckCount && item.statusCode !== "CHECKED",
        inputChange: (val, item, _, record) => {
          if (item.spotCheckCount) {
            record.setField(
              "badRate",
              (val * 100 / (item.spotCheckCount * 100) * 100).toFixed(2)
            );
          }
          if (val > Number(item.spotCheckCount)) {
            vue.$notification.open({
              message: $T("scux.summaryReceipt.message.badCountNo").$D(
                "抽检不良数量不能超过抽检数量!"
              ),
              class: "notification",
            });
          }
        },
      },
      {
        fieldCode: "badRate",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.badRate").$D(
          "不良率%"
        ),
        editor: false,
      },
      {
        fieldCode: "headerId",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.badProject").$D(
          "不良项"
        ),
      },
      {
        fieldCode: "checkByName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.checkByName"
        ).$D("质检人"),
      },
      {
        fieldCode: "remark",
        fieldType: "INPUT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.remark").$D(
          "备注"
        ),
        editor: (val, item) => item.statusCode !== "CHECKED",
      },
      {
        fieldCode: "qualityInspectionCategoryCode",
        fieldType: "LOV",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.qualityInspectionCategory"
        ).$D("质检品类"),
        lovCode: "SCUX.HONGHE_QC_CATEGORY",
        displayField: "qualityInspectionCategory",
        editor: (val, item) => item.statusCode !== "CHECKED",
        required: true,
      },
      {
        fieldCode: "letter",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.letter").$D(
          "物料承认书"
        ),
      },
      {
        fieldCode: "drawing",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.drawing").$D(
          "物料图纸"
        ),
      },
      {
        fieldCode: "attachmentUuid",
        fieldType: "UPLOAD",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.attachmentUuid").$D(
          "出货检验报告"
        ),
      },
    ],
    queryParameter: {},
    fastQueryField: {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T("scux.summaryReceipt.model.summaryReceipt.itemCode").$D(
        "物品编号"
      ),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "qcNum",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.qcNum").$D(
          "质检单号"
        ),
      },
      {
        fieldCode: "supplierNum",
        fieldType: "LOV",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.supplier").$D(
          "供应商"
        ),
        lovCode: "SCUX_HONGHE_ERP_SUPPLIER",
      },
      {
        fieldCode: "asnNum",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.asnNum").$D(
          "送货单号"
        ),
      },
      {
        fieldCode: "statusCode",
        fieldType: "SELECT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.statusCode").$D(
          "质检状态"
        ),
        lovCode: "SCUX.HONGHE_QUALITY_CONTROL_STATUS",
        defaultValue: { orderSeq: 1, value: "CHECKING" },
      },
      // {
      //   fieldCode: "invOrganizationId",
      //   fieldType: "LOV",
      //   fieldName: $T("scux.summaryReceipt.model.summaryReceipt.invOrganizationId").$D("库存组织"),
      //   lovCode: "HPFM.INV_ORG",
      //   options: {
      //     multiple: false,
      //     subDisplayField: "organizationId",
      //     queryField: "organizationName"
      //   },
      // },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("scux.summaryReceipt.model.summaryReceipt.itemCode").$D(
          "物品编号"
        ),
      },
      // {
      //   fieldCode: "checkByName",
      //   fieldType: "TEXT",
      //   fieldName: $T("scux.summaryReceipt.model.summaryReceipt.checkByName").$D("质检人"),
      // },
      // {
      //   fieldCode: "rcvTrxCreatedByName",
      //   fieldType: "TEXT",
      //   fieldName: $T("scux.summaryReceipt.model.summaryReceipt.rcvTrxCreatedByName").$D("创建人"),
      // },
      {
        fieldCode: "inspectDateFrom",
        fieldType: "DATE_PICKER",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.inspectDateFrom"
        ).$D("送检时间从"),
      },
      {
        fieldCode: "inspectDateTo",
        fieldType: "DATE_PICKER",
        fieldName: $T(
          "scux.summaryReceipt.model.summaryReceipt.inspectDateTo"
        ).$D("送检时间至"),
        endDateFieldCode: "inspectDateFrom",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/CfYoAicBDhm5c9yuUFiat2ghQtlOS5dwpEQuiaDI3yicrFE`,
        method: "get",
      },
    },
  };
}

export { indexDS };
