import { $T } from "srm-mobile-ui";
function billDetaulDS(vm) {
  return {
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    showTotalCount:false,
    fields: [
      {
        fieldName: $T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.prNum").$D("单据编号"),
        fieldCode: "displayPrNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.lineNumber").$D("行号"),
        fieldCode: "lineNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.executeBillType").$D("执行单据类型"),
        fieldCode: "executeBillTypeMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.common.executionBillNum").$D("执行单据编号"),
        fieldCode: "executionBillNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.executionBillLineNum").$D("执行单据行号"),
        fieldCode: "executionBillLineNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.executeQuantity").$D("有效数量"),
        fieldCode: "executeQuantity",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.common.model.supplierName").$D("供应商"),
        fieldCode: "supplier",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.billStatus").$D("状态"),
        fieldCode: "billStatus",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("sprm.purchaseRequisitionInquiry.model.purchaseRequisitionInquiry.neededDate").$D("需求日期"),
        fieldCode: "neededDate",
        fieldType: "TEXT",
        render:(val) =>
          // eslint-disable-next-line new-cap
          vm.$options.filters.CalcDate(val)
        ,
      },
    ],
    transport: {
      read: {
        url: `/sprm/v1/${localStorage.getItem("organizationId")}/pr-change-historys`,
        method: "get",
        params: {},
      },
    },
  };
}

export default billDetaulDS;
