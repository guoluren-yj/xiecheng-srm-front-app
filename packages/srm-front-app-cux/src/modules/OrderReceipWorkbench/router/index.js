let route = [
  {
    path: "/OrderVerificationReceipWorkbench",
    name: "OrderReceipWorkbench",
    meta: {
      appName: "订单验收工作台",
      // isPurchase:true
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/OrderVerificationReceipWorkbenchDetail",
    name: "OrderReceipWorkbenchDetail",
    meta: {
      appName: "订单验收工作台",
      // isPurchase:true
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },
];

export default route;