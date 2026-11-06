import { $T } from "srm-mobile-ui";

export const ConfirmedFlag = {
  ALL: "",
  TO_BE_CONFIRMED: "0",
  CONFIRMED:"1"
};

function indexDS(vm, type) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter: {
      confirmedFlag: ConfirmedFlag[type],
      customizeUnitCode: "SODR.SEND_ORDER_LIST.FILTER_LINE,SODR.SEND_ORDER_LIST.GRID_BY_LINE",
    },
    fastQueryField: {
      fieldCode: "displayPoNum",
      fieldType: "TEXT",
      fieldName: $T("hipspfm.common.model.poNum").$D("订单号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "releaseDateStart",
        endDateFieldCode: "releaseDateEnd",
        fieldType: "DATE",
        selectType: "start-end",
        fieldName: $T("sodr.receivedOrder.model.receivedOrder.releaseDate").$D("发布日期"),
      },
      {
        fieldCode: "supplierCompanyIds",
        fieldType: "LOV",
        fieldName: $T("sodr.sendOrder.model.sendOrder.supplierId").$D("供应商"),
        lovCode: "SODR.AUTH_SUPPLIER",
        options: {
          multiple: false,
          queryField: "supplierCompanyName", // 查询
          displayField: "supplierCompanyName", // 主键
          subDisplayField: "supplierCompanyNum",
          valueField: "supplierCompanyId",
        },
      },
      {
        fieldCode: "selectStatusCode",
        fieldType: "SELECT",
        fieldName: $T("sodr.receivedOrder.model.receivedOrder.statusCode").$D("订单状态"),
        options: {
          displayField: "meaning",
          subDisplayField: "value",
          valueField: "value",
          listData: [
            { value: "PENDING", meaning: $T("hipspfm.common.button.create").$D("新建"), orderSeq: 1 },
            { value: "SUBMITTED", meaning: $T("sodr.sendOrder.model.common.submitted").$D("已提交"), orderSeq: 2 },
            { value: "APPROVED", meaning: $T("sodr.sendOrder.model.common.approved").$D("审批通过"), orderSeq: 3 },
            { value: "REJECTED", meaning: $T("sodr.sendOrder.model.common.ApprovalRefused").$D("审批拒绝"), orderSeq: 4 },
            { value: "PUBLISHED", meaning: $T("sodr.sendOrder.model.common.published").$D("已发布"), orderSeq: 5 },
            { value: "CONFIRMED", meaning: $T("sodr.sendOrder.model.common.confirmed").$D("已确认"), orderSeq: 6 },
            { value: "DELIVERY_DATE_REVIEW", meaning: $T("sodr.sendOrder.model.common.orderFeedbackReview").$D("订单反馈审核"), orderSeq: 7 },
            { value: "DELIVERY_DATE_REJECT", meaning: $T("sodr.sendOrder.model.common.orderFeedbackReviewReturn").$D("订单反馈审核退回"), orderSeq: 8 },
            { value: "PUBLISH_CANCEL", meaning: $T("sodr.sendOrder.model.common.cancelPublish").$D("取消发布"), orderSeq: 9 },
            { value: "CANCELED", meaning: $T("sodr.sendOrder.model.common.cancelled").$D("已取消"), orderSeq: 10 },
            { value: "CLOSED", meaning: $T("sodr.sendOrder.model.common.closed").$D("已关闭"), orderSeq: 11 },
          ],
          callback:(val) => {
            // vm.dataSet.addQueryParameter("checked", 0);
            if (val) {
              switch (type) {
              case "TO_BE_CONFIRMED":
                vm.dataSet1.setQueryParameter({
                  checked: false,
                  switchDisableFlag:true
                });
                break;
              case "CONFIRMED":
                vm.dataSet2.setQueryParameter({
                  checked: false,
                  switchDisableFlag:true
                });
                break;
              default:
                vm.dataSet0.setQueryParameter({
                  checked: false,
                  switchDisableFlag:true
                });
                break;
              }
            } else {
              switch (type) {
              case "TO_BE_CONFIRMED":
                vm.dataSet1.setQueryParameter({
                  checked: true,
                  switchDisableFlag:false
                });
                break;
              case "CONFIRMED":
                vm.dataSet2.setQueryParameter({
                  checked: true,
                  switchDisableFlag:false
                });
                break;
              default:
                vm.dataSet0.setQueryParameter({
                  checked: true,
                  switchDisableFlag:false
                });
                break;
              }
            }
          },
          onClear:() => {
            switch (type) {
            case "TO_BE_CONFIRMED":
              vm.dataSet1.setQueryParameter({
                checked: true,
                switchDisableFlag:false
              });
              break;
            case "CONFIRMED":
              vm.dataSet2.setQueryParameter({
                checked: true,
                switchDisableFlag:false
              });
              break;
            default:
              vm.dataSet0.setQueryParameter({
                checked: true,
                switchDisableFlag:false
              });
              break;
            }
          }
        },
      },
      {
        fieldName: $T("hipspfm.common.view.tab.onlySearchUnorderedOrder").$D("仅查询未结订单"),
        fieldCode: "checked",
        fieldType: "SWITCH",
        defaultValue:true,
        disabled: () => {
          switch (type) {
          case "TO_BE_CONFIRMED":
            if (typeof vm.dataSet1.queryParameter.switchDisableFlag !== "undefined" && vm.dataSet1.queryParameter.switchDisableFlag === true) {
              return true;
            }
            return false;
          case "CONFIRMED":
            if (typeof vm.dataSet2.queryParameter.switchDisableFlag !== "undefined" && vm.dataSet2.queryParameter.switchDisableFlag === true) {
              return true;
            }
            return false;
          default:
            if (typeof vm.dataSet0.queryParameter.switchDisableFlag !== "undefined" && vm.dataSet0.queryParameter.switchDisableFlag === true) {
              return true;
            }
            return false;
          }
          // return false;
        },
      },
    ],
    events: {
      beforeQuery: (ds, params) => {
        let statusCodes = [];
        let defaultOrderStatus;
        if (params.checked) {
          defaultOrderStatus = [
            "PENDING",
            "SUBMITTED",
            "APPROVED",
            "REJECTED",
            "PUBLISHED",
            "DELIVERY_DATE_REVIEW",
            "DELIVERY_DATE_REJECT",
            "CONFIRMED",
            "PUBLISH_CANCE"
          ];
        } else {
          defaultOrderStatus = [];
        }
        statusCodes = params.selectStatusCode ? params.selectStatusCode : defaultOrderStatus;
        params.statusCodes = statusCodes.toString();
        delete params.selectStatusCode;
        delete params.checked;
        delete params.switchDisableFlag;
      }
    },
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/po-header/purchaser`,
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
      submit: {
        url: `spuc/v1/${localStorage.getItem("organizationId")}/po-extended/po-header/batch-submit`,
        method: "post",
      },
      destroy: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "delete",
      },
    },
  };
}

export default indexDS;
