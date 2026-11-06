import { $T, SrmUtil } from "srm-mobile-ui";

function receiveLineDs() {
  return {
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    fields: [
      {
        fieldCode: "acceptLineNum",
        fieldName: $T("scux.acceptBench.model.receipt.acceptLineNum").$D("行号"),
      },
      {
        fieldCode: "acceptTaxIncludedPrice",
        required: true,
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.acceptBench.model.view.acceptTaxIncludedPrice").$D("验收含税单价"),
      },
      {
        fieldCode: "taxIncludedPrice",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.taxIncludedPrices").$D("含税单价"),
      },
      {
        fieldCode: "acceptAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.acceptBench.model.receipt.acceptAmount").$D("本次验收金额"),
        required: true,
        // dynamicProps: {
        //   defaultValue: ({ record }) => {
        //     return record.get('referenceAmount');
        //   },
        // },
      },
      {
        fieldCode: "referenceAmount",
        fieldName: $T("scux.acceptBench.model.receipt.referenceAmount").$D("比例参考金额"),
      },
      {
        fieldCode: "remark",
        // fieldType: "TEXT_AREA",
        fieldType: "INPUT",
        fieldName: $T("scux.acceptBench.model.receipt.remark").$D("备注"),
      },
      {
        fieldCode: "itemCode",
        // fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        // fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.itemName").$D("物料名称"),
      },
      {
        fieldCode: "specifications",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.specifications").$D("规格"),
      },
      {
        fieldCode: "model",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.model").$D("型号"),
      },
      {
        fieldCode: "brand",
        fieldType: "TEXT",
        fieldName: $T("scux.acceptBench.model.receipt.brand").$D("品牌"),
      },
      {
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.acceptBench.model.receipt.quantity").$D("数量"),
      },
      {
        // fieldCode: "uomId",
        fieldCode: "uomName",
        // fieldType: "LOV",
        fieldName: $T("scux.acceptBench.model.receipt.secondaryUomName").$D("单位"),
        // lovCode: "SMDM_ITEM_ORG_UOM",
        // valueField: "uomId",
        // textField: "uomName",
        // options: {
        //   queryParams: {
        //     lovCode: "SMDM_ITEM_ORG_UOM",
        //     tenantId: SrmUtil.getTenantId(),
        //     // itemId: record.get('itemId'),
        //     // primaryUomId: record.get('uomId')
        //   }
        // },
      },
      {
        fieldCode: "taxIncludedLineAmount",
        // fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.acceptBench.model.receipt.taxIncludedLineAmounts").$D("含税行金额"),
      },
      {
        fieldCode: "displayPoNum",
        fieldName: $T("scux.acceptBench.model.receipt.displayPoNum").$D("订单号"),
      },
      {
        fieldCode: "displayLineNum",
        fieldName: $T("scux.acceptBench.model.receipt.displayLineNum").$D("订单行号"),
      },
      {
        fieldCode: "projectTaskNum",
        fieldName: $T("sinv.common.model.common.projectTaskNum").$D("项目编码"),
      },
      {
        fieldCode: "projectTaskName",
        fieldName: $T("sinv.common.model.common.projectTaskName").$D("项目名称"),
      },
      {
        fieldCode: "taskName",
        fieldName: $T("sinv.common.model.common.taskName").$D("项目任务名称"),
      },
      {
        fieldCode: "taskCode",
        fieldName: $T("sinv.common.model.common.taskCode").$D("项目任务编码"),
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/line-detail/{acceptHeaderId}`,
        method: "get",
      },
    },
  };
}

export { receiveLineDs };
