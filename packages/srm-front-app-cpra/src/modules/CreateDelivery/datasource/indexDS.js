import { $T, SrmUtil } from "srm-mobile-ui";
export const indexDS = () => ({
  autoQuery: true,
  selection: Infinity,
  pageSize: 10,
  editable: true,
  editFlag: false,
  enableQuery: true,
  data: [],
  fields: [],
  queryParameter: {
    customizeUnitCode: "SINV.DELIVERY_CREATION.LIST,SINV.DELIVERY_CREATION.FILTER",
  },
  fastQueryField: {
    fieldCode: "displayPoNum",
    fieldType: "TEXT",
    fieldName: $T("sodr.common.model.common.displayPoNum").$D("订单号"),
  },
  // 查询表单字段
  queryFields: [
    {
      fieldCode: "needByDateStart",
      endDateFieldCode: "needByDateEnd",
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      fieldName: $T("ssrc.bidHall.modal.inqueryHall.demandDate").$D("需求日期"),
    },
    {
      fieldCode: "companyId",
      fieldType: "LOV",
      fieldName: $T("sinv.common.model.common.customer").$D("客户"),
      lovCode: "SINV.ASN_CUSTOMER",
      options: {
        multiple: false,
        subDisplayField: "companyNum",
      }
    },
    {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("sinv.common.model.common.item").$D("物料"),
    },
    {
      fieldCode: "planFlag",
      fieldType: "SWITCH",
      fieldName: $T("sinv.common.model.common.planFlag").$D("按计划送货"),
    },
  ],
  transport: {
    read: {
      url: `/spuc/v1/${SrmUtil.getTenantId()}/po-location/purchaser/can-create-asn`,
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
});

// 维护
export const mainTainDS = () => ({
  autoQuery: true,
  selection: Infinity,
  pageSize: 10,
  editable: true,
  editFlag: false,
  enableQuery: true,
  data: [],
  fields: [],
  queryParameter: {
    supplierTenantId: localStorage.getItem("organizationId"),
    customizeUnitCode: "SINV.DELIVERY_CREATION.LIST_BY_MAINTAIN,SINV.DELIVERY_CREATION.FILTER_BY_MAINTAIN",
  },
  fastQueryField: {
    fieldCode: "displayPoNum",
    fieldType: "TEXT",
    fieldName: $T("sodr.common.model.common.displayPoNum").$D("订单号"),
  },
  // 查询表单字段
  queryFields: [
    {
      fieldCode: "creationDateFrom",
      endDateFieldCode: "creationDateTo",
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      fieldName: $T("sinv.common.model.common.creationDate").$D("创建日期"),
    },
    {
      fieldCode: "companyId",
      fieldType: "LOV",
      fieldName: $T("sinv.common.model.common.customer").$D("客户"),
      lovCode: "SINV.ASN_CUSTOMER",
      options: {
        multiple: false,
        subDisplayField: "companyNum",
      }
    },
  ],
  transport: {
    read: {
      url: `/spuc/v1/${SrmUtil.getTenantId()}/asn-header/for-supplier/maintain`,
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
      url: `/spuc/v1/${SrmUtil.getTenantId()}/asn-header`,
      method: "delete",
    },
  },
});

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
      url: `/spuc/v1/${SrmUtil.getTenantId()}/asn-detail-list/${asnLineId}`,
      method: "get",
    },
  },
});

export default indexDS;
