let route = [
  {
    path: "/SupplierDeliveryWorkbenchList",
    name: "SupplierDeliveryWorkbenchList",
    meta:{
      appName:"销售方发货工作台",
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/SupplierDeliveryWorkbenchDetail",
    name: "SupplierDeliveryWorkbenchDetail",
    meta:{
      appName:"销售方发货工作台",
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },
];

export default route;
