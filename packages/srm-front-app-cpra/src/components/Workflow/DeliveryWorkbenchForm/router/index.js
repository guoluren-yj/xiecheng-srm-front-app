let route = [
  {
    path: "/DeliveryWorkbenchList",
    name: "DeliveryWorkbenchList",
    meta:{
      appName:"采购方发货工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/DeliveryWorkbenchDetail",
    name: "DeliveryWorkbenchDetail",
    meta:{
      appName:"采购方发货工作台",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },
];

export default route;
