import { $T } from "srm-mobile-ui";

/**
 * 全部tab
 *
 * 单据来源类型
 * 1、招投标：BID
 * 2、询报价：RFX
 */

function allDS(type) {
  const queryFields = {
    RFX:[
      {
        fieldCode: "quotationStartDate",
        fieldType: "DATE",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
      },
      {
        fieldCode: "rfxNum",
        fieldType: "TEXT",
        fieldName: $T("ssrc.queryRfq.model.queryRfq.RFXNum").$D("RFX单号"),
      },
      {
        fieldCode: "sourceMethod",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
        lovCode: "SSRC.SOURCE_METHOD",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "sourceCategory",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
        lovCode: "SSRC.SOURCE_CATEGORY",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "quotationType",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationTypeMeaning").$D("报价方式"),
        lovCode: "SSRC.QUOTATION_TYPE",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "rfxStatusSet",
        fieldType: "SELECT",
        fieldName: $T("ssrc.queryRfq.model.queryRfq.status").$D("状态"),
        lovCode: "SSRC.RFX_STATUS",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "purOrganizationId",
        fieldType: "LOV",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
        lovCode: "SODR.PURCHASE_ORGANIZATION",
        options: {
          multiple: false,
          subDisplayField: "organizationCode",
          queryParams: {
            organizationId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldCode: "createdUnitName",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.createdUnitName").$D("创建人部门"),
      },
      {
        fieldCode: "auctionDirection",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.biddingDirection").$D("报价方向"),
        lovCode: "SSRC.SOURCE_AUCTION_DIRECTION",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "currencyCode",
        fieldType: "LOV",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.currencyName").$D("币种"),
        lovCode: "SMDM.EXCHANGE_RATE.CURRENCY",
        options: {
          multiple: false,
          queryParams: {
            organizationId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldCode: "sealedQuotationFlag",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sealedQuotationFlag").$D("密封报价"),
        lovCode: "HPFM.FLAG",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "prNum",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.prNum").$D("采购申请号"),
      },
      {
        fieldCode: "createdBy",
        fieldType: "LOV",
        fieldName: $T("ssrc.queryRfq.model.queryRfq.creater").$D("创建人"),
        lovCode: "HIAM.TENANT.USER",
        options: {
          title: $T("smbl.common.view.pleaseSelectTheFounder").$D("请选择创建人"),
          multiple: false,
          displayField: "realName",
          subDisplayField: "loginName",
          valueField: "id",
          queryField: "realName",
          queryParams: {
            organizationId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldCode: "approvedBy",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.approvedBy").$D("审批人"),
      },
    ],
    BID:[
      {
        fieldCode: "quotationStartDate",
        fieldType: "DATE",
        fieldName: $T("ssrc.bidHall.model.bidHall.quotationStartTime").$D("投标开始时间"),
      },
      {
        fieldCode: "multiRfxNumOrTitle",
        fieldType: "TEXT",
        fieldName: $T("ssrc.supQuoSumQuery.model.supQuoSumQuery.bidNum").$D("BID单号"),
      },
      {
        fieldCode: "sourceMethod",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
        lovCode: "SSRC.SOURCE_METHOD",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "quotationType",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationTypeMeaning").$D("报价方式"),
        lovCode: "SSRC.QUOTATION_TYPE",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "rfxStatus",
        fieldType: "SELECT",
        fieldName: $T("ssrc.queryRfq.model.queryRfq.status").$D("状态"),
        lovCode: "SSRC.NEW_BID_STATUS",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "purOrganizationId",
        fieldType: "LOV",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
        lovCode: "SODR.PURCHASE_ORGANIZATION",
        options: {
          multiple: false,
          subDisplayField: "organizationCode",
          queryParams: {
            organizationId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldCode: "auctionDirection",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.biddingDirection").$D("报价方向"),
        lovCode: "SSRC.SOURCE_AUCTION_DIRECTION",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "currencyCode",
        fieldType: "LOV",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.currencyName").$D("币种"),
        lovCode: "SMDM.EXCHANGE_RATE.CURRENCY",
        options: {
          multiple: false,
          queryParams: {
            organizationId: localStorage.getItem("tenantId"),
          },
        },
      },
      {
        fieldCode: "sealedQuotationFlag",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sealedQuotationFlag").$D("密封报价"),
        lovCode: "HPFM.FLAG",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "createdBy",
        fieldType: "LOV",
        fieldName: $T("ssrc.queryRfq.model.queryRfq.creater").$D("创建人"),
        lovCode: "HIAM.TENANT.USER",
        options: {
          title: $T("smbl.common.view.pleaseSelectTheFounder").$D("请选择创建人"),
          multiple: false,
          displayField: "realName",
          subDisplayField: "loginName",
          valueField: "id",
          queryField: "realName",
          queryParams: {
            organizationId: localStorage.getItem("tenantId"),
          },
        },
      },
      // {
      //   fieldCode: "prNum",
      //   fieldType: "TEXT",
      //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.prNum").$D("采购申请号"),
      // },
      // {
      //   fieldCode: "approvedBy",
      //   fieldType: "TEXT",
      //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.approvedBy").$D("审批人"),
      // },
      // {
      //   fieldCode: "createdUnitName",
      //   fieldType: "TEXT",
      //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.createdUnitName").$D("创建人部门"),
      // },
    ]
  };
  // 个性化编码
  const customizeUnitCode = {
    BID:"SSRC.BID_HALL.NEW_LIST.ALL,SSRC.BID_HALL.NEW_LIST.FILTER_BAR",
    RFX:""
  };
  const secondarySourceCategory = {
    BID:"NEW_BID",
    RFX:""
  };

  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    fields: [],
    fastQueryField: {
      fieldCode: type === "BID" ? "multiRfxNumOrTitle" : "rfxTitle",
      fieldType: "TEXT",
      fieldName: type === "BID" ? $T("smbl.inquiryHall.model.inquiryHallBidTitle").$D("招标书标题") : $T("ssrc.queryRfq.model.queryRfq.inquiryTitle").$D("询价单标题"),
    },
    // 查询表单字段
    queryFields: queryFields[type],
    queryParameter: {
      customizeUnitCode: customizeUnitCode[type],
      secondarySourceCategory: secondarySourceCategory[type],
      page: 0,
      size: 20
    },
    events: {
      // eslint-disable-next-line no-unused-vars
      beforeQuery: (ds, params, pathParam, bodyParameter) => {
        let curCustomizeFilterComparison = [];
        let curCustomMergeFilterField = [];
        Object.keys(params).forEach((key) => {
          if (![ "customizeUnitCode", "secondarySourceCategory", "page", "size", "rfxTitle", "rfxNum" ].includes(key)) {
            curCustomizeFilterComparison.push(key + ":=");
          } else if ([ "rfxTitle", "rfxNum" ].includes(key)) {
            curCustomMergeFilterField.push(key);
          }
        });
        params["customizeFilterComparison"] = curCustomizeFilterComparison.join(",");
        params["customMergeFilterField"] = curCustomMergeFilterField.join(",");
      }
    },
    transport: {
      read: {
        url: `/ssrc/v2/${localStorage.getItem("organizationId")}/rfx/list/all`,
        method: "get",
      },
    },
  };
}

export {
  allDS,
};
