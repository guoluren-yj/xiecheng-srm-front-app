let route = [
  {
    path: "/BudgetApprovalDetail",
    name: "BudgetApprovalDetail",
    meta: {
      appName: "项目信息审批",
    },
    component: (resolve) => require([ "../views/BudgetApprovalDetail" ], resolve),
  },
];

export default route;
