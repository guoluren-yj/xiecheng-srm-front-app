let route = [
  {
    path: "/DeliveryBillCancelList",
    name: "DeliveryBillCancelList",
    meta:{
      appName:"送货单取消",
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/DeliveryBillCancelDetail",
    name: "DeliveryBillCancelDetail",
    meta:{
      appName:"送货单取消",
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },

];

export default route;
