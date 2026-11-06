import { $T } from "srm-mobile-ui";
import { SrmUtil } from "srm-mobile-ui";

function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter: {
      customizeUnitCode: "SSLM.SUPPLIER_LIFE_CYCLE.SUMMARY_TABLE,SSLM.SUPPLIER_LIFE_CYCLE.SUMMARY_FORM",
    },
    bodyParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    fastQueryField: {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("hipspfm.common.message.supplier").$D("供应商"),
    },
    filterCustomizeCode:"SMBL.SUPPLIER_LIFE_CYCLE.LIST.FILTRE",
    // 查询表单字段
    queryFields: [
      // {
      //   fieldCode: "erpCreationDateStart",
      //   endDateFieldCode: "erpCreationDateEnd",
      //   fieldType: "DATE",
      //   selectType: "start-end",
      //   langCode: "hipspfm.common.message.createTime",
      //   fieldName: "创建日期",
      // },
      {
        fieldCode: "supplierCompanyNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.view.supplier.code").$D("供应商编码"),
      },
      {
        fieldCode: "supplierErpNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierManage.model.supplierManage.erpSupplierCode").$D("ERP供应商编码"),
      },
      {
        fieldName: $T("sslm.common.view.supplier.class").$D("供应商分类"),
        fieldCode: "categoryId",
        fieldType: "LOV",
        lovCode: "SSLM.SUPPLIER_CATEGORY",
        displayField: "categoryDescription",
        options: {
          multiple: false,
          queryField: "categoryCode", // 查询
          displayField: "categoryDescription", // 选择后展示值
          subDisplayField: "categoryCode",
          valueField: "categoryId",
        },
        required: false,
      },
      {
        fieldName: $T("sslm.common.view.company.name").$D("公司"),
        fieldCode: "companyId",
        fieldType: "LOV",
        displayField: "companyName",
        lovCode: "SPFM.USER_AUTHORITY_COMPANY",
        options: {
          multiple: false,
          queryField: "companyName", // 查询
          displayField: "companyName", // 选择后展示值
          subDisplayField: "companyNum",
          valueField: "companyId",
        },
        required: false,
      },
      {
        fieldCode: "specialSupplierFlag",
        fieldType: "SELECT",
        fieldName: $T("sslm.supplierManage.model.supplierManage.specialSupplier").$D("特准供应商"),
        options: {
          displayField: "meaning",
          valueField: "value",
          listData: [
            { value: "1", meaning: $T("smbl.common.view.yes").$D("是"), orderSeq: 1 },
            { value: "0", meaning: $T("smbl.common.view.no").$D("否"), orderSeq: 2 },
          ],
        }
      },
      {
        fieldCode: "erpFlag",
        fieldType: "SELECT",
        fieldName: $T("sslm.supplierManage.model.supplierManage.erpFlag").$D("ERP供应商"),
        options: {
          displayField: "meaning",
          valueField: "value",
          listData: [
            { value: "1", meaning: $T("smbl.common.view.yes").$D("是"), orderSeq: 1 },
            { value: "0", meaning: $T("smbl.common.view.no").$D("否"), orderSeq: 2 },
          ],
        }
      },
      {
        fieldCode: "blacklistFlag",
        fieldType: "SELECT",
        fieldName: $T("sslm.supplierManage.model.supplierManage.blacklistFlag").$D("黑名单供应商"),
        options: {
          displayField: "meaning",
          valueField: "value",
          listData: [
            { value: "1", meaning: $T("smbl.common.view.yes").$D("是"), orderSeq: 1 },
            { value: "0", meaning: $T("smbl.common.view.no").$D("否"), orderSeq: 2 },
          ],
        }
      },
    ],
    events: {
      beforeQuery: (ds, params, pathParam, bodyParameter) => {
        Object.keys(params).forEach((key) => {
          bodyParameter[key] = params[key];
        });
      }
    },
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/supplier-pool`,
        method: "post",
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

// export const storeInfoDs = (asnLineId) => {
//   return {
//     autoQuery: true,
//     selection: Infinity,
//     pageSize: 10,
//     editable: false,
//     editFlag: false, //是否可编辑
//     enableQuery: true,
//     data: [],
//     showTotalCount: false,
//     queryParameter: {},
//     fields: [],
//     transport: {
//       read: {
//         url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-detail-list/${asnLineId}`,
//         method: "get",
//       },
//     },
//   };
// };

export default indexDS;
