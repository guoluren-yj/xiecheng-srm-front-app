let route = [
  {
    path: "/YongXiangDeliveryList",
    name: "YongXiangDeliveryList",
    meta:{
      appName:"送货单创建"
    },
    component: (resolve) => require([ "../views/DeliveryList" ], resolve),
  },
  {
    path: "/YongXiangDeliveryDetail",
    name: "YongXiangDeliveryDetail",
    meta:{
      appName:"送货单创建"
    },
    component: (resolve) => require([ "../views/DeliveryDetail" ], resolve),
  },
  {
    path: "/YongXiangCreateDeliveryDetail",
    name: "YongXiangCreateDeliveryDetail",
    meta:{
      appName:"送货单创建"
    },
    component: (resolve) => require([ "../views/CreateDeliveryDetail" ], resolve),
  },
];

export default route;
