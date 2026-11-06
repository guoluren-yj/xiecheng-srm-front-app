let route = [
  {
    path: "/SummaryReceiptsList",
    name: "SummaryReceiptsList",
    meta: {
      appName: "质检单填写"
    },
    component: (resolve) => require([ "../views/SummaryReceiptsList" ], resolve),
  },
  {
    path: "/SummaryReceiptsDetail",
    name: "SummaryReceiptsDetail",
    meta: {
      appName: "不良项明细"
    },
    component: (resolve) => require([ "../views/SummaryReceiptsDetail" ], resolve),
  },
];

export default route;
