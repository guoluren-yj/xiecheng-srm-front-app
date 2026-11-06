// import MyOrderList from '../views/MyOrderList'
// import MyOrderDetail from '../views/MyOrderDetail'

let route = [
  {
    path: "/MyOrderList",
    name: "MyOrderList",
    meta:{
      appName:"我发出的订单",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/MyOrderList" ], resolve),
  },
  {
    path: "/MyOrderDetail",
    name: "MyOrderDetail",
    meta:{
      appName:"我发出的订单",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/MyOrderDetail" ], resolve),
  }
];

export default route;
