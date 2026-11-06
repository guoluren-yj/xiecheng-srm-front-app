function supplyItemDetailConfirmDatasource() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      agencyUserId: 0,
      status: "WAIT_CONFIRM"//NEW_CREATE新建，WAIT_CONFIRM待确认，CONFIRMED已确认
    },
    fields: [
      {
        fieldName: "交付数量",
        fieldCode: "deliverQuantity",
        langCode: "smbl.common.model.deliverQuantity",
      },
      {
        fieldName: "交付金额",
        fieldCode: "deliverPrice",
        labelCode: "smbl.common.model.deliverPrice",
      },
      {
        fieldName: "农户",
        fieldCode: "peasantUserName",
        langCode: "smbl.common.model.peasant",
      },
      {
        fieldName: "商品",
        fieldCode: "itemName",
        langCode: "smbl.common.model.product",
      },
      {
        fieldName: "供货明细单号",
        fieldCode: "supplyDetailNum",
        langCode: "smbl.common.model.supplyDetailNum",
      },
      {
        fieldName: "提交时间",
        fieldCode: "creationDate",
        langCode: "smbl.common.model.creationDate",
      },
      {
        fieldName: "确认时间",
        fieldCode: "confirmTime",
        langCode: "smbl.common.model.confirmTime",
      }
    ],
    fastQueryField: {
      fieldCode: "rfxTitle",
      fieldType: "TEXT",
      langCode: "ssrc.queryRfq.model.queryRfq.inquiryTitle",
      fieldName: "询价单标题",
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "confirmTimeFrom",
        fieldType: "DATE_PICKER",
        langCode: "ssrc.common.submitTime",
        fieldName: "提交日期",
        selectType: "start-end",
        endDateFieldCode: "confirmTimeTo",
      },
      {
        fieldCode: "peasantUserName",
        fieldType: "TEXT",
        langCode: "smbl.common.model.peasant",
        fieldName: "农户",
      },
      {
        fieldCode: "poNum",
        fieldType: "TEXT",
        langCode: "sodr.writeOff.model.common.displayPoNum",
        fieldName: "订单号",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/sanjiang-supply-details/agency/list`,
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

export default supplyItemDetailConfirmDatasource;
