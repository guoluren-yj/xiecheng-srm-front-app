import { $T, SrmUtil } from "srm-mobile-ui";

export const SearchType = {
  send: "send",
  receive: "receive"
};

function indexDS(type) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter: {
      customizeUnitCode: "SPFM.PARTNER_INVITE.SEND_LIST,SPFM.PARTNER_INVITE.SEARCH_FORM",
    },
    bodyParameter: {
      searchType: SearchType[type],
      tenantId: SrmUtil.getTenantId()
    },
    fastQueryField: {
      fieldCode: "searchCompanyName",
      fieldType: "TEXT",
      fieldName: $T("spfm.invitationList.model.invitationList.inviteCompanyName").$D("被邀请企业名称"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldName: $T("hipspfm.disposeInvite.view.message.sendTime").$D("发出时间"),
        fieldCode: "startDate",
        endDateFieldCode: "endDate",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
      },
      {
        fieldName: $T("spfm.invitationRegister.model.invitation.inviter.company").$D("公司"),
        fieldCode: "companyId",
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTHORITY_COMPANY",
        displayField: "companyName",
        options: {
          displayField: "companyName", // 选择后展示值
          subDisplayField: "companyNum",
          valueField: "companyId",
        },
      },
      {
        fieldName: $T("spfm.invitationList.model.invitationList.inviteType").$D("邀请类型"),
        fieldCode: "inviteType",
        fieldType: "SELECT",
        lovCode: "SPFM.PARTNER_INVITE_TYPE",
        displayField: "inviteTypeMeaning",
        options: {
          displayField: "meaning", // 选择后展示值
          valueField: "value",
        },
      },
      {
        fieldName: $T("spfm.invitationRegister.model.invitation.inviteStatus").$D("邀请状态"),
        fieldCode: "processStatus",
        fieldType: "SELECT",
        lovCode: "SPFM.PARTNER_INVITE_STATUS",
        displayField: "processStatusMeaning",
        options: {
          displayField: "meaning", // 选择后展示值
          valueField: "value",
        },
      },
    ],
    events: {
      beforeQuery: (ds, params, pathParam, bodyParameter) => {
        Object.keys(params).forEach((key) => {
          if (key === "companyId" || key === "inviteType" || key === "processStatus" || key === "startDate" || key === "endDate" || key === "searchCompanyName") {
            bodyParameter[key] = params[key];
          }
          // if (key === "currencyCode" || key === "companyName") {
          //   bodyParameter[key] = params[key];
          // } else if (params[key] !== null) {
          //   bodyParameter[key] = params[key].split(",");
          // }
        });
      }
    },
    transport: {
      read: {
        url: `/spfm/v1/${localStorage.getItem("organizationId")}/invites`,
        method: "post",
      },
      create: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "post",
      },
      update: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "put",
      },
      destroy: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "delete",
      },
    },
  };
}

// export const storeInfoDs = (asnLineId) => {
//   return {
//     autoQuery: true,
//     selection: Infinity,
//     pageSize: 10,
//     editable: false,
//     editFlag: false, //是否可编辑
//     enableQuery: true,
//     data: [],
//     showTotalCount: false,
//     queryParameter: {},
//     fields: [],
//     transport: {
//       read: {
//         url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-detail-list/${asnLineId}`,
//         method: "get",
//       },
//     },
//   };
// };

export default indexDS;
