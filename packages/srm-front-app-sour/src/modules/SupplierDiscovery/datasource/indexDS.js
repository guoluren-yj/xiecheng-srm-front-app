import { $T } from "srm-mobile-ui";
function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    fields: [],
    bodyParameter: {
      inviteStatus: "ALL"
    },
    fastQueryField: {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("hipspfm.common.message.company").$D("公司"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldName: $T("spfm.invitationRegister.model.invitation.inviteStatus").$D("邀请状态"),
        fieldCode: "inviteStatus",
        fieldType: "SELECT",
        lovCode: "SPFM.INVITE_QUERY_STATUS",
      },
      {
        fieldName: $T("spfm.supplier.model.supplier.platform.processTime").$D("认证通过时间"),
        fieldCode: "approveFromDate",
        endDateFieldCode: "approveToDate",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
      },
      {
        fieldName: $T("spfm.companySearch.model.company.industry").$D("行业"),
        fieldCode: "industryIds",
        fieldType: "LOV",
        lovCode: "HPFM.INDUSTRY_FIRST",
        // displayField: "industryName",
        options: {
          multiple: true,
          queryField: "industryCode", // 查询
          displayField: "industryName", // 选择后展示值
          subDisplayField: "industryCode",
          valueField: "industryId",
          callback:(val, valueField, displayField, ds) => {
            const industryIdArr = val.map((item) => item.industryId);
            const industryIdArrStr = industryIdArr.join();
            ds.addQueryFieldParameter("childrenIndustryIds", "industryIds", industryIdArrStr);
          }
        },
        required: false,
      },
      {
        fieldName: $T("spfm.companySearch.model.company.childrenIndustry").$D("产品服务分类"),
        fieldCode: "childrenIndustryIds",
        fieldType: "LOV",
        // displayField: "industryName2",
        lovCode: "HPFM.INDUSTRY_SECOND",
        options: {
          multiple: true,
          queryField: "industryName", // 查询
          displayField: "industryName", // 选择后展示值
          subDisplayField: "industryName",
          valueField: "industryId",
          callback:(val, valueField, displayField, ds) => {
            const childrenIndustryIdArr = val.map((item) => item.industryId);
            const childrenIndustryIdArrStr = childrenIndustryIdArr.join();
            ds.addQueryFieldParameter("industrycategoryIds", "industryIds", childrenIndustryIdArrStr);
          }
        },
        required: false,
      },
      {
        fieldName: $T("spfm.companySearch.model.company.serviceArea").$D("送货或服务范围"),
        fieldCode: "serviceAreaCodes",
        fieldType: "SELECT",
        // displayField: "meaning",
        lovCode: "SPFM.COMPANY.SERVICE_AREA",
      },
      {
        fieldName: $T("spfm.companySearch.model.company.capitalRange").$D("注册资本"),
        fieldCode: "capitalRanges",
        fieldType: "SELECT",
        // displayField: "meaning",
        lovCode: "SPFM.COMPANY.CAPITAL_RANGE",
      },
      {
        fieldName: $T("spfm.certificationApproval.model.detailForm.categoryList").$D("主营品类"),
        fieldCode: "industrycategoryIds",
        fieldType: "LOV",
        // displayField: "industryName2",
        lovCode: "HPFM.INDUSTRY.CATEGORY",
        options: {
          multiple: true,
          queryField: "categoryCode", // 查询
          displayField: "categoryName", // 选择后展示值
          subDisplayField: "categoryCode",
          valueField: "categoryId",
        },
        required: false,
      },
      {
        fieldName: $T("spfm.certificationApproval.model.detailForm.currencyCode").$D("注册资本币种"),
        fieldCode: "currencyCode",
        fieldType: "LOV",
        // displayField: "industryName2",
        lovCode: "SPFM.CURRENCY",
        options: {
          multiple: false,
          queryField: "currencyCode", // 查询
          displayField: "currencyName", // 选择后展示值
          subDisplayField: "currencyCode",
          valueField: "currencyCode",
        },
        required: false,
      },
    ],
    events: {
      beforeQuery: (ds, params, pathParam, bodyParameter) => {
        Object.keys(params).forEach((key) => {
          if ([ "industryIds", "childrenIndustryIds", "serviceAreaCodes", "capitalRanges", "industrycategoryIds" ].includes(key)) {
            bodyParameter[key] = params[key]?.split(",");
          } else {
            bodyParameter[key] = params[key];
          }
        });
      }
    },
    transport: {
      read: {
        url: `/spfm/v1/${localStorage.getItem("organizationId")}/companies/search/supplier`,
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
