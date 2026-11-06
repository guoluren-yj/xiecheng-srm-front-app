// import FindPurchaserList from '../views/FindPurchaserList'
// import PurchaserDetail from '../views/PurchaserDetail'
// import InviteCooperation from '../views/InviteCooperation'

let route = [
  {
    path: "/FindPurchaserList",
    name: "FindPurchaserList",
    meta:{
      appName:"发现采购商"
    },
    component: (resolve) => require([ "../views/FindPurchaserList" ], resolve),
  },
  {
    path: "/PurchaserDetail",
    name: "PurchaserDetail",
    meta:{
      appName:"发现采购商"
    },
    component: (resolve) => require([ "../views/PurchaserDetail" ], resolve),
  },
  {
    path: "/InviteCooperation",
    name: "InviteCooperation",
    meta:{
      appName:"发现采购商"
    },
    component: (resolve) => require([ "../views/InviteCooperation" ], resolve),
  },
];

export default route;
