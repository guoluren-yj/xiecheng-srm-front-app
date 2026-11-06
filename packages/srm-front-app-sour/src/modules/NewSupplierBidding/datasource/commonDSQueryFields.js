import { $T } from "srm-mobile-ui";

const commonDSQueryFields = () => {
  const queryFields = {
    RFX:[
      {
        fieldCode: "quotationStartDate",
        fieldType: "DATE",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
      },
      // {
      //   fieldCode: "rfxNum",
      //   fieldType: "TEXT",
      //   fieldName: $T("ssrc.queryRfq.model.queryRfq.RFXNum").$D("RFX单号"),
      // },
      {
        fieldCode: "sourceMethod",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
        lovCode: "SSRC.SOURCE_METHOD",
        options: {
          multiple: false,
        }
      },
      // {
      //   fieldCode: "sourceCategory",
      //   fieldType: "SELECT",
      //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
      //   lovCode: "SSRC.SOURCE_CATEGORY",
      //   options: {
      //     multiple: false,
      //   }
      // },
      // {
      //   fieldCode: "quotationType",
      //   fieldType: "SELECT",
      //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationTypeMeaning").$D("报价方式"),
      //   lovCode: "SSRC.QUOTATION_TYPE",
      //   options: {
      //     multiple: false,
      //   }
      // },
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
    ],
    BID:[
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
        fieldCode: "companyId",
        fieldType: "SELECT",
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.companyName").$D("客户"),
        lovCode: "HPFM.RF_PURCHASE_COMPANY",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "displayQuotationStatus",
        fieldType: "SELECT",
        fieldName: $T("ssrc.queryRfq.model.queryRfq.status").$D("状态"),
        lovCode: "SSRC.NEW_BID_DISPLAY_QUOTATION_STATUS",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "quotationStartDate",
        fieldType: "DATE",
        fieldName: $T("ssrc.bidHall.model.bidHall.quotationStartTime").$D("投标开始时间"),
      },
      {
        fieldName: $T("ssrc.biddingOpen.model.quotationEndDate").$D(
          "投标截止时间"
        ),
        fieldType: "DATE",
        fieldCode: "quotationEndDate",
      },
      // {
      //   fieldCode: "quotationType",
      //   fieldType: "SELECT",
      //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationTypeMeaning").$D("报价方式"),
      //   lovCode: "SSRC.QUOTATION_TYPE",
      //   options: {
      //     multiple: false,
      //   }
      // },
      {
        fieldCode: "realName",
        fieldType: "TEXT",
        fieldName: $T("ssrc.queryRfq.model.queryRfq.creater").$D("创建人"),
      },
    ]
  };

  return queryFields;
};

export {
  commonDSQueryFields,
};
