// import DeliveryBillQueryList from '../views/DeliveryBillQueryList'
// import DetailDocument from '../views/DetailDocument'

let route = [
  {
    path: "/DeliveryBillQueryList",
    name: "DeliveryBillQueryList",
    meta:{
      appName:"送货单查询",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DeliveryBillQueryList" ], resolve),
  },
  {
    path: "/DetailDocument",
    name: "DetailDocument",
    meta:{
      appName:"送货单查询",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DetailDocument" ], resolve),
  },
  {
    path: "/DetailLogistics",
    name: "DetailLogistics",
    meta:{
      appName:"送货单查询",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DetailLogistics" ], resolve),
  },
];

export default route;
