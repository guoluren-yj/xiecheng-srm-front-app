import { SrmUtil, $T } from "srm-mobile-ui";

function reportFilledInDS() {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SSLM_SITEINVESTIGATE_FILLING_LIST.LIST,SSLM_SITEINVESTIGATE_FILLING_LIST.SEARCH_FORM",
    },
    fastQueryField: {
      fieldCode: "evalNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.code").$D("考察报告编码"),
    },
    queryFields: [
      {
        fieldName: $T("smbl.common.message.status").$D("状态"),
        fieldType: "SELECT",
        fieldCode: "evalStatus",
        displayField: "evalStatusMeaning",
        lovCode: "SSLM.SITE_EVAL_STATUS",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.code").$D("考察报告编码"),
        fieldType: "TEXT",
        fieldCode: "evalNum",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.describe").$D("考察报告描述"),
        fieldType: "TEXT",
        fieldCode: "evalDescription",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人"),
        fieldType: "TEXT",
        fieldCode: "realName",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间"),
        fieldType: "DATE_PICKER",
        fieldCode: "creationDateFrom",
        selectType: "start-end",
        endDateFieldCode: "creationDateTo",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.company").$D("公司"),
        fieldType: "LOV",
        fieldCode: "companyId",
        lovCode: "SPCM.USER_AUTH.COMPANY",
      }, {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplier").$D("供应商"),
        fieldType: "LOV",
        fieldCode: "supplierCompanyId",
        lovCode: "SPFM.USER_AUTH.SUPPLIER",
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-headers/evaluating`,
        method: "get",
      },
    }
  };
}

export {
  reportFilledInDS,
};