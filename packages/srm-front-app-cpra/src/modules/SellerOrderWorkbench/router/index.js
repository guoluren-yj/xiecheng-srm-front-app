let route = [
  {
    path: "/SellerOrderWorkbenchList",
    name: "SellerOrderWorkbenchList",
    meta: {
      appName: "销售方订单工作台",
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/SellerOrderWorkbenchDetail",
    name: "SellerOrderWorkbenchDetail",
    meta: {
      appName: "销售方订单工作台",
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },
];

export default route;
