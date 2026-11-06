function confirmBasicPriceDataSource() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      rfxTitle: "",
      benchmarkStatus: "",
      finishedFlag: 1,
    },
    fields: [
      {
        fieldName: "标题",
        fieldCode: "rfxTitle",
        langCode: "hipspfm.order.model.line.title",
      },
      {
        fieldName: "招标状态",
        fieldCode: "rfxStatusMeaning",
        labelCode: "ssrc.inquiryHall.model.inquiryHall.inviteStatus",
      },
    ],
    fastQueryField: {
      fieldName: "询价单号",
      fieldCode: "rfxNum",
      fieldType: "TEXT",
      langCode: "ssrc.inquiryHall.model.inquiryHall.rfxNum",
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "rfxTitle",
        fieldType: "TEXT",
        langCode: "ssrc.inquiryHall.model.inquiryHall.rfxTitle",
        fieldName: "标题",
      },
      {
        fieldCode: "benchmarkStatus",
        fieldType: "SELECT",
        langCode: "ssrc.inquiryHall.model.inquiryHall.benchmarkStatus",
        fieldName: "基准价状态",
        lovCode: "SSRC.AUX.BENCHMARK_STATUS",
        options: {
          multiple: false,
        },
      },
      {
        fieldCode: "finishedFlag",
        fieldType: "SELECT",
        langCode: "ssrc.inquiryHall.model.inquiryHall.finishedFlag",
        fieldName: "过滤已完成状态",
        lovCode: "HPFM.FLAG",
        options: {
          multiple: false,
        },
        defaultValue: {
          value: "1",
          meaning: "是"
        }
      },
    ],
    transport: {
      read: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/benchmark/confirm/list`,
        method: "get",
      },
    }
  };
}

export {
  confirmBasicPriceDataSource,
};
