function packingMaterialsManageDatasource() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SINV.DELIVERY_CREATION.LIST_BY_MAINTAIN,SINV.DELIVERY_CREATION.FILTER_BY_MAINTAIN",
      supplierTenantId: "",
    },
    fields: [
      {
        fieldCode: "asnNum",
        fieldType: "TEXT",
        readonly: true,
      },
    ],
    fastQueryField: {
      fieldCode: "companyId",
      fieldType: "LOV",
      langCode: "smbl.common.view.queryCompanyName",
      fieldName: "公司名称",
      lovCode: "SINV.ASN_CUSTOMER",
      options: {
        title: "选择分公司",
        multiple: false,
        subDisplayField: "companyNum",
        queryParams: {
          tenantId: 0,
        },
        callback: () => {
        },
      },
    },
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-header/for-supplier/maintain`,
        method: "get",
      },
    },
    events: {
    },
  };
}

export default packingMaterialsManageDatasource;