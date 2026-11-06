// import SupplierDiscoveryList from '../views/SupplierDiscoveryList'
// import SupplierDiscoveryDetail from '../views/SupplierDiscoveryDetail'
// import InviteRegisterSupplier from '../views/InviteRegisterSupplier'
// import InviteCooperationSupplier from '../views/InviteCooperationSupplier'

let route = [
  {
    path: "/SupplierDiscoveryList",
    name: "SupplierDiscoveryList",
    meta:{
      appName:"发现供应商",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SupplierDiscoveryList" ], resolve),
  },
  {
    path: "/SupplierDiscoveryDetail",
    name: "SupplierDiscoveryDetail",
    meta:{
      appName:"发现供应商",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SupplierDiscoveryDetail" ], resolve),
  },
  {
    path: "/InviteRegisterSupplier",
    name: "InviteRegisterSupplier",
    meta:{
      appName:"发现供应商",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InviteRegisterSupplier" ], resolve),
  },
  {
    path: "/InviteCooperationSupplier",
    name: "InviteCooperationSupplier",
    meta:{
      appName:"发现供应商",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/InviteCooperationSupplier" ], resolve),
  },
];

export default route;
