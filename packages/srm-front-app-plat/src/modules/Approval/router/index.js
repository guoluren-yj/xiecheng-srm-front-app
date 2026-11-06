let route = [
  {
    path: "/ApprovalList",
    name: "ApprovalList",
    meta: {
      appName: "审批工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ApprovalList" ], resolve),
  },
  {
    path: "/ApprovalDetail",
    name: "ApprovalDetail",
    meta: {
      appName: "审批工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ApprovalDetail" ], resolve),
  },
  {
    path: "/ApprovalApproved",
    name: "ApprovalApproved",
    meta: {
      appName: "审批工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ApprovalApproved" ], resolve),
  },
];

export default route;
