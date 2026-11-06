
let route = [
  {
    path: "/SimpleSupWarehouseList",
    name: "SimpleSupWarehouseList",
    meta:{
      appName:"简易供应商入库及变更",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SimpleSupWarehouseList" ], resolve),
  },
  {
    path: "/SimpleSupWarehouseDetail",
    name: "SimpleSupWarehouseDetail",
    meta:{
      appName:"简易供应商入库及变更",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SimpleSupWarehouseDetail" ], resolve),
  },
  {
    path: "/SimpleSupWarehouseDetailChange",
    name: "SimpleSupWarehouseDetailChange",
    meta:{
      appName:"简易供应商入库及变更信息页面",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SimpleSupWarehouseDetailChange" ], resolve),
  },
  {
    path: "/SimpleSupWarehouseDetailAdd",
    name: "SimpleSupWarehouseDetailAdd",
    meta:{
      appName:"简易供应商入库及变更编辑页面",
      isPurchase:true
    },
    component: (resolve) => require([ "../views/SimpleSupWarehouseDetailAdd" ], resolve),
  },
];

export default route;
