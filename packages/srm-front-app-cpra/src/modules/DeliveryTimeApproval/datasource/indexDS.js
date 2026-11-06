import { $T } from "srm-mobile-ui";
function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter: {
      customizeUnitCode: "SODR.DELIVERY_DATE_REVIEW.GRID,SODR.DELIVERY_DATE_REVIEW.FILTER",
    },
    fastQueryField: {
      fieldCode: "displayPoNum",
      fieldType: "TEXT",
      fieldName: $T("hipspfm.common.model.poNum").$D("订单号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "feedbackDateStart",
        endDateFieldCode: "feedbackDateEnd",
        fieldType: "DATE",
        selectType: "start-end",
        fieldName: $T("sodr.deliveryDateReview.model.common.feedbackTime").$D("交期反馈时间"),
      },
      {
        fieldCode: "supplierCompanyId",
        fieldType: "LOV",
        fieldName: $T("sodr.deliveryDateReview.model.common.supplierId").$D("供应商"),
        lovCode: "SPRM.SUPPLIER",
        options: {
          multiple: false,
          displayField: "supplierCompanyName", //展示描述
          subDisplayField: "supplierCompanyNum", //展示编码
          valueField: "supplierCompanyId", //查询主键
        },
      },
      {
        fieldCode: "agentId",
        fieldType: "LOV",
        fieldName: $T("sodr.deliveryDateReview.model.deliveryDateReview.agentName").$D("采购员"),
        lovCode: "SPFM.USER_AUTH.PURCHASE_AGENT",
      },
    ],
    events: {
      // beforeQuery: (ds, params) => {
      //   if (params.feedbackDateStart) {
      //     params.feedbackDateStart += " 00:00:00";
      //   }
      //   if (params.feedbackDateEnd) {
      //     params.feedbackDateEnd += " 00:00:00";
      //   }
      // }
    },
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/po-header/delivery-query`,
        method: "get",
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

export default indexDS;
