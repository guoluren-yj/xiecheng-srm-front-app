import { $T, SrmUtil } from "srm-mobile-ui";
function bargainProcessTotalDS() {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
    },
    fields: [
      {
        fieldName: $T("ssrc.priceComparison.model.comparison.supplierCode").$D("供应商编码"),
        fieldCode: "supplierCompanyNum",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.quotationTime").$D("报价时间"),
        fieldType: "DATE_PICKER",
        fieldCode: "quotationDate",
        editor: false,
        timePicker:true,
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.num").$D("序号"),
        fieldCode: "num",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.quotationNode").$D("报价节点"),
        fieldCode: "quotationNodeMeaning",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.priceComparison.round").$D("轮次"),
        fieldCode: "roundNumber",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.comparison.supplierName").$D("供应商名称"),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("ssrc.priceComparison.model.comparison.totalTaxAmount").$D("报价总价（含税）"),
        fieldCode: "totalQuotationTaxAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldName: $T("ssrc.priceComparison.model.comparison.totalNetAmount").$D("报价总价（未税）"),
        fieldCode: "totalQuotationNetAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
    ],
    transport: {
      read: {
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/bargain-assistant/table/histogram`,
        method: "get",
      },
    },
    events: {
    }
  };
}

export default bargainProcessTotalDS;
