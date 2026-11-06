let route = [
  {
    path: "/DeliveryList",
    name: "DeliveryList",
    meta:{
      appName:"送货单创建"
    },
    component: (resolve) => require([ "../views/DeliveryList" ], resolve),
  },
  {
    path: "/DeliveryDetail",
    name: "DeliveryDetail",
    meta:{
      appName:"送货单创建"
    },
    component: (resolve) => require([ "../views/DeliveryDetail" ], resolve),
  },
  {
    path: "/CreateDeliveryDetail",
    name: "CreateDeliveryDetail",
    meta:{
      appName:"送货单创建"
    },
    component: (resolve) => require([ "../views/CreateDeliveryDetail" ], resolve),
  },
];

export default route;
