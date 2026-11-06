// import DeliveryBillQueryList from '../views/DeliveryBillQueryList'
// import DetailDocument from '../views/DetailDocument'

let route = [
  {
    path: "/CuxDeliveryBillQueryList",
    name: "CuxDeliveryBillQueryList",
    meta:{
      appName:"送货单查询",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DeliveryBillQueryList" ], resolve),
  },
  {
    path: "/CuxDetailDocument",
    name: "CuxDetailDocument",
    meta:{
      appName:"送货单查询",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DetailDocument" ], resolve),
  },
  {
    path: "/CuxDetailLogistics",
    name: "CuxDetailLogistics",
    meta:{
      appName:"送货单查询",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/DetailLogistics" ], resolve),
  },
];

export default route;
