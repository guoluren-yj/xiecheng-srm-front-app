let route = [
  {
    path: "/UnnerGyMyOrderList",
    name: "UnnerGyMyOrderList",
    meta:{
      appName: "我发出的订单",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/UnnerGy_MyOrderList" ], resolve),
  },
  {
    path: "/UnnerGyMyOrderDetail",
    name: "UnnerGyMyOrderDetail",
    meta:{
      appName: "我发出的订单",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/UnnerGy_MyOrderDetail" ], resolve),
  }
];

export default route;
