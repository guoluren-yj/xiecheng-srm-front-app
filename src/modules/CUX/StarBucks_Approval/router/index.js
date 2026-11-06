let route = [
  {
    path: "/StarBucks_ApprovalList",
    name: "StarBucks_ApprovalList",
    meta: {
      appName: "待办事项"
    },
    component: (resolve) => require([ "../views/StarBucks_ApprovalList" ], resolve),
  },
  {
    path: "/StarBucks_ApprovalDetail",
    name: "StarBucks_ApprovalDetail",
    meta: {
      appName: "待办事项"
    },
    component: (resolve) => require([ "../views/StarBucks_ApprovalDetail" ], resolve),
  },
  {
    path: "/StarBucks_ApprovalApproved",
    name: "StarBucks_ApprovalApproved",
    meta: {
      appName: "待办事项"
    },
    component: (resolve) => require([ "../views/StarBucks_ApprovalApproved" ], resolve),
  },
  // {
  //   path: "/StartedApprovalList",
  //   name: "StartedApprovalList",
  //   meta: {
  //     appName: "待办事项"
  //   },
  //   component: (resolve) => require([ "../views/StartedApprovalList" ], resolve),
  // },
];

export default route;
