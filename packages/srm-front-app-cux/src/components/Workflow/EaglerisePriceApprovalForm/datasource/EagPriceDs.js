function indexDs(modelPricingId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery:true,
    showTotalCount: true,
    queryParameter: {
      modelPricingId:modelPricingId
    },
    fastQueryField: {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      // eslint-disable-next-line rulesdir/check_js
      fieldName: "物料编码",
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        // eslint-disable-next-line rulesdir/check_js
        fieldName: "物料编码",
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        // eslint-disable-next-line rulesdir/check_js
        fieldName: "物料名称",
      },
      {
        fieldCode: "itemUpdateDateFrom",
        fieldType: "DATE",
        // eslint-disable-next-line rulesdir/check_js
        fieldName: "更新日期从",
      },
      {
        fieldCode: "itemUpdateDateTo",
        fieldType: "TEXT",
        // eslint-disable-next-line rulesdir/check_js
        fieldName: "更新日期至",
      },
    ],
    fields: [],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}//eaglerise-pricing-lines/${modelPricingId}/list`,
        method: "get",
      },
    },
  };
}

export default indexDs;
