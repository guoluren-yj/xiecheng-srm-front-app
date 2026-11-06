import { $T } from "srm-mobile-ui";

function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    queryParameter: {
      customizeUnitCode: "SSLM.EASY_SUPPLIER_WAREHOUSE.LIST,SSLM.EASY_SUPPLIER_WAREHOUSE.SEARCH_BAR",
      customizeOrderField: "creationDate:desc",
      // pageNum: 1,
      // pageSize: 10,
    },
    // bodyParameter: {
    //   pageNum: 1,
    //   pageSize: 10,
    // },
    fastQueryField: {
      fieldCode: "supplierName",
      fieldType: "TEXT",
      fieldName: $T("sslm.supplierWarehouse.model.warehouse.supplierName").$D("供应商名称"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "reqStatus",
        fieldType: "SELECT",
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.applyStatus").$D("申请状态"),
        lovCode: "SSLM.EXTERNAL_SUP_REQ_STATUS",
      },
      {
        fieldCode: "reqNumber",
        fieldType: "INPUT",
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.applyNum").$D("申请单号"),
      },
      {
        fieldCode: "reqTypeCode",
        fieldType: "SELECT",
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.reqTypeCode").$D("单据类型"),
        lovCode: "SSLM.EXTERNAL_SUP_REQ_TYPE",
      },
      {
        fieldCode: "creator",
        fieldType: "INPUT",
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.creator").$D("创建人"),
      },
      {
        fieldName: $T("sslm.supplierWarehouse.model.warehouse.creationTime").$D("创建时间"),
        fieldCode: "dateFrom",
        endDateFieldCode: "dateTo",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
      },
    ],
    fields: [
      // {
      //   fieldCode: "reqNumber",
      //   fieldType: "TEXT",
      //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.applyNum").$D("申请单号"),
      // },
      // {
      //   fieldCode: "supplierNum",
      //   fieldType: "TEXT",
      //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.supplierCode").$D("供应商编码"),
      // },
      // {
      //   fieldCode: "supplierName",
      //   fieldType: "TEXT",
      //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.supplierName").$D("供应商名称"),
      // },
      // {
      //   fieldCode: "reqTypeCode",
      //   fieldType: "TEXT",
      //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.reqTypeCode").$D("单据类型"),
      // },
      // {
      //   fieldCode: "reqTypeCodeMeaning",
      //   fieldType: "TEXT",
      //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.reqTypeCodeMeaning").$D("单据类型"),
      // },
      // {
      //   fieldCode: "creator",
      //   fieldType: "TEXT",
      //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.creator").$D("创建人"),
      // },
      // {
      //   fieldCode: "creationDate",
      //   fieldType: "TEXT",
      //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.creationTime").$D("创建时间"),
      // },
      // {
      //   fieldCode: "reqStatusMeaning",
      //   fieldType: "TEXT",
      //   fieldName: $T("sslm.supplierWarehouse.model.warehouse.applyStatus").$D("申请状态"),
      // },
    ],
    events: {
      // eslint-disable-next-line no-unused-vars
      beforeQuery: (ds, params, pathParams, bodyParameter) => {
        const { dateFrom, dateTo } = params;
        if (dateFrom && dateTo) {
          const creationDateRange = params.dateFrom + "," + params.dateTo;
          const customizeFilterComparison = "creationDate:~";
          params["creationDate_range"] = creationDateRange;
          params["customizeFilterComparison"] = customizeFilterComparison;
        } else {
          delete params.creationDate_range;
          delete params.customizeFilterComparison;
        }
        // if(params.creationDateFrom)
        // bodyParameter["areaCode"] = areaCode;
        // bodyParameter["capitalType"] = capitalType;
        // if (!bodyParameter["searchName"]) {
        //   bodyParameter["searchName"] = "undefined";
        // }
      }
    },
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem("organizationId")}/external-supplier-reqs`,
        method: "get",
      },
    },
  };
}

export default indexDS;
