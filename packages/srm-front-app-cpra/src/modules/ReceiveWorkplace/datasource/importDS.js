import { $T, SrmUtil } from "srm-mobile-ui";

function importDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    // editable: true,
    // editFlag: true,
    fields: [
      {
        fieldCode: "importTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.common.model.common.importTypeMeaning").$D("导入类型"),
      },
      {
        fieldCode: "importStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.common.model.common.importStatus").$D("导入状态"),
      },
      {
        fieldCode: "importMessage",
        fieldType: "TEXT",
        fieldName: $T("sinv.common.model.common.exectMessage").$D("导入消息"),
      },
      {
        fieldCode: "lastUpdateDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.common.model.common.lastUpdateDates").$D("操作日期"),
        editor:false,
      },
      {
        fieldCode: "lastUpdatedName",
        fieldType: "TEXT",
        fieldName: $T("sinv.common.model.common.lastUpdatedName").$D("操作人"),
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/rcv-change-records/{rcvTrxHeaderId}/{rcvTrxLineId}`,
        method: "get",
      },
    },
    events: {
    }
  };
}

export { importDS };