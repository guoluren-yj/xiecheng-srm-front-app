// import DeliveryBillList from '../views/DeliveryBillList'
// import DeliveryBillDetail from '../views/DeliveryBillDetail'

let route = [
  {
    path: "/DeliveryBillList",
    name: "DeliveryBillList",
    meta:{
      appName:"送货单审批",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DeliveryBillList" ], resolve),
  },
  {
    path: "/DeliveryBillDetail",
    name: "DeliveryBillDetail",
    meta:{
      appName:"送货单审批",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DeliveryBillDetail" ], resolve),
  },
];

export default route;
