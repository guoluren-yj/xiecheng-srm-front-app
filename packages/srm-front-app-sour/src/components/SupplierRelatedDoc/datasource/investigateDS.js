import { SrmUtil, $T } from "srm-mobile-ui";

function investigateDS() {

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: { customizeUnitCode: "SSLM.SUPPLIER_LIFE_MANAGE.ELIMINATE_RELATED_DOC" },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "investgNumber",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.investiagte.code").$D("调查表编号"),
      },
      {
        fieldCode: "processStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.investigate.status").$D("调查表状态"),
      },
      {
        fieldCode: "partnerCompanyNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.supplierNum").$D("供应商编码"),
      },
      {
        fieldCode: "partnerCompanyName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "companyNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.view.company.code").$D("公司编码"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.view.company.companyName").$D("公司名称"),
      },
      {
        fieldCode: "investigateTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.investigate.type").$D("调查表类型"),
      },
      {
        fieldCode: "investigateLevelMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.investigate.level").$D("调查表管控维度"),
      },
      {
        fieldCode: "templateName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.investigate.template.name").$D("调查表模板名称"),
      },
      {
        fieldCode: "createUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.view.creator.name").$D("创建人"),
      },
      {
        fieldCode: "releaseDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierReview.model.supplierReview.processDate").$D("发布日期"),
      },
      {
        fieldCode: "createDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.view.created.date").$D("创建日期"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/investigate/sending",
        method: "get",
      },
    },
  };
}

export default investigateDS;
