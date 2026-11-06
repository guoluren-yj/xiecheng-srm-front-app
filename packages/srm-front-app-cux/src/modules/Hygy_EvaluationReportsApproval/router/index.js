let route = [
  {
    path: "/Hygy_EvaluationReportsApproval",
    name: "Hygy_EvaluationReportsApproval",
    meta:{
      appName:"评标报告审批"
    },
    component: (resolve) => require([ "../views/Hygy_EvaluationReportsApproval" ], resolve),
  },
  {
    path: "/Hygy_EvaluationReportApprovalDetail",
    name: "Hygy_EvaluationReportApprovalDetail",
    meta:{
      appName:"评标报告详情"
    },
    component: (resolve) => require([ "../views/Hygy_EvaluationReportApprovalDetail" ], resolve),
  },
  {
    path: "/Hygy_EvaluationProcurementSchemeDetail",
    name: "Hygy_EvaluationProcurementSchemeDetail",
    meta:{
      appName:"评标报告详情"
    },
    component: (resolve) => require([ "../views/Hygy_EvaluationProcurementSchemeDetail" ], resolve),
  },
];

export default route;