let route = [
  {
    path: "/ReceiverWorkplaceList",
    name: "ReceiverWorkplaceList",
    meta: {
      appName: "收货工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ReceiverWorkplaceList" ], resolve),
  },
  {
    path: "/ReceiverWorkplaceDetail",
    name: "ReceiverWorkplaceDetail",
    meta: {
      appName: "收货工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/ReceiverWorkplaceDetail" ], resolve),
  },
];

export default route;
