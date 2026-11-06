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
    editable: false,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter: {
      confirmedFlag: ConfirmedFlag[type],
      customizeUnitCode: "SODR.ORDER_APPROVAL.LIST.GRID,SODR.ORDER_APPROVAL.LIST.LIST.HEADER_BY_REQUEST",
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
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("sodr.receivedOrder.model.receivedOrder.companyId").$D("客户"),
        lovCode: "SPUC.PO_CUSTOMER",
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
            { value: "PUBLISHED", meaning: $T("sodr.receivedOrder.view.message.orderTypes.published").$D("已发布"), orderSeq: 1 },
            { value: "PART_FEED_BACK", meaning: $T("sodr.receivedOrder.view.message.orderTypes.partFeedBack").$D("部分反馈"), orderSeq: 1 },
            { value: "DELIVERY_DATE_REVIEW", meaning: $T("sodr.sendOrder.model.common.orderFeedbackReview").$D("订单反馈审核中"), orderSeq: 2 },
            { value: "DELIVERY_DATE_REJECT", meaning: $T("sodr.sendOrder.model.common.orderFeedbackReviewReturn").$D("订单反馈审核退回"), orderSeq: 3 },
            { value: "CONFIRMED", meaning: $T("sodr.receivedOrder.view.message.orderTypes.confirmedFlag").$D("已确认"), orderSeq: 4 },
            { value: "PUBLISH_CANCEL", meaning: $T("sodr.receivedOrder.view.message.orderTypes.publishCancelFlag").$D("取消发布"), orderSeq: 5 },
            { value: "CANCELED", meaning: $T("sodr.receivedOrder.view.message.orderTypes.cancelledFlag").$D("已取消"), orderSeq: 6 },
            { value: "CANCELING", meaning: $T("sodr.receivedOrder.view.message.orderTypes.cancelingWfl").$D("取消审批中"), orderSeq: 7 },
            { value: "CLOSED", meaning: $T("sodr.receivedOrder.view.message.orderTypes.closedFlag").$D("已关闭"), orderSeq: 8 },
            { value: "CLOSE_WFL", meaning: $T("sodr.receivedOrder.view.message.orderTypes.closeWfl").$D("关闭审批中"), orderSeq: 9 },
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
            "PUBLISHED",
            "DELIVERY_DATE_REVIEW",
            "DELIVERY_DATE_REJECT",
            "CONFIRMED",
            "PUBLISH_CANCEL"
          ];
        } else {
          defaultOrderStatus = [
            "PUBLISHED",
            "DELIVERY_DATE_REVIEW",
            "DELIVERY_DATE_REJECT",
            "CONFIRMED",
            "PUBLISH_CANCEL",
            "CANCELED",
            "CLOSED"
          ];
        }
        statusCodes = params.selectStatusCode ? params.selectStatusCode : defaultOrderStatus;
        params.statusCodes = statusCodes.toString();
        delete params.selectStatusCode;
        delete params.checked;
        delete params.switchDisableFlag;
        // if (params.releaseDateStart) {
        //   params.releaseDateStart += " 00:00:00";
        // }
        // if (params.releaseDateEnd) {
        //   params.releaseDateEnd += " 00:00:00";
        // }
      }
    },
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/po-header/supplier?supplierTenantId=${localStorage.getItem("supplierTenantId")}`,
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
