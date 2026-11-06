import { $T } from "srm-mobile-ui";
function indexDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter: {
      customizeUnitCode: "SODR.CONFIRM_ORDER_LIST.GRID,SODR.CONFIRM_ORDER_LIST.FILTER",
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
        fieldName: $T("sodr.common.model.common.releasedDate").$D("发布日期"),
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("entity.customer.tag").$D("客户"),
        lovCode: "SPUC.PO_CUSTOMER",
      },
      {
        fieldCode: "statusCode",
        fieldType: "SELECT",
        fieldName: $T("entity.order.status").$D("订单状态"),
        lovCode: "SODR.PO_STATUS",
      },
    ],
    events: {
      // beforeQuery: (ds, params) => {
      //   if (params.releaseDateStart) {
      //     params.releaseDateStart += " 00:00:00";
      //   }
      //   if (params.releaseDateEnd) {
      //     params.releaseDateEnd += " 00:00:00";
      //   }
      // }
    },
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/po-header/confirm-list`,
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
