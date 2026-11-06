// 执行单据详情
import { SrmUtil, $T } from "srm-mobile-ui";

function executionBillDS(prLineId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [ {
      fieldCode: "displayPrNum",
      fieldName: $T("sprm.common.model.executeBill.displayPrNum").$D("单据编号"),
      fieldType: "TEXT",
    }, {
      fieldCode: "lineNum",
      fieldName: $T("sprm.common.model.common.lineNumber").$D("行号"),
      fieldType: "TEXT",
    }, {
      fieldCode: "executeBillTypeMeaning",
      fieldName: $T("sprm.common.model.common.executeBillType").$D("执行单据类型"),
      fieldType: "TEXT",
    }, {
      fieldCode: "executionBillNum",
      fieldName: $T("sprm.common.model.common.executionBillNum").$D("执行单据编号"),
      fieldType: "TEXT",
    }, {
      fieldCode: "executionBillLineNum",
      fieldName: $T("sprm.common.model.executeBill.executionBillLineNum").$D("执行单据行号"),
      fieldType: "TEXT",
    }, {
      fieldCode: "executeQuantity",
      fieldName: $T("sprm.common.model.executeBill.executeQuantity").$D("有效数量"),
      fieldType: "INPUT_NUMBER",
      editor: false,
    }, {
      fieldCode: "supplier",
      fieldName: $T("sprm.common.model.executeBill.supplier").$D("供应商"),
      fieldType: "TEXT",
    }, {
      fieldCode: "billStatusMeaning",
      fieldName: $T("sprm.common.model.executeBill.billStatusMeaning").$D("状态"),
      fieldType: "TEXT",
    }, {
      fieldCode: "needDate",
      fieldName: $T("sprm.common.model.executeBill.needDate").$D("需求日期"),
      fieldType: "TEXT",
      render: (val) => SrmUtil.dateFormat(val),
    }, ],
    queryParameter: {
      prLineId,
      customizeUnitCode: "SPRM.PURCHASE_REQUISITION_INQUIRY.LIST.EXECUTIONBILL",
    },
    transport: {
      read: {
        url: `/sprm/v1/${SrmUtil.getTenantId()}/pr-change-historys`,
        method: "get",
      },
    }
  };
}

export {
  executionBillDS,
};