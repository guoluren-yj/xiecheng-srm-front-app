import { SrmUtil, $T } from "srm-mobile-ui";

function currentQuotationLineDataSet() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    forceValidate: true,
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
        fieldCode: "netPrice",
      },
      {
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.taxPrice").$D("含税单价"),
        fieldCode: "currentQuotationPrice",
      },
      {
        fieldCode: "taxId",
        fieldType: "LOV",
        lovCode: "SMDM.TAX",
        valueField: "taxId",
        displayField: "taxRate",
        options: {
          valueField: "taxId",
          displayField: "taxRate",
          subDisplayField: "taxRate",
        },
      },
      {
        fieldCode: "updatedFlag",
      },
      {
        fieldCode: "objectVersionNumber",
      },
    ],
    events: {
      afterQuery: (ds, data) => {
        const newdata = data.map((lineData) => {
          const {
            currentQuotationPrice,
            netPrice,
            currentQuotationSecPrice,
            netSecondaryPrice,
            currentLnTotalAmount,
            currentLnNetAmount,
          } = lineData || {};
          const temporaryData = {
            currentQuotationPrice,
            netPrice,
            currentQuotationSecPrice,
            netSecondaryPrice,
            currentLnTotalAmount,
            currentLnNetAmount,
          };
          return {
            ...lineData,
            temporaryData,
            previewCurrentQuotationPriceValue: currentQuotationPrice,
            previewNetPriceValue: netPrice,
            previewCurrentQuotationSecPriceValue: currentQuotationSecPrice,
            previewNetSecPriceValue: netSecondaryPrice,
          };
        });
        return newdata;
      },
    },
    transport: {
      read: {
        url: "/ssrc/v2/{tenantId}/rfx/supplier/quotation/lines?quotationHeaderId={quotationHeaderId}&customizeUnitCode={customizeUnitCode}&sourceMobileEndFlag={sourceMobileEndFlag}",
        method: "get",
      },
    },
  };
}

export { currentQuotationLineDataSet };
