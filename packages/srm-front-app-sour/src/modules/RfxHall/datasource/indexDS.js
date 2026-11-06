import { $T } from "srm-mobile-ui";
function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    fields: [
      {
        fieldName: $T("ssrc.queryRfq.model.queryRfq.inquiryTitle").$D("询价单标题"),
        fieldCode: "rfxTitle",
        fieldType: "TEXT",
        defaultValue: "",
      },
      {
        fieldName: $T("ssrc.queryRfq.model.queryRfq.company").$D("公司"),
        fieldCode: "companyName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.startTime").$D("开始时间"),
        fieldCode: "quotationStartDate",
      },
      {
        fieldName: $T("ssrc.queryRfq.model.queryRfq.quotationDeadline").$D("报价截止时间"),
        fieldCode: "quotationEndDate",
      },
      {
        fieldName: $T("ssrc.queryRfq.model.queryRfq.creater").$D("创建人"),
        fieldCode: "createByName",
      },
    ],
    fastQueryField: {
      fieldCode: "rfxTitle",
      fieldType: "TEXT",
      fieldName: $T("ssrc.queryRfq.model.queryRfq.inquiryTitle").$D("询价单标题"),
    },
    // 查询表单字段
    queryFields: [
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
          multiple: true,
        }
      },
      {
        fieldCode: "purOrganizationId",
        fieldType: "LOV",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
        lovCode: "SODR.PURCHASE_ORGANIZATION",
        options: {
          multiple: true,
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
    transport: {
      read: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/list`,
        method: "get",
      },
    },
  };
}

export {
  indexDS,
};
