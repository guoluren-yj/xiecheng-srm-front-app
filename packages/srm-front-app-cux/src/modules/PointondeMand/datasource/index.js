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
        fieldCode: "pointLocation",
        fieldName: $T("scux.PointondeMandList.model.pointLocation").$D("点位位置"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("scux.PointondeMandList.model.supplierName").$D("供应商"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "journalPositionStatusMeaning",
        fieldName: $T("scux.PointondeMandList.model.journalPositionStatusMeaning").$D("刊位状态"),
        fieldType: "TEXT",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "pointLocation",
        fieldType: "TEXT",
        fieldName: $T("scux.PointondeMandList.model.pointLocation").$D("点位位置"),
      },
    ],
    queryFields: [
      {
        fieldCode: "pointPositionStatus",
        fieldType: "SELECT",
        fieldName: $T("scux.PointondeMandList.model.pointPositionStatus").$D("点位状态"),
        lovCode: "SCUX.WLY_POINT_SUPPLY_STATUS",
      },
      {
        fieldCode: "journalPositionStatus",
        fieldType: "SELECT",
        fieldName: $T("scux.PointondeMandList.model.journalPositionStatus").$D("刊位状态"),
        lovCode: "SCUX.WLY_JOURNAL_SUPPLY_STATUS",
      },
      {
        fieldCode: "pointPositionNumber",
        fieldType: "INPUT",
        fieldName: $T("scux.PointondeMandList.model.pointPositionNumber").$D("点位单号"),
      },
      // {
      //   fieldCode: "companyName",
      //   fieldType: "INPUT",
      //   fieldName: $T("scux.PointondeMandList.model.companyName").$D("客户公司"),
      // },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/r1iaGjJ7oUbyicibf6aNKwvCIMlDM46AEzFgcGuwjMsDXU`,
        method: "post",
      },
    },
    events: {
      beforeQuery: (ds, param, pathParams, data) => {
        data.pointPositionStatus = param.pointPositionStatus;
        data.journalPositionStatus = param.journalPositionStatus;
        data.pointPositionNumber = param.pointPositionNumber;
        data.companyName = param.companyName;
        data.runningStatus = param.runningStatus;
        data.pointLocation = param.pointLocation;
        data.page = 0;
        data.size = 10;
      }
    }
  };
}
// 监播资料
function mointDataDs(datas) {
  return {
    autoQuery: false,
    selection: Infinity,
    editFlag: false,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    fields: [
      {
        fieldCode: "uploadUuid",
        fieldName: $T("scux.MonitData.model.uploadUuid").$D("附件"),
        fieldType: "UPLOAD",
      },
      {
        fieldCode: "uploadAddress",
        fieldName: $T("scux.MonitData.model.uploadAddresss").$D("定位"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attributeVarchar1Meaning",
        fieldName: $T("scux.MonitData.model.attributeVarchar1Meaning").$D("问题备注"),
        fieldType: "TEXT",
      }
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/5JGS51qE89x92icvibZ2uh8chfiaJ07lV4Kk1PGHLPOpDs`,
        method: "get",
        params: datas
      },
    },
  };
}

function headerDs(_this) {
  const {
    app: {
      _route: {
        query: { pointPositionId },
      },
    },
  } = _this.$router;
  return {
    autoQuery: true,
    enableQuery: true,
    editable: true,
    fields: [
      {
        fieldCode: "pointLocation",
        fieldName: $T("scux.PointondeMandDetails.model.pointLocation").$D("点位位置"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "resourceStyleMeaning",
        fieldName: $T("scux.PointondeMandDetails.model.resourceStyleMeaning").$D("资源类型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "adStyle",
        fieldName: $T("scux.PointondeMandDetails.model.adStyle").$D("广告形式"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "dimension",
        fieldName: $T("scux.PointondeMandDetails.model.dimension").$D("规格尺寸"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "brandMeaning",
        fieldName: $T("scux.PointondeMandDetails.model.brandMeaning").$D("品牌"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "provinceName",
        fieldName: $T("scux.PointondeMandDetails.model.provinceName").$D("省份"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "cityName",
        fieldName: $T("scux.PointondeMandDetails.model.cityName").$D("城市"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "publishFrequency",
        fieldName: $T("scux.PointondeMandDetails.model.publishFrequency").$D("发布频次"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "isLastMaterialMeaning",
        fieldName: $T("scux.PointondeMandDetails.model.isLastMaterialMeaning").$D("是否上传监播资料"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "monitorFrequencyMeaning",
        fieldName: $T("scux.PointondeMandDetails.model.monitorFrequencyMeaning").$D("监播频次"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "monitorValid",
        fieldName: $T("scux.PointondeMandDetails.model.monitorValid").$D("监播有效期"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "uploadUuid",
        fieldName: $T("scux.PointondeMandDetails.model.uploadUuid").$D("附件"),
        fieldType: "UPLOAD",
      },
      {
        fieldCode: "operatingrecord",
        fieldName: $T("scux.PointondeMandDetails.model.operatingrecord").$D("操作记录"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/SyeS84ZxrEWDLfVGDOLjbbiaKzlBiaVjvMuM55iane4reM`,
        method: "get",
        params: { pointPositionId },
      },
    },
  };
}
// 刊位信息
function lineDetailsDs(_this) {
  const {
    app: {
      _route: {
        query: { pointPositionId },
      },
    },
  } = _this.$router;
  return {
    autoQuery: true,
    enableQuery: false,
    pageSize: 10,
    bodyParameter: {
      "pointPositionId": pointPositionId,
      "supplierFlag": "1",
    },
    fields: [
      {
        fieldCode: "journalPositionVersion",
        fieldName: $T("scux.PointondeMandDetails.model.journalPositionVersion").$D("刊位版本"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "approvalRemarks",
        fieldName: $T("scux.PointondeMandDetails.model.approvalRemarks").$D("审批意见"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "readMe",
        fieldName: $T("scux.PointondeMandDetails.model.readmontMe").$D("刊位备注"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierRemarks",
        fieldName: $T("scux.PointondeMandDetails.model.supplierRemarks").$D("供应商备注"),
        fieldType: "INPUT",
      },
      {
        fieldCode: "monitorValid",
        fieldName: $T("scux.PointondeMandDetails.model.monitorValid").$D("监播有效期"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "monitdata",
        fieldName: $T("scux.PointondeMandDetails.model.monitdata").$D("监播资料"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "operatingdata",
        fieldName: $T("scux.PointondeMandDetails.model.operatingdata").$D("操作记录"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "createdByName",
        fieldName: $T("scux.PointondeMandDetails.model.createdByName").$D("创建人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.PointondeMandDetails.model.creationDate").$D("创建时间"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/5JGS51qE89x92icvibZ2uh8RWY5s7wXa30ucxNakuKiaicc`,
        method: "post",
      },
    },
  };
}

export { lineDs, headerDs, lineDetailsDs, mointDataDs };