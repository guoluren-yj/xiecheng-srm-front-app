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
    //     fieldName: '装箱/装柜任务编号',
    //     fieldCode: "encasementNumber",
    //     fieldType: 'TEXT',
    //     defaultValue: '',
    // },
    // headerRightField: {
    //     fieldName: '状态',
    //     fieldCode: "encasementHeaderStatusMeaning",
    //     fieldType: 'TEXT',
    //     defaultValue: '',
    // },
    fields: [
      {
        fieldName: "装箱/装柜任务编号",
        fieldCode: "encasementNumber",
        langCode: "smbl.common.model.encasementNumber",
        fieldType: "TEXT",
        defaultValue: "",
      },
      {
        fieldName: "状态",
        fieldCode: "encasementHeaderStatusMeaning",
        langCode: "smbl.common.message.status",
        fieldType: "TEXT",
        defaultValue: "",
      },
      {
        fieldName: "公司",
        fieldCode: "companyName",
        fieldType: "TEXT",
        langCode: "spuc.common.model.common.uniqlo.companyName",
        defaultValue: "",
      },
      {
        fieldName: "供应商",
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        labelCode: "spuc.common.model.common.supplier",
      },
      {
        fieldName: "集装箱号",
        fieldCode: "containerNumber",
        langCode: "smbl.common.model.containerNumber",
      },
      {
        fieldName: "船名",
        fieldCode: "vessel",
        langCode: "smbl.common.model.vessel",
      },
      {
        fieldName: "运编号",
        fieldCode: "invoiceNumber",
        langCode: "smbl.common.model.invoiceNumber",
      },
      {
        fieldName: "提单号",
        fieldCode: "billLadingNumber",
        langCode: "smbl.common.model.billLadingNumber",
      },
      {
        fieldName: "采购合同号",
        fieldCode: "contractNumber",
        langCode: "smbl.common.model.contractNumber",
      },
      {
        fieldName: "创建人",
        fieldCode: "createdByName",
        langCode: "smbl.common.model.createdByName",
      },
      {
        fieldName: "创建时间",
        fieldCode: "creationDate",
        langCode: "smbl.common.model.creationDate",
      }
    ],
    fastQueryField: {
      fieldCode: "encasementNumber",
      fieldType: "TEXT",
      langCode: "smbl.common.message.pleaseInputPackingTaskNumber",
      fieldName: "请输入装箱/装柜任务编号",
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "creationDateFrom",
        fieldType: "DATE_PICKER",
        langCode: "spuc.common.model.common.creationDate",
        fieldName: "创建日期",
        selectType: "start-end",
        endDateFieldCode: "creationDateTo",
      },
      {
        fieldCode: "encasementHeaderStatus",
        fieldType: "SELECT",
        langCode: "smbl.common.message.status",
        fieldName: "状态",
        lovCode: "SCUX_ENCASEMENT_STATUS",
        options: {
          queryParams: {
            tenantId: window.localStorage.organizationId,
          },
        }
      },
      {
        fieldCode: "vessel",
        fieldType: "TEXT",
        langCode: "smbl.common.model.vessel",
        fieldName: "船名",
      },
      {
        fieldCode: "billLadingNumber",
        fieldType: "TEXT",
        langCode: "smbl.common.model.billLadingNumber",
        fieldName: "提单号",
      },
      {
        fieldCode: "invoiceNumber",
        fieldType: "TEXT",
        langCode: "smbl.common.model.invoiceNumber",
        fieldName: "运编号",
      },
      {
        fieldCode: "containerNumber",
        fieldType: "TEXT",
        langCode: "smbl.common.model.containerNumber",
        fieldName: "集装箱号",
      },
      {
        fieldCode: "contractNumber",
        fieldType: "TEXT",
        langCode: "smbl.common.model.contractNumber",
        fieldName: "采购合同号",
      },
      {
        fieldCode: "createdByName",
        fieldType: "TEXT",
        langCode: "smbl.common.model.createdByName",
        fieldName: "创建人",
      },

      // {
      //     fieldCode: 'currentNode',
      //     fieldType: 'SELECT',
      //     langCode: 'hwfl.common.view.message.current.stage',
      //     fieldName: '当前节点',
      //     lovCode: "SCUX.SUMEC.QQC.NODE",
      //     options:{
      //         queryParams: {
      //             tenantId: window.localStorage.organizationId,
      //         },
      //     }
      // },
      // {
      //     fieldCode: 'businessUserName',
      //     fieldType: 'TEXT',
      //     langCode: 'smbl.common.model.salesman',
      //     fieldName: '业务员',
      // },
      // {
      //     fieldCode: 'materialVendorName',
      //     fieldType: 'TEXT',
      //     langCode: 'smbl.common.model.fabricFactory',
      //     fieldName: '面料工厂',
      // },
      // {
      //     fieldCode: 'productVendorName',
      //     fieldType: 'TEXT',
      //     langCode: 'smbl.common.model.productFactory',
      //     fieldName: '成品工厂',
      // },
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
        url: `/scux/v1/${localStorage.getItem("organizationId")}/cux/sumec/encasement-headers/confirm-summary`,
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
