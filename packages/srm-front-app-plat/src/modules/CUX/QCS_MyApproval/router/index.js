
let route = [
  {
    path: "/MyApprovalList",
    name: "MyApprovalList",
    meta:{
      appName:"我的审批"
    },
    component: (resolve) => require([ "../views/MyApprovalList" ], resolve),
  },
  {
    path: "/MyApprovalDetail",
    name: "MyApprovalDetail",
    meta:{
      appName:"我的审批"
    },
    component: (resolve) => require([ "../views/MyApprovalList" ], resolve),
  }
];

export default route;
