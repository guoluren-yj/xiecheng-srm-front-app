import { $T, SrmUtil } from "srm-mobile-ui";
// 订单基础信息和采买组织信息共用Ds
function basicInfoDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      // {
      //   fieldCode: "purchaserInnerAttachmentUuid",
      //   fieldName: $T("sodr.workspace.model.common.attachmentUUID").$D(
      //     "采购方附件"
      //   )
      //   // type: "attachment",
      //   // fieldType: "UPLOAD"
      //   // bucketName: BUCKET_NAME,
      //   // directory: BUCKET_DIRECTORY,
      // },
      // {
      //   fieldCode: "attachmentUuid",
      //   fieldName: $T("sodr.workspace.model.common.attachmentUUID").$D(
      //     "采购方附件"
      //   )
      //   // fieldType: "UPLOAD"
      //   // bucketName: BUCKET_NAME,
      //   // directory: BUCKET_DIRECTORY,
      // },
      // {
      //   fieldCode: "supplierAttachmentUuid",
      //   fieldName: $T("sodr.workspace.model.common.supplierAttachmentId").$D(
      //     "供应商附件"
      //   )
      //   // fieldType: "UPLOAD"
      //   // bucketName: BUCKET_NAME,
      //   // directory: BUCKET_DIRECTORY,
      // }
    ],
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    transport: {
      read: {
        url: "spuc/v1/{tenantId}/po-header/{poHeaderId}/detail",
        method: "get"
      }
    }
  };
}

function lineDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      poHeaderId: null
    },
    transport: {
      read: {
        url: "spuc/v1/{tenantId}/po-line/{poHeaderId}/detail",
        method: "get"
      }
    }
  };
}

function editDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "neededDate",
        fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
        fieldType: "DATE"
      },
      {
        fieldCode: "organizationName",
        displayField: "invOrganizationName",
        fieldName: $T("sprm.common.model.common.invOrganizationName").$D(
          "库存组织"
        ),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.INVORG",
        options: {
          displayField: "organizationName",
          subDisplayField: "organizationCode",
          valueField: "organizationName",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
            enabledFlag: 1,
            ouId: null
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField(
                "invOrganizationName",
                val[0].organizationName
              );
              ds.current.setField("invOrganizationId", val[0].organizationId);
              ds.current.setField("invOrganizationIdLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("invOrganizationName", null);
            ds.current.setField("invOrganizationId", null);
            ds.current.setField("invOrganizationIdLov", null);
          }
        }
      },
      {
        fieldCode: "costId",
        fieldName: $T("sprm.common.model.common.costId").$D("成本中心"),
        fieldType: "LOV",
        lovCode: "SPRM.COST_CENTER",
        options: {
          displayField: "costName",
          subDisplayField: "costCode",
          valueField: "costName",
          queryParams: {
            ouId: null,
            companyId: null
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("costName", val[0].costName);
              ds.current.setField("costCode", val[0].costCode);
              ds.current.setField("costId", val[0].costId);
              ds.current.setField("costLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("costName", null);
            ds.current.setField("costCode", null);
            ds.current.setField("costId", null);
            ds.current.setField("costLov", null);
          }
        }
      },
      {
        fieldCode: "wbsCode",
        fieldName: $T("sprm.common.model.common.wbsLov").$D("WBS元素"),
        fieldType: "LOV",
        lovCode: "SMDM.WBS",
        options: {
          displayField: "wbsName",
          subDisplayField: "wbsCode",
          valueField: "wbsName",
          queryParams: {
            ouId: null,
            companyId: null
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("wbs", val[0].wbsName);
              ds.current.setField("wbsCode", val[0].wbsCode);
              ds.current.setField("wbsLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("wbs", null);
            ds.current.setField("wbsCode", null);
            ds.current.setField("wbsLov", null);
          }
        }
      },
      {
        fieldCode: "innerPoNum",
        fieldName: $T("sprm.common.model.common.innerPoNum").$D("内部订单号"),
        fieldType: "INPUT"
      }
    ],
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    transport: {
      destroy: {
        url: "sprm/v1/{tenantId}/purchase-requests",
        method: "delete"
      }
    }
  };
}

function executorDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    queryParameter: {
      customizeUnitCode: "SPRM.PURCHASE_REQUISITION_INQUIRY.LIST.EXECUTIONBILL",
      prLineId: null
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    transport: {
      read: {
        url: "sprm/v1/{tenantId}/pr-change-historys",
        method: "get"
      }
    }
  };
}

export { basicInfoDs, editDs, executorDs, lineDs };
