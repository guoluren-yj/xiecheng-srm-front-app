import { $T } from "srm-mobile-ui";
import { isNil } from "lodash";

function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    filterCustomizeCode: "SMBL.DELIVERY_BILL_QUERY.SEARCH",
    queryParameter: {
      customizeUnitCode: "SINV.PURCHASER_DELIVERY_LIST.GRID,SINV.PURCHASER_DELIVERY_LIST.FILTER",
    },
    fastQueryField: {
      fieldCode: "asnNum",
      fieldType: "TEXT",
      fieldName: $T("sinv.purchaseReception.view.message.asnNum").$D("送货单号"),
    },
    // 查询表单字段
    queryFields: [
      // {
      //   fieldCode: "expectedArriveDateFrom",
      //   endDateFieldCode: "expectedArriveDateTo",
      //   fieldType: "DATE_PICKER",
      //   selectType: "start-end",
      //   fieldName: $T("sinv.common.model.common.expectedArriveTime").$D("预计到货时间"),
      // },
      {
        fieldCode: "supplierCompany",
        fieldType: "LOV",
        fieldName: $T("entity.supplier.tag").$D("供应商"),
        lovCode: "SPRM.SUPPLIER",
        options: {
          multiple: true,
          subDisplayField: "supplierNum",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              let tempkeys = val.map((res) => res["tempKey"] ? res["tempKey"] : `${res["supplierCompanyId"]}s`);
              let supplierIds = val.map((res) => res["supplierId"] || null);
              let supplierCompanyIds = val.map((res) => res["supplierCompanyId"] || null);
              ds.addQueryParameter("tempkeys", tempkeys ? tempkeys.join(",") : null);
              if (supplierIds && supplierIds.length && supplierIds[0]) {
                ds.addQueryParameter("supplierIds", supplierIds ? supplierIds.join(",") : null);
                if (supplierCompanyIds && supplierCompanyIds.length && supplierCompanyIds[0]) {
                  ds.addQueryParameter("supplierCompanyIds", supplierCompanyIds ? supplierCompanyIds.join(",") : null);
                }
              } else if (supplierCompanyIds && supplierCompanyIds.length && supplierCompanyIds[0]) {
                ds.addQueryParameter("supplierCompanyIds", supplierCompanyIds ? supplierCompanyIds.join(",") : null);
              }
            }
          },
          onClear: (ds) => {
            ds.addQueryParameter("supplierCompanyIds", null);
            ds.addQueryParameter("supplierIds", null);
            ds.addQueryParameter("tempkeys", null);
          }
        }
      },
      {
        fieldCode: "asnStatus",
        fieldType: "SELECT",
        fieldName: $T("sinv.common.model.common.asnStatus").$D("送货单状态"),
        lovCode: "SINV.ASN_HEADERS_STATUS",
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-header/for-purchase`,
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
  };
}

export const storeInfoDs = (asnLineId) => ({
  autoQuery: true,
  selection: Infinity,
  pageSize: 10,
  editable: false,
  editFlag: false, //是否可编辑
  enableQuery: true,
  data: [],
  showTotalCount: false,
  queryParameter: {},
  fields: [],
  transport: {
    read: {
      url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-detail-list/${asnLineId}`,
      method: "get",
    },
  },
});

export const logisticInfoDS = () => ({
  autoQuery: true,
  selection: Infinity,
  pageSize: 10,
  editable: false,
  editFlag: false, //是否可编辑
  enableQuery: true,
  data: [],
  forceValidate:true,
  showTotalCount: false,
  // queryParameter: {},
  pathParameter: {
    // tenantId: SrmUtil.getTenantId(),
    asnHeaderId: null,
  },
  fields: [
    {
      fieldName: $T("sinv.common.model.common.logisticsCompany").$D("物流公司"),
      fieldCode: "logisticsCompany",
      displayField: "logisticsCompanyMeaning",
      fieldType: "LOV",
      lovCode: "SINV.ASN_SHIPPER_NAME",
      options: {
        queryParams: { lovCode:"SINV.ASN_SHIPPER_NAME" }
      },
    },
    {
      fieldCode: "logisticsStaff",
      fieldType: "INPUT",
      fieldName: $T("sinv.common.model.common.logisticsStaff").$D("配送人员"),
    },
    {
      fieldCode: "logisticsContactInfo",
      fieldType: "INPUT",
      fieldName: $T("sinv.common.model.common.logisticsContactInfo").$D("联系方式"),
    },
    {
      fieldCode: "logisticsCost",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("sinv.common.model.common.logisticsCost").$D("物流费用"),
    },
    {
      fieldCode: "expressNum",
      fieldType: "INPUT",
      fieldName: $T("sinv.common.model.common.expressNum").$D("快递单号"),
    },
    {
      fieldCode: "logisticsPhoneNum",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("sinv.common.model.common.logisticsPhoneNum").$D("收件人手机号"),
      required: (val, item) => item.logisticsCompany === "SF",
      validator: (val, record, field) => {
        const pattern = /^1(3|4|5|6|7|8|9)\d{9}$/;
        // const pattern = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/;
        field.errorMessage = $T("sinv.common.model.common.phoneErrMsg").$D("手机号格式不正确");
        if (!isNil(val)) {
          if (pattern.test(val)) {
            return true;
          }
        } else {
          return true;
        }
      },
    },
    {
      fieldCode: "internationalTelCode",
      fieldType: "SELECT",
      fieldName: $T("sinv.common.model.common.internationalTelCode").$D("区号"),
      lovCode: "HPFM.IDD",
      required: (val, item) => item.logisticsCompany === "SF",
    },
    {
      fieldCode: "logisticsReceiptStatus",
      fieldType: "SELECT",
      fieldName: $T("sinv.common.model.common.logisticsReceiptStatus").$D("物流签收状态"),
      lovCode: "SINV.ASN_LOGISTICS_STATUS",
    },
    {
      fieldCode: "carNumber",
      fieldType: "INPUT",
      fieldName: $T("sinv.common.model.common.carNumber").$D("车牌号"),
    },
  ],
  transport: {
    read: {
      url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-header/{asnHeaderId}`,
      method: "get",
    },
  },
});

export default indexDS;
