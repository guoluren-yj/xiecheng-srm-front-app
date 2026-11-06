let route = [
  {
    path: "/ReceiveList",
    name: "ReceiveList",
    meta:{
      appName:"接收",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/ReceiveList" ], resolve),
  },
  {
    path: "/ReceiveDetail",
    name: "ReceiveDetail",
    meta:{
      appName:"接收",
      isPurchase: true
    },
    component: (resolve) => require([ "../views/ReceiveDetail" ], resolve),
  },
];

export default route;
