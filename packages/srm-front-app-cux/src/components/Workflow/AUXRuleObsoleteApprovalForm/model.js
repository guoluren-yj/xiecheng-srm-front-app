function indexDatasource(rfxLineItemId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false, //是否可编辑
    enableQuery: true,
    data: [],
    showTotalCount: false,
    queryParameter: {},
    fields: [
      {
        fieldName: "名称",
        fieldType: "EMPTY",
        fieldCode: "itemName",
        langCode: "smbl.common.model.name",
        formRow: 10,
      }, {
        fieldName: "数量",
        fieldType: "TEXT",
        fieldCode: "validQuotationQuantity",
        langCode: "scux.ruleElimination.model.validQuotationQuantity",
        formRow: 20,
      }, {
        fieldName: "报价(元)",
        fieldType: "TEXT",
        fieldCode: "validQuotationPrice",
        langCode: "scux.ruleElimination.model.validQuotationPrice",
        formRow: 20,
      }
    ],
    transport: {
      read: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/aux/rfx/${rfxLineItemId}/quotation/detail`,
        method: "get",
      },
    },

  };
}

export default indexDatasource;
