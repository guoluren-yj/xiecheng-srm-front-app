
let route = [
  {
    path: "/PurchasingSchemeApproveList",
    name: "PurchasingSchemeApproveList",
    meta:{
      appName:"采购方案审批"
    },
    component: (resolve) => require([ "../views/PurchasingSchemeApproveList" ], resolve),
  },
  {
    path: "/PurchasingSchemeApproveDetail",
    name: "PurchasingSchemeApproveDetail",
    meta:{
      appName:"采购方案审批"
    },
    component: (resolve) => require([ "../views/PurchasingSchemeApproveDetail" ], resolve),
  },
];

export default route;

