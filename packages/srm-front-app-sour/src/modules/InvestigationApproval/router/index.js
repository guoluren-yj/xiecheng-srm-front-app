let route = [
  {
    path: "/InvestigationApprovalList",
    name: "InvestigationApprovalList",
    meta:{
      appName:"调查表审批",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvestigationApprovalList" ], resolve)
  },
  {
    path: "/InvestigationApprovalDetail",
    name: "InvestigationApprovalDetail",
    meta:{
      appName:"调查表审批详情页",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InvestigationApprovalDetail" ], resolve)
  },
];

export default route;