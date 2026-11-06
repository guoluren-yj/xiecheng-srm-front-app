// eslint-disable-next-line no-unused-vars
function srmListExampleDS(vm) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    editFlag:true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    // table表单显示的字段
    fields: [
      {
        fieldCode:"poNum",
      },
      {
        fieldCode:"currentTaskId",
      },
      {
        fieldCode:"processInstanceId",
      },
      {
        fieldCode:"processName",
      },
      {
        fieldCode:"applicationTime",
      },
      {
        fieldName: "公司",
        fieldCode: "companyName",
        langCode: "scux.orderChange.model.companyName",
      },
      {
        fieldName: "供应商名称",
        fieldCode: "supplierName",
        langCode: "scux.orderChange.model.supplierName",
      },
      {
        fieldName: "申请人",
        fieldCode: "applicationUserName",
        langCode: "scux.orderChange.model.applicationUserName",
      },
      {
        fieldName: "订单类型",
        fieldCode: "poTypeDesc",
        langCode: "scux.orderChange.model.poTypeDesc",
      },
      {
        fieldName: "含税金额",
        fieldCode: "taxIncludeAmount",
        langCode: "scux.orderChange.model.taxIncludeAmount",
      },
      {
        fieldName: "不含税金额",
        fieldCode:"amount",
        langCode: "scux.orderChange.model.amount",
      },
      {
        fieldName: "币种",
        fieldCode: "currencyCode",
        langCode: "scux.orderChange.model.currencyCode",
      },
      {
        fieldName: "总数量",
        fieldCode: "quantityTotal",
        langCode: "scux.orderChange.model.quantityTotal",
      },
      {
        fieldName: "付款条件",
        fieldCode: "termsName",
        langCode: "scux.orderChange.model.termsName",
      },
      {
        fieldName: "月结账期（天）",
        fieldCode: "attributeVarchar10",
        langCode: "scux.orderChange.model.monthlyInvocingPeriod",
      },
      {
        fieldName: "付款方式",
        fieldCode: "attributeVarchar11Meaning",
        langCode: "scux.orderChange.model.paymentMethod",
      },
      {
        fieldName: "订单摘要",
        fieldCode: "remark",
        langCode: "scux.orderChange.model.orderSummary",
      },
      {
        fieldName:"内部附件",
        fieldCode:"purchaserInnerAttachmentUuid",
        langCode: "scux.orderChange.model.innnerAttachmentUuid",
      },
      {
        fieldName:"外部附件",
        fieldCode:"attachmentUuid",
        langCode: "scux.orderChange.model.outerAttachmentUuid",
      }
    ],
    fastQueryField: {
      fieldCode: "poNum",
      fieldType: "TEXT",
      langCode: "sinv.common.model.common.poNum",
      fieldName: "订单号",
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "poNum",
        fieldType: "TEXT",
        langCode: "sinv.common.model.common.orderNum",
        fieldName: "订单号",
      },
    ],
    transport: {
      read: {
        url:`/scux/v1/${localStorage.getItem("organizationId")}/hygy-change-apply/listTaskPage`,
        method: "get",
      },
    },
    buttons: [
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
