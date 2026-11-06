import { SrmUtil, $T } from "srm-mobile-ui";

function queryQuotationLineDataSet({switchUrl = 0}) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    fields:[
      {
        fieldCode: "rfxTitle",
        // fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemMean").$D("物料名称"),
      },
      {
        fieldCode: "itemName",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemMean").$D("物料名称"),
      },
      {
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.netPrice").$D("未税单价"),
        fieldCode: "validNetPrice",
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.taxPrice").$D("含税单价"),
        fieldCode: "quotationPrice",
        fieldType: "INPUT_NUMBER",
      },
      {
        fieldCode: "taxRate",
      },
    ],
    transport: {
      read: {
        url: Number(switchUrl) === 2 ? "/ssrc/v2/{tenantId}/rfx/quotation/header/record/pur-query/quotation-line/detail?quotationHeaderId={quotationHeaderId}&customizeUnitCode={customizeUnitCode}&sourceMobileEndFlag={sourceMobileEndFlag}&rfxHeaderId={rfxHeaderId}" : "/ssrc/v2/{tenantId}/rfx/quotation/header/record/quotation-line?quotationHeaderId={quotationHeaderId}&customizeUnitCode={customizeUnitCode}&sourceMobileEndFlag={sourceMobileEndFlag}&rfxHeaderId={rfxHeaderId}",
        method: "get",
      },
    },
  };
}

export { queryQuotationLineDataSet };
