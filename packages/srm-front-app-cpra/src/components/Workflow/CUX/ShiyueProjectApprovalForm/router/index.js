let route = [
  {
    path: "/ProjectApprovalDetail",
    name: "ProjectApprovalDetail",
    meta: {
      appName: "项目信息审批",
    },
    component: (resolve) => require([ "../views/ProjectApprovalDetail" ], resolve),
  }
];

export default route;
