
let route = [
  {
    path: "/MyDeliveryList",
    name: "MyDeliveryList",
    meta:{
      appName:"我的送货单"
    },
    component: (resolve) => require([ "../views/MyDeliveryList" ], resolve),
  },
  {
    path: "/MyDeliveryDetail",
    name: "MyDeliveryDetail",
    meta:{
      appName:"我的送货单"
    },
    component: (resolve) => require([ "../views/MyDeliveryDetail" ], resolve),
  }
];

export default route;
