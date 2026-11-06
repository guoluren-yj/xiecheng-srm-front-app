function packingMaterialsDatasource(asnHeaderId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    queryParameter: {
      asnHeaderId: "",
    },
    fields: [
      {
        fieldName: "名词",
        fieldCode: "itemName",
        fieldType: "TEXT",
        langCode: "smbl.common.model.noun",
        readonly: true,
      },
      {
        fieldName: "单位",
        fieldCode: "uomName",
        fieldType: "TEXT",
        labelCode: "smbl.common.mode.uomName",
        required: true,
      },
      {
        fieldName: "规格",
        fieldCode: "specifications",
        fieldType: "TEXT",
        labelCode: "smbl.common.mode.specifications",
        required: true,
      },
    ],
    fastQueryField: {},
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/donlim-asn-items/list/${ asnHeaderId }`,
        method: "get",
      },
      destroy: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/donlim-asn-items/delete`,
        method: "post",
      },
    },
    events: {
    },
  };
}

export default packingMaterialsDatasource;