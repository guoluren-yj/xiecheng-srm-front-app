import { $T } from "srm-mobile-ui";

const commonDSQueryFields = () => {
  const queryFields = {
    RFX:[
      {
        fieldCode: "sourceCategory",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
        lovCode: "SSRC.INQUIRY_SOURCE_CATEGORY",
        options: {
          multiple: false,
        },
        // defaultValue: {
        //   value: "RFQ",
        //   meaning: $T("ssrc.common.inquiryPrice").$D("询价"),
        // },
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
        fieldCode: "companyId",
        fieldType: "SELECT",
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.companyName").$D("客户"),
        lovCode: "HPFM.RF_PURCHASE_COMPANY",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "supplierCompanyId",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.company").$D("公司"),
        lovCode: "HPFM.RF_PURCHASE_COMPANY",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "realName",
        fieldType: "TEXT",
        fieldName: $T("ssrc.queryRfq.model.queryRfq.creater").$D("创建人"),
      },
      {
        fieldCode: "quotationStartDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
        timePicker: true,
        options: {
          callback(startDate, endDate, ds) {
            const currentFilterDS = ds.queryFilter;
            const currentQuery = currentFilterDS.mQuery || {};

            const { quotationEndDate, } = currentQuery;

            if (startDate && quotationEndDate && startDate >= quotationEndDate) {
              currentQuery.quotationStartDate = null;
            }
          },
        },
      },
      {
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
        fieldCode: "quotationEndDate",
        fieldType: "DATE_PICKER",
        timePicker: true,
        options: {
          callback(startDate, endDate, ds) {
            const currentFilterDS = ds.queryFilter;
            const currentQuery = currentFilterDS.mQuery || {};

            const { quotationStartDate, } = currentQuery;

            if (startDate && quotationStartDate && startDate <= quotationStartDate) {
              currentQuery.quotationEndDate = null;
            }
          },
        },
      },
    ],
    BID:[
      // {
      //   fieldCode: "sourceCategory",
      //   fieldType: "SELECT",
      //   fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("招标类别"),
      //   lovCode: "SSRC.SOURCE_CATEGORY",
      //   options: {
      //     multiple: false,
      //   }
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
        fieldCode: "supplierCompanyId",
        fieldType: "SELECT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.company").$D("公司"),
        lovCode: "HPFM.RF_PURCHASE_COMPANY",
        options: {
          multiple: false,
        }
      },
      {
        fieldCode: "quotationStartDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("ssrc.bidHall.model.bidHall.quotationStartTime").$D("投标开始时间"),
        timePicker: true,
        options: {
          callback(startDate, endDate, ds) {
            const currentFilterDS = ds.queryFilter;
            const currentQuery = currentFilterDS.mQuery || {};

            const { quotationEndDate, } = currentQuery;

            if (startDate && quotationEndDate && startDate >= quotationEndDate) {
              currentQuery.quotationStartDate = null;
            }
          },
        },
      },
      {
        fieldName: $T("ssrc.biddingOpen.model.quotationEndDate").$D("投标截止时间"),
        fieldType: "DATE_PICKER",
        fieldCode: "quotationEndDate",
        timePicker: true,
        options: {
          callback(startDate, endDate, ds) {
            const currentFilterDS = ds.queryFilter;
            const currentQuery = currentFilterDS.mQuery || {};

            const { quotationStartDate, } = currentQuery;

            if (startDate && quotationStartDate && startDate <= quotationStartDate) {
              currentQuery.quotationEndDate = null;
            }
          },
        },
      },
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
