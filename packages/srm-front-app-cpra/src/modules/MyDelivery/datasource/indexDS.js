import { $T } from "srm-mobile-ui";
import { isNil } from "lodash";

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
      customizeUnitCode: "SINV.SUPPLIER_DELIVERY_LIST.QUERY,SINV.SUPPLIER_DELIVERY_LIST.GRID",
    },
    fastQueryField: {
      fieldCode: "asnNum",
      fieldType: "TEXT",
      fieldName: $T("sinv.purchaseReception.view.message.asnNum").$D("送货单号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "creationDateFrom",
        endDateFieldCode: "creationDateTo",
        fieldType: "DATE",
        selectType: "start-end",
        fieldName: $T("hipspfm.common.message.createTime").$D("创建时间"),
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("sinv.common.model.common.customer").$D("客户"),
        lovCode: "SINV.ASN_CUSTOMER",
        options: {
          subDisplayField: "companyNum",
        }
      },
      {
        fieldCode: "asnStatus",
        fieldType: "SELECT",
        fieldName: $T("sinv.common.model.common.asnStatus").$D("送货单状态"),
        lovCode: "SINV.ASN_HEADERS_STATUS",
      },
    ],
    events: {
      beforeQuery: (ds, params) => {
        if (params.creationDateFrom) {
          params.creationDateFrom += " 00:00:00";
        }
        if (params.creationDateTo) {
          params.creationDateTo += " 00:00:00";
        }
      }
    },
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-header/for-supplier`,
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
  autoQuery: false,
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
