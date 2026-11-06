
import { SrmUtil, $T } from "srm-mobile-ui";
// import moment from 'moment';

// import { DEFAULT_DATE_FORMAT } from 'utils/constants';
// import intl from 'utils/intl';
// import { SRM_SSRC } from '_utils/config';

// // import { getQuantityAndUomCombine } from '@/utils/utils';

// import { getQuotationRangeLabel } from '../../utils/renders';
// import { getUpdateFlag } from '../../utils/updateFlag';

// 单据头基本信息
function headerDataSet() {
  return {
    autoQuery: false,
    editable: true,
    enableQuery: false,
    editFlag: true,
    selection: Infinity,
    forceValidate: true,
    fields:[
      {
        formRow: 0,
        fieldCode: "rfxTitle",
        fieldType: "EMPTY",
      },
      {
        fieldName: $T("ssrc.supplierQuotation.model.supQuot.companyName").$D("客户"),
        fieldCode: "companyName",
      },
      {
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.companyNameAttachmentBusTec").$D("客户商务/技术附件"),
        fieldCode: "companyNameUuid",
      },
      {
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.currency").$D("币种"),
        fieldCode: "currencyCode",
        fieldType: "LOV",
      },
      {
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.paymentTerms").$D("付款方式"),
        fieldCode: "paymentTypeId",
      },
      {
        fieldName: $T("ssrc.common.model.common.termsOfPayment").$D("付款条款"),
        fieldCode: "paymentTermId",
      },
      {
        fieldName: $T("ssrc.biddingHall.view.biddingMode").$D("竞价模式"),
        fieldCode: "biddingMode",
      },
      {
        fieldName: $T("ssrc.biddingHall.view.biddingTarget").$D("竞价对象"),
        fieldCode: "biddingTarget",
      },
      {
        fieldName: $T("ssrc.biddingHall.view.biddingStrategy").$D("出价策略"),
        fieldCode: "biddingStrategy",
      },
    ],
  };
}

function ruleDataSet() {
  return {
    autoQuery: false,
    paging: false,
    fields: [
      {
        fieldCode: "biddingTarget",
        fieldName: $T("ssrc.supplierQuotation.model.supQuot.companyName").$D("客户"),
      },
      {
        fieldCode: "biddingStrategy",
        fieldName: $T("ssrc.supplierQuotation.model.supQuot.companyName").$D("客户"),
      },
    ],
  };
}

// unit price list view table
function quotationLineDataSet() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    forceValidate: true,
    transport: {
      read: {
        url: "/ssrc/v1/{organizationId}/bidding/sup/line/cur/page",
        method: "post",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        const newdata = data.map((lineData) => {
          const {
            currentQuotationPrice,
            netPrice,
            currentQuotationSecPrice,
            netSecondaryPrice,
            currentLnTotalAmount,
            currentLnNetAmount,
            currentQuotationSecQuantity = null,
            taxRate = null,
          } = lineData || {};
          const temporaryData = {
            currentQuotationPrice,
            netPrice,
            currentQuotationSecPrice,
            netSecondaryPrice,
            currentLnTotalAmount,
            currentLnNetAmount,
          };

          return {
            ...lineData,
            temporaryData,
            previewCurrentQuotationPriceValue: currentQuotationPrice,
            previewNetPriceValue: netPrice,
            previewCurrentQuotationSecPriceValue: currentQuotationSecPrice,
            previewNetSecPriceValue: netSecondaryPrice,
            previewCurrentQuotationQuantityValue: currentQuotationSecQuantity,
            taxRate: taxRate === 0 ? "0" : taxRate,
          };
        });
        return newdata;
      },
    },
    // events: {
    //   update: ({ record, fieldCode }) => {
    //     const markUpdatedFlag = getUpdateFlag({ fieldCode });
    //     if (record && markUpdatedFlag) {
    //       record.set('updatedFlag', 1); // 行如果有变更，后端会依据此提交
    //     }
    //   },
    // },
  };
}

export {
  headerDataSet,
  ruleDataSet,
  quotationLineDataSet,
};
