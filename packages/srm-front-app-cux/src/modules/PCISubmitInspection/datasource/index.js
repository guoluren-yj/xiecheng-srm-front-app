import { $T } from "srm-mobile-ui";

function lineDs() {
  return {
    autoQuery: true,
    selection: Infinity,
    editFlag: false,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    showTotalCount: true,
    fields: [
      {
        fieldCode: "supplierName",
        fieldName: $T("scux.pciQialityInspection.model.supplierName").$D("供应商"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "organizationName",
        fieldName: $T("scux.pciQialityInspection.model.organizationName").$D("业务实体"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.pciQialityInspection.model.creationDate").$D("创建日期"),
        fieldType: "TEXT",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "asnCheckNum",
        fieldType: "TEXT",
        fieldName: $T("scux.pciQialityInspection.model.asnCheckNum").$D("送检单号"),
      },
    ],
    queryFields: [
      {
        fieldCode: "fromDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("scux.pciQialityInspection.model.fromDate").$D("创建日期从"),
      },
      {
        fieldCode: "toDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("scux.pciQialityInspection.model.toDate").$D("创建日期至"),
        endDateFieldCode: "fromDate",
      },
      {
        fieldCode: "supplierName",
        fieldType: "INPUT",
        fieldName: $T("scux.pciQialityInspection.model.supplierName").$D("供应商"),
      },
      {
        fieldCode: "checkStatus",
        fieldType: "SELECT",
        fieldName: $T("scux.pciQialityInspection.model.checkStatus").$D("送检单状态"),
        lovCode: "SCUX.PCI.ASN_CHECK_STATUS",
        defaultValue: {
          value: "WAIT_CHECK",
          meaning: $T("scux.pciQialityInspection.model.checkStatusCheck").$D("待检测"),
        },
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/pci-asn-check-headers/list`,
        method: "get",
      },
    },
  };
}

function formDs(type) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    forceValidate:true,
    fields: [
      {
        fieldCode: "employeeNum",
        fieldName: $T("scux.pciQialityInspection.model.checkNameLov").$D("请分配质检员"),
        fieldType: "LOV",
        required: type === "distribution",
        lovCode: "SCUX.PCI.EMPLOYEE",
      },
      {
        fieldCode: "checkRemark",
        fieldName: $T("scux.pciQialityInspection.model.reasonRejectionTransfer").$D("请输入驳回/转交理由"),
        fieldType: "INPUT",
        required: type === "returnInspections",
      },
    ],
  };
}

function headerDs (_this) {
  const {
    app: {
      _route: {
        query: { asnCheckHeaderId },
      },
    },
  } = _this.$router;

  return {
    enableQuery: true,
    editable: true,
    fields: [
      {
        fieldCode: "supplierName",
        fieldName: $T("scux.pciQialityInspection.model.supplierName").$D("供应商"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "asnAddressTypeMeaning",
        fieldName: $T("scux.pciQialityInspection.model.asnAddressTypeMeaning").$D("送货地类型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "shipToLocationAddress",
        fieldName: $T("scux.pciQialityInspection.model.shipToLocationAddress").$D("收货地点"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "contactName1",
        fieldName: $T("scux.pciQialityInspection.model.contactName1").$D("联系人1"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "contactPhone1",
        fieldName: $T("scux.pciQialityInspection.model.contactPhone1").$D("联系方式1"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "contactName2",
        fieldName: $T("scux.pciQialityInspection.model.contactName2").$D("联系人2"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "contactPhone2",
        fieldName: $T("scux.pciQialityInspection.model.contactPhone2").$D("联系方式2"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "checkName",
        fieldName: $T("scux.pciQialityInspection.model.checkNameLov").$D("质检员"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "checkRemark",
        fieldName: $T("scux.pciQialityInspection.model.reasonRejectionTransfer").$D("请输入驳回/转交理由"),
        fieldType: "INPUT",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/pci-asn-check-headers/${asnCheckHeaderId}`,
        method: "get",
      },
    },
  };
}

function lineDetailsDs (_this) {
  const {
    app: {
      _route: {
        query: { asnCheckHeaderId },
      },
    },
  } = _this.$router;
  return {
    autoQuery: false,
    enableQuery: false,
    editable: false,
    pageSize: 10,
    forceValidate: true,
    fields: [
      {
        fieldCode: "itemCode",
        fieldName: $T("scux.pciQialityInspection.model.itemCode").$D("物料编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "neededDate",
        fieldName: $T("scux.pciQialityInspection.model.neededDate").$D("需求日期"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "shipQuantity",
        fieldName: $T("scux.pciQialityInspection.model.shipQuantity").$D("发货数量"),
        fieldType: "NUMBER",
      },
      {
        fieldCode: "uomName",
        fieldName: $T("scux.pciQialityInspection.model.uomName").$D("单位"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "productNum",
        fieldName: $T("scux.pciQialityInspection.model.productNum").$D("项目号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "productName",
        fieldName: $T("scux.pciQialityInspection.model.productName").$D("项目名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "checkResult",
        fieldName: $T("scux.pciQialityInspection.model.checkResult").$D("质检结果"),
        fieldType: "SELECT",
        displayField: "checkResultMeaning",
        lovCode: "SCUX.PCI.CHECK_RESULT",
        required: true,
      },
      {
        fieldCode: "checkLineRemark",
        fieldName: $T("scux.pciQialityInspection.model.checkLineRemark").$D("质检行备注"),
        fieldType: "INPUT",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/pci-asn-check-lines/${asnCheckHeaderId}/lines`,
        method: "get",
      },
    },
  };
}

export { lineDs, formDs, headerDs, lineDetailsDs };