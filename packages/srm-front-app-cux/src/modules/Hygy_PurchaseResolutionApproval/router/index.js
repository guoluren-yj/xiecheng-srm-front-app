let route = [
  {
    path: "/Hygy_PurchaseResolutionApproval",
    name: "Hygy_PurchaseResolutionApproval",
    meta:{
      appName:"采购决议评审表"
    },
    component: (resolve) => require([ "../views/Hygy_PurchaseResolutionApproval" ], resolve),
  },
  {
    path: "/Hygy_PurchaseResolutionApprovalDetail",
    name: "Hygy_PurchaseResolutionApprovalDetail",
    meta:{
      appName:"采购决议评审表"
    },
    component: (resolve) => require([ "../views/Hygy_PurchaseResolutionApprovalDetail" ], resolve),
  },
  {
    path: "/Hygy_ProcurementPlanDetail",
    name: "Hygy_ProcurementPlanDetail",
    meta:{
      appName:"采购方案评审单"
    },
    component: (resolve) => require([ "../views/Hygy_ProcurementPlanDetail" ], resolve),
  },
];

export default route;