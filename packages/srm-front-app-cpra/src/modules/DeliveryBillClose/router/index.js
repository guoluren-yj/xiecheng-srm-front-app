let route = [
  {
    path: "/DeliveryBillCloseList",
    name: "DeliveryBillCloseList",
    meta:{
      appName:"送货单关闭",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/List" ], resolve),
  },
  {
    path: "/DeliveryBillCloseDetail",
    name: "DeliveryBillCloseDetail",
    meta:{
      appName:"送货单关闭",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/Detail" ], resolve),
  },

];

export default route;
