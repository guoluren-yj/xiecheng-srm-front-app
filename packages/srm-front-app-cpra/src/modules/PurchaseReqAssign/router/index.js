let route = [
  {
    path: "/PurchaseReqAssignList",
    name: "PurchaseReqAssignList",
    meta: {
      appName: "需求执行-分配",
      isPurchase: true,
    },
    component: (resolve) => require([ "../views/PurchaseReqAssignList" ], resolve),
  },
  {
    path: "/PurchaseReqAssignDetail",
    name: "PurchaseReqAssignDetail",
    meta: {
      appName: "需求执行-分配",
      isPurchase: true,
    },
    component: (resolve) => require([ "../views/PurchaseReqAssignDetail" ], resolve),
  }
];

export default route;