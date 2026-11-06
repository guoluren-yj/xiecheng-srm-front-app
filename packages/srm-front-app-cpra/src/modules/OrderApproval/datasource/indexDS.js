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
        fieldCode: "erpCreationDateStart",
        endDateFieldCode: "erpCreationDateEnd",
        fieldType: "DATE",
        selectType: "start-end",
        fieldName: $T("hipspfm.common.message.createTime").$D("创建时间"),
      },
      {
        fieldCode: "tempKey",
        fieldType: "LOV",
        fieldName: $T("hipspfm.common.message.supplier").$D("供应商"),
        lovCode: "SPRM.SUPPLIER",
      },
      {
        fieldCode: "agentId",
        fieldType: "LOV",
        fieldName: $T("sodr.orderApproval.model.common.agentName").$D("采购员"),
        lovCode: "SPFM.USER_AUTH.PURCHASE_AGENT",
      },
    ],
    events: {
      // beforeQuery: (ds, params) => {
      //   if (params.erpCreationDateStart) {
      //     params.erpCreationDateStart += " 00:00:00";
      //   }
      //   if (params.erpCreationDateEnd) {
      //     params.erpCreationDateEnd += " 00:00:00";
      //   }
      // }
    },
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/po-header/approving`,
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
