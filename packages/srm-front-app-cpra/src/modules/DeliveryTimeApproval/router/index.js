// import DeliveryTimeList from '../views/DeliveryTimeList'
// import DeliveryTimeDetail from '../views/DeliveryTimeDetail'

let route = [
  {
    path: "/DeliveryTimeList",
    name: "DeliveryTimeList",
    meta:{
      appName:"交期审核",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DeliveryTimeList" ], resolve),
  },
  {
    path: "/DeliveryTimeDetail",
    name: "DeliveryTimeDetail",
    meta:{
      appName:"交期审核",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DeliveryTimeDetail" ], resolve),
  },
];

export default route;
