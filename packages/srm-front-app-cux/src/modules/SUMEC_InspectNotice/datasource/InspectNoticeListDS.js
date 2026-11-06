function srmListExampleDS() {
  return {
    showTotalCount: true,
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    // table表单显示的字段
    // headerField: {
    //     fieldName: '验货通知单编号',
    //     fieldCode: "qqcNum",
    //     fieldType: 'TEXT',
    //     defaultValue: '',
    // },
    // headerRightField: {
    //     fieldName: '状态',
    //     fieldCode: "statusCodeMeaning",
    //     fieldType: 'TEXT',
    //     defaultValue: '',
    // },
    fields: [
      {
        fieldName: "验货通知单编号",
        fieldCode: "qqcNum",
        fieldType: "TEXT",
        langCode: "smbl.common.model.inspectionNoticeNo",
        defaultValue: "",
      },
      {
        fieldName: "状态",
        fieldCode: "statusCodeMeaning",
        fieldType: "TEXT",
        langCode: "smbl.common.message.status",
        defaultValue: "",
      },
      {
        fieldName: "当前节点",
        fieldCode: "currentNodeMeaning",
        fieldType: "TEXT",
        langCode: "hwfl.common.view.message.current.stage",
        defaultValue: "",
      },
      {
        fieldName: "数量",
        fieldCode: "quantity",
        fieldType: "TEXT",
        labelCode: "spuc.common.model.common.quantity",
      },
      {
        fieldName: "验货类型",
        fieldCode: "qqcTypeMeaning",
        langCode: "smbl.common.model.inspectionType",
      },
      {
        fieldName: "成品工厂",
        fieldCode: "productVendorName",
        langCode: "smbl.common.model.productFactory",
      },
      {
        fieldName: "面料工厂",
        fieldCode: "materialVendorName",
        langCode: "smbl.common.model.fabricFactory",
      },
      {
        fieldName: "QA工程师",
        fieldCode: "qaUserName",
        langCode: "smbl.common.model.QAengineer",
      },
      {
        fieldName: "业务员",
        fieldCode: "businessUserName",
        langCode: "smbl.common.model.salesman",
      },
      {
        fieldName: "销售订单号",
        fieldCode: "salePoNum",
        langCode: "spuc.scheduleReleases.model.scheduleReleases.salePoNumber",
      },
      {
        fieldName: "产品/面料描述",
        fieldCode: "reqDescription",
        langCode: "smbl.common.model.productFabricDesc",
      },
      {
        fieldName: "申请验货日期",
        fieldCode: "reqTime",
        langCode: "smbl.common.model.requestInspectionDate",
      }
    ],
    fastQueryField: {
      fieldCode: "qqcNum",
      fieldType: "TEXT",
      langCode: "smbl.common.message.NoOfInspectionNotice",
      fieldName: "验货通知单编号",
    },
    // 查询表单字段
    queryFields: [
      // {
      //     fieldCode: 'rfxDate',
      //     fieldType: 'DATE_PICKER',
      //     langCode: 'smbl.common.message.inspectionDate',
      //     fieldName: '申请验货日期',
      //     selectType: 'start-end',
      //     endDateFieldCode: 'endDate',
      // },
      {
        fieldCode: "qqcNum",
        fieldType: "TEXT",
        langCode: "smbl.common.message.NoOfInspectionNotice",
        fieldName: "验货通知单编号",
      },
      {
        fieldCode: "salePoNum",
        fieldType: "TEXT",
        langCode: "spuc.scheduleReleases.model.scheduleReleases.salePoNumber",
        fieldName: "销售订单号",
      },
      {
        fieldCode: "qqcType",
        fieldType: "SELECT",
        langCode: "smbl.common.message.inspectionType",
        fieldName: "验货类型",
        lovCode: "SCUX.SUMEC.QQC.TYPE",
        options: {
          queryParams: {
            tenantId: window.localStorage.organizationId,
          },
        }
      },
      {
        fieldCode: "currentNode",
        fieldType: "SELECT",
        langCode: "hwfl.common.view.message.current.stage",
        fieldName: "当前节点",
        lovCode: "SCUX.SUMEC.QQC.NODE",
        options: {
          queryParams: {
            tenantId: window.localStorage.organizationId,
          },
        }
      },
      {
        fieldCode: "businessUserName",
        fieldType: "TEXT",
        langCode: "smbl.common.model.salesman",
        fieldName: "业务员",
      },
      {
        fieldCode: "materialVendorName",
        fieldType: "TEXT",
        langCode: "smbl.common.model.fabricFactory",
        fieldName: "面料工厂",
      },
      {
        fieldCode: "productVendorName",
        fieldType: "TEXT",
        langCode: "smbl.common.model.productFactory",
        fieldName: "成品工厂",
      },
      // {
      //     fieldCode: 'rfxNum',
      //     fieldType: 'LOV',
      //     langCode: 'smbl.msgUrlMapping.model.mapping.tenantName',
      //     fieldName: '询价单号',
      //     lovCode: "HLOD.LOV.VIEW",
      //     options: {
      //         title: "选择单号",
      //         multiple: true,
      //         //displayField: "",
      //         subDisplayField: "tenantName",
      //         //valueField: "",
      //         queryField: "viewName",
      //         queryParams: {
      //             tenantId: 0,
      //         },
      //         callback: (val) => {
      //             console.log(val)
      //         },
      //     },
      // },
    ],
    transport: {
      read: {
        // url: `/ssrc/v1/${localStorage.getItem('organizationId')}/rfx/list`,
        url: `/scux/v1/${localStorage.getItem("organizationId")}/sumec-qqc-lines/qc-wait-submit`,
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
    buttons: [
      //'cancel',
      "delete",
      //'save',
      {
        text: "审批通过",
        fill: true,
        visible: (checkedList) => {
          return checkedList.length > 1;
        },
        disabled: (checkedList) => {
          return checkedList.length === 0;
        },
        callback: (checkedList) => {
          console.log(checkedList);
        },
      },
    ],
    setData(data) {
      this.data = data;
    },
    clear() {
      this.setData([]);
    },
  };
}

export default srmListExampleDS;
