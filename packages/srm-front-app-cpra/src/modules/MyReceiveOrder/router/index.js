let route = [
  {
    path: "/MyReceiveOrder",
    name: "MyReceiveOrder",
    meta:{
      appName:"我收到的订单"
    },
    component: (resolve) => require([ "../views/MyReceiveOrder" ], resolve),
  },
  {
    path: "/MyReceiveOrderDetail",
    name: "MyReceiveOrderDetail",
    meta:{
      appName:"我收到的订单"
    },
    component: (resolve) => require([ "../views/MyReceiveOrderDetail" ], resolve),
  },
  {
    path: "/MyReceiveOrderQrCode",
    name: "MyReceiveOrderQrCode",
    meta:{
      appName:"我收到的订单"
    },
    component: (resolve) => require([ "../views/MyReceiveOrderQrCode" ], resolve),
  },
];

export default route;
