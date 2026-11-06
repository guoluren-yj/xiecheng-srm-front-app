import { $T } from "srm-mobile-ui";

function indexTenantDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    enableSelect:(record) => [ "WAIT_CONFIRMED" ].includes(record.data.reqStatus),
    data: [],
    queryParameter: {
      customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM.LIST",
    },
    fastQueryField: {
      fieldCode: "changeReqNumber",
      fieldType: "TEXT",
      fieldName: $T("sslm.enterpriseInform.model.application.changeReqNumber").$D("申请单号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("sslm.enterpriseInform.model.application.companyName").$D("企业名称"),
        lovCode: "SSLM.COMPANY_PARTNER",
      },
      {
        fieldCode: "reqStatus",
        fieldType: "SELECT",
        fieldName: $T("sslm.enterpriseInform.model.application.applicationState").$D("申请状态"),
        lovCode: "SSLM.ENTERPRISE_CHANGE_CONFIRM_STATUS",
      },
    ],
    fields: [],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/firm-change-confirms`,
        method: "get",
      },
    },
  };
}

function indexPlatformDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    enableSelect:(record) => [ "WAIT_TENANT_CONFIRMED" ].includes(record.data.reqStatus) && record.data.platformConfirmNewestFlag === 1,
    data: [],
    queryParameter: {
      // customizeUnitCode: "SSLM.ENTERPRISE_INFORM_CONFIRM.LIST",
    },
    fastQueryField: {
      fieldCode: "changeReqNumber",
      fieldType: "TEXT",
      fieldName: $T("sslm.enterpriseInform.model.application.changeReqNumber").$D("申请单号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("sslm.enterpriseInform.model.application.companyName").$D("企业名称"),
        lovCode: "SSLM.COMPANY_PARTNER",
      },
      {
        fieldCode: "reqStatus",
        fieldType: "SELECT",
        fieldName: $T("sslm.enterpriseInform.model.application.applicationState").$D("申请状态"),
        lovCode: "SSLM.ENTERPRISE_CHANGE_CONFIRM_STATUS",
      },
    ],
    fields: [],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/firm-change-confirms/platform-tenant-confirm-list`,
        method: "get",
      },
    },
  };
}

export {
  indexTenantDS,
  indexPlatformDS,
};
