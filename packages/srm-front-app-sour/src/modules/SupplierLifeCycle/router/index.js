let route = [
  {
    path: "/SupplierLifeCycleList",
    name: "SupplierLifeCycleList",
    meta:{
      appName:"供应商生命周期",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SupplierLifeCycleList" ], resolve),
  },
  {
    path: "/SupplierLifeCycleDetail",
    name: "SupplierLifeCycleDetail",
    meta:{
      appName:"供应商生命周期",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SupplierLifeCycleDetail" ], resolve),
  }
];

export default route;
