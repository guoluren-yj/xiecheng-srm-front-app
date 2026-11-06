// queryQuotationBasicFormDataSet


import { SrmUtil, $T } from "srm-mobile-ui";

function queryQuotationBasicFormDataSet() {
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
        formRow: 0,
        fieldCode: "rfxTitle",
        fieldType: "EMPTY",
      },
      {
        formRow: 100,
        fieldName: $T("ssrc.supplierQuotation.model.supQuot.companyName").$D("客户"),
        fieldCode: "companyName",
      },
      {
        formRow: 200,
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.companyNameAttachmentBusTec").$D("客户商务/技术附件"),
        fieldCode: "companyNameUuid",
      },
      {
        formRow: 300,
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.currency").$D("币种"),
        fieldCode: "currencyCode",
        fieldType: "LOV",
      },
      {
        formRow: 400,
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.paymentTerms").$D("付款方式"),
        fieldCode: "paymentTypeName",
      },
      {
        formRow: 500,
        formCol: 1,
        fieldName: $T("ssrc.common.model.common.termsOfPayment").$D("付款条款"),
        fieldCode: "paymentTermName",
      },
    ],
  };
}

export { queryQuotationBasicFormDataSet };
