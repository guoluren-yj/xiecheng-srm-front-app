let route = [
  {
    path: "/PurchaseReqWorkbenchList",
    name: "PurchaseReqWorkbenchList",
    meta: {
      appName: "采购申请工作台",
      isPurchase: true,
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/PurchaseReqWorkbenchDetail",
    name: "PurchaseReqWorkbenchDetail",
    meta: {
      appName: "采购申请工作台",
      isPurchase: true,
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },
  {
    path: "/PurchaseReqWorkbenchQuery",
    name: "PurchaseReqWorkbenchQuery",
    meta: {
      appName: "采购申请工作台",
      isPurchase: true,
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  }
];

export default route;
