let route = [
  // 永祥-资金计划汇总-表格详情
  {
    path: "/YXCapitalPlanSummaryDetailApproval",
    name: "YXCapitalPlanSummaryDetailApproval",
    meta: {
      appName: "资金计划汇总",
    },
    component: (resolve) =>
      require([ "../YXCapitalPlanSummaryDetailApproval" ], resolve),
  },
];

export default route;
