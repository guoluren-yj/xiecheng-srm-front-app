import { $T } from "srm-mobile-ui";
function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    editable:false,
    pageSize: 10,
    data: [],
    fields: [],
    queryParameter: {
    },
    fastQueryField: {
      fieldCode: "bidNum",
      fieldType:"TEXT",
      fieldName: $T("hipspfm.bidHall.view.message.BidNum").$D("招标编号")
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "bidCreateStartDate",
        endDateFieldCode: "bidCreateEndDate",
        fieldType: "DATE_PICKER",
        selectType: "start-end",
        fieldName: $T("ssrc.bidHall.model.bidHall.creationDate").$D("创建日期"),
      },
      {
        fieldCode: "bidStatusSet",
        fieldType: "SELECT",
        fieldName: $T("ssrc.bidHall.model.supplierQuotation.bidStatus").$D("状态"),
        lovCode: "SSRC.BID_STATUS",
        defaultValue: {
          value: "OPEN_BID_PENDING",
          meaning: $T("hipspfm.bidHall.view.message.toBeOpened").$D("待开标")
        }
      },
      {
        fieldCode: "quotationType",
        fieldType: "SELECT",
        fieldName: $T("ssrc.bidHall.model.bidHall.sourceMethod").$D("寻源方式"),
        lovCode: "SSRC.SOURCE_METHOD",
      },
      {
        fieldCode: "userName",
        fieldType: "TEXT",
        fieldName: $T("ssrc.bidHall.model.bidHall.bidderPeople").$D("招标员"),
      },
    ],
    transport: {
      read: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/bid/list?customizeUnitCode=SSRC.BID_HALL.LIST`,
        method: "get",
      },
    },
  };
}

export default indexDS;
