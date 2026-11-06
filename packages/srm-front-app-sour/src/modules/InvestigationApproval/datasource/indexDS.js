import { $T } from "srm-mobile-ui";
function indexDs() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    // 字段集
    fields: [],
    // 快速查询
    fastQueryField: {
      fieldCode: "investgNumber",
      fieldType: "TEXT",
      fieldName: $T("sslm.common.model.investigate.code").$D("调查表编号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "partnerCompanyName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "investigateType",
        fieldType: "SELECT",
        lovCode: "SSLM.INVESTIGATE_TYPE",
        fieldName: $T("sslm.common.model.investiagte.type").$D("调查表类型"),
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTHORITY_COMPANY",
        fieldName: $T("sslm.common.view.company.name").$D("公司"),
        displayField: "companyName",
        options: {
          displayField: "companyName",
          subDisplayField: "companyNum",
          valueField: "companyId",
        }
      },
      {
        fieldCode: "createUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.view.creator.name").$D("创建人"),
      },
      {
        fieldCode: "templateCode",
        fieldType: "LOV",
        lovCode: "SSLM.INVESTIGATE_TEMPLATE_ID",
        fieldName: $T("sslm.common.model.investigate.template").$D("调查表模板"),
        displayField: "templateName",
        options: {
          displayField: "templateName",
          subDisplayField: "templateCode",
          valueField: "templateCode",
        }
      },
      {
        fieldCode: "submitDateFrom",
        fieldType: "DATE_PICKER",
        fieldName: $T("sslm.investigCorrelat.view.message.submitDateFrom").$D("提交时间从"),
      },
      {
        fieldCode: "submitDateTo",
        fieldType: "DATE_PICKER",
        fieldName: $T("sslm.investigCorrelat.view.message.submitDateTo").$D("提交时间到"),
      },
    ],
    // 表单参数
    queryParameter: {
      customizeUnitCode: "SSLM.INVESTIGATION_APPROVAL_LIST.TABLE_LIST,SSLM.INVESTIGATION_APPROVAL_LIST.SEARCH_FORM",
      page: 0,
      size: 10,
    },
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/investigate/listSubmitted`,
        method: "get",
      },
    },
  };
}

export default indexDs;