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
        method: "get",
      },
    },
  };
}
// 点位查看 （采）
function purchaselineDs() {
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
        fieldName: $T("scux.PurChasePointondeMandList.model.pointLocation").$D("点位位置"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("scux.PurChasePointondeMandList.model.supplierName").$D("供应商"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "journalPositionStatusMeaning",
        fieldName: $T("scux.PurChasePointondeMandList.model.journalPositionStatusMeaning").$D("刊位状态"),
        fieldType: "TEXT",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "pointLocation",
        fieldType: "TEXT",
        fieldName: $T("scux.PurChasePointondeMandList.model.pointLocation").$D("点位位置"),
      },
    ],
    queryFields: [
      {
        fieldCode: "pointPositionStatus",
        fieldType: "SELECT",
        fieldName: $T("scux.PurChasePointondeMandList.model.pointPositionStatus").$D("点位状态"),
        lovCode: "SCUX.WLY_POINT_SUPPLY_STATUS",
      },
      {
        fieldCode: "journalPositionStatus",
        fieldType: "SELECT",
        fieldName: $T("scux.PurChasePointondeMandList.model.journalPositionStatus").$D("刊位状态"),
        lovCode: "SCUX.WLY_JOURNAL_SUPPLY_STATUS",
      },
      {
        fieldCode: "pointPositionNumber",
        fieldType: "INPUT",
        fieldName: $T("scux.PurChasePointondeMandList.model.pointPositionNumber").$D("点位单号"),
      },
      // {
      //   fieldCode: "companyName",
      //   fieldType: "INPUT",
      //   fieldName: $T("scux.PurChasePointondeMandList.model.companyName").$D("客户公司"),
      // },
      {
        fieldCode: "brand",
        fieldType: "SELECT",
        lovCode: "SYPP",
        fieldName: $T("scux.PurChasePointondeMandList.model.brand").$D("品牌"),
        options: {
          multiple: true,
        }
      },
      {
        fieldCode: "resourceStyle",
        fieldType: "SELECT",
        fieldName: $T("scux.PurChasePointondeMandList.model.resourceStyle").$D("资源类型"),
        lovCode: "ZYLX",
      },
      {
        fieldCode: "adStyle",
        fieldType: "INPUT",
        fieldName: $T("scux.PurChasePointondeMandList.model.adStyle").$D("广告形式"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/r1iaGjJ7oUbyicibf6aNKwvCEtEc4jXdQKcLu5j85WOQmc`,
        method: "post",
      },
    },
    events: {
      beforeQuery: (ds, param, pathParams, data) => {
        data.region = param.region;
        data.brand = param.brand && param.brand.split(",");
        data.resourceStyle = param.resourceStyle;
        data.adStyle = param.adStyle;
        data.monitorValidFrom = param.monitorValidFrom;
        data.monitorValidTo = param.monitorValidTo;
        data.creationDateFrom = param.creationDateFrom;
        data.creationDateTo = param.creationDateTo;
        data.runningStatus = param.runningStatus;
        data.pointLocation = param.pointLocation;
        data.city = param.city;
        data.province = param.province;
        data.journalPositionStatus = param.journalPositionStatus;
        data.pointPositionNumber = param.pointPositionNumber;
        data.companyName = param.companyName;
        data.pointPositionStatus = param.pointPositionStatus;
        data.page = 0;
        data.size = 10;
      }
    }
  };
}
// 广宣点位
function placeDs() {
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
        fieldCode: "totalPointAmount",
        fieldName: $T("scux.PurChaseMandPlaceList.model.totalPointAmount").$D("点位总数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "totalWinBidAmount",
        fieldName: $T("scux.PurChaseMandPlaceList.model.totalWinBidAmount").$D("点位中标总金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "totalActualExecutAmount",
        fieldName: $T("scux.PurChaseMandPlaceList.model.totalActualExecutAmount").$D("点位实际执行总金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "pointAmount",
        fieldName: $T("scux.PurChaseMandPlaceList.model.pointAmount").$D("点位数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "winBidAmount",
        fieldName: $T("scux.PurChaseMandPlaceList.model.winBidAmount").$D("点位中标金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "actualExecutAmount",
        fieldName: $T("scux.PurChaseMandPlaceList.model.actualExecutAmount").$D("点位实际执行金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "buttons",
        fieldName: $T("scux.PurChaseMandPlaceList.model.buttons").$D("操作"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "region",
        fieldName: $T("scux.PurChaseMandPlaceList.model.region").$D("大区"),
        fieldType: "TEXT",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "pointLocation",
        fieldType: "TEXT",
        fieldName: $T("scux.PurChaseMandPlaceList.model.pointLocation").$D("点位位置"),
      },
    ],
    queryFields: [
      {
        fieldCode: "region",
        fieldType: "SELECT",
        fieldName: $T("scux.PurChaseMandPlaceList.model.region").$D("大区"),
        options: {
          listData:[],
          displayField: "meaning",
          valueField: "value",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.dataSet.queryParameter["region"] = val[0].region || null;
            }
          },
        }
      },
      {
        fieldCode: "brand",
        fieldType: "SELECT",
        lovCode: "SYPP",
        fieldName: $T("scux.PurChaseMandPlaceList.model.brand").$D("品牌"),
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "resourceStyle",
        fieldType: "SELECT",
        fieldName: $T("scux.PurChaseMandPlaceList.model.resourceStyle").$D("资源类型"),
        lovCode: "ZYLX",
      },
      {
        fieldCode: "adStyle",
        fieldType: "TEXT",
        fieldName: $T("scux.PurChaseMandPlaceList.model.adStyle").$D("广告形式"),
      },
      {
        fieldName: $T("scux.PurChaseMandPlaceList.model.monitorValidFrom").$D("有效期从"),
        fieldCode: "monitorValidFrom",
        fieldType: "DATE",
      },
      {
        fieldName: $T("scux.PurChaseMandPlaceList.model.monitorValidTo").$D("有效期至"),
        fieldCode: "monitorValidTo",
        fieldType: "DATE",
      },
      {
        fieldName: $T("scux.PurChaseMandPlaceList.model.creationDateFrom").$D("创建日期从"),
        fieldCode: "creationDateFrom",
        fieldType: "DATE",
      },
      {
        fieldName: $T("scux.PurChaseMandPlaceList.model.creationDateTo").$D("创建日期至"),
        fieldCode: "creationDateTo",
        fieldType: "DATE",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/L9dsrzib74rhecwfqSn9Ty0RK7mXZP9lVwIp7rKqCsQE`,
        method: "post",
      },
    },
    events: {
      beforeQuery: (ds, param, pathParams, data) => {
        data.currPage = "region";
        data.region = param.region;
        data.brand = param.brand && param.brand.split(",");
        data.resourceStyle = param.resourceStyle;
        data.adStyle = param.adStyle;
        data.monitorValidFrom = param.monitorValidFrom;
        data.monitorValidTo = param.monitorValidTo;
        data.creationDateFrom = param.creationDateFrom;
        data.creationDateTo = param.creationDateTo;
        data.pointLocation = param.pointLocation;
        data.page = 0;
        data.size = 10;
      }
    }
  };
}
//省份
function proviceDs() {
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
        fieldCode: "pointAmount",
        fieldName: $T("scux.Province.model.pointAmount").$D("点位数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "winBidAmount",
        fieldName: $T("scux.Province.model.winBidAmount").$D("点位中标金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "actualExecutAmount",
        fieldName: $T("scux.Province.model.actualExecutAmount").$D("点位实际执行金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "buttons",
        fieldName: $T("scux.Province.model.buttons").$D("操作"),
        fieldType: "TEXT",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "pointLocation",
        fieldType: "TEXT",
        fieldName: $T("scux.Province.model.pointLocation").$D("点位位置"),
      },
    ],
    queryFields: [
      {
        fieldCode: "province",
        fieldType: "LOV",
        fieldName: $T("scux.Province.model.province").$D("省份"),
        lovCode: "SCUX.WLY.PROVINCE",
      },
      {
        fieldCode: "brand",
        fieldType: "SELECT",
        lovCode: "SYPP",
        fieldName: $T("scux.Province.model.brand").$D("品牌"),
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "resourceStyle",
        fieldType: "SELECT",
        fieldName: $T("scux.Province.model.resourceStyle").$D("资源类型"),
        lovCode: "ZYLX",
      },
      {
        fieldCode: "adStyle",
        fieldType: "TEXT",
        fieldName: $T("scux.Province.model.adStyle").$D("广告形式"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/L9dsrzib74rhecwfqSn9Ty0RK7mXZP9lVwIp7rKqCsQE`,
        method: "post",
      },
    },
    events: {
      beforeQuery: (ds, param, pathParams, data) => {
        data.region = param.region;
        data.province = param.province;
        data.brand = param.brand && param.brand.split(",");
        data.resourceStyle = param.resourceStyle;
        data.adStyle = param.adStyle;
        data.monitorValidFrom = param.monitorValidFrom;
        data.monitorValidTo = param.monitorValidTo;
        data.creationDateFrom = param.creationDateFrom;
        data.creationDateTo = param.creationDateTo;
        data.currPage = param.currPage;
        data.pointLocation = param.pointLocation;
        data.page = 0;
        data.size = 10;
      }
    }
  };
}
// 城市
function cityDs() {
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
        fieldCode: "pointAmount",
        fieldName: $T("scux.City.model.pointAmount").$D("点位数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "winBidAmount",
        fieldName: $T("scux.City.model.winBidAmount").$D("点位中标金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "actualExecutAmount",
        fieldName: $T("scux.City.model.actualExecutAmount").$D("点位实际执行金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "buttons",
        fieldName: $T("scux.City.model.buttons").$D("操作"),
        fieldType: "TEXT",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "pointLocation",
        fieldType: "TEXT",
        fieldName: $T("scux.City.model.pointLocation").$D("点位位置"),
      },
    ],
    queryFields: [
      {
        fieldCode: "city",
        fieldType: "LOV",
        fieldName: $T("scux.City.model.city").$D("城市"),
        lovCode: "SCUX.WLY.CITY",
      },
      {
        fieldCode: "brand",
        fieldType: "SELECT",
        lovCode: "SYPP",
        fieldName: $T("scux.City.model.brand").$D("品牌"),
        options: {
          multiple: true,
        },
      },
      {
        fieldCode: "resourceStyle",
        fieldType: "SELECT",
        fieldName: $T("scux.City.model.resourceStyle").$D("资源类型"),
        lovCode: "ZYLX",
      },
      {
        fieldCode: "adStyle",
        fieldType: "TEXT",
        fieldName: $T("scux.City.model.adStyle").$D("广告形式"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/L9dsrzib74rhecwfqSn9Ty0RK7mXZP9lVwIp7rKqCsQE`,
        method: "post",
      },
    },
    events: {
      beforeQuery: (ds, param, pathParams, data) => {
        data.region = param.region;
        data.brand = param.brand && param.brand.split(",");
        data.resourceStyle = param.resourceStyle;
        data.adStyle = param.adStyle;
        data.monitorValidFrom = param.monitorValidFrom;
        data.monitorValidTo = param.monitorValidTo;
        data.creationDateFrom = param.creationDateFrom;
        data.creationDateTo = param.creationDateTo;
        data.currPage = param.currPage;
        data.province = param.province;
        data.city = param.city;
        data.pointLocation = param.pointLocation;
        data.page = 0;
        data.size = 10;
      }
    }
  };
}
// 监播资料
function mointDataDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    editFlag: false,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    forceValidate: true,
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
        fieldCode: "attributeVarchar1",
        fieldName: $T("scux.MonitData.model.attributeVarchar1").$D("问题备注"),
        fieldType: "SELECT",
        lovCode: "WTBZ",
        required: true,
        options: {
          // displayField: 'meaning',
          // valueField: 'value',
          // callback: (a, b) => {
          //   console.log(a, b, "ab")
          // },
          multiple: true,
        }
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/5JGS51qE89x92icvibZ2uh8chfiaJ07lV4Kk1PGHLPOpDs`,
        method: "get",
        // params:{ journalPositionId:journalPositionIds}
      },
    },
  };
}
// 问题备注ds
function wtbzData() {
  return {
    autoQuery: false,
    enableQuery: true,
    editable: false,
    fields: [
      {
        fieldCode: "attributeVarchar1",
        fieldName: $T("scux.MonitData.model.attributeVarchar1").$D("问题备注"),
        fieldType: "SELECT",
        lovCode: "WTBZ",
        required: true,
        options: {
          // displayField: "attributeVarchar2",
          // valueField: "attributeVarchar1",
          // displayField: "attributeVarchar1Meaning",
          multiple: true,
        }
      },
    ],
    // transport: {
    //   read: {
    //     url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/5JGS51qE89x92icvibZ2uh8chfiaJ07lV4Kk1PGHLPOpDs`,
    //     method: "get",
    //     // params:{ journalPositionId:journalPositionIds}
    //   },
    // },
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
    enableQuery: true,
    editable: true,
    fields: [
      {
        fieldCode: "winBidNumber",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.winBidNumber").$D("中标行"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "pointLocation",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.pointLocation").$D("点位位置"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "companyName",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.companyName").$D("公司"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "resourceStyleMeaning",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.resourceStyleMeaning").$D("资源类型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "adStyle",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.adStyle").$D("广告形式"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "dimension",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.dimension").$D("规格尺寸"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "brandMeaning",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.brandMeaning").$D("品牌"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "regionName",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.regionName").$D("大区"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "provinceName",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.provinceName").$D("省份"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "cityName",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.cityName").$D("城市"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "winBidAmount",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.winBidAmount").$D("点位中标金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "actualExecuteAmount",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.actualExecuteAmount").$D("点位实际执行金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "publishFrequency",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.publishFrequency").$D("发布频次"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "isLastMaterialMeaning",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.isLastMaterialMeaning").$D("是否上传监播资料"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "monitorFrequencyMeaning",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.monitorFrequencyMeaning").$D("监播频次"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "monitorValid",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.monitorValid").$D("监播有效期"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "relatedContract",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.relatedContract").$D("关联合同"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "freeReplaceAmount",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.freeReplaceAmount").$D("免费换刊次数"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "readMe",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.readMe").$D("备注"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "uploadUuid",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.uploadUuid").$D("附件"),
        fieldType: "UPLOAD",
      },
      {
        fieldCode: "operatingrecord",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.operatingrecord").$D("操作记录"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "createdByName",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.createdByName").$D("创建人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.creationDate").$D("创建时间"),
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
// 广宣点位 头信息
function statisticsDs() {
  return {
    autoQuery: true,
    enableQuery: true,
    editable: true,
    fields: [
      {
        fieldCode: "years",
        fieldName: $T("scux.PurChaseMandPlaceList.model.years").$D("年份"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "pointAmount",
        fieldName: $T("scux.PurChaseMandPlaceList.model.pointAmount").$D("点位总数量"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "winBidAmount",
        fieldName: $T("scux.PurChaseMandPlaceList.model.winBidAmount").$D("点位中标总金额(万元)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "actualExecutAmount",
        fieldName: $T("scux.PurChaseMandPlaceList.model.actualExecutAmount").$D("点位实际执行总金额(万元)"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/L9dsrzib74rhecwfqSn9Ty0RK7mXZP9lVwIp7rKqCsQE`,
        method: "post",
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
    autoQuery: false,
    enableQuery: false,
    editable: false,
    pageSize: 10,
    forceValidate: true,
    bodyParameter: {
      "pointPositionId": pointPositionId,
      "supplierFlag": "1",
    },
    fields: [
      {
        fieldCode: "journalPositionVersion",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.journalPositionVersion").$D("刊位版本"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "approvalRemarks",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.approvalRemarks").$D("审批意见"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "readMe",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.readmontMe").$D("刊位备注"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierRemarks",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.supplierRemarks").$D("供应商备注"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "monitorValid",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.monitorValid").$D("监播有效期"),
        fieldType: "string",
      },
      {
        fieldCode: "monitdata",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.monitdata").$D("监播资料"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "operatingdata",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.operatingdata").$D("操作记录"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "createdByName",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.createdByName").$D("创建人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.PurChasePointondeMandDetails.model.creationDate").$D("创建时间"),
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

export { lineDs, headerDs, lineDetailsDs, mointDataDs, placeDs, statisticsDs, proviceDs, cityDs, purchaselineDs, wtbzData };