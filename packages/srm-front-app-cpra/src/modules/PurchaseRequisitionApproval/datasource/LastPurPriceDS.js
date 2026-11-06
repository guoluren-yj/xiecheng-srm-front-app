// 上次采购单价
import { SrmUtil, $T } from "srm-mobile-ui";

function lastPurPriceDS(poLineId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [ {
      fieldCode: "displayPoNum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.displayPoNum").$D("订单编号"),
    }, {
      fieldCode: "lineNum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.lineNumber").$D("行号"),
    }, {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.companyName").$D("公司"),
    }, {
      fieldCode: "supplierCode",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.supplierCode").$D("供应商编码"),
    }, {
      fieldCode: "supplierName",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.supplierCompanyName").$D("供应商名称"),
    }, {
      fieldCode: "enteredTaxIncludedPrice",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.model.common.enteredTaxIncludedPrice").$D("含税单价"),
    }, {
      fieldCode: "quantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.model.common.quantity").$D("数量"),
    }, {
      fieldCode: "taxIncludedLineAmount",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T("sprm.common.model.common.taxIncludedLineAmount").$D("行金额"),
    }, {
      fieldCode: "confirmedDate",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.model.common.confirmedDate").$D("发布时间"),
    }, ],
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/po-line/${poLineId}`,
        method: "get",
      },
    }
  };
}

export {
  lastPurPriceDS,
};