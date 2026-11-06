import { $T } from "srm-mobile-ui";
function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 20,
    editable: true,
    enableQuery: true,
    queryParameter: {
      displaySupplierName: null,
      supplierId: null,
      tempkey: null,
    },
    fastQueryField: {
      fieldCode: "displayPoNum",
      fieldType: "TEXT",
      fieldName: $T("hipspfm.common.model.poNum").$D("订单号"),
    },
    queryFields: [
      {
        fieldCode: "supplierCompanyId",
        fieldType: "LOV",
        fieldName: $T("hipspfm.common.message.supplier").$D("供应商"),
        lovCode: "SPRM.SUPPLIER",
        options: {
          multiple: false,
          subDisplayField: "supplierCompanyNum",
          displayField: "supplierCompanyName",
          valueField: "supplierCompanyId",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.dataSet.queryParameter["supplierId"] = val[0].supplierId || null;
              ds.current.dataSet.queryParameter["tempkey"] = val[0].tempKey || null;
              ds.current.dataSet.queryParameter["displaySupplierName"] = val[0].displaySupplierName || null;
            }
          },
        }
      },
      // {
      //   fieldCode: "itemCode",
      //   fieldType: "LOV",
      //   fieldName: $T("sodr.orderApproval.model.common.itemCode").$D("物料编码"),
      //   lovCode: "SODR.PO_ITEM",
      // },
      {
        fieldCode: "itemName",
        fieldName: $T("sodr.orderApproval.model.common.itemName").$D("物料名称"),
      },
      // {
      //   fieldCode: "invOrganizationIds",
      //   fieldType: "LOV",
      //   fieldName: $T("sodr.orderApproval.model.common.invOrganizationIds").$D("收货组织"),
      //   lovCode: "SPUC.SMDM.INV_ORG",
      //   options: {
      //     multiple: true,
      //   }
      // },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/weilong/po-location/approving`,
        method: "get",
      },
    },
    events: {
      beforeQuery(ds, params) {
        if (!params["supplierCompanyId"]) {
          params["displaySupplierName"] = null;
          params["supplierId"] = null;
          params["tempkey"] = null;
        }
      }
    }
  };
}

export default indexDS;
